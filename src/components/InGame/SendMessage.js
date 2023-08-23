import React, { useState } from "react";
import { db } from "../../Configurations/firebase-chatapp";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Button } from "antd";
import { FaPaperPlane } from 'react-icons/fa';

// Title: React-Chat
// Author: Timonwa Akintokun
// Date: 13 July, 2023
// Availability: https://github.com/Timonwa/react-chat
const SendMessage = ({ scroll, messagesLength }) => {
  const [message, setMessage] = useState("");

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    const currentUser = localStorage.getItem("email");
    await addDoc(collection(db, "messages"), {
      text: message,
      user: currentUser,
      createdAt: serverTimestamp(),
    });
    setMessage("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  const formClassName = `send-message ${messagesLength > 0 ? 'has-messages' : 'no-messages'}`;


  return (
    <form onSubmit={(event) => sendMessage(event)} className={formClassName}>
      <input
        style={{ maxWidth: '80%' }}
        name="messageInput"
        type="text"
        className="form-input__input"
        placeholder="Type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        type="primary"
        shape="square"
        icon={<FaPaperPlane />}
        htmlType="submit"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </form>
  );
};

export default SendMessage;