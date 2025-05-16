import React from "react"

const MainFooter = (): JSX.Element => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="h-[64px] border-t border-default-200 mt-8">
      <div className="max-w-5xl w-full flex justify-center items-center h-full mx-auto">
        <p className="text-sm">Copyright &copy;ReadingClubb {currentYear}</p>
      </div>
    </footer>
  )
}

export default MainFooter
