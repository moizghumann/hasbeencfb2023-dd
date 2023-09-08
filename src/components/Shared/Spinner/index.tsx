import { Box, Spinner } from "@chakra-ui/react";

const CSpinner = (props: any) => {
  const { ...rest } = props;
  return (
    <Box display="flex" justifyContent="center" alignItems="center" {...rest}>
      <Spinner />
    </Box>
  );
};

export default CSpinner;
