/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  apiKey: process.env.RESEND_API_KEY,
  from: process.env.MAIL_FROM || 'MyApp <no-reply@mydomain.com>',
}));
