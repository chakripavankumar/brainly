import mongoose, { Types } from "mongoose";

mongoose.connect("mongodb://localhost:27017/brainly")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const tagSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
});

const contentTypes = [
  "image",
  "video",
  "article",
  "audio",
  "youtube",
  "twitter",
];

const contentSchema = new mongoose.Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: Types.ObjectId, ref: "Tags" }],
  userId: { type: Types.ObjectId, ref: "Users", required: true },
});
console.log("MONGO_URL from env:", process.env.MONGO_URL);
const linkSchema = new mongoose.Schema({
  hash: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

export const UserModel = mongoose.model("Users", userSchema);

export const TagModel = mongoose.model("Tags", tagSchema);

export const ContentModel = mongoose.model("Contents", contentSchema);

export const LinkModel = mongoose.model("Links", linkSchema);
