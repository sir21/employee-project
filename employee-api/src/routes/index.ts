import * as express from "express";

import {
    GetAllEmployees,
    UploadEmployeesFromCSV
} from "../controller/employeeController";

const router = express.Router();


// define a route handler for the default home page
router.post("/employees/upload", UploadEmployeesFromCSV);
router.get("/employees", GetAllEmployees);
// TODO: 3rd story point
// router.put("/employees/:id", editEmployee);
// router.delete("employees/:id", deleteEmployee);

export default router;
