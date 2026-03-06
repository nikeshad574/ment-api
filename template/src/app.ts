import express from "express";
import morgan from "morgan";
import globalErrorHandler from "./middlewares/error.middlewares";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.static("/public"));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.route("/api/v1").get((_, res) => {
  res.send("Hello World!");
});

app.all("*", (_, res) => {
  res.send("No such route found on the server");
});
app.use(globalErrorHandler);

export default app;
