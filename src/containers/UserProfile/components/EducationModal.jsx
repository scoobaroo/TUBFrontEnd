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
  ComboBox,
  Item,
  ButtonGroup,
} from "@adobe/react-spectrum";
import { FaPlus } from "react-icons/fa";

const ModalWrapper = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
`;
const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 3px;
`;

const EducationModal = ({
  onSetEducationType,
  onSetName,
  register,
  modal,
  openModal,
  closeModal,
  EducationType,
}) => (
  <>
    <ModalWrapper>
      <DialogTrigger isOpen={modal}>
        <ButtonWrapper>
          <ActionButton onPress={openModal}>
            <FaPlus />
          </ActionButton>
        </ButtonWrapper>
        <Dialog>
          <Heading>
            <Flex alignItems="center" gap="size-100">
              <Text>Educations</Text>
            </Flex>
          </Heading>
          <Divider />
          <Content>
            <Form>
              <TextField onChange={onSetName} label="Label Or Name" autoFocus />
              <ComboBox
                onSelectionChange={onSetEducationType}
                label="Education Type"
                items={EducationType}
              >
                {(item) => <Item key={item.Label}>{item.Label}</Item>}
              </ComboBox>
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
    </ModalWrapper>
  </>
);

export default EducationModal;
