import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GameEditForm = () => {
  // Get the gameId from the URL parameters and set up state variables
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [starttime, setStartTime] = useState('');
  const [endtime, setEndTime] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchGameDetails();
  }, []);

  // Format the date-time input
  const formatDateTimeInput = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toISOString().slice(0, 16);
  };

  const fetchGameDetails = async () => {
    try {
      // Fetch game details from the API using the gameId
      const response = await fetch(`https://zd6ooaabbe.execute-api.us-east-1.amazonaws.com/gameget/${gameId}`);
      if (response.ok) {
        const data = await response.json();
        // Extract and parse the game details
        const { name, difficulty, category, timeframe, starttime, endtime, description } = data;
        const parsedStartTime = new Date(starttime);
        const parsedEndTime = new Date(endtime);
        const localOffset = parsedStartTime.getTimezoneOffset() * 60000; 
        const localStartTime = new Date(parsedStartTime.getTime() - localOffset);
        const localEndTime = new Date(parsedEndTime.getTime() - localOffset);
        // Update the state variables with the fetched data
        setName(name);
        setDifficulty(difficulty);
        setCategory(category);
        setTimeframe(timeframe);
        setStartTime(formatDateTimeInput(localStartTime));
        setEndTime(formatDateTimeInput(localEndTime));
        setDescription(description);
      } else {
        // Handle the error if fetching game details fails
        throw new Error('Failed to fetch game details');
      }
    } catch (error) {
      console.error('Error fetching game details:', error);
      toast.error('Failed to fetch game details');
    }
  };

  const updateGame = async (event) => {
    event.preventDefault();

    // Validation: Check if the start time is less than the end time
    const startDate = new Date(starttime);
    const endDate = new Date(endtime);
    if (startDate >= endDate) {
      toast.error('Start time should be less than end time');
      return;
    }

    try {
      // Update the game details using the API
      const response = await fetch(`https://zd6ooaabbe.execute-api.us-east-1.amazonaws.com/games/edit/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          difficulty,
          category,
          timeframe,
          starttime,
          endtime,
          description,
        }),
      });

      if (response.ok) {
        // If the update is successful, show a success message and navigate to the next page
        toast.success('Game updated successfully');
        navigate(`/editgamequestion/${gameId}`);
      } else {
        // Handle the error if updating the game fails
        throw new Error('Failed to update game');
      }
    } catch (error) {
      console.error('Error updating game:', error);
      toast.error('Failed to update game');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card w-50">
        <div className="card-body">
          <h2 className="card-title display-6">Edit Game</h2>
          <form onSubmit={updateGame}>
            <div className="form-group">
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

export default GameEditForm;
