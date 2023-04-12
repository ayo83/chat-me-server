import Logger from 'bunyan';
import { config } from '@root/config';
import { BaseCache } from '@service/redis/base.cache';

const log: Logger = config.createLogger('redisConnection');

class RedisConnection extends BaseCache {
  constructor() {
    super('redisConnection');
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      log.info('Successfully connected redis.');
    } catch (error) {
      log.error('Error connecting to redis', error);
    }
  }
}

export const redisConnection: RedisConnection = new RedisConnection();
