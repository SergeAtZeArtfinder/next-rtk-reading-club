import { Card, CardProps, CardBody } from "@heroui/react"
import DOMPurify from "isomorphic-dompurify"

interface Props extends Omit<CardProps, "children"> {
  description?: string | null
}

const ArtworkDetailsDescription = ({
  description,
  ...restCardProps
}: Props): JSX.Element => {
  return (
    <Card {...restCardProps}>
      <CardBody className="text-default-500">
        <h2 className="text-lg font-semibold mb-2 text-secondary">
          Description
        </h2>

        {description ? (
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(description),
            }}
          />
        ) : (
          <p>No detailed description available.</p>
        )}
      </CardBody>
    </Card>
  )
}

export default ArtworkDetailsDescription
