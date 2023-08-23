import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GameCreationForm = () => {
  const navigate = useNavigate();

  // State variables for form inputs
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [starttime, setStartTime] = useState('');
  const [endtime, setEndTime] = useState('');
  const [description, setDescription] = useState('');

  // Function to handle form submission and create the game
  const createGame = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Validation: Check if the start time is less than the end time
    const startDate = new Date(starttime);
    const endDate = new Date(endtime);
    if (startDate >= endDate) {
      toast.error('Start time should be less than end time');
      return;
    }

    try {
      // Create the game data to be sent in the POST request
      const body = {
        name,
        difficulty,
        category,
        timeframe,
        starttime,
        endtime,
        description,
      };

      // Send a POST request to create the game using the API
      const response = await fetch('https://zd6ooaabbe.execute-api.us-east-1.amazonaws.com/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        const gameId = data.id;
        toast.success('Game created successfully');
        navigate(`/addquestions/${gameId}`);
      } else {
        throw new Error('Failed to create game');
      }
    } catch (error) {
      console.error('Error creating game:', error);
      toast.error('Failed to create game');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card w-50">
        <div className="card-body">
          <h2 className="card-title display-6">Create Game</h2>
          <form onSubmit={createGame}>
            <div className="form-group mb-3">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Difficulty level:</label>
              <select
                id="difficulty"
                className="form-control"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                required
              >
                <option value="">Select difficulty level</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <input
                type="text"
                id="category"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="timeframe">Time Frame: (Per question in secs)</label>
              <input
                type="text"
                id="timeframe"
                className="form-control"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="starttime">Start Time:</label>
              <input
                type="datetime-local"
                id="starttime"
                className="form-control"
                value={starttime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endtime">End Time:</label>
              <input
                type="datetime-local"
                id="endtime"
                className="form-control"
                value={endtime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary my-2">
              Next
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default GameCreationForm;
