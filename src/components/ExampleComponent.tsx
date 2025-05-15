"use client"

import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/lib/redux/store/index"
import { setValue } from "@/lib/redux/slices/exampleSlice"

const ExampleComponent = (): JSX.Element => {
  const value = useSelector((state: RootState) => state.example.value)
  const dispatch = useDispatch()

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="font-semibold text-xl">{value}</p>
      <button
        className="px-2 py-1 rounded bg-green-500 hover:bg-green-600 active:bg-green-700"
        onClick={() => dispatch(setValue("New Value"))}
      >
        Update
      </button>
    </div>
  )
}

export default ExampleComponent
