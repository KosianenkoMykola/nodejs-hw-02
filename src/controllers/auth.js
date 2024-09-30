import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

import * as authServices from "../services/auth.js";

export const sendResetEmail = async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await authServices.findByEmail(email);
  
      if (!user) {
        throw createHttpError(404, "User not found!");
      }
  
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
  
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
  
      const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Password Reset",
        html: `<p>To reset your password, click <a href="${resetLink}">here</a>.</p>`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({
        status: 200,
        message: "Reset password email has been successfully sent.",
        data: {},
      });
    } catch (error) {
      next(createHttpError(500, "Failed to send the email, please try again later."));
    }
  };

const setupSession = (res, session) => {
    const refreshTokenExpiry = new Date(session.refreshTokenValidUntil);

    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expires: refreshTokenExpiry,
    });

    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expires: refreshTokenExpiry,
    });
};

export const signupController = async (req, res, next) => {
    try {
        const newUser = await authServices.signup(req.body);

        res.status(201).json({
            status: 201,
            message: "Successfully registered user",
            data: newUser,
        });
    } catch (error) {
        next(error);
    }
};

export const signinController = async (req, res, next) => {
    try {
        const session = await authServices.signin(req.body);

        setupSession(res, session);

        res.json({
            status: 200,
            message: "Successfully logged in user!",
            data: {
                accessToken: session.accessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const refreshController = async (req, res, next) => {
    try {
        const { refreshToken, sessionId } = req.cookies;
        const session = await authServices.refreshSession({ refreshToken, sessionId });

        setupSession(res, session);

        res.json({
            status: 200,
            message: "Successfully refreshed session",
            data: {
                accessToken: session.accessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const logoutController = async (req, res, next) => {
    try {
        const { sessionId } = req.cookies;
        if (sessionId) {
            await authServices.signout(sessionId);
        }

        res.clearCookie("sessionId", { httpOnly: true });
        res.clearCookie("refreshToken", { httpOnly: true });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
