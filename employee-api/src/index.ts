import express from "express";
import cors from "cors";
import { db } from "./config/database.config";
import * as routes from "./routes";

db.sync({ force: true }).then(() => {
    // tslint:disable-next-line:no-console
    console.log('connected to database');
});

const app = express();
const port = 8080; // default port to listen

app.use(cors());
app.use(express.json());

// Configure routes
routes.register(app);

// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});