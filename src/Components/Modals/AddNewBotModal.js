import '../../Styles/Modal.css'
import { language_names, formats, styles, tones, response_lengths } from '../OptionValues'
import React, { useCallback, useState, useRef } from "react";
import {
  Form,
  Modal,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
  Accordion,
  Alert,
} from "react-bootstrap";
import { sendRequestsWithToken } from "../../Utils/Requests";

// const inputs = [1, 2, 3, 4, 5, 6];

export const AddNewBotModal = ({ show, setShow, handleAdd }) => {
  // const numRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const [inputs, setInputs] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef([]);

  const handleInputChange = useCallback((index, value) => {
    const newInputs = [...inputs];
    value = value.slice(-1);
    newInputs[index] = value;
    setInputs(newInputs);
    if(index === inputRefs.current.length - 1 && value !== '') inputRefs.current[index].blur();
    if (index < inputRefs.current.length - 1 && value !== '') {
      inputRefs.current[index + 1].focus();
    }
  },[inputs, inputRefs]);

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

  const handleOnKeyDown = useCallback((ev, index) => {
    const value = inputRefs.current[index].value;
    console.log("value", value);
    if (ev.keyCode === 8 && value === '') { // Check if backspace key is pressed and input field is empty
      if (index > 0) { // Check if it's not the first input field
        inputRefs.current[index - 1].focus(); // Move focus to previous input field
        return; // Exit the function to prevent further execution
      }
    }

  }, [inputRefs])


  return (
    <Modal show={show} onHide={handleClose} className="modal-lg">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup class="mb-4">
            <FormLabel class="px-2 text-dark fw-bold">Bot Name</FormLabel>
            <FormControl type="px-0 text" placeholder="My Chatbot" name="name" style={{borderRadius: "1em"}}/>
            <p class="px-2 mb-0" style={{color:"blue"}}>
              The name is used to identify your chatbot. It’s private and exclusively visible to you.
            </p>
            <p class="px-2" style={{color:"red"}}>
              <b>Bot Name</b> is required.
            </p>
          </FormGroup>
          {/* <FormGroup class="mb-4">
            <FormLabel class="px-2 text-dark fw-bold">Description </FormLabel>
            <FormControl type="px-0 text" placeholder="This is my general assistant" name="description" style={{borderRadius: "1em"}}/>
            <p class="px-2 mb-0" style={{color:"blue"}}>
            The description is used to identify your chatbot. It’s private and exclusively visible to you.
            </p>
          </FormGroup>
          <div class="mb-3">
            <Accordion defaultActiveKey="0" id="my-accordion">
              <Accordion.Item>
                <Accordion.Header>Models (LLMs)</Accordion.Header>
                <Accordion.Body>
                <Form.Select size='lg' style={{borderRadius: "1em"}}>
                  <option value="1">GPT 3.5|4K context</option>
                  <option value="2">GPT 3.5|16K context</option>
                  <option value="3">GPT 4|4K context</option>
                  <option value="4">GPT 4|16K context</option>
                </Form.Select>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          <div class="mb-3">
            <Accordion defaultActiveKey="0" id="my-accordion">
              <Accordion.Item>
                <Accordion.Header>Writing Style</Accordion.Header>
                <Accordion.Body>
                <p class="px-2 mb-0 fw-bold text-dark" style={{fontSize:"13px"}}>
                  Language
                </p>
                <Form.Select className="mb-3" size='lg' style={{borderRadius: "1em"}}>
                  {
                    language_names.map((language_name, index) => (
                      <option value={index}>{language_name}</option>
                    ))
                  }
                </Form.Select>
                <p class="px-2 mb-0 fw-bold text-dark" style={{fontSize:"13px"}}>
                  Tone
                </p>
                <Form.Select className="mb-3" size='lg' style={{borderRadius: "1em"}}>
                  {
                    tones.map((tone, index) => (
                      <option value={index}>{tone}</option>
                    ))
                  }
                </Form.Select>
                <p class="px-2 mb-0 fw-bold text-dark" style={{fontSize:"13px"}}>
                  Style
                </p>
                <Form.Select className="mb-3" size='lg' style={{borderRadius: "1em"}}>
                  {
                    styles.map((style, index) => (
                      <option value={index}>{style}</option>
                    ))
                  }
                </Form.Select>
                <p class="px-2 mb-0 fw-bold text-dark" style={{fontSize:"13px"}}>
                  Format
                </p>
                <Form.Select className="mb-3" size='lg' style={{borderRadius: "1em"}}>
                  {
                    formats.map((format, index) => (
                      <option value={index}>{format}</option>
                    ))
                  }
                </Form.Select>
                <p class="px-2 mb-0 fw-bold text-dark" style={{fontSize:"13px"}}>
                  Max response length
                </p>
                <Form.Select className="mb-3" size='lg' style={{borderRadius: "1em"}}>
                  {
                    response_lengths.map((response_length, index) => (
                      <option value={index}>{response_length}</option>
                    ))
                  }
                </Form.Select>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          
          <div class="mb-3">
            <Accordion defaultActiveKey="0" id="my-accordion">
              <Accordion.Item>
                <Accordion.Header>Conversation Starter</Accordion.Header>
                <Accordion.Body>
                <Alert variant='info' style={{borderRadius: "2em", borderColor: "cornflowerblue", borderWidth: "1px !important"}}>
                  By enabling the "Welcome message," the conversation will automatically initiate with the AI, and you won't see the initial screen displaying the logo, cards, and buttons.
                </Alert>
                {inputs.map((value, index) => (
                  <input
                    className="pt-1 mx-1 text-center no-arrows"
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    type="number"
                    pattern="[0-9]" // Only allow numeric input
                    value={value}
                    placeholder='*'
                    onChange={(e) => handleInputChange(index, e.target.value, e)}
                    style={{ margin: '5px', width:"30px"}}
                    onKeyDown={(ev) => handleOnKeyDown(ev, index)}
                  />
                ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div> */}
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


