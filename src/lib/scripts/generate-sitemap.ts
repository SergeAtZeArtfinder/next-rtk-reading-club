import "dotenv/config"

import fs from "fs"
import path from "path"

const getSitemap = (publicPaths: string[]) => {
  if (!process.env.BASE_URL) {
    throw new Error("BASE_URL environment variable is not set")
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${publicPaths
      .map((path) => {
        return `
          <url>
            <loc>${process.env.BASE_URL}${path}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
        `
      })
      .join("")}
  </urlset>`

  const textFile = `User-agent: *
Allow: /

Sitemap: ${process.env.BASE_URL}/sitemap.xml
`

  return { sitemap, textFile }
}

const { sitemap, textFile } = getSitemap(["/", "/about"])

fs.writeFileSync(path.resolve("public", "sitemap.xml"), sitemap)
fs.writeFileSync(path.join("public", "robots.txt"), textFile)
