import csv from "csvtojson";
import { EmployeeInstance } from "../models";

import { IFileStatus } from "../@types/fileStatus";
import { checkEmpty, startWithHash } from "../utils/checks";

const addEmployee = () => {
    return 1;
}

const getAllEmployees = async (page: number = 0, pageSize: number = 5, minSalary: number = -Infinity, maxSalary: number = Infinity, orderBy: string = 'id', orderMethod: string = 'ASC') => {
    try {
        // tslint:disable-next-line:no-console
        console.log(page, pageSize, minSalary, maxSalary, orderBy, orderMethod);
        const result = await EmployeeInstance.findAll();
        return result.map((row) => {
            return {
                id: row.getDataValue('id'),
                login: row.getDataValue('login'),
                name: row.getDataValue('name'),
                salary: row.getDataValue('salary'),
            }
        });
    } catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        throw new Error("Failed getting employees");
    }
}

const manageCSVFile = async (files: Express.Multer.File[]): Promise<IFileStatus[]> => {
    try {
        const promises: Promise<IFileStatus>[] = [];
        files.forEach(async (file) => {
            promises.push(uploadEmployees(file));
        });
        const result: IFileStatus[] = await Promise.all(promises);
        // tslint:disable-next-line:no-console
        console.log(result);
        return result;
    } catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        throw new Error("Failed while uploading CSV.");
    }
}

const uploadEmployees = async (file: Express.Multer.File): Promise<IFileStatus> => {
    const employees: any[] = [];
    const csvRecords = await csv({ noheader: true }).fromString(file.buffer.toString());
    let fileStatus: IFileStatus = { name: file.originalname, status: 'in_progress', count: 0 };

    for (const record of csvRecords) {
        if (startWithHash(record.field1)) {
            continue;
        }

        if (checkEmpty([record.field1, record.field2, record.field3, record.field4])) {
            fileStatus = {
                ...fileStatus,
                status: 'error',
                count: 0,
            }
            break;
        }

        const employee = await EmployeeInstance.findByPk(record.field1);
        if (employee) {
            fileStatus = {
                ...fileStatus,
                status: 'error',
                count: 0,
            }
            break;
        }
        fileStatus = {
            ...fileStatus,
            count: fileStatus.count++,
        }
        const emp = await EmployeeInstance.create({ id: record.field1, login: record.field2, name: record.field3, salary: record.field4 })
        employees.push(emp);
    }

    fileStatus = {
        ...fileStatus,
        status: 'completed'
    };
    // tslint:disable-next-line:no-console
    console.log(fileStatus);
    return fileStatus;
}

export {
    addEmployee,
    getAllEmployees,
    manageCSVFile
}