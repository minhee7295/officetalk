import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#E6E6FA", // 연보라색
      contrastText: "#333", // 주로 contained 버튼에 적용
    },
    secondary: {
      main: "#dc004e", // 강조용 핫핑크
    },
  },
  typography: {
    fontFamily: "Noto Sans KR, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        outlinedPrimary: {
          color: "#333",
          borderColor: "#E6E6FA",
          "&:hover": {
            backgroundColor: "#f5f5ff",
            borderColor: "#c5c5e0",
          },
        },
        containedPrimary: {
          color: "#333",
          backgroundColor: "#E6E6FA",
          "&:hover": {
            backgroundColor: "#dcdcf0",
          },
        },
      },
    },
  },
});

export default theme;
