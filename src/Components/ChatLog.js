import '../Styles/Chatbot.css'
import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { sendRequestsWithToken_as_JSON } from "../Utils/Requests";
import { Chatbox } from "./Chatbox";

const ChatLogList = () => {
  const [messages, setMessages] = useState([]);
  const [chatLogs, setChatLogs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  useEffect(() => {
    sendRequestsWithToken_as_JSON("find-chatlogs")
      .then((response) => response.json())
      .then((result) => {
        setChatLogs(result);
      });
  }, []);
  const fetchMessages = useCallback((logId) => {
    sendRequestsWithToken_as_JSON ("find_messages_by_id", {
      body: JSON.stringify({
        logId: logId,
      }),
    })
      .then((response) => response.json())
      .then((result) =>
        setMessages([
          { content: "Hello, How may I help you today?", role: "assistant" },
          ...result,
        ])
      );
  }, []);
  const handleSelect = useCallback(
    (index) => {
      setSelectedIndex(index);
      fetchMessages(chatLogs[index].logId);
    },
    [chatLogs]
  );
  return (
    <section className="gradient-custom">
      <div className="container py-5">
        <div className="row py-3">
          <div className="col-3">
            <h1>Chat Logs</h1>
            <hr />
            <div class="chatlog list-unstyled" id="list-tab" role="tablist">
              {chatLogs.length === 0 && <h2>No Chat Logs</h2>}
              {chatLogs.map((chatLog, index) => (
                <span
                  class={`d-flex justify-content-center mask-custom py-3 ${
                    selectedIndex === index && "active"
                  }`}
                  id="list-home-list"
                  data-mdb-toggle="list"
                  role="tab"
                  aria-controls="list-home"
                  onClick={() => handleSelect(index)}
                >
                  {chatLog.botName} -{" "}
                  {moment(new Date(chatLog.createdDate)).format("HH:mm")}
                </span>
              ))}
            </div>
          </div>
          <div className="col-9">
            <Chatbox
              name={selectedIndex !== -1 ? chatLogs[selectedIndex].botName : ""}
              messages={messages}
              isChatLog = {false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatLogList;
