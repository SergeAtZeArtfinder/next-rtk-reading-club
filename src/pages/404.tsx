import Image from "next/image"

const NotFound = (): JSX.Element => {
  return (
    <div className=" h-screen flex flex-col justify-center items-center ">
      <h1 className="text-3xl font-bold text-secondary">Oups!...</h1>
      <Image
        src="/images/ostrich.png"
        alt="ostrich"
        width={400}
        height={400}
        priority
      />
      <p className="text-xl font-semibold my-4">Not found</p>
      <p>We haven&rsquo;t found the page you have requested.</p>
    </div>
  )
}

export default NotFound
