import { Router } from 'express';
import { jwtAuth } from '../middlewares/jwtAuth';
import { v4 as uuid } from 'uuid';

const exceptionsRoute = Router();

exceptionsRoute.get('/:id?', (req, res) => {
  res.sendStatus(500);
});

export default exceptionsRoute;
