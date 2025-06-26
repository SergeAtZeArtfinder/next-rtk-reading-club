import { Card, CardProps, CardBody } from "@heroui/react"

interface Props extends Omit<CardProps, "children"> {
  provenanceText?: string | null
  exhibitionHistory?: string | null
  publicationHistory?: string | null
}

const ArtworkDetailsHistory = ({
  provenanceText,
  exhibitionHistory,
  publicationHistory,
  ...restCardProps
}: Props): JSX.Element => {
  return (
    <Card {...restCardProps}>
      <CardBody className="text-default-500 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-secondary">
          Provenance, Exhibition and Publications History
        </h2>
        {provenanceText ? (
          <p>
            <span className="font-semibold text-secondary">From:</span>{" "}
            {provenanceText}
          </p>
        ) : (
          <p>No provenance history available.</p>
        )}

        {exhibitionHistory ? (
          <p>
            <span className="font-semibold text-secondary">Displayed at:</span>{" "}
            {exhibitionHistory}
          </p>
        ) : (
          <p>No exhibition history available.</p>
        )}

        {publicationHistory ? (
          <p>
            <span className="font-semibold text-secondary">Publications:</span>{" "}
            {publicationHistory}
          </p>
        ) : (
          <p>No publication history available.</p>
        )}
      </CardBody>
    </Card>
  )
}

export default ArtworkDetailsHistory
