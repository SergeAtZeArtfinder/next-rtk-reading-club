import type { GetServerSideProps } from "next"
import { wrapper } from "@/lib/redux/store/wrapper"
import { setValue } from "@/lib/redux/slices/exampleSlice"
import BooksList from "@/components/books/BooksList"

const HomePage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-center my-8">
        Hello, Redux RTK Polygon
      </h1>
      <div className="flex justify-center items-center h-screen w-auto mx-auto">
        <BooksList />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async () => {
    store.dispatch(setValue("Prefetched Value from Server"))
    return { props: {} }
  })

export default HomePage
