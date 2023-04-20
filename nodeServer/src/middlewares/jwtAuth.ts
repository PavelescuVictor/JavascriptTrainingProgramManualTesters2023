import { Request, Response, NextFunction } from 'express';

import { verify } from 'jsonwebtoken';

export const secret = 'ABCDEFGHIJKLMNOPQRSTUVXYZ';

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    res.sendStatus(401);
    return;
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer') {
    res.sendStatus(401);
    return;
  }

  try {
    const decoded = verify(token, secret);
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};
