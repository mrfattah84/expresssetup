import express, { urlencoded } from "express";
import { port } from "./config/index.js";
import mainRoute from "./routes/index.js";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./utils/swagger.js";
const app = express();

app.use(express.json()); // parses application/json
app.use(express.urlencoded({ extended: true })); // parses form data (optional)
app.set("trust proxy", true);
app.use(cookieParser());

// app.js / index.js

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/", mainRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
