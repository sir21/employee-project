import { Sequelize } from 'sequelize';

export const db = new Sequelize('app', '', '', {
    storage: './database.sqlite',
    dialect: 'sqlite',
    logging: false,
});