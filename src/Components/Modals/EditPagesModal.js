import React, { useCallback, useState, useEffect } from "react";
import {
  Form,
  Modal,
  Button,
  FormControl,
} from "react-bootstrap";
import { sendRequestsWithToken } from "../../Utils/Requests";
export const EditPagesModal = ({ show, setShow, id, AddPage = () => {} }) => {
  const [pages, setPages] = useState([]);
  const [linkVal, setLinkVal] = useState("");
  const [content, setContent] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const handleClose = useCallback(() => {
    setShow(false);
  }, [setShow]);
  
  const handleSubmit = useCallback(() => {
    setShow(false);
  }, [setShow]);

  const handleAdd = useCallback(() => {
    setIsDisabled(true);
    console.log(linkVal);
    const formdata = new FormData();
    formdata.append("id", id);
    formdata.append("url", linkVal);
    sendRequestsWithToken ("add-page", {
      body: formdata,
    })
      .then((response) => response.json())
      .then((result) => {
        setPages([...pages, linkVal]);
        AddPage(linkVal);
        setLinkVal("");
        setIsDisabled(false);
      });
  }, [id, linkVal, pages, AddPage]);

  const fetchContent = useCallback((url) => {
    setContent("Loading...");
    const formdata = new FormData();
    formdata.append("link", url);
    sendRequestsWithToken("extract-content", {
      body: formdata,
    })
      .then((response) => response.json())
      .then((result) => setContent(result));
  }, []);

  useEffect(() => {
    setContent("");
    if (id !== "") {
      const formdata = new FormData();
      formdata.append("id", id);
      sendRequestsWithToken("find-pages-by-id", {
        body: formdata
      })
        .then((response) => response.json())
        .then((result) => setPages(result));
    }
  }, [id]);

  return (
    <Modal show={show} onHide={handleClose} className="modal-xl">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Links</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-9">
              <FormControl
                type="text"
                placeholder="Input links here..."
                onChange={(ev) => setLinkVal(ev.target.value)}
              />
            </div>
            <div className="col-2 mx-2">
              <button
                class="btn btn-primary"
                onClick={handleAdd}
                type="button"
                disabled={isDisabled}
              >
                Add
              </button>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-6">
              <table className="table table-hover">
                <tbody>
                  {pages.map((page) => (
                    <tr>
                      <td onClick={() => fetchContent(page)}>{page}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-6">
              <textarea
                readOnly
                value={content}
                style={{ height: "500px", width: "100%" }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
