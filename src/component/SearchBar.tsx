import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  onSearch: (value: string) => void;
}

// @review 관심사 분리를 했으므로 해당 스타일 관련도 따로 빼서 임포트 하는게 좋음 하나의 파일은 하나의 역할을 하는게 좋음
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [input, setInput] = useState<string>("");

  // @review 기능 자체가 이상함 사용자가 검색어를 다 입력도 안했는데 검색이 되면 안되서 이 디바운스 기능은 불필요 검색시 해당 검색어를 가져가는게 맞음
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(input);
    }, 500); // 0.5초

    return () => clearTimeout(timer); // 입력할때 호출 x
  }, [input, onSearch]);

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </Search>
  );
}
