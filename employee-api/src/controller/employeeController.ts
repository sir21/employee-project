import { Request, Response } from "express";
import { checkEmpty } from "../utils/checks";

import { deleteEmployee, editEmployee, getAllEmployees, manageCSVFile } from "../services/employeeServices";

const EditEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { login, name, salary } = req.body;

        // tslint:disable-next-line:no-console
        console.log("Update1", login, name, salary);

        if (checkEmpty([id, login, name, salary])) {
            return res.status(500).send({ message: "Empty Fields" });
        }

        const result = await editEmployee(id, login, name, salary);

        return res.status(204).send(result);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

const DeleteEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (checkEmpty([id])) {
            return res.status(500).send({ message: "Id required" });
        }

        const result = await deleteEmployee(id);

        return res.status(204).send(result);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};


const GetAllEmployees = async (req: Request, res: Response) => {
    try {
        const { page, pageSize, minSalary, maxSalary, orderBy } = req.query;
        let { orderMethod } = req.query;

        if (!(orderMethod === 'ASC' || orderMethod === 'DESC')) {
            orderMethod = 'ASC';
        }

        const result = await getAllEmployees(
            +page,
            +pageSize,
            +minSalary,
            + maxSalary,
            orderBy.toString(),
            orderMethod
        );
        return res.status(200).send(result);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

const UploadEmployeesFromCSV = async (req: Request, res: Response) => {
    try {
        const files = req.files;
        if (!Array.isArray(files)) {
            return;
        }
        const result = await manageCSVFile(files);
        return res.status(201).send(result);
    } catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        return res.status(500).send(err.message);
    }
}

export {
    EditEmployee,
    DeleteEmployee,
    GetAllEmployees,
    UploadEmployeesFromCSV
}