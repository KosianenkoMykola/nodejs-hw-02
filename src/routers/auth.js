import {Router} from "express";

import * as authControllers from "../controllers/auth.js";

import ctrlWrapper from "../untils/ctrlWrapper.js";
import validateBody from "../untils/validateBody.js";

import {userSignupSchema, userSigninSchema, resetPwdSchema} from "../validation/users.js";

const authRouter = Router();

authRouter.post("/register", validateBody(userSignupSchema), ctrlWrapper(authControllers.signupController));

authRouter.post("/send-reset-email", ctrlWrapper(authControllers.sendResetEmail));

authRouter.post("/reset-pwd", validateBody(resetPwdSchema),ctrlWrapper(authControllers.resetPwd));

authRouter.get("/verify", ctrlWrapper(authControllers.verifyController));

authRouter.post("/login", validateBody(userSigninSchema), ctrlWrapper(authControllers.signinController));

authRouter.post("/refresh", ctrlWrapper(authControllers.refreshController));

authRouter.post("/logout", ctrlWrapper(authControllers.logoutController));

export default authRouter;