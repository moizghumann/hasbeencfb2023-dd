import { useEffect } from "react";
import { VStack, Text, Button, Grid, GridItem } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { useForm, SubmitHandler, DeepMap, FieldError } from "react-hook-form";
import { EMAIL_REGEX } from "../../constants";
import { CInput } from "..";

export type RegisterFormType = {
  name: string;
  email: string;
  password: string;
};

export interface CRegisterProps {
  onRegisterSubmit: (data: RegisterFormType) => void;
  errors?: DeepMap<RegisterFormType, FieldError>;
  isLoading: boolean;
}

export default function Register(props: CRegisterProps) {
  const { onRegisterSubmit, isLoading, errors: apiErrors } = props;

  //   console.log({
  //     isLoading,
  //   });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormType>();

  useEffect(() => {
    if (apiErrors) {
      Object.entries(apiErrors).forEach(([name, err]) => {
        if (err) setError(name as keyof RegisterFormType, err);
      });
    }
  }, [apiErrors, setError]);

  const submit: SubmitHandler<RegisterFormType> = (data) => {
    onRegisterSubmit(data);
    // console.log(data);
  };

  return (
    <VStack mt="20">
      <Text as="h1" color="black" fontWeight="semibold" fontSize="3xl" mb="5">
        Register
      </Text>
      <VStack
        as="form"
        onSubmit={handleSubmit(submit)}
        bgColor="#fff"
        px="10"
        py="5"
        rounded="2xl"
        maxW="400px"
        w="full"
      >
        <Grid
          onSubmit={handleSubmit(submit)}
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(1, 1fr)" }}
          columnGap="10"
          rowGap="4"
          w="full"
        >
          <GridItem>
            <CInput
              {...register(`name`, {
                required: {
                  value: true,
                  message: "Name is required!",
                },
              })}
              error={errors.name}
              label="Name"
              placeholder="Jack Willson"
            />
          </GridItem>
          <GridItem>
            <CInput
              {...register(`email`, {
                required: {
                  value: true,
                  message: "email is required!",
                },
                validate: {
                  matchPattern: (v) => {
                    return (
                      EMAIL_REGEX.test(v) ||
                      "Please provide a valid email address"
                    );
                  },
                },
              })}
              error={errors.email}
              label="Email"
              placeholder="jack@gmail.com"
              type="email"
            />
          </GridItem>
          <GridItem>
            <CInput
              {...register(`password`, {
                required: {
                  value: true,
                  message: "password is required!",
                },
              })}
              error={errors.password}
              label="Password"
              placeholder="*******"
              type="password"
            />
          </GridItem>
        </Grid>
        <Button
          colorScheme="blackAlpha"
          bgColor="#100b16"
          _hover={{
            bgColor: "transparent",
            color: "#100b16",
          }}
          _active={{
            bgColor: "#100b16",
            color: "#fff",
          }}
          size="md"
          rounded="full"
          border="1px solid #100b16"
          type="submit"
          isLoading={isLoading}
          w="full"
          mt="5"
        >
          <Text mt="-5px" px="8">
            Register
          </Text>
        </Button>
        <Text textAlign="center">
          Already have a account?{" "}
          <Text
            as={Link}
            to={`/signin`}
            _hover={{
              textDecor: "none",
            }}
            textDecor="underline"
          >
            Sign in
          </Text>
        </Text>
      </VStack>
    </VStack>
  );
}
