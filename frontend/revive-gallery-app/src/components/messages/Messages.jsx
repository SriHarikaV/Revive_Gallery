import { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Form,
  InputGroup,
  Button,
  ListGroup,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

import "./messages.css";
import { getUserConversations } from "./services";
import { useUser } from "../auth/UserContext";
import { io } from "socket.io-client";

let socket;

function Messages() {
  let { chatId } = useParams();
  const { user } = useUser();
  const [conversations, setConversations] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const latestMessageRef = useRef(null);
  useEffect(() => {
    init();
  }, [chatId]);
  console.log("render");
  useEffect(() => {
    socket = io.connect("http://localhost:8080");

    return () => {
      socket.removeAllListeners();
    };
  }, []);
  const init = () => {
    getUserConversations()
      .then((res) => {
        setConversations(res);
        handleSelected();
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    if (chatId) {
      socket.emit("JOIN_ROOM", { chatId }, (error) => {
        if (error) alert(error);
      });
      socket.on("receiveMessage", ({ message, user, chatId: id }) => {
        console.log(message);

        if (chatId === id) {
          // Ensure that prevSelected is not null before updating
          setSelected((prevSelected) => {
            // Ensure that prevSelected is not null before updating
            if (prevSelected) {
              return {
                ...prevSelected,
                chats: {
                  ...prevSelected.chats,
                  conversation: [
                    ...prevSelected.chats.conversation,
                    {
                      message,
                      senderId: user._id,
                    },
                  ],
                },
              };
            }
            return prevSelected;
          });
        }
      });
    }
    return () => {
      removeListners();
    };
  }, [chatId]);
  const removeListners = () => {
    console.log("clean up done");

    socket.removeAllListeners();
  };
  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatId, selected, message]);

  const handleSelected = () => {
    setIsSelected(true);
    setSelected(conversations.find((x) => x.chats._id === chatId) || null);
  };
  function handleMsgSubmit(e) {
    e.preventDefault();

    socket.emit("sendMessage", { chatId, user, message }, (error) => {
      if (error) {
        alert(JSON.stringify(error));
      }
    });
    setMessage("");
    setSelected(
      selected,
      selected.chats.conversation.push({
        message,
        senderId: user._id,
      })
    );
  }

  return (
    <Container>
      <Row>
        <aside className="col-lg-4 col-md-4">
          <h3 className="h3">Conversations</h3>
          {conversations.length >= 1 ? (
            <ListGroup as="ul">
              {conversations.map((x) => (
                <ListGroup.Item
                  key={x.chats._id}
                  as="li"
                  active={x.chats._id === chatId}
                >
                  <Link
                    onClick={handleSelected}
                    to={`/messages/${x.chats._id}`}
                    style={{
                      textDecoration: "none",
                      color: `${x.chats._id === chatId ? "white" : "black"}`,
                    }}
                  >
                    {x.isBuyer ? (
                      <>
                        <span>{x.chats.seller.firstName} </span>
                        <span>{x.chats.seller.lastName}</span>
                      </>
                    ) : (
                      <>
                        <span>{x.chats.buyer.firstName}</span>
                        <span>{x.chats.buyer.lastName}</span>
                      </>
                    )}
                  </Link>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <h5>No messages yet</h5>
          )}
        </aside>
        {selected !== null ? (
          <article className="col-lg-8 col-md-8">
            {isSelected && (
              <>
                <Row>
                  <div className="chat-selected-header h6 col-lg-12">
                    {selected.isBuyer ? (
                      //   <Link to={`/profile/${selected.chats.seller._id}`}>
                      <span>{selected.chats.seller.firstName}</span>
                    ) : (
                      //   </Link>
                      //   <Link to={`/profile/${selected.chats.buyer._id}`}>
                      <span>{selected.chats.buyer.firstName}</span>
                      //   </Link>
                    )}
                  </div>
                </Row>

                <div
                  className="chat-selected-body col-lg-12"
                  style={{
                    overflowY: "scroll",
                    maxHeight: "75vh",
                    minHeight: "75vh",
                  }}
                >
                  {selected.chats.conversation.map((x) => (
                    <div
                      className={selected.myId === x.senderId ? "me" : "not-me"}
                      key={x._id}
                    >
                      <span className="message">{x.message}</span>
                    </div>
                  ))}
                  <div ref={latestMessageRef}></div>
                </div>
                <div className="chat-selected-footer col-lg-12">
                  <Form onSubmit={handleMsgSubmit}>
                    <Form.Group>
                      <InputGroup>
                        <Form.Control
                          className="cnts-btn"
                          as="textarea"
                          required
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        ></Form.Control>
                        <Button
                          className="cnts-btn"
                          type="submit"
                          variant="secondary"
                        >
                          Send
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Form>
                </div>
              </>
            )}
          </article>
        ) : null}
      </Row>
    </Container>
  );
}

export default Messages;
