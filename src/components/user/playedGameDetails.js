import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PlayedGameDetailsPage = () => {
    const navigate = useNavigate();
    const { gameId } = useParams();
    const [game, setGame] = useState(null);
    const [questionDescriptions, setQuestionDescriptions] = useState({});
    const [questionAnswers, setQuestionAnswers] = useState({});
  
    useEffect(() => {
      fetchGameDetails();
    }, []);
  
    const fetchGameDetails = async () => {
      try {
        // Fetch game details from the server
        const response = await fetch(`https://zd6ooaabbe.execute-api.us-east-1.amazonaws.com/gameget/${gameId}`);
        if (response.ok) {
          const data = await response.json();
          setGame(data);
          fetchQuestionDescriptions(data.questions);
        } else {
          throw new Error('Failed to fetch game details');
        }
      } catch (error) {
        console.error('Error fetching game details:', error);
      }
    };
  
    const fetchQuestionDescriptions = async (questionIds) => {
      // Fetch question descriptions and answers for the game
      const descriptions = {};
      const answers = {};
      for (const questionId of questionIds) {
        try {
          const response = await fetch(`https://zd6ooaabbe.execute-api.us-east-1.amazonaws.com/questions/${questionId}`);
          if (response.ok) {
            const data = await response.json();
            descriptions[questionId] = data.description;
            answers[questionId] = data.answer;
          } else {
            throw new Error(`Failed to fetch description for question ${questionId}`);
          }
        } catch (error) {
          console.error(`Error fetching description for question ${questionId}:`, error);
          descriptions[questionId] = '';
        }
      }
      setQuestionDescriptions(descriptions);
      setQuestionAnswers(answers);
    };
  
    const navigateToLobby = () => {
      navigate('/games');
    };
  
    if (!game) {
      return <div>Loading game details...</div>;
    }

  const { name, category, difficulty, description, questions } = game;

  return (
    <div className="container">
      <h2 className="display-6">Played Game Details</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Name: {name}</h5>
          <p className="card-text">Category: {category}</p>
          <p className="card-text">Difficulty: {difficulty}</p>
          <p className="card-text">Description: {description}</p>
        </div>
      </div>
      <div className="mt-4">
        <h3>Questions:</h3>
        <ul>
          {questions.map((questionId, index) => (
            <li key={index}>
              <strong>Question {index + 1}: </strong>
              {questionDescriptions[questionId] || 'Loading question description...'}
              <br />
              <strong>Answer: </strong>
              {questionAnswers[questionId] || 'Loading answer...'}
            </li>
          ))}
        </ul>
      </div>
      <button className="btn btn-secondary mt-3" onClick={navigateToLobby}>
        Back to Lobby
      </button>
      <ToastContainer />
    </div>
  );
};

export default PlayedGameDetailsPage;
