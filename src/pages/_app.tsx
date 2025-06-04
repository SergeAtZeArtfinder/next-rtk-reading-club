import type { AppProps } from "next/app"
import type { Session } from "next-auth"

import { wrapper } from "@/lib/redux/store/wrapper"
import Providers from "@/providers/Providers"
import MainNavigation from "@/components/MainNavigation"
import MainFooter from "@/components/MainFooter"

import "prismjs/themes/prism-tomorrow.css"
import "@/styles/globals.css"

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Providers session={session as Session}>
      <MainNavigation />
      <main className="p-4 min-h-[calc(100vh-128px)] max-w-5xl mx-auto">
        <Component {...pageProps} />
      </main>
      <MainFooter />
    </Providers>
  )
}

export default wrapper.withRedux(App)
