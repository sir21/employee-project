import { IEmployee } from "../@types/employee";
import http from "./http-common";
import axios from "axios";

const deleteEmployee = (id: string) => {
    return http.delete<any>(`/${id}`);
}

const editEmployee = (employee: IEmployee) => {
    return http.put<IEmployee>(`/${employee.id}`, employee);
}

const getAllEmployees = (page: number, pageSize: number, minSalary: number, maxSalary: number, orderBy: string, orderMethod: string) => {
    return http.get<IEmployee[]>("/", { params: { page, pageSize, minSalary, maxSalary, orderBy, orderMethod } });
}

const uploadCSV = (data: FormData) => {
    return axios.create({
        baseURL: "http://localhost:8080/employees",
    }).post<any[]>("/upload", data);
};

export {
    deleteEmployee,
    editEmployee,
    getAllEmployees,
    uploadCSV,
}