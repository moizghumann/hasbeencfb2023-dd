import { forwardRef } from "react";
import {
  Input,
  InputGroup,
  FormLabel,
  FormControl,
  InputProps,
  Text,
} from "@chakra-ui/react";

interface ICInput extends InputProps {
  label: string;
  placeholder: string;
  error?: any;
}

const CInput = forwardRef((props: ICInput, ref: any) => {
  const { label, placeholder, error, ...otherProps } = props;
  return (
    <FormControl
      _focusVisible={{
        boxShadow: "none",
      }}
    >
      <FormLabel
        color="#171717"
        fontWeight={600}
        lineHeight="20px"
        m="0px"
        fontSize="14px"
      >
        {label}
      </FormLabel>
      <InputGroup size="md">
        <Input
          ref={ref}
          placeholder={placeholder}
          border="0px"
          borderBottom="1px"
          borderColor={error ? "red" : "#d5d9de"}
          rounded="none"
          p="0"
          _focusVisible={{
            boxShadow: "none",
          }}
          {...otherProps}
        />
      </InputGroup>
      {error ? (
        <Text pt="2" color="red.500" fontSize="14px">
          {error.message}
        </Text>
      ) : null}
    </FormControl>
  );
});

export default CInput;
