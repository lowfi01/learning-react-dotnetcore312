using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Interfaces;
using Domain;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Security
{

  // Note: We inject IJwtGenerator into our Application, within the startup class.
  public class JwtGenerator : IJwtGenerator
  {
    // - Note: Configuration["TokenKey"], is set only in the local development enviroment
    //   Note: there are enviroment keys we can use to replace this once in production.
    //         - this is only aviaible in development mode & also on the host computer.... this will break if you don't do these steps
    //             dotnet user-secrets init -p API/  - required to initialize user secrets
    //             dotnet user-secrets set "TokenKey" "super secret key that will sign all tokens" -m API/    - set a new user secret
    //             dotnet user-secrets list -m API/   - show all user secrets
    private readonly SymmetricSecurityKey _key;
    public JwtGenerator(IConfiguration config)
    {
      this._key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
    }

    public string CreateToken(AppUser user)
    {
      // Todo list
      // 1. Build token before returning
      // 2. list of claims(payload data) can be provided to token
      // 3. claims(payload data) can be returned within tokens

      // When we create our token this field will be added as a claim(payload data)
      // - username as a nameid inside out jwt token (payload)
      // - this should give us access to the user on the client side :)
      var claims = new List<Claim>
      {
        new Claim(JwtRegisteredClaimNames.NameId, user.UserName)
      };

      // generate signing cridentials (each token needs to be signed by the api before leaving)
      // - this process will allow our API to authentica without quering our database!
      // - this is considered a fast mechanism for authentication as we simply just given
      //   the client the token, they store it! we validate it on requests as it is passed
      //   as a bearer within the header of the request.
      // Note: this is the secret key that will sign each of our tokens, giving access to anyone!!
      // Note: argument takes a string in a byte array
      // Note: this is a naive approach of storing the secret string!!!!!!!!!!!!

      // -- Note: we are now use dotnet user-secrets store...
      var key = _key; //token key Encoding.UTF8.GetBytes("super secret key that will sign all tokens")

      // generate credientials
      var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature); // takes key & algorithm to hash the key.

      // describe data about token
      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(claims), // pass claims (payload)
        Expires = DateTime.Now.AddDays(7), // token will expire in 7 days
        SigningCredentials = cred
      };

      // Token handler
      var tokenHandler = new JwtSecurityTokenHandler();
      var token = tokenHandler.CreateToken(tokenDescriptor);

      // write token
      return tokenHandler.WriteToken(token);

      // if you would like to read token
      // - https://jwt.io/
    }
  }
}