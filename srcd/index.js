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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
//? Helpers
const httpLogger_1 = __importDefault(require("./middleware/httpLogger"));
const helpers_1 = require("./helpers/helpers");
const middlewares_1 = require("./middleware/middlewares");
//? Routes


const AdminAuthRoutes_1 = __importDefault(require("./routes/Admin/AdminAuthRoutes"));
const AdminRoutes_1 = __importDefault(require("./routes/Admin/AdminRoutes"));
const SubscriptionRoutes_1 = __importDefault(require("./routes/Subscription/SubscriptionRoutes"));
const PartnerAuthRoute_1 = __importDefault(require("./routes/Partner/PartnerAuthRoute"));
const PartnerRoutes_1 = __importDefault(require("./routes/Partner/PartnerRoutes"));
const UserAuthRoute_1 = __importDefault(require("./routes/User/UserAuthRoute"));
const UserRoutes_1 = __importDefault(require("./routes/User/UserRoutes"));
const SendMailRoute_1 = __importDefault(require("./routes/Admin/SendMailRoute"));
const PostRoutes_1 = __importDefault(require("./routes/Post/PostRoutes"));
const SplashScreen_1 = __importDefault(require("./routes/SplashScreen/SplashScreen"));
const path_1 = __importDefault(require("path"));
const Notification_1 = __importDefault(require("./routes/Notification/Notification"));
const CheckUser_1 = __importDefault(require("./routes/Check user/CheckUser"));
const Search_1 = __importDefault(require("./routes/search/Search"));
const uploadFileController_1 = __importDefault(require("./controller/UploadFileController/uploadFileController"));
const fileUpload = require('express-fileupload');
dotenv_1.default.config();
//? APP INITIALIZATION
const app = (0, express_1.default)();
//? Mongodb Connection
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGODB_URI ? process.env.MONGODB_URI : "");
        console.log("DB Connected...🤝");
    }
    catch (err) {
        (0, helpers_1.error)(err);
    }
}))();
// cors policy
var corsOptions = {
    origin: "*",
    preflightContinue: false,
    optionsSuccessStatus: 200,
    methods: "GET, PUT, POST, DELETE",
};
// Configure Express to use EJS
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
//? Custom Middleware
app.use(httpLogger_1.default);
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(fileUpload());
//? API's
app.get("/", (req, res) => {
    res.json({ message: "Easer backend working here... 🚀" });
});
//? AUTH ROUTES
app.use("/api/admin", AdminAuthRoutes_1.default);
//?
app.use("/api/admin", AdminRoutes_1.default);
app.use("/api/subscription", (0, middlewares_1.checkTokenAndPermission)(["ADMIN"]), SubscriptionRoutes_1.default);
app.use('/api/checkuser', CheckUser_1.default);
app.use('/api/splash', SplashScreen_1.default);
app.use("/api/partner", PartnerAuthRoute_1.default);
app.use("/api/partner", PartnerRoutes_1.default);
app.use("/api/user", UserAuthRoute_1.default);
app.use("/api/user", UserRoutes_1.default);
app.use('/api/admin', SendMailRoute_1.default);
//------> POST ROUTE
app.use('/api/post', PostRoutes_1.default);
//----------> Notification
app.use('/api/notification', Notification_1.default);
//---------------> Search API
app.use('/api/search', Search_1.default);
//-----------> Upload file
app.post('/api/upload-file', uploadFileController_1.default);
//? PORT
const PORT = process.env.PORT || 8000;
//? Server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}... 🚀`);
});
