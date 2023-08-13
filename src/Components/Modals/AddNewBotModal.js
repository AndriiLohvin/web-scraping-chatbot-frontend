import React, { useCallback } from "react";
import {
  Form,
  Modal,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
} from "react-bootstrap";
import { sendRequestsWithToken } from "../../Utils/Requests";

export const AddNewBotModal = ({ show, setShow, handleAdd }) => {
  const handleClose = useCallback(() => {
    setShow(false);
  }, [setShow]);
  const handleSubmit = useCallback(
    (ev) => {
      ev.preventDefault();
      const formData = new FormData(ev.target);
      sendRequestsWithToken ("add-new-chatbot", {
        body: formData
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          handleAdd({
            name: formData.get("name"),
            _id: result,
            pages: [],
            files: [],
          });
        });
      setShow(false);
    },
    [handleAdd, setShow]
  );
  return (
    <Modal show={show} onHide={handleClose} className="mask-custom">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <FormLabel>Name</FormLabel>
            <FormControl type="text" placeholder="Enter text" name="name" />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
