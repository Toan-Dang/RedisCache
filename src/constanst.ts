import e from 'express';
import { createClient } from 'redis';

export const redisClient = createClient({
  url: 'redis://default:wUpy2mKz0vCWHKYCJVcaaU4Clo8yDyQX@redis-19970.c9.us-east-1-2.ec2.cloud.redislabs.com:19970',
  socket: {
    connectTimeout: 50000,
  },
});
