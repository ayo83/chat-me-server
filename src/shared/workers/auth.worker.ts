import { authService } from '@service/database/auth.service';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';

const log: Logger = config.createLogger('authWorker');

class AuthWorker {
  async addAuthUserToDb(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;

      // ADD METHOD TO SEND DATA TO DB
      await authService.createAuthUser(value);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const authWorker: AuthWorker = new AuthWorker();
