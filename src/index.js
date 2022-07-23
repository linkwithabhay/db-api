import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import alphaRouter from "./routes/phaseAlpha.js";

dotenv.config();
const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/", alphaRouter);

const PORT = process.env.PORT || 9000;
// mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
//   if (error) return console.error(error.stack);
//   app.listen(PORT, () => {
//     console.log("Connected to DB!");
//     console.log(`Server running on port: ${PORT}`);
//   });
// });

app.listen(PORT, (err) => {
  if (err) return console.log("Error Occured");
  console.log(`Server running on port: ${PORT}`);
  console.log(`Open http://localhost:${PORT} in browser`);
});

// mongoose.set("useFindAndModify", false);
