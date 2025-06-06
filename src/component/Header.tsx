import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Menu,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchBar from './SearchBar';
import { useRouter } from 'next/router';
import useLogout from '@/hooks/useLogout';
import { HeaderProps, SessionUser } from '@/inteface/item.interface';
import useCategories from '@/hooks/useCategories';

export default function Header({ onSearch, onCategoryChange }: HeaderProps) {
  const [menu, setMenu] = useState<null | HTMLElement>(null);
  const open = Boolean(menu);
  const router = useRouter();
  const logout = useLogout();

  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenu(null);
  };

  const handleWrite = () => {
    router.push('/post/new');
    handleMenuClose();
  };

  const handleCategoryChange = (e: SelectChangeEvent) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
    onCategoryChange(selected);
  };

  useEffect(() => {
    const user = sessionStorage.getItem('session-user');
    if (!user) {
      router.push('/login');
    } else {
      try {
        const parsed: SessionUser = JSON.parse(user);
        setIsAdmin(parsed.role === 'admin');
      } catch {
        router.push('/login');
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
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          Office Talk
        </Typography>
        <SearchBar onSearch={onSearch} />
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          displayEmpty
          sx={{
            color: 'white',
            minWidth: 120,
            borderBottom: '1px solid white',
          }}
        >
          <MenuItem value="">전체</MenuItem>
          {categories.map(cat => (
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
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={handleWrite}>글쓰기</MenuItem>
          <MenuItem
            onClick={() => {
              router.push('/mypage');
              handleMenuClose();
            }}
          >
            좋아요 페이지
          </MenuItem>

          {isAdmin && (
            <MenuItem
            onClick={() => {
              router.push('/users');
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
