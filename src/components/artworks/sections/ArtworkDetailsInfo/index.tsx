import { Card, CardProps, CardBody } from "@heroui/react"

interface Props extends Omit<CardProps, "children"> {
  sourceUpdatedAt?: string | null
  copyrightNotice?: string | null
}

const ArtworkDetailsInfo = ({
  sourceUpdatedAt,
  copyrightNotice,
  ...restCardProps
}: Props): JSX.Element => {
  return (
    <Card {...restCardProps}>
      <CardBody className="text-default-500">
        <h2 className="text-lg font-semibold mb-2 text-secondary">
          Additional Information
        </h2>
        <p>
          <span className="font-semibold">Source updated at:</span>{" "}
          {sourceUpdatedAt
            ? new Date(sourceUpdatedAt).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <span className="font-semibold">Copyright:</span>{" "}
          {copyrightNotice || "N/A"}
        </p>
      </CardBody>
    </Card>
  )
}

export default ArtworkDetailsInfo
