import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GameDetailsPage = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    // When the component mounts or the game state updates, fetch the game details and calculate the remaining time
    if (game) {
      calculateRemainingTime();
    }
    fetchGameDetails();
  }, [game]);

  const fetchGameDetails = async () => {
    try {
      // Fetch the game details from the server using the gameId from the URL params
      const response = await fetch(`https://zd6ooaabbe.execute-api.us-east-1.amazonaws.com/gameget/${gameId}`);
      if (response.ok) {
        const data = await response.json();
        setGame(data);
        // Calculate the remaining time when game data is received
        calculateRemainingTime(data.starttime);
      } else {
        throw new Error('Failed to fetch game details');
      }
    } catch (error) {
      console.error('Error fetching game details:', error);
    }
  };

  const navigateToLobby = () => {
    // Navigate back to the game lobby
    navigate('/games');
  };

  if (!game) {
    // Display a loading message while waiting for game details
    return <div>Loading game details...</div>;
  }

  const { name, category, difficulty, starttime, endtime, description } = game;

  const isGameAvailable = new Date(starttime) > new Date();

  // Function to calculate the remaining time until the game starts
  const calculateRemainingTime = () => {
    const startTime = new Date(game.starttime).getTime();
    const currentTime = new Date().getTime();
    const remaining = Math.max(0, startTime - currentTime);

    if (remaining > 0) {
      // Format the remaining time into days, hours, minutes, and seconds
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      const formattedTime = [];
      if (days > 0) formattedTime.push(`${days}d`);
      if (hours > 0) formattedTime.push(`${hours}h`);
      if (minutes > 0) formattedTime.push(`${minutes}m`);
      if (seconds > 0) formattedTime.push(`${seconds}s`);

      setRemainingTime(formattedTime.join(' '));

      // Update the remaining time every second using setTimeout
      const timer = setTimeout(calculateRemainingTime, 1000);
      return () => clearTimeout(timer);
    } else {
      // When the game starts, navigate to the in-game page
      setRemainingTime('Game is starting...');
      navigate(`/inGame/${gameId}`);
    }
  };
  return (
    <div className="container">
      <h2 className="display-6">Game Details</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Name: {name}</h5>
          <p className="card-text">Category: {category}</p>
          <p className="card-text">Difficulty: {difficulty}</p>
          <p className="card-text">Description: {description}</p>
          <p className="card-text">Start Time: {starttime}</p>
          <p className="card-text">End Time: {endtime}</p>
          <p className="card-text">Stay on this page! The game is about to start in: {remainingTime}</p>
        </div>
      </div>
      <button className="btn btn-secondary mt-3" onClick={navigateToLobby}>
        Back to Lobby
      </button>
      <ToastContainer />
    </div>
  );
};

export default GameDetailsPage;
