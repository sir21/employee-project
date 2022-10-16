import csv from "csvtojson";
import { EmployeeInstance } from "../models";

import { IFileStatus } from "../@types/fileStatus";
import { checkEmpty, startWithHash } from "../utils/checks";
import { Op, Sequelize } from "sequelize";

const addEmployee = () => {
  return 1;
}

const getAllEmployees = async (
  page: number = 0,
  pageSize: number = 5,
  minSalary: number | null,
  maxSalary: number | null,
  orderBy: string = 'id',
  orderMethod: string = 'ASC'
): Promise<{ result: any[], count: number }> => {
  try {
    // tslint:disable-next-line:no-console
    console.log(page, pageSize, minSalary, maxSalary, orderBy, orderMethod);
    let res;

    if (minSalary !== 0  && maxSalary !== 0) {
      res = await EmployeeInstance.findAndCountAll({
        where: {
          salary: {
            [Op.between]: [minSalary, maxSalary]
          }
        },
        offset: page * pageSize,
        limit: pageSize,
        order: [['id', 'ASC']],
      });
    } else if (minSalary !== 0) {
      res = await EmployeeInstance.findAndCountAll({
        where: {
          salary: {
            [Op.gte]: minSalary
          }
        },
        offset: page * pageSize,
        limit: pageSize,
        order: [['id', 'ASC']],
      });
    } else if (maxSalary !== 0) {
      res = await EmployeeInstance.findAndCountAll({
        where: {
          salary: {
            [Op.lte]: maxSalary
          }
        },
        offset: page * pageSize,
        limit: pageSize,
        order: [['id', 'ASC']],
      });
    } else {
      res = await EmployeeInstance.findAndCountAll({
        offset: page * pageSize,
        limit: pageSize,
        order: [['id', 'ASC']],
      })
    }

    // tslint:disable-next-line:no-console
    console.log(res);
    const { rows, count } = res;
    const result = rows.map((row) => {
      return {
        id: row.getDataValue('id'),
        login: row.getDataValue('login'),
        name: row.getDataValue('name'),
        salary: row.getDataValue('salary'),
      }
    });
    return { result, count }
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
    return result;
  } catch (err) {
    throw new Error("Failed while uploading CSV.");
  }
}

const uploadEmployees = async (file: Express.Multer.File): Promise<IFileStatus> => {
  let fileStatus: IFileStatus = { name: file.originalname, status: 'in_progress', count: 0 };
  try {
    const employees: any[] = [];
    const csvRecords = await csv({ noheader: true }).fromString(file.buffer.toString());

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
    return fileStatus;
  } catch (err) {
    fileStatus = {
      ...fileStatus,
      status: 'error',
      count: 0,
    };
    return fileStatus;
  }
}

export {
  addEmployee,
  getAllEmployees,
  manageCSVFile
}