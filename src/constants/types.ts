import { MicroRequest } from 'apollo-server-micro/dist/types';
import { ServerResponse } from 'http';

export interface ContextArgs {
  req: MicroRequest;
  res: ServerResponse;
}
