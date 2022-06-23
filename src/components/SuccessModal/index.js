import React from "react";
import { AlertDialog, DialogTrigger } from "@adobe/react-spectrum";

const SuccessModal = (props) => {
  return (
    <DialogTrigger isOpen={props.open}>
      <></>
      <AlertDialog
        title={props.title}
        variant="information"
        primaryActionLabel="OK"
        onPrimaryAction={props.action}
      >
        {props.message}
      </AlertDialog>
    </DialogTrigger>
  );
};

export default SuccessModal;
