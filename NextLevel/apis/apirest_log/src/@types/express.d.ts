import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;  // O el tipo adecuado de `user`
    }
  }
}
