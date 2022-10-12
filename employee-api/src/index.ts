import express from "express";
import { db } from "./config/database.config";
import * as routes from "./routes";

db.sync({ force: true }).then(() => {
    // tslint:disable-next-line:no-console
    console.log('connected to database');
});

const app = express();
const port = 8080; // default port to listen

app.use(express.json());

// Configure routes
routes.register(app, db);

// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});