import React from "react";
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

// Title: React-Chat
// Author: Timonwa Akintokun
// Date: 13 July, 2023
// Availability: https://github.com/Timonwa/react-chat
const Message = ({ message }) => {
  const currentUser = localStorage.getItem("email");

  return (
    <div
      className={`chat-bubble ${message.user === currentUser ? "right" : ""}`}>
      <Avatar
        className="chat-bubble__left"
        icon={<UserOutlined />}
        style={{
          backgroundColor: message.user === currentUser ? '#428c69' : '#023467',
          color: 'white',
          width: '40px',
          height: '48px',
          paddingTop: '2%',
        }}
        />

      <div className="chat-bubble__right">
        <p className="user-name">{message.user}</p>
        <p className="user-message">{message.text}</p>
      </div>
    </div>
  );
};

export default Message;