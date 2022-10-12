import { DataTypes, Model } from "sequelize";
// @ts-ignore
import db from "src/config/database.config";

interface EmployeeAttribute {
    id: string,
    login: string,
    name: string,
    salary: number,
}

export class EmployeeInstance extends Model<EmployeeAttribute> { }

EmployeeInstance.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        salary: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize: db,
        tableName: 'employees'
    }
)