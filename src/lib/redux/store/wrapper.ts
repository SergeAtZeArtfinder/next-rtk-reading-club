import { createWrapper } from "next-redux-wrapper"
import { store } from "./index"

export const wrapper = createWrapper(() => store)
