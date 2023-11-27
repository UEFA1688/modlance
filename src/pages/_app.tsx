import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { EdgeStoreProvider } from '~/lib/edgestore';
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import Head from "next/head";

import "~/styles/globals.css";
import type { Metadata } from 'next'

import { Kanit } from 'next/font/google';

const kanit = Kanit({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});



export const metadata: Metadata = {
  title: 'UEFA168',
  description: 'Portfolio BY UEFA168',
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <EdgeStoreProvider>
      <Head>
        <title>Modlance</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className={`${kanit.className} bg-gradient-to-b from-violet-600/[.15] via-transparent`}>
            <Component {...pageProps} />
        </main>
      </EdgeStoreProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
