import createHttpError from "http-errors";

import * as authServices from "../services/auth.js";
import {verifyToken} from "../untils/jwt.js";

const authenticate = async(req, res, next)=> {
    // const {authorization} = req.headers;
    const authorization = req.get("Authorization");

    if(!authorization) {
         return next(createHttpError(401, "Authorization header not found"));
    }

    const [bearer, token] = authorization.split(" ");

    if(bearer !== "Bearer") {
        return next(createHttpError(401, "Authorization header must have Bearer type"));
    }
    
    let tokenPayload = null;

    try {
        tokenPayload = verifyToken(token, process.env.JWT_SECRET);
    } catch {
        return next(createHttpError(401, "Invalid jwt"));
    }

    // const session = await authServices.findSessionByAccessToken(token);
    // if(!session) {
    //     return next(createHttpError(401, "Session not found"));
    // }

    // if(new Date() > session.accessTokenValidUntil) {
    //     return next(createHttpError(401, "Access token expired"));
    // }

    const user = await authServices.findUser({email: tokenPayload.data.email});
    if(!user) {
        return next(createHttpError(401, "User not found"));
    }

    req.user = user;

    next();
};

export default authenticate;