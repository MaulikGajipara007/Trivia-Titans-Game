import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GameList = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]); 
  const [questionDescriptions, setQuestionDescriptions] = useState({}); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filterCategory, setFilterCategory] = useState(''); 
  const [filterDifficulty, setFilterDifficulty] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [gamesPerPage] = useState(10); // Number of games to display per page

  useEffect(() => {
    fetchGames(); 
  }, []);

  const fetchGames = async () => {
    try {
      // Fetch the list of games from the API
      const response = await fetch('https://zd6ooaabbe.execute-api.us-east-1.amazonaws.com/games/get');
      if (response.ok) {
        const data = await response.json();
        setGames(data); // Update the state with the fetched games
      } else {
        throw new Error('Failed to fetch games');
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const deleteGame = async (gameId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this game?');
    if (confirmDelete) {
      try {
        // Delete the game using the API
        const response = await fetch(`https://zd6ooaabbe.execute-api.us-east-1.amazonaws.com/games/delete/${gameId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setGames(games.filter((game) => game.id !== gameId));
          toast.success('Game deleted successfully');
        } else {
          throw new Error('Failed to delete game');
        }
      } catch (error) {
        console.error('Error deleting game:', error);
        toast.error('Failed to delete game');
      }
    }
  };

  const fetchQuestionDescriptions = async (questionIds) => {
    const descriptions = {};
    for (const questionId of questionIds) {
      try {
        // Fetch the description for each question using the questionId from the API
        const response = await fetch(`https://zd6ooaabbe.execute-api.us-east-1.amazonaws.com/questions/${questionId}`);
        if (response.ok) {
          const data = await response.json();
          descriptions[questionId] = data.description; // Store the description in the 'descriptions' object
        } else {
          throw new Error(`Failed to fetch description for question ${questionId}`);
        }
      } catch (error) {
        console.error(`Error fetching description for question ${questionId}:`, error);
        descriptions[questionId] = ''; // Set an empty description if there was an error fetching it
      }
    }
    setQuestionDescriptions(descriptions); // Update the state with the question descriptions
  };

  const editGame = async (gameId) => {
    navigate(`/editgame/${gameId}`); // Navigate to the edit game page for the selected game
  };

  useEffect(() => {
    const questionIds = games.flatMap((game) => game.questions);
    fetchQuestionDescriptions(questionIds); // Fetch question descriptions when the 'games' state updates
  }, [games]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // Update the search term when the user types in the search input
  };

  const handleCategoryFilter = (event) => {
    setFilterCategory(event.target.value); // Update the category filter when the user selects a category
  };

  const handleDifficultyFilter = (event) => {
    setFilterDifficulty(event.target.value); // Update the difficulty filter when the user selects a difficulty
  };

  const filteredGames = games.filter((game) => {
    // Filter games based on search term, category filter, and difficulty filter
    const nameMatches = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatches = filterCategory ? game.category === filterCategory : true;
    const difficultyMatches = filterDifficulty ? game.difficulty === filterDifficulty : true;
    return nameMatches && categoryMatches && difficultyMatches;
  });

  // Pagination logic
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h2 className="display-6">Game List</h2>
      <div className="filter-options d-flex align-items-center">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <select value={filterCategory} onChange={handleCategoryFilter} className="form-control">
            <option value="">All Categories</option>
            {games.map((game) => (
              <option key={game.category} value={game.category}>
                {game.category}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-control"
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Difficulty</th>
            <th>Questions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentGames.map((game) => (
            <tr key={game.id}>
              <td>{game.name}</td>
              <td>{game.category}</td>
              <td>{game.difficulty}</td>
              <td>
                <ul className="question-list">
                  {game.questions.map((questionId) => (
                    <li key={questionId}>{questionDescriptions[questionId]}</li>
                  ))}
                </ul>
              </td>
              <td>
                <div className="d-flex">
                  <button className="btn btn-primary" onClick={() => editGame(game.id)}>
                    Edit
                  </button>
                  <button className="btn btn-danger mx-2" onClick={() => deleteGame(game.id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage - 1)}>
              Previous
            </button>
          </li>
          {Array.from({ length: Math.ceil(filteredGames.length / gamesPerPage) }).map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === Math.ceil(filteredGames.length / gamesPerPage) ? 'disabled' : ''
            }`}
          >
            <button className="page-link" onClick={() => paginate(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
      <ToastContainer />
    </div>
  );
};

export default GameList;
