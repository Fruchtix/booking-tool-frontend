import { DynamoDB, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { DynamoDBAdapter } from '@next-auth/dynamodb-adapter';

const config: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY as string,
  },
  region: process.env.NEXT_AUTH_AWS_REGION,
};

const client = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

export default NextAuth({
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    // signIn: '/signin',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/check-your-mail', // (used for check email message)
    newUser: '/settings/url', // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  adapter: DynamoDBAdapter(client),
  callbacks: {
    async session({ session, user }) {
      session.studioID = user.id;
      return session;
    },
  },
  theme: {
    colorScheme: 'light',
    brandColor: 'black',
  },
});
