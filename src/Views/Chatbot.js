import { useCallback, useState, useRef } from 'react'
import '../Styles/Chatbot.css'
import { sendRequestsWithToken } from '../Utils/Requests';
import { useParams } from 'react-router-dom';
import { Password } from '../Components/Password';

export default function Chatbot(){
  const [currentPassword, setCurrentPassword] = useState('');

  const { chatbotId, chatlogId } = useParams();
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState();
  const [showPrompt, SetShowPrompt] = useState(false);
  const [messages, setMessages] = useState([
    {
      content: "Hello, How can I help you today?",
      role: "assistant"
    }
  ]);
  const [context, setContext] = useState("");
  
  const chat = useRef(null);
  const msgRef = useRef(null);
  const promptRef = useRef(null);

  const handleonClickPromptButton = useCallback(() => {
    SetShowPrompt(!showPrompt);
  }, [showPrompt])

  const handleonClickSetPromptButton = useCallback(() => {
    const formdata = new FormData();
    formdata.append("prompt", promptRef.current.value);
    console.log(promptRef.current.value);
    console.log(typeof(promptRef.current.value));
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
        console.log("file", file.name);
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

  const handleonClickSendButton = useCallback(() => {
    const formdata = new FormData();
    let answer = "";
    const msg = msgRef.current.value;
    msgRef.current.value = "";
    formdata.append("msg", msg);
    formdata.append("bot_id", chatbotId);
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
        setContext(result);
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
    if(currentPassword.length < 6) setCurrentPassword(currentPassword + num);
  }, [currentPassword])

  const handleResetPassword = useCallback(() => {
    setCurrentPassword('');
  }, [])

  return(
    <Password
      enterPassword={handleEnterPassword}
      resetPassword={handleResetPassword}
      currentPassword={currentPassword}
    />
    // <section class="gradient-custom">
    //   <div class="container py-5">
    //     <div class="row">
    //       <div class="text-light col-md-5 col-lg-5 col-xl-5 mb-4 mb-md-0">
    //         {/* <h5 class="font-weight-bold mb-3 text-center text-lg-start">Prompt & Relative Context</h5> */}
    //         <div class="mask-custom card" id="prompt">
    //           <div class="card-body text-start">

    //             {/* ------ file-upload-begin -------- */}
    //             <div className='file-upload'>
    //               <label for="formFileLg" class="form-label"><b>Please Choose Files</b></label>
    //               <div className='d-flex mb-3'>
    //                 <input class="form-control form-control-lg" id="formFileLg" type="file" onChange={handleonChangeChooseFile} />
    //                 <button type="button" class="btn mx-3 border" onClick={handleonClickAddButton}>Add</button>
    //                 <button type="button" class="btn mx-3 border" onClick={handleonClickClearDatabaseButton}>Clear</button>
    //               </div>
    //               <div className='file-table text-center'>
    //                 <table class="table table-hover table-striped">
    //                   <thead>
    //                     <tr>
    //                       <th className='py-2'>File Name</th>
    //                       <th className='py-2'>Actions</th>
    //                     </tr>
    //                   </thead>
    //                   <tbody>
    //                     {
    //                       files.map((file, index) => (
    //                         <tr key={index}>
    //                           <td className='py-2'>
    //                               {file}
    //                           </td>
    //                           <td className='py-2'>
    //                             <button type="button" class="btn border" onClick={() => handleonClickRemoveButton(index)}>Remove</button>
    //                           </td>
    //                         </tr>
    //                       ))
    //                     }
    //                   </tbody>
    //                 </table>
    //               </div>
    //             </div>
    //             {/* ------ file-upload-end -------- */}

    //             <button type="button" class="btn border mb-3" onClick={handleonClickPromptButton}>{showPrompt ? "Hide" : "Show"} Context</button>
    //             <button type="button" class="btn border mb-3 mx-2" onClick={handleonClickSetPromptButton}>Set Prompt</button>
    //               <div class="form-outline form-white mb-3 mask-custom" id="prompt-box">
    //                 <label for="textAreaExample2" class="form-label" style={{paddingLeft: "15px", marginTop:"0.5rem", fontWeight: "bold"}}>Enter your prompt</label>
    //                 <textarea
    //                   class="form-control px-3"
    //                   id="textAreaExample2"
    //                   rows="4"
    //                   ref={promptRef}
    //                   placeholder="You will act as a legal science expert.
    //                     Please research this context deeply answer questions based on  given context as well as your knowledge.
    //                     If you can't find accurate answer, please reply similar answer to this question or you can give related information to given questions.
    //                     Below is context you can refer to."
    //                 >
    //                 </textarea>
    //               </div>
    //               {showPrompt && (
    //                 <div class="text-start">
    //                   <h5>Relative Context</h5>
    //                   <p class="string">
    //                     {context}
    //                   </p>
    //                 </div>
    //               )}
    //           </div>
    //         </div>
    //       </div>

    //       <div class="col-md-7 col-lg-7 col-xl-7">
    //         <ul class="list-unstyled " ref={chat} id="chatmsg">
    //           {
    //             messages.map((msg, index) => (
    //               msg.role === "user" ? (
    //                 <li class="d-flex justify-content-between mb-4" key = {index}>
    //                   <img src="./Images/user.png" alt="avatar"
    //                     class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60" />
    //                   <div class="card mask-custom">
    //                     <div class="card-header d-flex justify-content-between p-3">
    //                       <p class="text-light fw-bold mb-0">You</p>
    //                       {/* <p class="text-muted small mb-0"><i class="far fa-clock"></i> 12 mins ago</p> */}
    //                     </div>
    //                     <div class="card-body text-start">
    //                       <p class="text-light mb-0 string">
    //                         {msg.content}
    //                       </p>
    //                     </div>
    //                   </div>
    //                 </li>
    //               ) : (
    //                 <li class="d-flex justify-content-between mb-4" key = {index}>
    //                   <div class="card mask-custom">
    //                     <div class="card-header d-flex justify-content-between p-3">
    //                       <p class="text-light fw-bold mb-0">Chatbot</p>
    //                       {/* <p class="text-muted small mb-0"><i class="far fa-clock"></i> 12 mins ago</p> */}
    //                     </div>
    //                     <div class="card-body text-start">
    //                       <p class="text-light mb-0 string">
    //                         {msg.content}
    //                       </p>
    //                     </div>
    //                   </div>
    //                   <img src="./Images/bot.webp" alt="avatar"
    //                     class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60" />
    //                 </li>
    //               )
    //             ))
    //           }
              
    //         </ul>
    //         <div class="form-outline form-white mb-3 mask-custom">
    //           <textarea class="form-control p-4" id="textAreaExample2" rows="4" ref={msgRef}></textarea>
    //         </div>
    //         <button type="button" class="btn btn-light btn-rounded float-end" onClick={handleonClickSendButton}>Send</button>
    //       </div>

    //     </div>

    //   </div>
    // </section>
  )
}