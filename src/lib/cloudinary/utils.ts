/**
 * @description extracts the public ID from the cloudinary image URL
 * @param {string} imageUrl cloudinary image url
 * for example `https://res.cloudinary.com/dlw2jic1w/image/upload/v1743345186/keealpucvdrkueykvdgz.webp` where the `keealpucvdrkueykvdgz` is the public image ID
 * @returns {string} the public id ( in our example it would be `'keealpucvdrkueykvdgz'`)
 */
export const getImagePublicId = (imageUrl: string): string => {
  const urlParts = new URL(imageUrl)
  const pathSegments = urlParts.pathname.split("/")
  const publicIdWithExtension = pathSegments[pathSegments.length - 1]
  /**
   * Remove file extension after dot(.) eg: `.webp`, `.png`, `.jpeg`
   */
  return publicIdWithExtension.replace(/\.[^/.]+$/, "")
}

export const getImagesMapById = (urls: string[]) => {
  return urls.reduce(
    (imgMap, current) => {
      const publicId = getImagePublicId(current)
      imgMap[publicId] = current
      return imgMap
    },
    {} as Record<string, string>,
  )
}

export const sortDeleteManyResults = (
  response: Record<string, "deleted" | "not_found">,
  imagesMap: Record<string, string>,
) => {
  const result = {
    deleted: [] as string[],
    notFound: [] as string[],
  }

  Object.entries(imagesMap).forEach(([id, url]) => {
    if (response[id] !== "not_found") {
      result.deleted.push(url)
    } else {
      result.notFound.push(url)
    }
  })

  return result
}
