import {betterAuth} from 'better-auth';
import {prismaAdapter} from "better-auth/adapters/prisma";
import {prisma} from './prisma';
import {Resend} from 'resend';
import {nextCookies} from "better-auth/next-js";

const resend = new Resend(process.env.AUTH_RESEND_KEY);


if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || 
    !process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  throw new Error('Missing required environment variables for social providers');
}

export const  auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data) {
      try {
        await resend.emails.send({
          from: 'noreply@ybforge.com',
          to: data.user.email,
          subject: 'Reset your password',
          text: `Click here to reset your password: ${data.url}`
        });
      } catch (error) {
        console.error('Error sending reset password email:', error);
        throw new Error('Failed to send reset password email');
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }
  },

  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),

  plugins: [
      nextCookies()
  ],

  account: {
    accountLinking:{
      enabled: true,
    }
  }
});
