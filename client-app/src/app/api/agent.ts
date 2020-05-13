// we will define api calls here.

import axios, { AxiosResponse } from "axios";
import IActivity from "../models/activity";

// all api request will use this base
axios.defaults.baseURL = "http://localhost:5000/api";

const responseBody = (response: AxiosResponse) => response.data;

// Add fake delay function against all api requests to simulate a production
// - carrying a function.
//   - process of transforming a function with multiple arguments into
//     a sequence of nesting functions.
const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

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

const Activities = {
  list: (): Promise<IActivity[]> => requests.get("/Activities"),
  details: (id: string) => requests.get(`/Activities/${id}`),
  create: (activity: IActivity) => requests.post(`/Activities`, activity),
  update: (activity: IActivity) =>
    requests.put(`/Activities/${activity.id}`, activity),
  delete: (id: string) => requests.delete(`/Activities/${id}`),
};

export default {
  Activities,
};
