import React from 'react';
import Question from '../components/InGame/Question';
import '../Page/css/InGame.css';
import ChatBox from '../components/InGame/Chatbox';
import { Row, Col } from 'antd';
import NavBar from '../components/NavBar';

const InGame = () => {
  
  return (
    <div>
      <NavBar />
      <Row style={{ height: 'calc(100vh - 50px)' }}>
        <Col span={8} style={{ height: '100%', overflow: 'scroll', overflowX: 'hidden' }}>
          <ChatBox></ChatBox>
        </Col>
        <Col span={16} style={{ height: '100%' }}>
          <Question />
        </Col>
      </Row>
    </div>
  );
};

export default InGame;
