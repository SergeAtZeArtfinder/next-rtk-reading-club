import { render, within } from "@testing-library/react"

import Navbar, { navLinks } from "./index"

describe("Navbar", () => {
  it("should render About navigation", () => {
    const { getByRole } = render(<Navbar />)

    expect(
      getByRole("navigation", {
        name: "About navigation",
      }),
    ).toBeInTheDocument()
  })

  it("should render About navigation list", () => {
    const { getByRole } = render(<Navbar />)

    expect(
      getByRole("list", {
        name: "About navigation links",
      }),
    ).toBeInTheDocument()
  })

  it("should render About navigation links", () => {
    const { getByRole } = render(<Navbar />)

    navLinks.forEach((link) => {
      const listItem = getByRole("listitem", {
        name: `About ${link.label}`,
      })
      const listItemLink = within(listItem).getByRole("link")

      expect(listItem).toBeInTheDocument()
      expect(listItemLink).toHaveAttribute("href", link.href)
      expect(listItemLink).toHaveTextContent(link.label)
    })
  })
})
