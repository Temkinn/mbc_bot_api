import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import User from "./database/schemas.js"

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors(
  {
    origin: "https://mbc-menu.netlify.app",
    credentials: true,
  }
));


app.get("/", (req, res) => {
  res.send("Hello, this is api for MBC Culture telegram bot!!!");
});

app.post("/users/add", async (req, res) => {
	try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    // res.status(400).json({ message: error.message });
    res.send(error)
  }
});

app.get("/user/:id", async (req, res) => {
	try {
    const user = await User.findOne({id: Number(req.params.id)});
    res.send(user)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Database has been connected!");
      console.log(`Server is running...`);
    });
  })
  .catch((err) => console.log(err));
