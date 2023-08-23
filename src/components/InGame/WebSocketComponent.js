import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

const WebSocketComponent = ({ notifications }, ref) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      socketRef.current = new WebSocket('wss://qx114ctsrj.execute-api.us-east-1.amazonaws.com/production');

      socketRef.current.onopen = () => {
        console.log('WebSocket connection established.');
        if (localStorage.getItem("team_id")) {
          const initialMessage = { action: 'setTeam', team: localStorage.getItem("team_id") };
          socketRef.current.send(JSON.stringify(initialMessage));
        }
      };

      socketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Received WebSocket message:', message);
        notifications(message);
      };

      socketRef.current.onclose = () => {
        console.log('WebSocket connection closed.');
      };
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [notifications]);

  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.log('WebSocket connection is not open.');
    }
  };

  useImperativeHandle(ref, () => ({
    sendMessage,
  }));

  return <div></div>;
};

export default forwardRef(WebSocketComponent);
