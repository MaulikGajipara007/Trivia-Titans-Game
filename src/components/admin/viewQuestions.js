import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10); // Number of questions to display per page
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    extractCategories();
  }, [questions]);

  useEffect(() => {
    applyFilters();
  }, [questions, searchTerm, selectedDifficulty, selectedCategory]);

  //Fetch questions
  const fetchQuestions = async () => {
    try {
      const response = await fetch('https://zd6ooaabbe.execute-api.us-east-1.amazonaws.com/questions');
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
      } else {
        throw new Error('Failed to fetch questions');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  //Extract categories
  const extractCategories = () => {
    const uniqueCategories = [...new Set(questions.map((question) => question.category))];
    setCategories(uniqueCategories);
  };

  const editQuestion = async (questionId) => {
    navigate(`/editquestions/${questionId}`);
  };

  //Handle delete function
  const deleteQuestion = async (questionId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this question?');
    if (confirmDelete) {
      try {
        const response = await fetch(`https://zd6ooaabbe.execute-api.us-east-1.amazonaws.com/questions/delete/${questionId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remove the question from the state
          setQuestions(questions.filter((question) => question.id !== questionId));
          toast.success('Question deleted successfully');
        } else {
          throw new Error('Failed to delete question');
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        toast.error('Failed to delete question');
      }
    }
  };

  const applyFilters = () => {
    let filteredData = questions;

    // Filter by difficulty
    if (selectedDifficulty) {
      filteredData = filteredData.filter((question) => question.difficulty === selectedDifficulty);
    }

    // Filter by category
    if (selectedCategory) {
      filteredData = filteredData.filter((question) => question.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filteredData = filteredData.filter((question) =>
        question.description.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    setFilteredQuestions(filteredData);
  };

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h2>Question List</h2>
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-control"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th>Description</th>
              <th>Option1</th>
              <th>Option2</th>
              <th>Option3</th>
              <th>Answer</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Explanation</th>
              <th>Hint</th>
              <th>Actions</th>
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
                <td>{question.explanation}</td>
                <td>{question.hint}</td>
                <td>
                  <div className="d-flex">
                    <button className="btn btn-primary" onClick={() => editQuestion(question.id)}>
                      Edit
                    </button>
                    <button className="btn btn-danger mx-2" onClick={() => deleteQuestion(question.id)}>
                      Delete
                    </button>
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
          {Array.from({ length: Math.ceil(filteredQuestions.length / questionsPerPage) }).map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === Math.ceil(filteredQuestions.length / questionsPerPage) ? 'disabled' : ''
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

export default QuestionList;
