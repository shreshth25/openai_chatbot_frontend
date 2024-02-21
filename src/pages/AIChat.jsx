import { useEffect, useRef, useState } from "react";
import viteLogo from "/vite.svg";
import "../App.css";
import io from "socket.io-client";
const url = import.meta.env.VITE_BACKEND_URL
const socket = io(url);

function AIChat() {
  const [configuration, setConfiguration] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [streamMessage, setStreamMessage] = useState("");
  const [isStream, setIsStream] = useState("");
  const [selectedOption, setSelectHandleOption] = useState("rest-api-chat");
  const textareaRef = useRef();
  const lastMessageRef = useRef();


  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("stream-message", (data) => {
      if (data === "newline") {
        setStreamMessage((prevMessage) => prevMessage + "\n");
      } else {
        setStreamMessage((prevMessage) => prevMessage + data);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("stream-message");
      socket.off("stream-receive-message");
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "55px";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamMessage]);

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  const handleSend = async () => {
    setLoading(true);
    const sender_text = {
      role: "user",
      content: text,
    };
    const newMessages = [...messages, sender_text];
    setMessages(newMessages);
    setText("");

    const response = await fetch(url+"createpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessages),
    });

    const reply = await response.json();

    const reply_messages = [
      ...newMessages,
      { role: "assistant", content: reply["data"] },
    ];
    setMessages(reply_messages);
    setLoading(false);
  };

  const handleSocketSend = async () => {
    setLoading(true);
    const sender_text = {
      role: "user",
      content: text,
    };
    const newMessages = [...messages, sender_text];
    setMessages(newMessages);
    setText("");

    socket.emit("message", {
      messages: newMessages,
    });

    socket.once("receiver-message", (data) => {
      const reply_messages = [
        ...newMessages,
        { role: "assistant", content: data },
      ];
      setMessages(reply_messages);
      setLoading(false);
    });
  };

  const handleSocketStreamSend = async () => {
    setIsStream(true);
    const sender_text = {
      role: "user",
      content: text,
    };
    const newMessages = [...messages, sender_text];
    setMessages(newMessages);
    setText("");

    socket.emit("stream-message", {
      messages: newMessages,
    });

    socket.once("stream-receive-message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: data },
      ]);
      setStreamMessage("");
      setIsStream(false);
    });
  };

  const handleOption = (e) => {
    setSelectHandleOption(e.target.value);
  };

  const handleClick = () => {
    switch (selectedOption) {
      case "rest-api-chat":
        handleSend();
        break;
      case "socket-chat":
        handleSocketSend();
        break;
      case "stream-socket-chat":
        handleSocketStreamSend();
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div className="chat-container">
        {messages.map((msg, index) => {
          return (
            <div key={index} ref={lastMessageRef}>
              {msg.role == "user" ? (
                <div className="chat outgoing">
                  <div className="chat-content">
                    <div className="chat-details">
                      <img
                        src="https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"
                        alt="user-img"
                      />
                      <p>{msg.content}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="chat incoming">
                  <div className="chat-content">
                    <div className="chat-details">
                      <img src={viteLogo} alt="user-img" />
                      <p>{msg.content}</p>
                    </div>
                    <span className="material-symbols-outlined">
                      content_copy
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {isLoading && (
          <div className="loader">
            <div className="chat incoming">
              <div className="chat-content">
                <div className="chat-details">
                  <img src={viteLogo} alt="user-img" />
                  <div className="typing-animation">
                    <div
                      className="typing-dot"
                      style={{ "--delay": "0.2s" }}
                    ></div>
                    <div
                      className="typing-dot"
                      style={{ "--delay": "0.3s" }}
                    ></div>
                    <div
                      className="typing-dot"
                      style={{ "--delay": "0.4s" }}
                    ></div>
                  </div>
                </div>
                <span className="material-symbols-outlined">content_copy</span>
              </div>
            </div>
          </div>
        )}
        {isStream && (
          <div className="loader">
            <div className="chat incoming">
              <div className="chat-content">
                <div className="chat-details">
                  <img src={viteLogo} alt="user-img" />
                  <p>{streamMessage}</p>
                </div>
                <span className="material-symbols-outlined">content_copy</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="typing-container">
        <div className="typing-content">
          <div className="typing-textarea">
            <textarea
              id="chat-input"
              placeholder="Enter your queries"
              ref={textareaRef}
              value={text}
              onChange={handleInputChange}
            ></textarea>
            <span className="material-symbols-outlined" onClick={handleClick}>
              send
            </span>
          </div>
          <select
            name="Type of Chat"
            placeholder="Select Chat"
            className="select-chat"
            onChange={handleOption}
          >
            <option className="select-chat-option" value="rest-api-chat">
              Rest API Chat
            </option>
            <option className="select-chat-option" value="socket-chat">
              Socket Chat
            </option>
            <option className="select-chat-option" value="stream-socket-chat">
              Stream Socket Chat
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default AIChat;
