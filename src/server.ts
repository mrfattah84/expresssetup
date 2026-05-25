import express, { urlencoded } from "express";
import { port } from "./config/index.js";
import mainRoute from "./routes/index.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(urlencoded({ extended: true }));
app.set("trust proxy", true);
app.use(cookieParser());

app.use("/api/", mainRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
