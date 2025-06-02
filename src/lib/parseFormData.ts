import formidable, { File as FormidableFile, Files } from "formidable"
import { IncomingMessage } from "http"

export const parseForm = (req: IncomingMessage): Promise<FormidableFile[]> => {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
  })

  return new Promise((resolve, reject) => {
    form.parse(req, (err, _fields, files: Files) => {
      if (err) return reject(err)

      const allFiles: FormidableFile[] = []

      for (const key in files) {
        const fileOrFiles = files[key]
        if (Array.isArray(fileOrFiles)) {
          allFiles.push(...fileOrFiles)
        }
      }

      resolve(allFiles)
    })
  })
}
