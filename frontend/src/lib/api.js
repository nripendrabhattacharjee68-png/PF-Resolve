import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const http = axios.create({ baseURL: API });

export const api = {
  getAccount: () => http.get("/demo/account").then((r) => r.data),
  getStatus: () => http.get("/transfer/status").then((r) => r.data),
  check: () => http.post("/transfer/check").then((r) => r.data),
  fixDateOfExit: () => http.post("/transfer/fix-date-of-exit").then((r) => r.data),
  submit: () => http.post("/transfer/submit").then((r) => r.data),
  reset: () => http.post("/demo/reset").then((r) => r.data),
  explain: (kind = "rejection") =>
    http.post("/ai/explain", { kind }).then((r) => r.data),
  generateRequest: () => http.post("/ai/generate-request").then((r) => r.data),
  askAssistant: (question) =>
    http.post("/ai/assistant", { question }).then((r) => r.data),
};
