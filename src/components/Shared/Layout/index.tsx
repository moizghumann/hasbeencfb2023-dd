import { Box } from "@chakra-ui/react";
import Header from "./Header";

const Layout = ({ children }: any) => {
  return (
    <Box minH="100vh">
      <Box>
        <Header />
        {/* Content */}
        <Box p="4">{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
