import React from "react";
import { AlertDialog, DialogTrigger } from "@adobe/react-spectrum";

const ErrorModal = (props)=> {
  return (
    <DialogTrigger isOpen={props.open}>
      <></>
      <AlertDialog
        title="Failed"
        variant="error"
        primaryActionLabel="OK"
        onPrimaryAction={props.action}
      >
        {props.message}
      </AlertDialog>
    </DialogTrigger>
  );
}

export default ErrorModal;
