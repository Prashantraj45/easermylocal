import dotenv from "dotenv";
import express, { Request, Response, Application, response } from "express";
import mongoose from "mongoose";
import cors from "cors";

//? Helpers
import httpLogger from "./middleware/httpLogger";
import { success, successBg, error, errorBg } from "./helpers/helpers";
import { checkTokenAndPermission } from "./middleware/middlewares";

//? Routes
import AdminAuthRoutes from "./routes/Admin/AdminAuthRoutes";
import AdminRoutes from "./routes/Admin/AdminRoutes";
import SubscriptionRoutes from "./routes/Subscription/SubscriptionRoutes";
import PartnerAuthRoutes from "./routes/Partner/PartnerAuthRoute";
import PartnerRoutes from "./routes/Partner/PartnerRoutes";
import UserAuthRoutes from "./routes/User/UserAuthRoute";
import UserRoutes from "./routes/User/UserRoutes";
import SendMailRoute from "./routes/Admin/SendMailRoute"
import PostRoute from './routes/Post/PostRoutes'
import SplashScreenRoute from './routes/SplashScreen/SplashScreen'
import path from "path";
import NotificationRoute from './routes/Notification/Notification'
import checkUserExist from './routes/Check user/CheckUser'
import SearchRoute from './routes/search/Search'
import uploadFileController from "./controller/UploadFileController/uploadFileController";
const fileUpload = require('express-fileupload');

dotenv.config();

//? APP INITIALIZATION
const app: Application = express();

//? Mongodb Connection
(async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ? process.env.MONGODB_URI : ""
    );
    console.log("DB Connected...🤝");
  } catch (err: any) {
    error(err);
  }
})();

// cors policy
var corsOptions = {
  origin: "*",
  preflightContinue: false,
  optionsSuccessStatus: 200,
  methods: "GET, PUT, POST, DELETE",
};

// Configure Express to use EJS
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );


//? Custom Middleware
app.use(httpLogger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(fileUpload())

//? API's
app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "Easer backend working here... 🚀" });
});

//? AUTH ROUTES
app.use("/api/admin", AdminAuthRoutes);

//?
app.use("/api/admin", AdminRoutes);

app.use(
  "/api/subscription",
  checkTokenAndPermission(["ADMIN"]),
  SubscriptionRoutes
);

app.use('/api/checkuser',checkUserExist)

app.use('/api/splash',SplashScreenRoute)

app.use("/api/partner", PartnerAuthRoutes);

app.use("/api/partner", PartnerRoutes);

app.use("/api/user", UserAuthRoutes);

app.use("/api/user", UserRoutes);

app.use('/api/admin',SendMailRoute)

//------> POST ROUTE
app.use('/api/post', PostRoute)

//----------> Notification
app.use('/api/notification',NotificationRoute)
//---------------> Search API
app.use('/api/search',SearchRoute)

//-----------> Upload file
app.post('/api/upload-file',uploadFileController)

//? PORT
const PORT = process.env.PORT || 8000;

//? Server
app.listen(PORT, (): void => {
  console.log(`Server is running on ${PORT}... 🚀`);
});
