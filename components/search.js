import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';

const Search = ({ params, inputRef }) => {
  const router = useRouter();
  const [input, setInput] = useState();
  const [note, setNote] = useState();

  useEffect(() => {
    inputRef?.current?.focus();
    inputRef?.current?.select();
  }, [inputRef]);

  const inputHandler = (e) => {
    const lowerCase = e.target.value.toLowerCase();
    setNote('press enter to search');
    if (e.key === 'Enter') {
      router.push(params + '/search/' + lowerCase);
      setInput(lowerCase);
    }
  };

  return (
    <div className="search-wrapper">
      <span className="note">{note}</span>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          onChange={inputHandler}
          onKeyUp={inputHandler}
          ref={inputRef}
        />
      </div>
    </div>
  );
};

export default Search;
