import express from "express";
import cors from "cors";
import pino from "pino-http";
import dotenv from "dotenv";

dotenv.config();

const port = Number(process.env.PORT) || 3000;


export  const startServer = () => {
    const app = express();
    const logger = pino({
        transport: {
            target: "pino-pretty"
        }
    });

    app.use(logger);
    app.use(cors());
    app.use(express.json());


    app.use((req, res) => {
        res.status(404).json({
            message: `${req.url} not found`
        });
    });
    app.use((error, req, res, next) => {
         res.status(500).json({
            message: error.message,
         });
    });

    app.listen(port , ()=> console.log("Server running on port 3000"));
};