import { useCallback, useState, useRef, useEffect } from 'react'
import '../Styles/Chatbot.css'
import { sendRequestsWithToken, sendRequestsWithToken_as_JSON } from '../Utils/Requests';
import { useParams } from 'react-router-dom';
import { Password } from '../Components/Password';
import { Chatbox } from '../Components/Chatbox';
import { compileString } from 'sass';

export default function Chatbot(){
  const [currentPassword, setCurrentPassword] = useState('');
  const [wrongPassword, setWrongPassword] = useState(false);
  const [botAuthorized, setBotAuthorized] = useState(false);
  const { chatbotId, chatlogId } = useParams();
  const [bot, setBot] = useState({
    name: "",
  });
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState();
  const [showPrompt, SetShowPrompt] = useState(false);
  const [messages, setMessages] = useState([
    {
      // content: "aaaa!!!!!!!!!",
      // role: "assistant"
    }
  ]);
  const [context, setContext] = useState("");
  // const [metadata, setMetadata] = useState([]);
  
  const chat = useRef(null);
  const msgRef = useRef(null);
  const promptRef = useRef(null);

  const handleonClickPromptButton = useCallback(() => {
    SetShowPrompt(!showPrompt);
  }, [showPrompt])

  const handleonClickSetPromptButton = useCallback(() => {
    const formdata = new FormData();
    formdata.append("prompt", promptRef.current.value);
    // console.log(promptRef.current.value);
    // console.log(typeof(promptRef.current.value));
    sendRequestsWithToken("set-prompt", {
      body: formdata,
    })
      .then(response => response.json())
      .catch((err) => {
        alert("Failed for reason!");
      })
  }, [promptRef])

  

  const handleonChangeChooseFile = useCallback((ev) => {
    setFile(ev.target.files[0]);
  }, [])

  const handleonClickAddButton = useCallback(() => {
    msgRef.current.disabled = true;
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("bot_id", chatbotId);
    sendRequestsWithToken("add-training-file",{
      body: formdata,
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log("file", file.name);
        setFiles([...files, file.name]);
        msgRef.current.disabled = false;
      })
      .catch((err) => {
        alert("Failed for reason");
      })
  }, [file, files, chatbotId, msgRef])

  const handleonClickClearDatabaseButton = useCallback(() => {
    // msgRef.current.disabled = true;
    sendRequestsWithToken("clear-database",{})
      .then((response) => response.json())
      .then(
        setFiles([]),
      )
      .catch((err) => {
        alert("Failed for reason");
      })
  }, [])

 
  const sendMessage = useCallback((msg) => {
    const formdata = new FormData();
    let answer = "";
    let metadata = [];
    // const msg = msgRef.current.value;
    // msgRef.current.value = "";
    formdata.append("msg", msg);
    formdata.append("bot_id", chatbotId);
    formdata.append("log_id", chatlogId);
    setMessages([
      ...messages,
      {content:msg, role:"user"},
    ])
    chat.current.scrollTop = chat.current.scrollHeight - chat.current.clientHeight;
    sendRequestsWithToken("similar-context", {
      body:formdata
    })
      .then(response => response.json())
      .then(result => {
        setContext(result.context);
        metadata = result.metadata;
        // console.log(result.metadata);
      })
      .then(() => {
        sendRequestsWithToken("user-question", {
          body: formdata
        })
          .then(response => {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            function read() {
              return reader.read().then(({ done, value }) => {
        
                if (done) {
                  console.log('Streaming completed.');
                  if(metadata.length !== 0) {
                    answer += '\n\nSource:\n'
                    metadata.forEach((data) => {
                      console.log(data);
                      answer += data + '\n'
                    });
                    setMessages([
                      ...messages,
                      {content:msg, role:"user"},
                      {content:answer, role:"assistant"}
                    ]);
                  }
                  return;
                }
                const data = decoder.decode(value);
                answer += data;
                setMessages([
                  ...messages,
                  {content:msg, role:"user"},
                  {content:answer, role:"assistant"}
                ])
                chat.current.scrollTop = chat.current.scrollHeight - chat.current.clientHeight;
                // Continue reading the stream
                return read();
              });
            }
            return read();
          })
          .catch(error => {
            console.error('Error fetching streaming data:', error);
          });
      })
  }, [messages, msgRef, chat, chatbotId])

  const handleonClickSendButton = useCallback(() => {
    sendMessage(msgRef.current.value);
    msgRef.current.value = "";
    // alert("asdf");
  }, [msgRef, sendMessage]);


  const handleonClickRemoveButton = useCallback((index) => {
    
    console.log(files[index]);
    const formdata = new FormData();
    formdata.append("filename", files[index]);
    formdata.append("id", chatbotId);
    sendRequestsWithToken("clear-database-by-metadata", {
      body: formdata,
    })
      .then(response => response.json())
      .then(
        setFiles(files.slice(0, index).concat(files.slice(index + 1)))
      )
      .catch(err => {
        alert("Error");
      })
  }, [files, chatbotId])

  const handleEnterPassword = useCallback((num) => {
    console.log(currentPassword.length)
    if(currentPassword.length === 6) return;
    if(currentPassword.length < 6) setCurrentPassword(currentPassword + num);
    if(currentPassword + num === bot.password) {setBotAuthorized(false); return;}
    if(currentPassword.length === 5) {
      setWrongPassword(true);
      setCurrentPassword('');
    }
  }, [currentPassword, bot.password, wrongPassword])

  const handleResetPassword = useCallback((ev) => {
    // ev.preventDefault();
    // window.location.reload();
  }, [])

  useEffect(() => {
    sendRequestsWithToken_as_JSON("find-chatbot-by-id", {
      body: JSON.stringify({
        id: chatbotId,
        log_id: chatlogId,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        setMessages([
          {
            content: result.welcomeMessage,
            role: "assistant"
          }
        ]);
        if(result.password.length === 6) setBotAuthorized(true);
        setBot(result);
        setFiles(result.files);
        // console.log("here2");
        if(result.conversationSaver){
          sendRequestsWithToken_as_JSON ("find_messages_by_id", {
            body: JSON.stringify({
              logId: result.lastChatLogId,
            }),
          })
            .then((response) => response.json())
            .then((rlt) =>
              setMessages([
                { content: result.welcomeMessage, role: "assistant" },
                ...rlt,
              ])
            );
        }
        
      })
  }, [chatbotId, chatlogId]);

  return(
    <>
    { botAuthorized ? (
      <Password
        enterPassword={handleEnterPassword}
        resetPassword={handleResetPassword}
        currentPassword={currentPassword}
        wrongPassword={wrongPassword}
      />
    ) : (
      <section className="gradient-custom">
        <div className="container py-5">
          <div className="row">
            <div className="text-light col-md-5 col-lg-5 col-xl-5 mb-4 mb-md-0">
              {/* <h5 className="font-weight-bold mb-3 text-center text-lg-start">Prompt & Relative Context</h5> */}
              <div className="mask-custom card" id="prompt">
                <div className="card-body text-start">

                  {/* ------ file-upload-begin -------- */}
                  <div className='file-upload'>
                    <label for="formFileLg" className="form-label"><b>Please Choose Files</b></label>
                    <div className='d-flex mb-3'>
                      <input className="form-control form-control-lg" id="formFileLg" type="file" onChange={handleonChangeChooseFile} />
                      <button type="button" className="btn mx-3 border" onClick={handleonClickAddButton}>Add</button>
                      <button type="button" className="btn mx-3 border" onClick={handleonClickClearDatabaseButton}>Clear</button>
                    </div>
                    <div className='file-table text-center'>
                      <table className="table table-hover table-striped">
                        <thead>
                          <tr>
                            <th className='py-2'>File Name</th>
                            <th className='py-2'>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            files.map((file, index) => (
                              <tr key={index}>
                                <td className='py-2'>
                                    {file}
                                </td>
                                <td className='py-2'>
                                  <button type="button" className="btn border" onClick={() => handleonClickRemoveButton(index)}>Remove</button>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* ------ file-upload-end -------- */}

                  <button type="button" className="btn border mb-3" onClick={handleonClickPromptButton}>{showPrompt ? "Hide" : "Show"} Context</button>
                  <button type="button" className="btn border mb-3 mx-2" onClick={handleonClickSetPromptButton}>Set Prompt</button>
                    <div className="form-outline form-white mb-3 mask-custom" id="prompt-box">
                      <label for="textAreaExample2" className="form-label" style={{paddingLeft: "15px", marginTop:"0.5rem", fontWeight: "bold"}}>Enter your prompt</label>
                      <textarea
                        className="form-control px-3"
                        id="textAreaExample2"
                        rows="4"
                        ref={promptRef}
                        placeholder="You will act as a legal science expert.
                          Please research this context deeply answer questions based on  given context as well as your knowledge.
                          If you can't find accurate answer, please reply similar answer to this question or you can give related information to given questions.
                          Below is context you can refer to."
                      >
                      </textarea>
                    </div>
                    {showPrompt && (
                      <div className="text-start">
                        <h5>Relative Context</h5>
                        <p className="string">
                          {context}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>

            <Chatbox 
              name = {bot.name}
              messages = {messages}
              msgRef = {msgRef}
              chat = {chat}
              submit = {handleonClickSendButton}
              isChatLog = {true}
              sendMessage = {sendMessage}
            />      
          </div>

        </div>
      </section> )
    }
    </>
  )
}