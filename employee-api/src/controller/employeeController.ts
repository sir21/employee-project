import { Request, Response } from "express";

import { getAllEmployees, manageCSVFile } from "../services/employeeServices";

const GetAllEmployees = async (req: Request, res: Response) => {
    try {
        const { page, pageSize, minSalary, maxSalary, orderBy, orderMethod } = req.query;
        const result = await getAllEmployees(+page, +pageSize, +minSalary, +maxSalary, orderBy.toString(), orderMethod.toString());

        // tslint:disable-next-line:no-console
        console.log(result);

        return res.send(result).status(200);
    } catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        return res.send(err).status(500);
    }
}

const UploadEmployeesFromCSV = async (req: Request, res: Response) => {
    try {
        const files = req.files;

        if (!Array.isArray(files)) {
            return;
        }

        const result = await manageCSVFile(files);
        // tslint:disable-next-line:no-console
        console.log(result);
        return res.send(result).status(201);
    } catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        return res.send(err).status(500);
    }
}

export {
    GetAllEmployees,
    UploadEmployeesFromCSV
}