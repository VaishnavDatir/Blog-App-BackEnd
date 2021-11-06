"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
const dotenv = __importStar(require("dotenv"));
const authentication_routes_1 = require("./routes/authentication.routes");
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const test_routes_1 = require("./routes/test.routes");
const helmet_1 = __importDefault(require("helmet"));
const post_routes_1 = require("./routes/post.routes");
const user_routes_1 = require("./routes/user.routes");
dotenv.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use((0, helmet_1.default)());
const fileStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        if (file.originalname.includes("post_image")) {
            cb(null, "images/post_images");
        }
        else {
            cb(null, "images/profile_images");
        }
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + file.originalname);
    },
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, multer_1.default)({ storage: fileStorage }).single("image"));
// app.use("/images", express.static(path.join(__dirname, "images")));
// app.use("/images");
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "origin, X-Requested-With,Content-Type,Accept, Authorization");
    res.header("Access-Control-Allow-Header", "Content-Type,Authorization");
    res.header("Content-Type", "application/json; charset=UTF-8");
    next();
});
app.use("/test", test_routes_1.testRouter);
app.use("/auth", authentication_routes_1.authRouter);
app.use("/post", post_routes_1.postRouter);
app.use("/user", user_routes_1.userRouter);
app.use(error_middleware_1.default);
const MONGODB_URI = process.env.DB_CONNECTION_STRING;
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    app.listen(port, () => {
        console.log(`🌍 is listening at http://localhost:${port}`);
    });
})
    .catch((err) => {
    console.log(err);
});
function uuidv4() {
    throw new Error("Function not implemented.");
}
