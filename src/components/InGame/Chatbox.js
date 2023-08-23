import React, { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db } from "../../Configurations/firebase-chatapp";
import Message from "./Message";
import SendMessage from "./SendMessage";
import { Typography } from 'antd';


// Title: React-Chat
// Author: Timonwa Akintokun
// Date: 13 July, 2023
// Availability: https://github.com/Timonwa/react-chat

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const scroll = useRef();

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessages(sortedMessages);

      // Scroll to the bottom of the chat box
      setTimeout(() => {
        if (scroll.current) {
          scroll.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 0);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="chat-box" style={{ height: '100%' }}>
      <Typography.Text
        style={{
          fontFamily: 'Calibri',
          fontSize: '200%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        Group Chat
      </Typography.Text>
      <div className="messages-wrapper">
        {messages && messages.length > 0 ? (
          messages.map((message) => <Message key={message.id} message={message} />)
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography.Text style={{ fontFamily: 'Calibri', fontSize: '200%' }}>No messages found.</Typography.Text>
          </div>
        )}
      </div>
      <span ref={scroll}></span>
      <SendMessage scroll={scroll} messagesLength={messages.length} />
    </main>
  );
};

export default ChatBox;