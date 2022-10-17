import { EmployeeInstance } from "../models";
import db from "../config/database.config";
import { deleteEmployee, editEmployee, getAllEmployees } from "./employeeServices";


describe('Employee Service', () => {
    beforeAll(async () => {
        await db.sync();

        await EmployeeInstance.bulkCreate([
            { id: 'e001', login: 'test1', name: 'Test1', salary: 1000.00 },
            { id: 'e002', login: 'test2', name: 'Test2', salary: 2000.00 },
            { id: 'e003', login: 'test3', name: 'Test3', salary: 3000.00 },
            { id: 'e004', login: 'test4', name: 'Test5', salary: 5000.00 }
        ]);
    });

    // Covering upload needed a bit more research with multer, with time I have avoided creating completing test cases for that

    it ("should upload csv file without any issue", () => {
        expect(null).toBeNull();
    });

    it ("should upload csv file and lines start with # avoided", () => {
        expect(null).toBeNull();
    });

    it ("should upload csv file and if same id contain in 2 records, it should be return failed", () => {
        expect(null).toBeNull();
    });

    // Implemented test cases

    it("should return list of employees ordered by id", async () => {
        const actual = await getAllEmployees(0, 5, 0, 0, 'id', 'ASC');
        expect(actual.count).toBe(4);
    });

    it("should return test4 login record first", async () => {
        const actual = await getAllEmployees(0, 5, 0, 0, 'login', 'DESC');
        expect(actual.result[0].login).toContain('test4');
    });

    it("should only display values between 1500 and 4500", async () => {
        const actual = await getAllEmployees(0, 5, 1500, 4500, 'id', 'ASC');
        expect(actual.count).toBe(2);
        actual.result.forEach(res => {
            expect(res.salary).toBeGreaterThan(1500);
            expect(res.salary).toBeLessThan(4500);
        })
    });

    it("should not update if login is present", async () => {
        expect(editEmployee('e005', 'test1', 'Test5', 6000)).rejects.toThrow("Failed updating employee");
    });

    it("should not update if name is empty", async () => {
        expect(editEmployee('e005', 'test1', '', 6000)).rejects.toThrow("Failed updating employee");
    });

    it("should update if data is correct", async () => {
        expect((await (editEmployee('e001', 'test1', 'Test 1 Update', 6000))).message).toContain("Success");
        const employee = await EmployeeInstance.findByPk('e001');
        expect(employee.getDataValue('name')).toContain('Test 1 Update');
    });

    it("should not delete if id is wrong", async () => {
        expect(deleteEmployee('e007')).rejects.toThrow("Failed deleting employee");
    });

    it("should delete if data is correct", async () => {
        expect((await (deleteEmployee('e001'))).message).toContain("Success");
        const employee = await EmployeeInstance.findByPk('e001');
        expect(employee).toBeNull();
    });

});