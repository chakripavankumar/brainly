"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        yield db_1.UserModel.create({
            username: username,
            password: password
        });
        res.json({
            message: "user signed up"
        });
    }
    catch (error) {
        res.status(411).json({
            messsage: console.log(error)
        });
    }
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = yield db_1.UserModel.findOne({
        username,
        password
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id
        }, config_1.JWT_PASSWORD);
        res.json({
            token
        });
    }
    else {
        res.status(403).json({
            message: "incorrect Credentsils"
        });
    }
}));
app.post("/content", middleware_1.Usermiddleware, (req, res) => {
    try {
        const link = req.body.link;
        const type = req.body.type;
        const title = req.body.title;
        db_1.ContentModel.create({
            link,
            type,
            title,
            //@ts-ignore
            userId: req.userId,
            tags: []
        });
        res.json({
            message: " content added"
        });
    }
    catch (error) {
        res.status(411).json({
            messsage: console.log(error)
        });
    }
});
app.get("/share", (req, res) => {
});
app.delete("/contentId/delete", (req, res) => {
});
app.get("/shareLink", (req, res) => {
});
app.listen(3002, () => console.log("server is runiing in 3002"));
