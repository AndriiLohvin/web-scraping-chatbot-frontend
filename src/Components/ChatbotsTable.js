import '../Styles/ChatbotsTable.css'
import React, { useCallback, useEffect, useState } from "react";
import { AddNewBotModal } from "./Modals/AddNewBotModal";
// import { convert_db_data } from "../../Utils/ChatbotUtil";
import { EditPagesModal } from "./Modals/EditPagesModal";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { sendRequestsWithToken, sendRequestsWithToken_as_JSON } from '../Utils/Requests';
// import { EditFilesModal } from "../Modals/EditFilesModal";
// import { setAuthorized } from '../Slice/signSlice';
// import { setToken } from '../Utils/Requests';
// import { useDispatch } from 'react-redux';

const ChatbotsTable = () => {
  // const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [addNewBotModalShow, setAddNewBotModalShow] = useState(false);
  const [editPagesModalShow, setEditPagesModalShow] = useState(false);
  // const [editFilesModalShow, setEditFilesModalShow] = useState(false);
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
    
      // const formdata = new FormData();
      // formdata.append("firstname", "test");
      // formdata.append("lastname", "test");
      // formdata.append("email", "test@gmail.com");
      // formdata.append("password", "123123");
      // formdata.append("confirm_password", "123123");
      // console.log("formdata: ", formdata);
      // sendRequestsWithToken('auth/signup', {
      //   body: formdata
      // })
      //   .then((response) => {
      //     const result = response.json();
      //     console.log(result);
      //     console.log("here");
      //     if(response.status === 200){
      //       // alert("You Signed Up Successfully");
      //       // navigator('/signin');
      //     }
      //     // else alert("Unknown Error");
      //   })
      //   .then(result => {
      //     console.log("here1");
      //     const formdata1 = new FormData();
      //     formdata1.append("email", "test@gmail.com");
      //     formdata1.append("password", "123123");
      //     sendRequestsWithToken("auth/signin", {
      //       body: formdata1,
      //     })
      //       .then(async (response) => {
      //         const result = await response.json();
      //         console.log(result['username']);
      //         if(response.status === 200){
      //           console.log(result.access_token);
      //           // alert("You Signed In Successfully");
      //           setToken(result.access_token);
      //           dispatch(
      //             setAuthorized({user: result.user})
      //           );
      //           // navigator("/");
      //         }
      //         else alert("Unknown Error");
      //       })
      //       .then((result) => {
      //         sendRequestsWithToken("find-all-chatbots", {})
      //         .then((response) => response.json())
      //         .then((result) => {
      //             console.log(result)
      //             setData(result);
      //           }
      //         );
      //       })
      //       .catch((err) => {
      //         alert("Sign In Failed for reason");
      //       })
      //   })
      //   .catch((err) => {
      //     alert("Failed for reason");
      //   })
    sendRequestsWithToken("find-all-chatbots")
      .then((response) => response.json())
      .then((result) => {
          console.log(result)
          setData(result);
        }
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
                      <Link to={`/chatbot/${bot._id}/${ (bot.conversationSaver && bot.lastChatLogId !== "") ? bot.lastChatLogId : uuidv4().toString()}`}>
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