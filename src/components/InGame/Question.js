import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Typography, List, Modal, Button } from 'antd';
import { Statistic } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import WebSocketComponent from './WebSocketComponent';
import { fetchDataFromServer, updateQuizPlayedData, updateScore } from './apiCalls';
import { useNavigate } from "react-router-dom";
import { ClockCircleOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { query, collection, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../../Configurations/firebase-chatapp";

const { Title } = Typography;


const Question = () => {
    const navigate = useNavigate();

    const { quizID } = useParams();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionList, setQuestionList] = useState([]);
    const [quizCategory, setQuizCategory] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    const [difficulty, setDifficulty] = useState('');

    const [question, setQuestion] = useState('');
    const [currentQuestionTime, setCurrentQuestionTime] = useState(0);
    const [options, setOptions] = useState([]);
    const [answer, setAnswer] = useState('');
    const [explaination, setExplaination] = useState('');
    const [hint, setHint] = useState('');

    const [startTime, setStartTime] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isTimerExpired, setIsTimerExpired] = useState(false);

    const [teamScore, setTeamScore] = useState(0);
    const [myScore, setMyScore] = useState(0);
    const teamScoreRef = useRef(teamScore);
    const myScoreRef = useRef(myScore);

    const [modal, contextHolder] = Modal.useModal();
    const [loading, setLoading] = useState(false);

    const { Countdown } = Statistic;
    const webSocketRef = useRef(null);


    useEffect(() => {
        const fetchQuizData = async (quizID) => {
            const jsonData = await fetchDataFromServer(quizID);
            return jsonData;
        };

        const fetchData = async () => {
            try {
                setLoading(true);
                const jsonData = await fetchQuizData(quizID);
                setLoading(false);
                if (jsonData.statusCode === 200) {
                    setQuestionList(jsonData.data.questionList);
                    setCreatedDate(jsonData.data?.createdDate);
                    setDifficulty(jsonData.data.difficulty);
                    setQuizCategory(jsonData.data.category);
                } else {
                    Modal.error({
                        title: 'Unable to fetch quiz.'
                    });
                }
            } catch (error) {
                console.error("Error fetching quiz data:", error);
                Modal.error({
                    title: 'Error',
                    content: 'An error occurred while fetching the quiz data.'
                });
            }
        };

        fetchData();
        setStartTime(new Date());
    }, [quizID]);

    // Update the current question data whenever the currentQuestionIndex changes
    useEffect(() => {
        const currentQuestion = questionList[currentQuestionIndex];
        if (currentQuestion) {
            setQuestion(currentQuestion.question);
            setOptions(currentQuestion.options);
            setAnswer(currentQuestion.answer);
            setHint(currentQuestion.hint);
            setExplaination(currentQuestion.explanation);
            setCurrentQuestionTime(questionList[currentQuestionIndex]?.time || 0);
        }
    }, [questionList, currentQuestionIndex]);

    //Modal to notify user of correct answer and explainations
    const showHints = () => {
        Modal.info({
            title: `Hint`,
            content: `${hint}`,
        });
    };

    //Modal to notify user of correct answer and explainations
    const handleShowHint = () => {
        showHints();
        if (webSocketRef.current) {
            webSocketRef.current.sendMessage({ "action": "hint", "message": hint }); //TODO:TeamID
        }
    };

    //Modal to notify user of correct answer and explainations
    const showAnswer = (option) => {
        let secondsToGo = 5;
        let instance = null;
        if (option === answer) {
            instance = modal.success({
                title: `Correct Answer is ${answer}`,
                content: `${explaination}`,
                okButtonProps: { disabled: true },
            });
        } else {
            instance = modal.error({
                title: `Correct Answer is ${answer}`,
                content: `${explaination}`,
                okButtonProps: { disabled: true },
            });

        }
        const timer = setInterval(() => {
            secondsToGo -= 1;
        }, 1000);
        setTimeout(() => {
            clearInterval(timer);
            instance.destroy();
            nextQuestion();
        }, secondsToGo * 1000);
    };

    //If the question timer is up
    const onFinish = () => {
        setIsTimerExpired(true);
        setCurrentQuestionTime(0);
        showAnswer();
    };

    // deletes group chat messages on game end
    const deleteChat = async () => {
        const q = query(collection(db, "messages"));

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            deleteDoc(doc.ref)
                .then(() => {
                    //   console.log("Document successfully deleted!");
                })
                .catch((error) => {
                    console.error("Error removing document: ", error);
                });
        });
    };



    //Move to next question once timer is up or question is answered, update database
    const nextQuestion = () => {
        setIsTimerExpired(false);
        setSelectedOption(null);
        setCurrentQuestionTime(0);

        if (currentQuestionIndex + 1 < questionList.length) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            setIsTimerExpired(true);
            Modal.info({
                title: 'Quiz Finished.'
            });
            updateScore(myScoreRef.current, teamScoreRef.current, quizID, difficulty, createdDate, quizCategory, questionList.length);

            if (localStorage.getItem("teamOwnerEmail") === localStorage.getItem("email")) {
                updateQuizPlayedData(quizID, teamScoreRef.current, startTime, difficulty, createdDate, quizCategory, questionList.length);
            }
            navigate("/reportAnalytics");

            deleteChat();
        }
    };

    // sync answers for all other users if THIS player answers
    const handleOptionClick = option => {
        if (!isTimerExpired) {
            setSelectedOption(option);
            setIsTimerExpired(true);
            if (webSocketRef.current) {
                webSocketRef.current.sendMessage({ "action": "sync", "message": option });
            }
            if (option === answer) {
                setTeamScore(prevScore => {
                    teamScoreRef.current = prevScore + 10;
                    return teamScoreRef.current;
                });
                setMyScore(prevScore => {
                    myScoreRef.current = prevScore + 10;
                    return myScoreRef.current;
                });
            }
            setCurrentQuestionTime(0);
            showAnswer(option);
        }
    };

    // sync answers for this user if other player answers
    const handleReceiveData = data => {
        if (data.action === 'sync') {
            if (!isTimerExpired) {
                setSelectedOption(data.message);
                setIsTimerExpired(true);
                showAnswer(data.message);
                if (selectedOption === answer) {
                    setTeamScore(prevScore => prevScore + 10);
                }
            }
        } else if (data.action === 'hint') {
            showHints();
        }
    };

    return (
        <div>
            <Row style={{ marginBottom: '20px' }} justify="space-between" align="middle">
                <Col>
                    <Button
                        type="primary"
                        style={{
                            backgroundColor: '#023467',
                            marginLeft: '15%',
                            // marginTop: '%',
                        }}
                        icon={<QuestionCircleOutlined />}
                        onClick={handleShowHint}>
                        Get Hint
                    </Button>
                </Col>
                <Col >
                    <Title level={4}
                        style={{
                            fontFamily: 'Calibri',
                            marginTop: '24%'
                        }}>
                        Your Score: {teamScore}
                    </Title>
                </Col>
                <Col >
                    <div className="clock-countdown"
                        style={{
                            marginTop: '10%',
                        }}
                    >
                        <div className="clock-icon">
                            <ClockCircleOutlined style={{ fontSize: '130%' }} />
                        </div>
                        <Countdown value={Date.now() + 1000 * currentQuestionTime} onFinish={onFinish} format="mm:ss" />
                    </div>
                </Col>
            </Row>
            <Row justify="center" style={{ marginBottom: '20px' }}>
                <Col>
                    <Title copyable='true' level={3} style={{ fontFamily: 'Calibri' }}>{question}</Title>
                </Col>
            </Row>
            <Row justify="center">
                <Col span={12}>
                    {loading && <Spin size="large" tip="Fetching quiz data..." />}
                    <List
                        dataSource={options}
                        renderItem={option => (
                            <List.Item>
                                <div
                                    className={`option ${selectedOption === option ? selectedOption === answer ? 'correct' : 'incorrect' : ''}`}
                                    onClick={() => handleOptionClick(option)}
                                    style={{
                                        width: '100%',
                                        height: '60px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        fontFamily: 'Calibri',
                                        transition: 'background-color 0.3s ease',
                                        cursor: isTimerExpired ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <Typography.Text>{option}</Typography.Text>
                                </div>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
            <WebSocketComponent ref={webSocketRef} notifications={handleReceiveData} />
            {contextHolder}
        </div>
    );
};

export default Question;
