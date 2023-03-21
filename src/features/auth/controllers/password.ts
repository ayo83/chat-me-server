import { Request, Response } from 'express';
import { config } from '@root/config';
import HTTP_STATUS from 'http-status-codes';
import { authService } from '@service/database/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import crypto from 'crypto';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { emailSchema, passwordSchema } from '@auth/schemes/password';
import { forgotPasswordTemplate } from '@service/emails/templates/forget-password/forget-password-template';
import { emailQueue } from '@service/queues/email.queue';
import { IResetPasswordParams } from '@user/interfaces/user.interface';
import moment from 'moment';
import publicIp from 'ip';
import { resetPasswordTemplate } from '@service/emails/templates/reset-password/reset-password-template';

export class Password {
  @joiValidation(emailSchema)
  public async requestReset(req: Request, res: Response): Promise<void> {
    const existingUser: IAuthDocument = await authService.getAuthUserByEmail(req.body.email);

    if (!existingUser) {
      throw new BadRequestError('Invalid Credentials');
    }

    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString('hex');
    await authService.updatePasswordToken(`${existingUser._id!}`, randomCharacters, Date.now() * 60 * 60 *1000);

    const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;
    const template: string = forgotPasswordTemplate.passwordResetTemplate(existingUser.username!, resetLink);
    emailQueue.addEmailJob('forgotPasswordEmail', {template, receiverEmail: req.body.email, subject: 'Reset Your Password'});

    res.status(HTTP_STATUS.OK).json({message: `Rest Password Link Sent To ${req.body.email}`});
  }


  @joiValidation(passwordSchema)
  public async resetPassword(req: Request, res: Response): Promise<void> {
    const existingUser: IAuthDocument = await authService.getAuthUserByToken(req.params.token);
    if (!existingUser) {
      throw new BadRequestError('Reset Token Has Expired');
    }

    existingUser.password = req.body.password;
    existingUser.passwordResetToken = undefined;
    existingUser.passwordResetExpires = undefined;
    await existingUser.save();

    const templateParams: IResetPasswordParams = {
      username: existingUser.username!,
      email: existingUser.email!,
      ipaddress: publicIp.address(),
      date: moment().format('DD/MM/YYYY HH:mm')
    };

    const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
    emailQueue.addEmailJob('forgotPasswordEmail', {template, receiverEmail: existingUser.email!, subject: 'Password Reset Confirmation'});

    res.status(HTTP_STATUS.OK).json({message: 'Password Reset Successfully'});
  }
}
