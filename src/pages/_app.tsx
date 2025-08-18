import { useRef } from "react"
import { Provider as ReduxProvider } from "react-redux"

import type { AppProps } from "next/app"

import { createAppStore, hydrate, AppStore } from "@/lib/redux/store"
import ThemeProviders from "@/components/providers"
import MainNavigation from "@/components/MainNavigation"
import MainFooter from "@/components/MainFooter"

import "@/styles/globals.css"

/**
 * @description We never recreate the store on the client after first mount,
 * so component subscriptions remain stable.
 * On each navigation that returns an initialReduxState,
 * we dispatch hydrate to merge server state into the client store.
 */
function App({ Component, pageProps }: AppProps) {
  const storeRef = useRef<AppStore>()

  // 1) First client render: create store with server-preloaded state (if present)
  if (!storeRef.current) {
    storeRef.current = createAppStore(pageProps.initialReduxState)
  }
  // 2) Subsequent client-side navigation: merge any new server state
  else if (pageProps.initialReduxState) {
    storeRef.current.dispatch(hydrate(pageProps.initialReduxState))
  }

  return (
    <ThemeProviders>
      <ReduxProvider store={storeRef.current}>
        <MainNavigation />
        <main className="p-4 min-h-[calc(100vh-128px)] max-w-5xl mx-auto">
          <Component {...pageProps} />
        </main>
        <MainFooter />
      </ReduxProvider>
    </ThemeProviders>
  )
}

export default App
