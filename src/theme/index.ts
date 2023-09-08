// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react";
import Container from "./components/Container";

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  colors: {
    brand: {
      primary: "#172C41",
      textLight: "#f0f0f3",
    },
  },
  styles: {
    global: {
      html: {
        scrollBehavior: "smooth !important",
      },
      body: {
        minH: "100vh",
        bgRepeat: "no-repeat",
        bgColor: "#E5E5E5",
      },
    },
  },
  components: {
    Container,
  },
});

export default theme;
