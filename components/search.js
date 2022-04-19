import React from "react"
import { useRouter } from 'next/router'

const Search = () => {
	const router = useRouter();
	console.log(router.query.slug)
  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
		router.push('/search/'+ lowerCase);
  };
  return (
    <div className="search-bar">
      <input type="text" placeholder="Search" onChange={inputHandler} value={router.query.slug}/>
    </div>
  )
}

export default Search
