import { Request, Response } from "express";

import { addEmployee } from "../services/employeeServices";


const UploadEmployeesFromCSV = async (req: Request, res: Response) => {
    try {
        // tslint:disable-next-line:no-console
        console.log(req.body);
        return res.send("OK").status(200);
    } catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        return res.send(err).status(500);
    }
}

export {
    UploadEmployeesFromCSV
}