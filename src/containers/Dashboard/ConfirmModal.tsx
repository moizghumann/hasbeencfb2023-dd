import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Stack,
} from "@chakra-ui/react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function ConfirmModal(props: ConfirmModalProps) {
  const { isOpen, onClose, onConfirm, isLoading } = props;
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are sure you want to lock the Bet?</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="5">
            <Stack direction={{ base: "column", md: "row" }} w="full">
              <Button
                colorScheme="orange"
                variant="outline"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                w="full"
                isLoading={isLoading}
              >
                Yes
              </Button>

              <Button w="full" colorScheme="orange" onClick={onClose}>
                No
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
