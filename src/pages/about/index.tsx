import { Card, CardBody, Code } from "@heroui/react"
import clsx from "clsx"

const Text = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <Card className="w-full my-4">
      <CardBody className={clsx("text-lg", className)}>{children}</CardBody>
    </Card>
  )
}

const AboutPage = (): JSX.Element => {
  return (
    <>
      <h1 className="text-3xl font-bold text-center my-8">
        RTK ( Redux Toolkit )
      </h1>

      <Text>
        Redux Toolkit is the official, recommended approach for writing Redux
        logic.
      </Text>
      <Text>
        It simplifies the standard Redux workflow by providing powerful
        utilities like{" "}
        <span className="inline-flex gap-1">
          <Code>createSlice</Code>, <Code>configureStore</Code>, and{" "}
          <Code>createAsyncThunk</Code>
        </span>{" "}
        , which reduce boilerplate and make your code more readable and
        maintainable. Instead of manually writing action types, action creators,
        and reducers, Redux Toolkit enables developers to define everything in a
        more concise and structured way, greatly improving the developer
        experience.
      </Text>
      <Text className="text-bold">
        One of the key benefits of Redux Toolkit is that it enforces best
        practices out of the box.
      </Text>
      <Text>
        It includes good default configurations like development-mode checks for
        accidental state mutations and serializability, built-in support for
        Redux DevTools, and integration with Redux middleware like{" "}
        <Code className="max-w-[200px]">redux-thunk</Code>.
      </Text>
      <Text>
        Redux Toolkit helps teams manage complex application state in a
        predictable and scalable way—particularly in large apps or those
        requiring advanced patterns like server-side rendering, API data
        caching, or optimistic updates. This makes it especially useful in a
        Next.js application where performance, structure, and SSR support are
        crucial.
      </Text>
    </>
  )
}

export default AboutPage
