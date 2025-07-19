import React from "react"
import { Dumbbell } from "lucide-react"

import IconButton from "@/components/IconButton"
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
            <IconButton key={id} href={href}>
              <Dumbbell />
            </IconButton>
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
