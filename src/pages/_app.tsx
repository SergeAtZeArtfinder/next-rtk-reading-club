import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { wrapper } from "@/lib/redux/store/wrapper"
import Providers from "@/providers/Providers"

function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <main>
        <Component {...pageProps} />
      </main>
    </Providers>
  )
}

export default wrapper.withRedux(App)
