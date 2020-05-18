using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
  public class ErrorHandlingMiddleware
  {
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;
    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
      _logger = logger;
      _next = next;
    }

    // HttpContext encapsulates all the http things we want, note we are injecting this here to the class.
    public async Task Invoke(HttpContext context)
    {
      // Invoke our expcetion handling
      try
      {
        await _next(context); // continue to next delegate in request pipeline
      }
      catch (Exception ex)
      {
        await HandleExceptionAsync(context, ex, _logger); // handle exception with custom methods
      }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception ex, ILogger<ErrorHandlingMiddleware> logger)
    {
      // holds our errors
      object errors = null;

      // Check the exception types we will have in our application.
      // - Rest Exception type
      //   - Add status code & errors to response
      // - Normal Exception type
      //   - send back as 500 internal error
      switch (ex)
      {
        case RestException re:
          logger.LogError(ex, "REST ERROR");  // log error
          errors = re.Errors; // set errors object to the error defined in RestException class
          context.Response.StatusCode = (int)re.Code; // set response status code defined in the restex class
          break;
        case Exception e:
          logger.LogError(ex, "SERVER ERROR");
          errors = string.IsNullOrWhiteSpace(e.Message) ? "Error" : e.Message; // check if error message is blank before saving to error
          context.Response.StatusCode = (int)HttpStatusCode.InternalServerError; // casts to 500;
          break;
      }

      // Serialize as application json
      // - Response content type tells the client to expect a json object
      // - check for errors
      //   - if false convert errors to a json object
      //   - write errors result to response
      context.Response.ContentType = "application/json";
      if (errors != null)
      {
        // libary available from dotnet core 3.0
        var result = JsonSerializer.Serialize(new
        {
          errors
        });

        await context.Response.WriteAsync(result);
      }


    }
  }
}