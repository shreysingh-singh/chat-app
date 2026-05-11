import express from "express";
import userRouter from "./router/userRouter"

import { MONGO_URL, PORT_URL } from "./config";
import mongoose from "mongoose";

const app = express();

app.use(express.json());


app.use("/user", userRouter);

//Testing
app.post("/", (req, res) => {
  res.json({
    msg: `Server is running`,
  });
});

async function startServer() {
  try {
    if (MONGO_URL) {
      await mongoose
        .connect(MONGO_URL)
        .then(() => console.log(`MongoDb Connected ✅`))
        .catch((err) => console.log(err));
    } else {
      console.warn(
        "MONGO_URL not provided — starting server without DB connection.",
      );
    }

    app.listen(PORT_URL, () => {
      console.log(`Your server is running on http://localhost:${PORT_URL}`);
    });
  } catch (e) {
    console.log(`Something went wrong`, e);
  }
}

startServer();
