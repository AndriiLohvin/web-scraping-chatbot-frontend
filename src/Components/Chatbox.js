import '../Styles/Chatbot.css'
import { useCallback } from 'react';


export const Chatbox = ({name, messages, msgRef = null, chat = null, submit = ()=> {}, isChatLog, sendMessage}) => {

  const handleInput = useCallback(
    (ev) => {
      if (ev.key === "Enter" && !ev.shiftKey) {
        sendMessage(ev.target.value);
        // Clear the input field after adding the message
        ev.target.value = "";
      }
    },
    [sendMessage]
  );

  return (
    <div className="col-md-7 col-lg-7 col-xl-7  m-auto">
      <ul className="list-unstyled " ref={chat} id="chatmsg">
        {
          messages.map((msg, index) => (
            msg.role === "user" ? (
              <li className="d-flex justify-content-between mb-4" key = {index}>
                <img src="./Images/user.png" alt="avatar"
                  className="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60" />
                <div className="card mask-custom">
                  <div className="card-header d-flex justify-content-between p-3">
                    <p className="text-light fw-bold mb-0">You</p>
                    {/* <p className="text-muted small mb-0"><i className="far fa-clock"></i> 12 mins ago</p> */}
                  </div>
                  <div className="card-body text-start">
                    <p className="text-light mb-0 string">
                      {msg.content}
                    </p>
                  </div>
                </div>
              </li>
            ) : (
              <li className="d-flex justify-content-between mb-4" key = {index}>
                <div className="card mask-custom">
                  <div className="card-header d-flex justify-content-between p-3">
                    <p className="text-light fw-bold mb-0">{name}</p>
                    {/* <p className="text-muted small mb-0"><i className="far fa-clock"></i> 12 mins ago</p> */}
                  </div>
                  <div className="card-body text-start">
                    <p className="text-light mb-0 string">
                      {msg.content}
                    </p>
                  </div>
                </div>
                <img src="./Images/bot.webp" alt="avatar"
                  className="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60" />
              </li>
            )
          ))
        }
      </ul>
      {isChatLog && (
        <>
          <div className="form-outline form-white mb-3 mask-custom">
            <textarea
              className="form-control p-4"
              id="textAreaExample2"
              rows="4"
              ref={msgRef}
              onKeyUp={handleInput}
            ></textarea>
          </div>
          <button type="button" className="btn btn-light btn-rounded float-end" onClick={submit}>Send</button>
        </>
      )}
    </div>
  )
}