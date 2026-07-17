import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"

const Search = ({ params }) => {
  const router = useRouter()
  const [input, setInput] = useState()
  const [note, setNote] = useState()
  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase()
    setNote("press enter to search")
    if (e.key === "Enter") {
      router.push(params + "/search/" + lowerCase)
      setInput(lowerCase)
    }
  }

  return (
    <>
      <span className="note">{note}</span>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          onChange={inputHandler}
          onKeyUp={inputHandler}
        />
      </div>
    </>
  )
}

export default Search
