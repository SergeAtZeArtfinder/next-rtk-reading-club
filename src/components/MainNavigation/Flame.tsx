"use client"

import React from "react"
import clsx from "clsx"

interface Props {
  className?: string
}

const Flame = ({ className }: Props): JSX.Element => (
  <div className={clsx("relative inline-block", className)}>
    <span className="absolute top-0 left-0 origin-[70%_70%] inline-block">
      🔥
    </span>
    <span
      className="absolute top-0 left-0 origin-[70%_70%] inline-block animate-flame"
      style={{ animationDelay: "0.15s" }}
    >
      🔥
    </span>
    <span
      className="absolute top-0 left-0 origin-[70%_70%] inline-block animate-flame"
      style={{ animationDelay: "0.3s" }}
    >
      🔥
    </span>
    <span
      className="absolute top-0 left-0 origin-[70%_70%] inline-block animate-flame"
      style={{ animationDelay: "0.45s" }}
    >
      🔥
    </span>
    <span
      className="absolute top-0 left-0 origin-[70%_70%] inline-block animate-flame"
      style={{ animationDelay: "0.6s" }}
    >
      🔥
    </span>
    <span
      className="absolute top-0 left-0 origin-[70%_70%] inline-block animate-flame"
      style={{ animationDelay: "0.75s" }}
    >
      🔥
    </span>
    <span
      className="absolute top-0 left-0 origin-[70%_70%] inline-block animate-flame"
      style={{ animationDelay: "0.9s" }}
    >
      🔥
    </span>
  </div>
)

export default Flame
