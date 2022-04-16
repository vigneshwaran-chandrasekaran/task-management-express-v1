import express from "express";
import error from "./middleware/error";

const app = express();

app.use(error);
