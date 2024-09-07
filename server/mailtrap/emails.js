import { VERIFICATION_EMAIL_TEMPLATE } from './emailTemplates.js';
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
      template_uuid:"e2a41244-6347-4bc0-a386-6476211b5075",
      template_variables: {
         company_info_name: "Auth Company",
         name: name,
       }
   })
   console.log("Welcome Email sent Sucessfully" , response)
  } catch (error) {
   console.log(`Error Sending Welcome Email`,error)
   throw new Error(`Error Sending Welcome Email: ${error}`)
  }
};
