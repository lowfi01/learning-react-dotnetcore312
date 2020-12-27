// we will define api calls here.

import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { IActivity } from "../models/activity";
import { history } from "../.."; // auto maps to index.* named files
import { toast } from "react-toastify";
import { IUser, IUserFormValues } from "../models/User";
import { IProfile } from "../models/profile";

// all api request will use this base
axios.defaults.baseURL = "http://localhost:5000/api";

// Handle requests
// - Assign jwt token to request header as Bearer token.
// - else we throw error if token does not exist.
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = window.localStorage.getItem("jwt");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error); // handle errors as a promise.
  }
);

// Exception Handling Logic
// - Add interceptor
//   - Note: we can intercept the request or the response coming back from the server.
// Note: Prior to using redirect on condition, we would be throwing an exception.
//   - throw error;
//   - this method of custom history direct is far better.
axios.interceptors.response.use(undefined, (error) => {
  // Network Error: server is probably down.
  // - needs to be put above error.response deconstructor or it won't run
  if (error.message === "Network Error" && !error.response) {
    toast.error("Network error - make sure API is running!");
  }

  const { status, data, config } = error.response;

  // Handle errors from API.
  // - direct to NotFound.tsx component
  // - push() to an invalid url will route to NotFound.tsx
  //   - this logic is found in App.tsx

  // 404: activity not found
  if (status === 404) {
    // use our custom history
    // - we feed custom history to our low level Router component
    //   which will contain navigation options even outside of our
    //   component structure.
    history.push("/notfound");
  }

  // 400: invalid Guid
  // - why would you use so many conditions to just check for guid?
  //   - Answer: because there can be different types of status 400
  if (
    status === 400 &&
    config.method === "get" &&
    data.errors.hasOwnProperty("id") // check if object has property field
  ) {
    history.push("/notfound");
  }

  // 500: internal server error
  if (status === 500) {
    toast.error("Server error - check terminal for more info!", {
      autoClose: 5000, // implemented by default
    });
  }

  throw error.response; // better to throw error.response as this will return a proper error object
});

const responseBody = (response: AxiosResponse) => response.data;

// Add fake delay function against all api requests to simulate a production
// - carrying a function.
//   - process of transforming a function with multiple arguments into
//     a sequence of nesting functions.
const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

// base requests for all standard CRUD operations
const requests = {
  // reusable requests
  get: (url: string) => axios.get(url).then(sleep(1200)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(sleep(1200)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(sleep(1200)).then(responseBody),
  delete: (url: string) =>
    axios.delete(url).then(sleep(1200)).then(responseBody),
};

// Request specific to Activities
const Activities = {
  list: (): Promise<IActivity[]> => requests.get("/Activities"), // list of all activities
  details: (id: string) => requests.get(`/Activities/${id}`), // get activity of id
  create: (activity: IActivity) => requests.post(`/Activities`, activity),
  update: (activity: IActivity) =>
    requests.put(`/Activities/${activity.id}`, activity),
  delete: (activityId: string) => requests.delete(`/Activities/${activityId}`),
  attend: (activityId: string) =>
    requests.post(`/Activities/${activityId}/attend`, {}),
  unattend: (activityId: string) =>
    requests.delete(`/Activities/${activityId}/attend`),
};

const User = {
  current: (): Promise<IUser> => requests.get("/user"),
  login: (userLogin: IUserFormValues): Promise<IUser> =>
    requests.post("/user/login", userLogin),
  register: (userRegister: IUserFormValues): Promise<IUser> =>
    requests.post("/user/register", userRegister),
};

const Profiles = {
  get: (username: string): Promise<IProfile> => requests.get(`/profiles/${username}`)
}

export default {
  Activities,
  User,
  Profiles
};
