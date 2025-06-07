import type { AppProps } from "next/app"
import type { Session } from "next-auth"
import { Provider as ReduxProvider } from "react-redux"

import { wrapper } from "@/lib/redux/store"
import Providers from "@/providers/Providers"
import MainNavigation from "@/components/MainNavigation"
import MainFooter from "@/components/MainFooter"

import "prismjs/themes/prism-tomorrow.css"
import "@/styles/globals.css"

function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest)
  const { session, ...restPageProps } = props.pageProps

  return (
    <ReduxProvider store={store}>
      <Providers session={session as Session}>
        <MainNavigation />
        <main className="p-4 min-h-[calc(100vh-128px)] max-w-5xl mx-auto">
          <Component {...restPageProps} />
        </main>
        <MainFooter />
      </Providers>
    </ReduxProvider>
  )
}

export default App
