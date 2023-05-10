import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { PriButton } from "./button";

type Props = {
  onSearch: (query: string) => void;
  placeholder?: string;
};

const QuerySearch: React.FC<Props> = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form className="search-container" onSubmit={handleFormSubmit}>
      <input
        className="search-input"
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder ?? "Search"}
      />
      <PriButton className="shadow-md bg-[#F8B49C]" htmlType="submit">
        <FaSearch />
      </PriButton>
    </form>
  );
};

export default QuerySearch;
