import { IEmailJob } from '@user/interfaces/user.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { emailWorker } from '@worker/email.worker';

class EmailQueue extends BaseQueue {
  constructor() {
    super('emails');
    this.processJob('forgotPasswordEmail', 5, emailWorker.adNotificationEmail);
    this.processJob('commentsEmail', 5, emailWorker.adNotificationEmail);
    this.processJob('followersEmail', 5, emailWorker.adNotificationEmail);
    this.processJob('reactionsEmail', 5, emailWorker.adNotificationEmail);
    this.processJob('directMessageEmail', 5, emailWorker.adNotificationEmail);
    this.processJob('changePassword', 5, emailWorker.adNotificationEmail);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public addEmailJob(name: string, data: IEmailJob): void {
    this.addJob(name, data);
  }
}

export const emailQueue: EmailQueue = new EmailQueue();
