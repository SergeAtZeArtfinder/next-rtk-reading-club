import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { wrapper } from "@/lib/redux/store/wrapper"
import Providers from "@/providers/Providers"
import MainNavigation from "@/components/MainNavigation"
import MainFooter from "@/components/MainFooter"

function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <MainNavigation />
      <main className="p-4 min-h-[calc(100vh-128px)] max-w-5xl mx-auto">
        <Component {...pageProps} />
      </main>
      <MainFooter />
    </Providers>
  )
}

export default wrapper.withRedux(App)
