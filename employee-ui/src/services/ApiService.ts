import http from "./http-common";
import { IEmployee } from "../@types/employee";

const deleteEmployee = (id: string) => {
    return http.delete<any>(`/${id}`);
}

const editEmployee = (employee: IEmployee) => {
    return http.put<IEmployee>(`/${employee.id}`, employee);
}

const getAllEmployees = (page: number, pageSize: number, minSalary: number | null, maxSalary: number | null, orderBy: string, orderMethod: string) => {
    return http.get<{ result: IEmployee[], count: number }>("/", { params: { page, pageSize, minSalary, maxSalary, orderBy, orderMethod } });
}

const uploadCSV = (data: FormData) => {
    return http.post<any[]>(`/upload`, data);
};

export {
    deleteEmployee,
    editEmployee,
    getAllEmployees,
    uploadCSV,
}