import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDatabase from "./src/database/index.js";

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/", (req, res) => {
    res.send("TrendWave Server");
});

connectDatabase().then(() => {
    app.listen(port, () => {
        console.log("Server is running on the port", port);
    });
}).catch((err) => {
    console.log("Error Message", err.message);
})