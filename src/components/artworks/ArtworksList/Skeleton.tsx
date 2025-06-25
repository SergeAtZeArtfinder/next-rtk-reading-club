import { Skeleton } from "@heroui/skeleton"
import { Card, CardBody } from "@heroui/react"
import clsx from "clsx"

interface Props {
  items?: number
  className?: string
}

const ArtworksListSkeleton = ({ items = 6, className }: Props): JSX.Element => {
  return (
    <div className={clsx("w-full grid gap-2 grid-cols-gallery", className)}>
      {Array.from({ length: items }).map((_, index) => (
        <Card
          key={index}
          className="rounded-xl"
          aria-label={`Loading artwork item ${index + 1}`}
        >
          <CardBody className="grid grid-cols-1 gap-2">
            <div className="w-full h-64 rounded-xl overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>

            <Skeleton className="w-32 h-8 rounded-lg" />
            <Skeleton className="w-[80%] h-6 rounded-lg" />
            <Skeleton className="w-[90%] h-6 rounded-lg" />
            <Skeleton className="w-full h-6 rounded-lg" />
          </CardBody>
        </Card>
      ))}
    </div>
  )
}

export default ArtworksListSkeleton
