import axios from "axios";

const API = axios.create({
  baseURL: "https://sales-insight-automator-k67c.onrender.com/"
});

export default API;