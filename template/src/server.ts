import mongoose from "mongoose";
import conf from "./conf/conf";
import app from "./app";

const connectDB = async () => {
  mongoose
    .connect(conf.dbURI)
    .then(() => {
      console.log("Database connected sucessfully.");
    })
    .catch((err) => {
      console.log("Database Connection Error", err);
    });
};

app.listen(conf.port, () => {
  console.log(`Listening on http://localhost:${conf.port}/api/v1`);
  connectDB();
});
