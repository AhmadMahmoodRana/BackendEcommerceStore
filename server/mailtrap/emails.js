import {
   PASSWORD_RESET_REQUEST_TEMPLATE,
   PASSWORD_RESET_SUCCESS_TEMPLATE,
   VERIFICATION_EMAIL_TEMPLATE,
} from './emailTemplates.js';
import { mailtrapClient, sender } from './mailtrap.config.js';

export const sendVerificationEmail = async (email, verificationToken) => {
   const recipient = [{ email }];
   try {
      const response = await mailtrapClient.send({
         from: sender,
         to: recipient,
         subject: 'Verify your Email.',
         html: VERIFICATION_EMAIL_TEMPLATE.replace(
            '{verificationCode}',
            verificationToken
         ),
         category: 'Email Verification',
      });
      console.log('Email Sent Sucessfully', response);
   } catch (error) {
      console.log(`Error Sending Verification Email: ${error}`);
      throw new Error(`Error Sending Verification Email: ${error}`);
   }
};

export const sendWelcomeEmail = async (email, name) => {
   const recipient = [{ email }];
   try {
      const response = await mailtrapClient.send({
         from: sender,
         to: recipient,
         template_uuid: 'e2a41244-6347-4bc0-a386-6476211b5075',
         template_variables: {
            company_info_name: 'Auth Company',
            name: name,
         },
      });
      console.log('Welcome Email sent Sucessfully', response);
   } catch (error) {
      console.log(`Error Sending Welcome Email`, error);
      throw new Error(`Error Sending Welcome Email: ${error}`);
   }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
   const recipient = [{ email }];
   try {
      const response = await mailtrapClient.send({
         from: sender,
         to: recipient,
         subject: 'Reset Your Password',
         html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
         category: 'Password Reset'
      });
   } catch (error) {
      console.log(`Error Sending Password Reset Email: ${error}`);
      throw new Error(`Error Sending Password Reset Email: ${error}`);
   }
};

export const sendResetSucessfullEmail = async (email) =>{
   const recipient = [{email}]
   try {
      const response = await mailtrapClient.send({
         from: sender,
         to: recipient,
         subject: 'Password Reset Successful',
         html: PASSWORD_RESET_SUCCESS_TEMPLATE,
         category: 'Password Reset'
      })
      console.log('Password Reset Successful Email sent Sucessfully', response)
   } catch (error) {
      console.log(`Error Sending Password Reset Successful Email`, error)
      throw new Error(`Error Sending Password Reset Successful Email: ${error}`)
   }
}