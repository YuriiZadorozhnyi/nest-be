import { Request } from 'express';

export interface RequestExtended extends Request {
  user: {
    id: string;
  };
}
