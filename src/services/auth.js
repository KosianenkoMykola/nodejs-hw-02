import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { sendEmail } from '../untils/sendEmail.js';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import { env } from '../untils/env.js';
import { TEMPLATES_DIR } from '../constants/index.js';

import SessionCollection from '../db/models/Session.js';
import UserCollection from '../db/models/User.js';

import { accessTokenLifetime, refreshTokenLifetime } from '../constants/users.js';

export const requestResetToken = async (email) => {

  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    { expiresIn: '15m' },
  );

  const resetPasswordTemplatePath = path.join(TEMPLATES_DIR, 'reset-password-email.html');

  const templateSource = ( await fs.readFile(resetPasswordTemplatePath)).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: env('SMTP_FROM'),
    to: email,
    subject: 'Reset Your Password',
    html,
  });
};

export const resetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, env('JWT_SECRET'));

    const user = await UserCollection.findOne({ email: decoded.email });

    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.session = null;
    await user.save();

    return { status: 200, message: 'Password has been successfully reset.' };

  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    throw error;
  }
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifetime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifetime);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const signup = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const data = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });

  return data;
};

export const signin = async (payload) => {
  const { email, password } = payload;

  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw createHttpError(401, 'Password or email invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id });
  const sessionData = createSession();
  const userSession = await SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });
  return userSession;
};

export const findSessionByAccessToken = (accessToken) =>
  SessionCollection.findOne({ accessToken });

export const refreshSession = async ({ refreshToken, sessionId }) => {
  const oldSession = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }
  if (new Date() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }
  await SessionCollection.deleteOne({ _id: sessionId });

  const sessionData = createSession();
  const userSession = await SessionCollection.create({
    userId: oldSession._id,
    ...sessionData,
  });
  return userSession;
};

export const signout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const findUser = (filter) => UserCollection.findOne(filter);