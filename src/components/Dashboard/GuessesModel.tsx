import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";

export default function GuessesModal({ children }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} colorScheme="orange" size="sm">
        User Guesses
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Guesses</ModalHeader>
          <ModalCloseButton />
          <ModalBody paddingX={"1"}>{children}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
