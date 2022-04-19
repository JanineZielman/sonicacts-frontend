import React, {useState} from "react"
import { useRouter } from 'next/router'

const Search = () => {
	const router = useRouter();
  const [input, setInput] = useState();
  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    if (e.key === 'Enter') {
      router.push('/search/'+ lowerCase);
      setInput(lowerCase)
    }
  };
  return (
    <div className="search-bar">
      <input type="text" placeholder="Search" onChange={inputHandler} onKeyUp={inputHandler}/>
    </div>
  )
}

export default Search
