import type { AppProps } from "next/app"
import { Provider as ReduxProvider } from "react-redux"

import ThemeProviders from "@/components/providers"
import MainNavigation from "@/components/MainNavigation"
import MainFooter from "@/components/MainFooter"

import "@/styles/globals.css"

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProviders>
      <MainNavigation />
      <main className="p-4 min-h-[calc(100vh-128px)] max-w-5xl mx-auto">
        <Component {...pageProps} />
      </main>
      <MainFooter />
    </ThemeProviders>
  )
}

export default App
