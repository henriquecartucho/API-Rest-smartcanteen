import express from "express";
import { SeeProfileController } from "../controllers/both/profile/seeProfileController";
import { LoginController } from "../controllers/both/auth/loginController";
import { NewSessionTokenController } from "../controllers/both/auth/newSessionTokenController";
import { validateToken } from "../middlewares/validateToken";
import { validateRefreshToken } from "../middlewares/validateRefreshToken";
import { LogoutController } from "../controllers/both/auth/logoutController";
import { SeeMealsController } from "../controllers/both/meals/seeMealsController";



const bothRouter = express.Router();

const seeProfileController = new SeeProfileController();
const loginController = new LoginController();
const newSessionToken = new NewSessionTokenController();
const logoutController = new LogoutController();
const seeMealsController = new SeeMealsController();

bothRouter.get("/profile", validateToken, validateRefreshToken, seeProfileController.handle);
bothRouter.post("/login", loginController.handle);
bothRouter.get("/newSessionToken", newSessionToken.handle);
bothRouter.get("/logout", validateToken, validateRefreshToken, logoutController.handle);

bothRouter.get("/meals/:barId", seeMealsController.handle);

export { bothRouter };
