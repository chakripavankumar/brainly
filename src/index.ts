declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}

import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import { ContentModel, LinkModel, UserModel } from "./db";
import { JWT_PASSWORD } from "./config";
import { Usermiddleware } from "./middleware";
import { random } from "./utils";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    await UserModel.create({
      username: username,
      password: password,
    });
    res.json({
      message: "user signed up",
    });
  } catch (error) {
    res.status(411).json({
      message: "Error signing up user",
    });
  }
});

app.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const existingUser = await UserModel.findOne({
    username,
    password,
  });
  if (existingUser) {
    const token = jwt.sign(
      {
        id: existingUser._id,
      },
      JWT_PASSWORD
    );
    res.json({
      token,
    });
  } else {
    res.status(403).json({
      message: "incorrect Credentials",
    });
  }
});

app.post("/content", Usermiddleware, async (req, res) => {
  try {
    const link = req.body.link;
    const type = req.body.type;
    const title = req.body.title;
    await ContentModel.create({
      link,
      type,
      title,
      userId: req.userId,
      tags: [],
    });
    res.json({
      message: "content added",
    });
  } catch (error) {
    res.status(411).json({
      message: "Error adding content",
    });
  }
});

app.get("/content", Usermiddleware, async (req, res) => {
  const userId = req.userId;
  const content = await ContentModel.find({
    userId: userId,
  }).populate("userId");
  res.json({
    content,
  });
});

app.delete("/:content", Usermiddleware, async (req, res) => {
  const contentId = req.body.contentId;
  await ContentModel.deleteMany({
    _id: contentId,
    userId: req.userId,
  });
  res.json({
    message: "content deleted",
  });
});

app.post("/share", Usermiddleware, async (req, res) => {
  const share = req.body.share;
  if (share) {
    const existingLink = await LinkModel.findOne({
      userId: req.userId,
    });
    if (existingLink) {
      res.json({
        hash: existingLink.hash,
      });
      return;
    }
    const hash = random(10);
    await LinkModel.create({
      hash: hash,
      userId: req.userId,
    });
    res.json({
      message: hash,
    });
  } else {
    await LinkModel.deleteOne({
      userId: req.userId,
    });
    res.json({
      msg: "removed link",
    });
  }
});

app.get("/:shareLink", Usermiddleware, async (req, res) => {
  const hash = req.params.shareLink;
  const link = await LinkModel.findOne({ hash });
  if (link) {
    const content = await ContentModel.find({ userId: link.userId });
    res.json({
      content,
    });
  } else {
    res.status(404).json({
      message: "Link not found",
    });
  }
});

app.listen(3002, () => console.log("server is running on 3002"));
