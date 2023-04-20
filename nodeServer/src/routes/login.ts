import { Router } from 'express';
import { sign } from 'jsonwebtoken';

import { jwtAuth, secret } from '../middlewares/jwtAuth';

const loginRoute = Router();

// const ACCESS_TOKEN_SECRET = 'AccessTokenSecret';
// const REFRESH_TOKEN_SECRET = 'RefreshTokenSecret';
// const ACCESS_TOKEN_EXPIRY_TIME = '1h';
// const REFRESH_TOKEN_EXPIRY_TIME = '60d';

import fixtures from '../__fixtures__';

const { users } = fixtures.users;

// const signToken = (userId, secretKey, expiresIn) => {
//   return new Promise((resolve, reject) => {
//     const options = {
//       expiresIn,
//       issuer: "Victor's Server",
//       audience: userId,
//     };

//     jsonwebtoken.sign({}, secretKey, options, (error, token) => {
//       if (error) reject({ isError: true, message: 'Invalid Operation' });
//       else resolve(token);
//     });
//   });
// };

// const signAccessToken = (userId) => {
//   return signToken(userId, 'accessTokenSecretKey', ACCESS_TOKEN_EXPIRY_TIME);
// };

// const signRefreshToken = (userId) => {
//   return signToken(userId, 'refreshTokenSecretKey', REFRESH_TOKEN_EXPIRY_TIME);
// };

// const reIssueTokens = async (refreshToken) => {
//   const payload = await verifyRefreshToken(refreshToken);
//   const userId = payload.aud;

//   let userToken = await userTokens
//     .find({ user: userId })
//     .sort({ createdAt: -1 })
//     .limit(1);

//   userToken = userToken[0];
//   if (!userToken)
//     throw { isError: true, message: 'User token does not exist.' };

//   if (userToken.refreshToken !== refreshToken)
//     throw { isError: true, message: 'Old token. Not valid anymore.' };

//   const [accessToken, refToken] = await Promise.all([
//     signAccessToken(userId),
//     signRefreshToken(userId),
//   ]);

//   await userTokens.findOneAndUpdate(
//     { id: userToken.id },
//     { set: { refreshToken: refToken } }
//   );

//   return { accessToken: accessToken, refreshToken: refToken };
// };

// const verifyAccessToken = async (req, res, next) => {
//   try {
//     const authToken = req.headers.authorization;
//     if (!authToken) throw { isError: true, message: 'No auth token provided!' };

//     const accessToken = authToken.split(' ')[1];
//     if (!accessToken)
//       throw { isError: true, message: 'No auth token provided!' };

//     const payload = await verifyAccessToken(accessToken);
//     await checkIfAllowed(payload.aud);
//     req.payload = payload;
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// const checkIfAllowed = async (userId) => {
//   const userToken = await userTokens
//     .find({ user: userId })
//     .sort({ createdAt: -1 })
//     .limit(1);
//   if (!userToken[0])
//     throw { isError: true, message: 'User token does not exist' };
// };

loginRoute.post('/', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) res.sendStatus(401);

  const results = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!results) res.sendStatus(401);

  const token = sign(
    {
      sub: '1234567',
      iss: 'nodeJs Server',
      usr: 'Victor Pavelescu',
    },
    secret,
    { expiresIn: '1m' }
  );
  res.cookie('user-data', results);
  res.json({
    token,
    expiresIn: 1000 * 15 * 1,
    userData: results
      ? {
          username: results.username,
          nickname: results.nickname,
          userId: results.id,
        }
      : {},
  });
});

export default loginRoute;
