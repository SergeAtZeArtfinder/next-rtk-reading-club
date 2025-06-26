import { Card, CardProps, CardBody, Image, Chip } from "@heroui/react"

interface Props extends Omit<CardProps, "children"> {
  imageUrl?: string
  title?: string
  artist?: string | null
  dateDisplayed?: string | null
  description?: string | null
  dimensions?: string | null
  mediumDisplay?: string | null
  classificationTitle?: string | null
  altClassificationTitles?: string[] | null
}

const ArtworkDetailsHero = ({
  imageUrl,
  title,
  artist,
  dateDisplayed,
  description,
  dimensions,
  mediumDisplay,
  classificationTitle,
  altClassificationTitles,
  ...restCardProps
}: Props): JSX.Element => {
  return (
    <Card {...restCardProps}>
      <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex justify-center items-center">
          <Image
            src={imageUrl || "/images/artwork_image_placeholder.jpg"}
            alt={title}
            className="w-full h-80 object-cover mb-4"
          />
        </div>
        <div className="text-default-500 flex flex-col gap-2">
          <h2 className="text-lg font-semibold mb-2 text-secondary">
            By: {artist || "Unknown Artist"}
          </h2>
          <p className="">
            <strong>Date:</strong> {dateDisplayed || "N/A"}
          </p>
          <p className="">
            <strong>Medium:</strong> {mediumDisplay || "N/A"}
          </p>
          <p className="">
            <strong>Dimensions:</strong> {dimensions || "N/A"}
          </p>
          <p className="">
            <strong>Short description:</strong>{" "}
            {description || "No description available."}
          </p>
          <div className="flex gap-2">
            <p className="font-semibold">Classification:</p>
            <ul className="flex flex-wrap gap-1">
              <Chip color="warning" as="li" className="text-default-800">
                {classificationTitle}
              </Chip>
              {altClassificationTitles
                ?.filter((current) => current !== classificationTitle)
                .map((classification) => (
                  <Chip
                    as="li"
                    key={classification}
                    color="secondary"
                    className="text-default-200 opacity-90"
                  >
                    {classification}
                  </Chip>
                ))}
            </ul>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default ArtworkDetailsHero
