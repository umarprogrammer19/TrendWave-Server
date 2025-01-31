import express from "express";
import "dotenv/config";
import cors from "cors";

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/", (req, res) => {
    res.send("TrendWave Server");
});

app.listen(port, () => {
    console.log("Server is running on the port", port);
})