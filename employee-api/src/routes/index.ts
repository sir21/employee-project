import * as express from "express";
import { Sequelize } from "sequelize";

export const register = (app: express.Application, db: Sequelize) => {

    // define a route handler for the default home page
    app.post("/users/upload", (req: any, res) => {
        res.send("OK");
    });
};