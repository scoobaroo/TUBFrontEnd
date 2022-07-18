import React from "react";
import styled from "styled-components";
import {
  Button,
  Heading,
  DialogTrigger,
  ActionButton,
  Dialog,
  Flex,
  Text,
  Divider,
  Content,
  Form,
  TextField,
  ButtonGroup,
} from "@adobe/react-spectrum";
import { FaPlus } from "react-icons/fa";

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 3px;
`;

const CertificationModal = ({
  onSetEducationType,
  onSetlabel,
  onSetName,
  register,
  modal,
  openModal,
  closeModal,
}) => (
  <>
    <DialogTrigger isOpen={modal}>
      <ButtonWrapper>
        <ActionButton marginY={"12px"} onPress={openModal}>
          <FaPlus />
        </ActionButton>
      </ButtonWrapper>
      <Dialog>
        <Heading>
          <Flex alignItems="center" gap="size-100">
            <Text>Certifications</Text>
          </Flex>
        </Heading>
        <Divider />
        <Content>
          <Form>
            <TextField onChange={onSetlabel} label="Label Or Name" autoFocus />
            <TextField onChange={onSetEducationType} label="Education Type" />
            <TextField onChange={onSetName} label="Name" />
          </Form>
        </Content>
        <ButtonGroup>
          <Button variant="secondary" onPress={closeModal}>
            Cancel
          </Button>
          <Button variant="cta" onPress={register}>
            Save
          </Button>
        </ButtonGroup>
      </Dialog>
    </DialogTrigger>
  </>
);

export default CertificationModal;
