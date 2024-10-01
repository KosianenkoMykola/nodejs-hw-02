import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

import * as authServices from "../services/auth.js";


 const ses = new SESClient({
      region: process.env.SES_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    });
  

  async function sendResetEmailAWS(toAddress) {
    const token = jwt.sign({ toAddress }, process.env.JWT_SECRET, { expiresIn: '5m' });
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    console.log( 'toAddress:', toAddress );
    const params = {
      Destination: {
        ToAddresses: [toAddress],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: {
                body: `<p>To reset your password, click <a href="${resetLink}">here</a>.</p>`,
                subject: "Password Reset",
            },
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: "Password Reset",
         },
      },
      Source: "kosianenkomykola@gmail.com",
    };

    const command = new SendEmailCommand(params);
    try{
        console.log( await ses.send(command) );
    } catch( error ) {
        console.log( error );
    }
  }

export const sendResetEmail = async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await authServices.findByEmail(email);
  
      if (!user) {
        throw createHttpError(404, "User not found!");
      }
      await sendResetEmailAWS(email);
      res.status(200).json({
        status: 200,
        message: "Reset password email has been successfully sent.",
        data: {},
      });
    } catch (error) {

        next(createHttpError(500, error ));

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
                accessToken: jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, { expiresIn: '5d' }),
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

export const resetPwd = async (req, res, next) => {
    try {

        const { token, password } = req.body;
        await authServices.changePwd(token, password);

        res.status(200).send({
            status: 200,
            message: "Password has been successfully reset.",
            data: {}
        }
     );
    } catch (error) {
        next(error);
    }
};