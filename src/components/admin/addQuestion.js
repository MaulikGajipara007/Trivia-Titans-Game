import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddQuestionsPage = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [selectedGameId, setSelectedGameId] = useState(gameId);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10); // Number of questions to display per page

  useEffect(() => {
    fetchAvailableQuestions();
  }, []);
  // Fetch available questions from the server
  const fetchAvailableQuestions = async () => {
    try {
      const response = await fetch('https://zd6ooaabbe.execute-api.us-east-1.amazonaws.com/questions');
      if (response.ok) {
        const data = await response.json();
        setAvailableQuestions(data.questions);
      } else {
        throw new Error('Failed to fetch questions');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
  // Filter search box
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter category
  const handleCategoryFilter = (e) => {
    setFilterCategory(e.target.value);
  };

  // Filter difficulty
  const handleDifficultyFilter = (e) => {
    setFilterDifficulty(e.target.value);
  };

  // Combination of filters
  const filteredQuestions = availableQuestions.filter((question) => {
    const matchesSearchTerm = question.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoryFilter = filterCategory ? question.category === filterCategory : true;
    const matchesDifficultyFilter = filterDifficulty ? question.difficulty === filterDifficulty : true;
    return matchesSearchTerm && matchesCategoryFilter && matchesDifficultyFilter;
  });
  const uniqueCategories = [...new Set(availableQuestions.map((question) => question.category))];

  //Toogle questions
  const handleQuestionToggle = (questionId) => {
    const updatedSelectedQuestions = [...selectedQuestions];
    const questionIndex = updatedSelectedQuestions.indexOf(questionId);
    if (questionIndex !== -1) {
      updatedSelectedQuestions.splice(questionIndex, 1);
    } else {
      updatedSelectedQuestions.push(questionId);
    }
    setSelectedQuestions(updatedSelectedQuestions);
  };

  //add questions
  const addQuestionsToGame = async () => {
    try {
      const response = await fetch(`https://zd6ooaabbe.execute-api.us-east-1.amazonaws.com/games/addedquestions/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionIds: selectedQuestions,
        }),
      });

      if (response.ok) {
        toast.success('Questions added to the game successfully');
        // Clear the selected questions
        setSelectedQuestions([]);
        navigate('/admin/gamedetails');
      } else {
        throw new Error('Failed to add questions to the game');
      }
    } catch (error) {
      console.error('Error adding questions to the game:', error);
      toast.error('Failed to add questions to the game');
    }
  };

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h2 className="display-6">Add Questions</h2>
      <div>
        <h4>Available Questions:</h4>
        <div className="row filter-options">
          <div className="col-md-4">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <select
                className="form-control"
                value={filterCategory}
                onChange={handleCategoryFilter}
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <select
                className="form-control"
                value={filterDifficulty}
                onChange={handleDifficultyFilter}
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>
        <table className="table question-table">
          <thead className="thead-dark">
            <tr>
              <th>Description</th>
              <th>Option 1</th>
              <th>Option 2</th>
              <th>Option 3</th>
              <th>Answer</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {currentQuestions.map((question) => (
              <tr key={question.id}>
                <td>{question.description}</td>
                <td>{question.option1}</td>
                <td>{question.option2}</td>
                <td>{question.option3}</td>
                <td>{question.answer}</td>
                <td>{question.category}</td>
                <td>{question.difficulty}</td>
                <td>
                  <div className="form-group">
                    <div className="form-switch">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`questionToggle${question.id}`}
                        checked={selectedQuestions.includes(question.id)}
                        onChange={() => handleQuestionToggle(question.id)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`questionToggle${question.id}`}
                      ></label>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage - 1)}>
              Previous
            </button>
          </li>
          {Array.from({ length: Math.ceil(filteredQuestions.length / questionsPerPage) }).map(
            (_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => paginate(index + 1)}>
                  {index + 1}
                </button>
              </li>
            )
          )}
          <li
            className={`page-item ${
              currentPage === Math.ceil(filteredQuestions.length / questionsPerPage)
                ? 'disabled'
                : ''
            }`}
          >
            <button className="page-link" onClick={() => paginate(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
      <button type="button" className="btn btn-primary" onClick={addQuestionsToGame}>
        Add Questions to Game
      </button>
      <ToastContainer />
    </div>
  );
};

export default AddQuestionsPage;
