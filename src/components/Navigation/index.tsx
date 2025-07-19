import React from "react"
import { Dumbbell } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { paths } from "@/lib/utils"
import ThemeToggle from "./ThemeToggle"
import NavLink from "./NavLink"

const navLinks = [
  { id: 1, title: "Home", href: paths.home() },
  { id: 2, title: "Workouts", href: paths.workouts() },
  { id: 3, title: "Sets", href: paths.sets() },
  { id: 4, title: "Exercises", href: paths.exercises() },
]

const Navigation = () => {
  return (
    <nav className="flex justify-between">
      <ul className="flex gap-2 items-center">
        {navLinks.map(({ id, title, href }) =>
          title === "Home" ? (
            <Button
              key={id}
              asChild
              variant="outline"
              size="icon"
              className="mr-8"
            >
              <Link href={href}>
                <Dumbbell />
              </Link>
            </Button>
          ) : (
            <NavLink key={id} href={href}>
              {title}
            </NavLink>
          ),
        )}
      </ul>
      <div>
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Navigation
