import '../../Styles/Modal.css'
import { language_names, formats, styles, tones, response_lengths } from '../OptionValues'
import React, { useCallback, useState, useRef } from "react";
import { MDBRange } from 'mdb-react-ui-kit';

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
import { sendRequestsWithToken, sendRequestsWithToken_as_JSON } from "../../Utils/Requests";

// const inputs = [1, 2, 3, 4, 5, 6];

export const AddNewBotModal = ({ show, setShow, handleAdd }) => {
  const [error, setError] = useState('');
  const [inputs, setInputs] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef([]);

  // ------------Form Datas Begin-----------------------
  const [botName, setBotName] = useState('');
  const [botDescription, setBotDescription] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState("Hello friend! How can I help you today?");
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedFormat, setSelectedFormat] = useState('FAQ');
  const [selectedStyle, setSelectedStyle] = useState('Friendly');
  const [selectedTone, setSelectedTone] = useState('Friendly');
  const [selectedLength, setSelectedLength] = useState('50 words');
  const [selectedContextBehavior, setSelectedContextBehavior] = useState('file');
  const [behaviorPrompt, setBehaviorPrompt] = useState('');
  const [fighterPrompt, setFighterPrompt] = useState('');
  const [appendedPrompt, setAppendedPrompt] = useState('');
  const [creativity, setCreativity] = useState(0.3);
  const [conversationSaver, setConversationSaver] = useState(false);
  const [sourceDiscloser, setSourceDiscloser] = useState(false);
  const [HTMLInterpreter, setHTMLInterpreter] = useState(false);
  // ------------Form Datas End-----------------------


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

  const handleSubmit = useCallback((ev) => {
    ev.preventDefault();
    // if (!botName.trim()) {
    //     console.log("here");
    //     console.log(botName);
    //     setError('Please fill in all required fields.');
    //   }else{
        // console.log("fsdsd---------------------------");
        // setError('');

        console.log("des", botDescription);
        sendRequestsWithToken_as_JSON ("add-new-chatbot", {
          body: JSON.stringify({
            name: botName,
            description: botDescription,
            welcomeMessage: welcomeMessage,
            model: selectedModel,
            language: selectedLanguage,
            tone: selectedTone,
            format: selectedFormat,
            style: selectedStyle,
            length: selectedLength,
            password: inputs.join(''),
            contextBehavior: selectedContextBehavior,
            behaviorPrompt: behaviorPrompt,
            fighterPrompt: fighterPrompt,
            appendedPrompt: appendedPrompt,
            creativity: creativity,
            conversationSaver: conversationSaver,
            sourceDiscloser: sourceDiscloser,
            HTMLInterpreter: HTMLInterpreter,
          }),
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            handleAdd({
              name: botName,
              _id: result,
              pages: [],
              files: [],
            });
          });
        setShow(false);
      // }
    },[
      handleAdd,
      botName,
      botDescription,
      welcomeMessage,
      selectedModel,
      selectedLanguage,
      selectedTone,
      selectedFormat,
      selectedStyle,
      selectedLength,
      inputs,
      selectedContextBehavior,
      behaviorPrompt,
      fighterPrompt,
      appendedPrompt,
      creativity,
      conversationSaver,
      sourceDiscloser,
      HTMLInterpreter,
    ]);

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
        <Modal.Body className='modal-body'>
          {/* ----------------- Name Input Begin -------------------- */}
          <FormGroup class="mb-4">
            <FormLabel class="px-2 text-dark fw-bold">Bot Name</FormLabel>
            <FormControl
              type="px-0 text"
              placeholder="My Chatbot"
              name="botName"
              style={{borderRadius: "1em"}}
              onChange={(ev) => setBotName(ev.target.value)}
            />
            <p class="px-2 mb-0" style={{color:"blue"}}>
              The name is used to identify your chatbot. It’s private and exclusively visible to you.
            </p>
            {/* {error && <p class="px-2" style={{color:"red"}}><b>Bot Name</b> is required.</p>} */}
          </FormGroup>
          {/* ----------------- Name Input End -------------------- */}

          {/* ----------------- Description Input Begin -------------------- */}
          <FormGroup class="mb-4">
            <FormLabel class="px-2 text-dark fw-bold">Description </FormLabel>
            <FormControl
              type="px-0 text"
              placeholder="This is my general assistant"
              name="description"
              style={{borderRadius: "1em"}}
              onChange={(ev) => setBotDescription(ev.target.value)}
            />
            <p class="px-2 mb-0" style={{color:"blue"}}>
            The description is used to identify your chatbot. It’s private and exclusively visible to you.
            </p>
          </FormGroup>
          {/* ----------------- Description Input End -------------------- */}

          {/* ----------------- Model Accordion Begin -------------------- */}
          <div class="mb-3">
            <Accordion defaultActiveKey="0" id="my-accordion">
              <Accordion.Item>
                <Accordion.Header>Models (LLMs)</Accordion.Header>
                <Accordion.Body>
                <label htmlFor="mySelect" class="px-2 mb-0 fw-bold text-dark"  style={{fontSize:"13px"}}>Model<span class="text-danger" style={{fontSize:"11px"}}> (Required)</span></label>
                <Form.Select
                  size='lg'
                  style={{borderRadius: "1em"}}
                  value={selectedModel}
                  onChange={(ev) => setSelectedModel(ev.target.value)}
                >
                  <option value="gpt-4"> GPT 4|4K context</option>
                  <option value="gpt-4-32k"> GPT 4|16K context</option>
                  <option value="gpt-3.5-turbo"> GPT 3.5|4K context</option>
                  <option value="gpt-3.5-turbo-16k"> GPT 3.5|16K context</option>
                </Form.Select>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          {/* ----------------- Model Accordion End -------------------- */}


          {/* ----------------- Writing Style Accordion Begin -------------------- */}
          <div class="mb-3">
            <Accordion defaultActiveKey="0" id="my-accordion">
              <Accordion.Item>
                <Accordion.Header>Writing Style</Accordion.Header>
                <Accordion.Body>
                <label htmlFor="mySelect" class="px-2 fw-bold text-dark" style={{fontSize:"13px"}}>Language</label>
                <Form.Select
                  id="mySelect"
                  className="mb-3"
                  size='lg'
                  style={{borderRadius: "1em"}}
                  value={selectedLanguage}
                  onChange={(ev) => setSelectedLanguage(ev.target.value)}
                >
                  {
                    language_names.map((language_name, index) => (
                      <option value={language_name}>{language_name}</option>
                    ))
                  }
                </Form.Select>
                <label htmlFor="mySelect" class="px-2 fw-bold text-dark"  style={{fontSize:"13px"}}>Tone</label>
                <Form.Select
                  className="mb-3"
                  size='lg'
                  style={{borderRadius: "1em"}}
                  value={selectedTone}
                  onChange={(ev) => setSelectedTone(ev.target.value)}
                >
                  {
                    tones.map((tone, index) => (
                      <option value={tone}>{tone}</option>
                    ))
                  }
                </Form.Select>
                <label htmlFor="mySelect" class="px-2 fw-bold text-dark"  style={{fontSize:"13px"}}>Style</label>
                <Form.Select
                  className="mb-3"
                  size='lg'
                  style={{borderRadius: "1em"}}
                  value={selectedStyle}
                  onChange={(ev) => setSelectedStyle(ev.target.value)}
                >
                  {
                    styles.map((style, index) => (
                      <option value={style}>{style}</option>
                    ))
                  }
                </Form.Select>
                <label htmlFor="mySelect" class="px-2 fw-bold text-dark"  style={{fontSize:"13px"}}>Format</label>
                <Form.Select
                  className="mb-3"
                  size='lg'
                  style={{borderRadius: "1em"}}
                  value={selectedFormat}
                  onChange={(ev) => setSelectedFormat(ev.target.value)}
                >
                  {
                    formats.map((format, index) => (
                      <option value={format}>{format}</option>
                    ))
                  }
                </Form.Select>
                <label htmlFor="mySelect" class="px-2 fw-bold text-dark"  style={{fontSize:"13px"}}>Max response length</label>
                <Form.Select
                  className="mb-3"
                  size='lg'
                  style={{borderRadius: "1em"}}
                  value={selectedLength}
                  onChange={(ev) => setSelectedLength(ev.target.value)}
                >
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
          {/* ----------------- Writing Style Accordion End -------------------- */}
          
          {/* ----------------- Conversation Starter Accordion Begin -------------------- */}
          <div class="mb-3">
            <Accordion defaultActiveKey="0" id="my-accordion">
              <Accordion.Item>
                <Accordion.Header>Conversation Starter</Accordion.Header>
                <Accordion.Body>
                <Alert variant='info' style={{borderRadius: "2em", borderColor: "cornflowerblue", borderWidth: "1px !important"}}>
                  By enabling the "Welcome message," the conversation will automatically initiate with the AI, and you won't see the initial screen displaying the logo, cards, and buttons.
                </Alert>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label class="px-2 text-dark fw-bold" style={{fontSize:"13px"}}>Welcome message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder='Hello friend! How can I help you today?'
                    value={welcomeMessage}
                    onChange={(ev) => setWelcomeMessage(ev.target.value)}
                  />
                </Form.Group>
                <p class="px-2 mb-0" style={{color:"blue", fontSize:"13px"}}>
                  Enabling the welcome message will automatically initiate the conversation with the chatbot. With this feature enabled, you won’t see the welcome screen, and the chatbot will begin the conversation without requiring any user input.
                </p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          {/* ----------------- Conversation Starter Accordion End -------------------- */}

          {/* ----------------- Access control (PIN code) Accordion Begin -------------------- */}
          <div class="mb-3">
            <Accordion defaultActiveKey="0" id="my-accordion">
              <Accordion.Item>
                <Accordion.Header>Access control (PIN code)</Accordion.Header>
                <Accordion.Body>
                <Alert variant='info' style={{borderRadius: "2em", borderColor: "cornflowerblue", borderWidth: "1px !important"}}>
                  The PIN is not necessary.
                </Alert>
                {inputs.map((value, index) => (
                  <input
                    className="pt-1 mx-1 text-center no-spinner"
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
          </div>
          {/* ----------------- Access control (PIN code) Accordion End -------------------- */}

          {/* ----------------- Advanced settings Accordion Begin -------------------- */}

          <div class="mb-3">
            <Accordion defaultActiveKey="0" class="my-accordion">
              <Accordion.Item>
                <Accordion.Header>Advanced settings</Accordion.Header>
                <Accordion.Body>
                <Alert variant='info' style={{borderRadius: "2em", borderColor: "cornflowerblue", borderWidth: "1px !important"}}>
                  Please carefully read the instructions highlighted in blue before making any modifications.
                </Alert>

                <div className='box'>
                  <label htmlFor="Context behavior" class="px-2 fw-bold text-dark" style={{fontSize:"13px"}}>Context behavior</label>
                  <Form.Select
                    id="Context behavior"
                    size='lg'
                    style={{borderRadius: "1em"}}
                    value={selectedContextBehavior}
                    onChange={(ev) => setSelectedContextBehavior(ev.target.value)}
                  >
                    <option value="file"> Get information only from the training data, and if necessary, respond with 'I don’t know'.</option>
                    <option value="both"> Get information from the training data and ChatGPT knowledge.</option>
                    <option value="gpt"> The chatbot will disregard the training data and respond similarly to the public ChatGPT.</option>
                  </Form.Select>
                  <p class="px-2 mb-0" style={{color:"blue", fontSize:"13px"}}>
                    The context behavior determines how the training data you provide will be utilized. It specifies the way in which the chatbot understands and responds to user inputs based on the given context.
                  </p>
                </div>

                <div className='box'>
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label class="px-2 text-dark fw-bold" style={{fontSize:"13px"}}>Behavior prompt</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder='Example: You are helpful assistant'
                      value={behaviorPrompt}
                      onChange={(ev) => setBehaviorPrompt(ev.target.value)}
                    />
                  </Form.Group>
                  <p class="px-2 mb-0" style={{color:"blue", fontSize:"13px"}}>
                    The behavior prompt overrides our default behavior of 'You are a helpful assistant' to provide a more customized experience, allowing your chatbot to act in a manner that aligns with your specific requirements and preferences. Example : Act like an employee of the startup InsertChatGPT, and your job is to help represent the company and the product in the best way possible. Never talk about our competition or say something bad about the startup.
                  </p>
                </div>

                <div className='box'>
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label class="px-2 text-dark fw-bold" style={{fontSize:"13px"}}>Hallucination fighter prompt</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder='If my message contains X, Y, Z do the following...'
                      value={fighterPrompt}
                      onChange={(ev) => setFighterPrompt(ev.target.value)}
                    />
                  </Form.Group>
                  <p class="px-2 mb-0" style={{color:"blue", fontSize:"13px"}}>
                    The hallucination fighter prompt utilizes the AI response as an input before delivering it to your users. It functions similarly to a moderator filter that fine-tunes the AI response. This process helps to ensure the accuracy and reliability of the output, please be aware that the hallucination fighter will double (x2) your normal query consumption.
                  </p>
                </div>

                <div className='box'>
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label class="px-2 text-dark fw-bold" style={{fontSize:"13px"}}>Append to your user prompts</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder='Be brief'
                      value={appendedPrompt}
                      onChange={(ev) => setAppendedPrompt(ev.target.value)}
                    />
                  </Form.Group>
                  <p class="px-2 mb-0" style={{color:"blue", fontSize:"13px"}}>
                    The append prompt will be added at the end of each of your user queries.
                  </p>
                </div>

                <div className='box'>
                  <Form.Label class="px-2 text-dark fw-bold" style={{fontSize:"13px"}}>Creativity ({creativity}) - Recommended value : 0.3</Form.Label>
                  <MDBRange
                    defaultValue={0.3}
                    min='0'
                    max='1'
                    step='0.1'
                    id='customRange3'
                    value={creativity}
                    onChange={(ev) => setCreativity(ev.target.value)}
                  />
                  <p class="px-2 mb-0" style={{color:"blue", fontSize:"13px"}}>
                    Creativity can be adjusted by changing the temperature value. A higher temperature value, such as 0.7, can result in more unpredictable and diverse outputs, while a lower temperature value, such as 0.2, can produce a more precise and specific output.
                  </p>
                </div>

                <div className='box'>
                  <Form.Label class="px-2 text-dark fw-bold" style={{fontSize:"13px"}}>Conversation saver</Form.Label>
                  <Form.Check // prettier-ignore
                    type="switch"
                    id="custom-switch"
                    label="disabled"
                    checked={conversationSaver}
                    onChange={(ev) => setConversationSaver(ev.target.checked)}
                  />
                  <p class="px-2 mb-0" style={{color:"blue", fontSize:"13px"}}>
                    The Conversation Saver feature ensures that your current conversation remains open, even if you refresh the page, navigate to a different page within the same website, or visit another website using the same chatbot.
                  </p>
                </div>
                <div className='box'>
                  <Form.Label class="px-2 text-dark fw-bold" style={{fontSize:"13px"}}>Source discloser</Form.Label>
                  <Form.Check // prettier-ignore
                    type="switch"
                    id="custom-switch"
                    label="disabled"
                    checked={sourceDiscloser}
                    onChange={(ev) => setSourceDiscloser(ev.target.checked)}
                  />
                  <p class="px-2 mb-0" style={{color:"blue", fontSize:"13px"}}>
                    The Source Exposure feature will display the URLs from which the AI obtained the information.
                  </p>
                </div>
                <div className='box'>
                  <Form.Label class="px-2 text-dark fw-bold" style={{fontSize:"13px"}}>HTML interpreter - Recommended value: Disabled</Form.Label>
                  <Form.Check // prettier-ignore
                    type="switch"
                    id="custom-switch"
                    label="disabled"
                    checked={HTMLInterpreter}
                    onChange={(ev) => setHTMLInterpreter(ev.target.checked)}
                  />
                  <p class="px-2 mb-0" style={{color:"blue", fontSize:"13px"}}>
                    With the HTML Interpreter feature, you may sacrifice the advantage of visually appealing formatting for the AI output, such as titles, tables, lists, and so on. However, it allows the execution of HTML code, which can be particularly useful when generating images or graphics using HTML.
                  </p>
                </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          {/* ----------------- Advanced settings Accordion End -------------------- */}

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


