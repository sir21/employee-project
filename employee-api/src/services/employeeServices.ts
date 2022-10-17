import csv from "csvtojson";
import { EmployeeInstance } from "../models";

import { IFileStatus } from "../@types/fileStatus";
import { checkEmpty, startWithHash } from "../utils/checks";
import { Op } from "sequelize";
import db from "../config/database.config";

/**
 * Edit employee
 * @param id 
 * @param login 
 * @param name 
 * @param salary 
 * @returns Success message
 */
const editEmployee = async (id: string, login: string, name: string, salary: number) => {
  try {
    const employee = await EmployeeInstance.findByPk(id);
    if (!employee) {
      throw new Error("Employee not found");
    }

    const checkLogin = await EmployeeInstance.findOne({ where: { login: { [Op.like]: login } } });

    if (checkLogin.getDataValue('id') !== employee.getDataValue('id')) {
      throw new Error("Similar login available");
    }
    await employee.update({ login, name, salary });
    await employee.save();

    return { message: "Success" };

  } catch (err) {
    throw new Error("Failed updating employee");
  }
}

/**
 * Delete employee
 * @param id Employee id to delete
 * @returns Success message
 */
const deleteEmployee = async (id: string) => {
  try {
    const employee = await EmployeeInstance.findByPk(id);
    if (!employee) {
      throw new Error("Employee not found");
    }

    await employee.destroy();

    return { message: "Success" };

  } catch (err) {
    throw new Error("Failed deleting employee");
  }
}

/**
 * Get all employees from DB. Filters available for min and max salary.
 * @param page 
 * @param pageSize 
 * @param minSalary 
 * @param maxSalary 
 * @param orderBy 
 * @param orderMethod 
 * @returns List of employees Promise<{result, count}>
 */
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

/**
 * Managing CSV files to get employees
 * @param files CSV files
 * @returns Status of uploading for each file sent
 */
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

/**
 * Process CSV file
 * @param file CSV file to process
 * @returns CSV file process status
 */
const uploadEmployees = async (file: Express.Multer.File): Promise<IFileStatus> => {
  // Initialize CSV file process status and transaction
  let fileStatus: IFileStatus = { name: file.originalname, status: 'in_progress' };
  const t = await db.transaction();

  try {
    // Encoding csv file to readable format
    const csvRecords = await csv({ noheader: true }).fromString(file.buffer.toString());
    // Array to store blocked employees
    let queueRecords: { record: any, blockedId: string }[] = [];

    // Iterate CSV file records
    for (const record of csvRecords) {
      // Ignore the record if record start with #
      if (startWithHash(record.field1)) {
        continue;
      }

      // IF any record has null value, will stop file process
      if (checkEmpty([record.field1, record.field2, record.field3, record.field4])) {
        fileStatus = { ...fileStatus, status: 'error' };
        queueRecords = [];
        break;
      }

      // Check available employee with id and login
      const employee = await EmployeeInstance.findByPk(record.field1, { transaction: t });
      const loginMatchEmployee = await EmployeeInstance.findOne({ where: { login: { [Op.like]: record.field2 } }, transaction: t });

      if (employee) {
        if (loginMatchEmployee) {
          if (loginMatchEmployee.getDataValue('id') === employee.getDataValue('id')) {
            // Updating existing employee name and salary
            await employee.update({ name: record.field3, salary: record.field4 }, { transaction: t });
          } else {
            // When login equals but different employee, This blocks DB update for this record
            let qRc = queueRecords.find(f => f.record.field1 === employee.getDataValue('id'));
            if (qRc) {
              qRc = { ...qRc, record, blockedId: loginMatchEmployee.getDataValue('id') }
            } else {
              queueRecords.push({ record, blockedId: loginMatchEmployee.getDataValue('id') });
            }
          }
        } else {
          // Updating existing employee with different login, name and salary. Login is unique and not found on DB
          await employee.update({ login: record.field2, name: record.field3, salary: record.field4 }, { transaction: t });

          // Remove any blocked records related to this record
          queueRecords = queueRecords.filter(q => q.record.field1 !== employee.getDataValue('id'));

          // Check blocked records and see this will last employee update free up any logins'
          const qRcs = queueRecords.filter(f => f.blockedId === employee.getDataValue('id'));
          if (qRcs.length > 0) {
            for (let qRc of qRcs) {
              // check for blocked login
              const loginMatchEmployeeSub = await EmployeeInstance.findOne(
                { where: { login: { [Op.like]: qRc.record.field2 } }, transaction: t });
              if (loginMatchEmployeeSub) {
                // If that record blocked by new record, blocked will get updated. (Highly unlikely scenario)
                qRc = { ...qRc, blockedId: loginMatchEmployeeSub.getDataValue('id') }
              } else {
                // If login is free, 
                const employeeNew = await EmployeeInstance.findByPk(qRc.record.field1);
                if (employeeNew) {
                  // If blocked record already has employee
                  await employeeNew.update(
                    { login: qRc.record.field2, name: qRc.record.field3, salary: qRc.record.field4 },
                    { transaction: t });
                } else {
                  // If blocked record does not have employee created in DB
                  await EmployeeInstance.create(
                    { id: qRc.record.field1, login: qRc.record.field2, name: qRc.record.field3, salary: qRc.record.field4 },
                    { transaction: t })
                }
                // Remove updated blocked record from DB
                queueRecords = queueRecords.filter(f => f.record.field1 !== qRc.record.field1);
              }
            }
          }
        }
      } else {
        if (loginMatchEmployee) {
          // New employee with blocked login
          let qRc = queueRecords.find(f => f.record.field1 === employee.getDataValue('id'));
          if (qRc) {
            qRc = { ...qRc, record, blockedId: loginMatchEmployee.getDataValue('id') }
          } else {
            queueRecords.push({ record, blockedId: loginMatchEmployee.getDataValue('id') });
          }
        } else {
          // New employee with unique login
          await EmployeeInstance.create({ id: record.field1, login: record.field2, name: record.field3, salary: record.field4 }, { transaction: t })
        }
      }
    }

    // Check everything went well, if so will commit data to database, otherwise will rollback the transaction
    if (queueRecords.length === 0 && fileStatus.status === 'in_progress') {
      await t.commit();
      fileStatus = { ...fileStatus, status: 'completed' };
    } else {
      await t.rollback();
      fileStatus = { ...fileStatus, status: 'error' };
    }
    return fileStatus;
  } catch (err) {
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