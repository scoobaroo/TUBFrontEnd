import React from "react";
import { AlertDialog, DialogTrigger } from "@adobe/react-spectrum";

const SuccessModal = (props) => {
  return (
    <DialogTrigger isOpen={true}>
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
