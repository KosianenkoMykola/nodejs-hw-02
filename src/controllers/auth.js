import * as authServices from "../services/auth.js";

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
