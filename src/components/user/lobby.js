import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../NavBar';
const GameList = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [gameStatusFilter, setGameStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage] = useState(10);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      // Fetch the list of games from the server
      const response = await fetch('https://zd6ooaabbe.execute-api.us-east-1.amazonaws.com/games/get');
      if (response.ok) {
        const data = await response.json();
        setGames(data);
        setGameStatusFilter('available'); // Default filter by 'available' games
        setFilteredGames(data); // Initially display all games
      } else {
        throw new Error('Failed to fetch games');
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const filterGames = () => {
    // Apply filters to the games based on user selections
    let filtered = games;

    if (categoryFilter !== '') {
      filtered = filtered.filter((game) => game.category === categoryFilter);
    }

    if (difficultyFilter !== '') {
      filtered = filtered.filter((game) => game.difficulty === difficultyFilter);
    }

    if (searchQuery !== '') {
      // Perform a case-insensitive search on the game name, category, and difficulty
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (game) =>
          game.name.toLowerCase().includes(query) ||
          game.category.toLowerCase().includes(query) ||
          game.difficulty.toLowerCase().includes(query)
      );
    }

    if (gameStatusFilter !== '') {
      // Filter games based on their start and end time
      const currentTime = new Date().getTime();
      filtered = filtered.filter((game) => {
        const startTime = new Date(game.starttime).getTime();
        const endTime = new Date(game.endtime).getTime();

        if (gameStatusFilter === 'available') {
          return startTime > currentTime;
        } else if (gameStatusFilter === 'inProgress') {
          return startTime <= currentTime && currentTime <= endTime;
        } else if (gameStatusFilter === 'ended') {
          return endTime < currentTime;
        }

        return true;
      });
    }
    setFilteredGames(filtered);
  };

  useEffect(() => {
    // Trigger filtering of games whenever filter options change
    filterGames();
  }, [categoryFilter, difficultyFilter, searchQuery, gameStatusFilter]);

  const joinGame = (gameId) => {
    // Navigate to the game details page when joining a game
    console.log(`Joining game with ID: ${gameId}`);
    navigate(`/gamedetails/${gameId}`);
  };

  const viewDetails = (gameId) => {
    navigate(`/playedgamedetails/${gameId}`);
  };

  const isGameInProgress = (startTime, endTime) => {
    // Check if the game is currently in progress based on its start and end time
    const currentTime = new Date();
    const startDate = new Date(startTime);

    return startDate >= currentTime;
  };

  // Pagination logic
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

  const handlePageChange = (pageNumber) => {
    // Update the current page when the user changes the page
    setCurrentPage(pageNumber);
  };


  return (
    <div className="container">
      <Navbar />
      <h2 className="display-6">Game List</h2>
      <div className="row">
        <div className="col-md-6 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-3">
          <select
            className="form-control"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {games
              .map((game) => game.category)
              .filter((category, index, self) => self.indexOf(category) === index)
              .map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <div className="form-group">
            <select
              className="form-control"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <select
            className="form-control"
            value={gameStatusFilter}
            onChange={(e) => setGameStatusFilter(e.target.value)}
          >
            <option value="">All Games</option>
            <option value="available">Available Games</option>
            <option value="inProgress">In Progress Games</option>
            <option value="ended">Ended Games</option>
          </select>
        </div>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Difficulty</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Game Status</th>
          </tr>
        </thead>
        <tbody>
          {currentGames.map((game) => (
            <tr key={game.id}>
              <td>{game.name}</td>
              <td>{game.category}</td>
              <td>{game.difficulty}</td>
              <td>{game.starttime}</td>
              <td>{game.endtime}</td>
              <td>
                {isGameInProgress(game.starttime, game.endtime) ? (
                  <button
                    className="btn btn-outline-success"
                    onClick={() => joinGame(game.id)}
                  >
                    Join Game
                  </button>
                ) : (
                  <span>
                    {new Date(game.endtime) < new Date() ? <button
                      className="btn btn-outline-secondary"
                      onClick={() => viewDetails(game.id)}
                    >
                      View Details
                    </button> : 'Game in progress'}
                  </span>
                )}
              </td>
              <td>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }).map((_, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(index + 1)}
                disabled={currentPage === index + 1}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default GameList;
