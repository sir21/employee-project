import express from "express";
import cors from "cors";
import helmet from 'helmet';
import bodyParser from 'body-parser';
import multer from 'multer';
import db from "./config/database.config";
import router from "./routes";


db.sync().then(() => {
    // tslint:disable-next-line:no-console
    console.log('connected to database');
});

const app = express();
const port = 8080; // default port to listen

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(multer().any());

// Configure routes
app.use(router)

// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});