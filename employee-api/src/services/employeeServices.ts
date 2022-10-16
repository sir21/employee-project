import csv from "csvtojson";
import { EmployeeInstance } from "../models";

import { IFileStatus } from "../@types/fileStatus";
import { checkEmpty, startWithHash } from "../utils/checks";
import { Op } from "sequelize";
import db from "../config/database.config";

const editEmployee = async (id: string, login: string, name: string, salary: number) => {
  try {
    const employee = await EmployeeInstance.findByPk(id);
    if (!employee) {
      throw new Error("Employee not found");
    }

    const checkLogin = await EmployeeInstance.findOne({ where: { login: { [Op.like]: login } } });

    if (checkLogin) {
      throw new Error("Similar login available");
    }

    // tslint:disable-next-line:no-console
    console.log("Update", login, name, salary);
    await employee.update({ login, name, salary });
    await employee.save();

    return { message: "Success" };

  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(err);
    throw new Error("Failed updating employee");
  }
}

const deleteEmployee = async (id: string) => {
  try {
    const employee = await EmployeeInstance.findByPk(id);
    if (!employee) {
      throw new Error("Employee not found");
    }

    await employee.destroy();

    return { message: "Success" };

  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(err);
    throw new Error("Failed deleting employee");
  }
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
    let res;

    const offset = (page - 1) * pageSize;

    if (minSalary !== 0 && maxSalary !== 0) {
      res = await EmployeeInstance.findAndCountAll({
        where: {
          salary: {
            [Op.between]: [minSalary, maxSalary]
          }
        },
        offset,
        limit: pageSize,
        order: [[orderBy, orderMethod]],
      });
    } else if (minSalary !== 0) {
      res = await EmployeeInstance.findAndCountAll({
        where: {
          salary: {
            [Op.gte]: minSalary
          }
        },
        offset,
        limit: pageSize,
        order: [[orderBy, orderMethod]],
      });
    } else if (maxSalary !== 0) {
      res = await EmployeeInstance.findAndCountAll({
        where: {
          salary: {
            [Op.lte]: maxSalary
          }
        },
        offset,
        limit: pageSize,
        order: [[orderBy, orderMethod]],
      });
    } else {
      res = await EmployeeInstance.findAndCountAll({
        offset,
        limit: pageSize,
        order: [[orderBy, orderMethod]],
      })
    }
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
    throw new Error("Failed getting employees");
  }
}

const manageCSVFile = async (files: Express.Multer.File[]): Promise<IFileStatus[]> => {
  try {
    const results: IFileStatus[] = []
    let i = 0;
    while (i < files.length) {
      const res = await uploadEmployees(files[i]);
      results.push(res);
      i++;
    }

    return results;
  } catch (err) {
    throw new Error("Failed while uploading CSV.");
  }
}

const uploadEmployees = async (file: Express.Multer.File): Promise<IFileStatus> => {
  let fileStatus: IFileStatus = { name: file.originalname, status: 'in_progress' };
  const t = await db.transaction();
  try {
    let employees: any[] = [];
    const csvRecords = await csv({ noheader: true }).fromString(file.buffer.toString());

    for (const record of csvRecords) {
      if (startWithHash(record.field1)) {
        continue;
      }

      if (checkEmpty([record.field1, record.field2, record.field3, record.field4])) {
        fileStatus = {
          ...fileStatus,
          status: 'error',
        }
        t.rollback();
        employees = [];
        break;
      }

      const employee = await EmployeeInstance.findByPk(record.field1, { transaction: t });
      if (employee) {
        fileStatus = {
          ...fileStatus,
          status: 'error',
        }
        await t.rollback();
        employees = [];
        break;
      }
      const emp = await EmployeeInstance.create({ id: record.field1, login: record.field2, name: record.field3, salary: record.field4 }, { transaction: t })
      employees.push(emp);
    }

    if (employees.length > 0) {
      await t.commit();
      fileStatus = {
        ...fileStatus,
        status: 'completed'
      };
    }
    return fileStatus;
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log(err);
    await t.rollback();
    fileStatus = {
      ...fileStatus,
      status: 'error'
    };
    return fileStatus;
  }
}

export {
  editEmployee,
  deleteEmployee,
  getAllEmployees,
  manageCSVFile
}