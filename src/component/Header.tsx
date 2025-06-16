import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Menu,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchBar from "./SearchBar";
import { useRouter } from "next/router";
import useLogout from "@/hooks/useLogout";
import { HeaderProps, SessionUser } from "@/inteface/item.interface";
import useCategories from "@/hooks/useCategories";

export default function Header({ onSearch, onCategoryChange }: HeaderProps) {
  // @review 해당 state는 메뉴를 여닫는 기능인 null | HTMLElement 이 아닌 boolean 으로 관리하는게 더 나아보임 또한 명칭을 isMenuOpen으로 변경하는게 더 명확함
  const [menu, setMenu] = useState<null | HTMLElement>(null);
  // @review 위에처럼 isMenuOpen으로 관리해야함 또한 이상태로 할거면 useMemo를 사용해서 불필요한 렌더링을 방지하는게 좋음
  const open = Boolean(menu);

  const router = useRouter();
  const logout = useLogout();
  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // @review handleMenuOpen, handleMenuClose 둘다 불필요
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenu(null);
  };

  /* @review 해당 함수는 useCallback으로 감싸는게 좋음 또한 router.push를 공통적으로 다 사용하고있어서 파라미터를 받아서 처리하는게 더 나아보임
    const handleWrite = useCallback((url: string) => {
      router.push(url);      
    }, [router]);  
  */
  const handleWrite = () => {
    router.push("/write");
    // handleMenuClose();
  };

  // @review 공통화 처리해야할 updateQuery을 불러와서 처리하는게 더 나아보임 또한 카테고리 누를떄마다 필터링 되게한게 의도된건지 모르곘음
  const handleCategoryChange = (e: SelectChangeEvent) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
    onCategoryChange(selected);
  };

  // @review 로그인 세션관리는 미들웨어에서 처리하고있음 해당코드 불필요
  useEffect(() => {
    const user = sessionStorage.getItem("session-user");
    if (!user) {
      router.push("/login");
    } else {
      try {
        const parsed: SessionUser = JSON.parse(user);
        setIsAdmin(parsed.role === "admin");
      } catch {
        router.push("/login");
      }
    }
  }, [router]);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 2 }}
          // @review 해당 이벤트 처리는 onClick={() => setIsMenu(!isMenuOpen)} 으로 처리하는게 더 나아보임
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
        >
          Office Talk
        </Typography>
        <SearchBar onSearch={onSearch} />
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          displayEmpty
          sx={{
            color: "white",
            minWidth: 120,
            borderBottom: "1px solid white",
          }}
        >
          <MenuItem value="">전체</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>

        <Menu
          anchorEl={menu}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <MenuItem onClick={handleWrite}>글쓰기</MenuItem>
          {/* @review 해당 메뉴들 handleWrite로 통합해서 처리하는게 좋음 */}
          <MenuItem
            onClick={() => {
              router.push("/mypage");
              handleMenuClose();
            }}
          >
            좋아요 페이지
          </MenuItem>

          {/* @review 해당 메뉴들 handleWrite로 통합해서 처리하는게 좋음 */}
          {isAdmin && (
            <MenuItem
              onClick={() => {
                router.push("/users");
                handleMenuClose();
              }}
            >
              유저 보기
            </MenuItem>
          )}

          <MenuItem onClick={logout}>로그아웃</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
