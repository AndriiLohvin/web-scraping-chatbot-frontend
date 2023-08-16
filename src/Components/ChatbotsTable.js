import '../Styles/ChatbotsTable.css'
import React, { useCallback, useEffect, useState } from "react";
import { AddNewBotModal } from "./Modals/AddNewBotModal";
// import { convert_db_data } from "../../Utils/ChatbotUtil";
import { EditPagesModal } from "./Modals/EditPagesModal";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { sendRequestsWithToken } from '../Utils/Requests';
// import { EditFilesModal } from "../Modals/EditFilesModal";

const ChatbotsTable = () => {
  const [data, setData] = useState([]);
  const [addNewBotModalShow, setAddNewBotModalShow] = useState(false);
  const [editPagesModalShow, setEditPagesModalShow] = useState(false);
  const [editFilesModalShow, setEditFilesModalShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const handleAdd = useCallback(() => {
    setAddNewBotModalShow(true);
  }, []);


  const AddNewData = useCallback(
    (newBot) => {
      console.log(data);
      setData([...data, newBot]);
    },
    [data]
  );

  const handleRemoveChatbot = useCallback(
    (botId, index) => {
      console.log(botId, index);
      if (window.confirm("Are you sure want to delete?")) {
        const formdata = new FormData();
        formdata.append("id", botId);
        sendRequestsWithToken("remove-chatbot",{
          body: formdata,
        })
          .then(response => response.json())
          .then(result => {
            setData(data.slice(0, index).concat(data.slice(index + 1)));
            setCurrentIndex(-1);
          })
      }
    },
    [data]
  );

  const addPage = useCallback(
    (link) => {
      setData([
        ...data.slice(0, currentIndex),
        {
          ...data[currentIndex],
          pages: [...data[currentIndex].pages, link],
        },
        ...data.slice(currentIndex + 1),
      ]);
    },
    [currentIndex, data]
  );

  const handleEditPages = useCallback(
    (botId, index) => {
      setCurrentIndex(index);
      setEditPagesModalShow(true);
    },
    []
  );

  useEffect(() => {
    sendRequestsWithToken("find-all-chatbots")
      .then((response) => response.json())
      .then((result) =>
        setData(result)
      );
  }, []);


  return(
    <section class="dashboard">
      <div class="container py-5">
            <div class="chatbot card mask-custom">
              <div class="card-head" >
                <h2 class="font-weight-bold text-center text-white mt-3">Your chatbots</h2>
                <button type="button" class="btn btn-light float-start btn-rounded mx-3" onClick={handleAdd}>Add New Bot</button>
                <table class="table table-hover table-striped px-4"> 
                  <thead>
                    <tr>
                      <th class="col-6 fs-5">Bot Name</th>
                      <th class="col-6 fs-5">Actions</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div class="card-body">
                <table class="table table-hover table-striped">
                  <tbody>
                    {data.length === 0 && (
                      <tr>
                        <td colspan="2">
                          <h3>You don't have any bot created</h3>
                        </td>
                      </tr>
                    )}
                    {data.map((bot, index) => (
                      <tr>
                        <td style={{width: "50%"}}>
                          <Link to={`/chatbot/${bot._id}/${uuidv4().toString()}`}>
                            <h3>{bot.name}</h3>
                          </Link>
                        </td>
                        <td style={{width: "50%"}}>
                          <button
                            class="btn btn-primary"
                            onClick={() => handleEditPages(bot._id, index)}
                          >
                            Edit Pages
                          </button>
                          <button
                            class="btn btn-primary mx-2"
                            // onClick={() => handleEditFiles(bot._id, index)}
                          >
                            Edit Files
                          </button>
                          <button
                            class="btn btn-danger mx-2"
                            onClick={() => handleRemoveChatbot(bot._id, index)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
          <AddNewBotModal
            show={addNewBotModalShow}
            setShow={setAddNewBotModalShow}
            handleAdd={AddNewData}
          />
          <EditPagesModal
            show={editPagesModalShow}
            setShow={setEditPagesModalShow}
            id={currentIndex === -1 ? "" : data[currentIndex]._id}
            AddPage={addPage}
          />
    </section>
  )
}

export default ChatbotsTable;