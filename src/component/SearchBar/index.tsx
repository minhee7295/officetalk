import React, { useState } from "react";
import { Search, SearchIconWrapper, StyledInputBase } from "./SearchBar.styles";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  onSearch: (value: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [input, setInput] = useState<string>("");

  const handleSearch = () => {
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon onClick={handleSearch} style={{ cursor: "pointer" }} />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
    </Search>
  );
}
