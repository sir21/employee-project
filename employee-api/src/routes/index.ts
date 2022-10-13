import * as express from "express";
import { UploadEmployeesFromCSV } from "../controller/employeeController";

export const register = (app: express.Application) => {

    // define a route handler for the default home page
    app.post("/employees/upload", UploadEmployeesFromCSV);
};