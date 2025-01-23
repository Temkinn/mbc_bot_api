import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import User from "./database/schemas.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: "https://mbc-menu.netlify.app",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello, this is api for MBC Culture telegram bot!!!");
  console.log("root request!");
});

app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findOne({ id: Number(req.params.id) });
    console.log("/user/{id} request!");
    res.send(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/users/admins", async (req, res) => {
  try {
    const admins = await User.find({
      isAdmin: true
    })
    console.log("/users/admins request!");
    const admins_id = admins.map((admin) => admin.id)
    res.send(admins_id);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    console.log("/users request!");
    res.send(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/users/add", async (req, res) => {
  try {
    const id = await User.findOne({ id: Number(req.body.id) });
    const username = await User.findOne({ username: req.body.username });
    if (id || username) {
      return res.status(404).json({ message: "User already exists" });
    }
    const newUser = new User(req.body);
    await newUser.save();
    console.log("/users/add request!");
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/users/update/:id", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { id: Number(req.params.id) },
      {
        name: req.body.name,
        username: req.body.username,
      }
    );
    console.log("/users/update/{id} request!");
    console.log(user);
    res.status(201).json({ user: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/user/:id/coins/add", async (req, res) => {
  try {
    const old_user = await User.findOne({ id: Number(req.params.id) });
    console.log(old_user.coins);
    const user = await User.findOneAndUpdate(
      { id: Number(req.params.id) },
      {
        coins: old_user.coins + req.body.coins,
      }
    );
    console.log("/user/{id}/coins/add request!");
    res.status(201).json({ user: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/user/:id/coins/subtract", async (req, res) => {
  try {
    const old_user = await User.findOne({ id: Number(req.params.id) });
    console.log(old_user.coins);
    if (old_user.coins < req.body.coins) {
      return res.status(404).json({ message: "Not enough coins" });
    }
    const user = await User.findOneAndUpdate(
      { id: Number(req.params.id) },
      {
        coins: old_user.coins - req.body.coins,
      }
    );
    console.log("/user/{id}/coins/subtract request!");
    res.status(201).json({ user: user });
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
