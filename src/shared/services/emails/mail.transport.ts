import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import Logger from 'bunyan';
import sendGridMail from '@sendgrid/mail';
import { config } from '@root/config';
import { BadRequestError } from '@global/helpers/error-handler';

interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const log: Logger = config.createLogger('mailOption');
sendGridMail.setApiKey(config.SENDGRID_API_KEY!);

class MailTransport {
  public async sendEmail(receiverEmail: string, subject: string, body: string): Promise<void> {
    if (config.NODE_ENV === 'test' || config.NODE_ENV === 'development') {
      this.developmentEmailSender(receiverEmail, subject, body);
    } else this.productionEmailSender(receiverEmail, subject, body);
  }

  private async developmentEmailSender(receiverEmail: string, subject: string, body: string): Promise<void> {
    const transporter: Mail = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: config.SENDER_EMAIL!,
        pass: config.SENDER_EMAIL_PASSWORD!
      }
    });

    const mailOptions: IMailOptions = {
      from: `Chatty Application <${config.SENDER_EMAIL!}>`,
      to: receiverEmail,
      subject,
      html: body
    };
    try {
      await transporter.sendMail(mailOptions);
      log.info('Development Email Sent Successfully');
    } catch (error) {
      log.error('Error Sending Email', error);
    }
  }


  private async productionEmailSender(receiverEmail: string, subject: string, body: string): Promise<void> {
    const transporter: Mail = nodemailer.createTransport({
      host: config.EMAIL_HOST!,
      port: 465,
      secure: true,
      auth: {
        user: config.EMAIL_USER!,
        pass: config.EMAIL_PASS!
      }
    });

    const mailOptions: IMailOptions = {
      from: `Chatty Application <${config.EMAIL_USER!}>`,
      to: receiverEmail,
      subject,
      html: body
    };
    try {
      await transporter.sendMail(mailOptions);
      log.info('Production Email Sent Successfully');
    } catch (error) {
      log.error('Error Sending Email', error);
    }
  }

  // private async productionEmailSender(receiverEmail: string, subject: string, body: string): Promise<void> {
  //   const mailOptions: IMailOptions = {
  //     from: `Chatty Application <${config.SENDER_EMAIL!}>`,
  //     to: receiverEmail,
  //     subject,
  //     html: body
  //   };
  //   try {
  //     await sendGridMail.send(mailOptions);
  //     log.info('Production Email Sent Successfully');
  //   } catch (error) {
  //     log.error('Error Sending Email', error);
  //   }
  // }
}

export const mailTransport: MailTransport = new MailTransport();
