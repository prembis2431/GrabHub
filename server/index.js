import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import router from "./router.js";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.listen(process.env.PORT || 5010);

mongoose.connect(process.env.DB_URI, { dbName: "grabhub" }).then(() => {
  console.log("Server connected with MongoDB");
});

app.use("/", router);
