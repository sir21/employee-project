import * as express from "express";

import {
    DeleteEmployee,
    EditEmployee,
    GetAllEmployees,
    UploadEmployeesFromCSV
} from "../controller/employeeController";

const router = express.Router();


// define a route handler for the default home page
router.post("/employees/upload", UploadEmployeesFromCSV);
router.get("/employees", GetAllEmployees);
router.put("/employees/:id", EditEmployee);
router.delete("/employees/:id", DeleteEmployee);

export default router;
