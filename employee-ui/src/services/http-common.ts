import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8080/employees",
  headers: {
    "Content-type": "application/json"
  }
});