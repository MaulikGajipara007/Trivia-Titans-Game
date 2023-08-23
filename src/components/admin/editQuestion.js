import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditQuestionPage = () => {
  // Get the questionId from the URL parameters and set up state variables
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [description, setDescription] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [explanation, setExplanation] = useState('');
  const [hint, setHint] = useState('');

  useEffect(() => {
    fetchQuestionDetails();
  }, []);

  const fetchQuestionDetails = async () => {
    try {
      // Fetch the question details from the API using the questionId
      const response = await fetch(`https://zd6ooaabbe.execute-api.us-east-1.amazonaws.com/questions/${questionId}`);
      if (response.ok) {
        const data = await response.json();
        // Set the state variables with the fetched question details
        setQuestion(data);
        setDescription(data.description);
        setOption1(data.option1);
        setOption2(data.option2);
        setOption3(data.option3);
        setAnswer(data.answer);
        setCategory(data.category);
        setDifficulty(data.difficulty);
        setExplanation(data.explanation);
        setHint(data.hint);
      } else {
        // Handle the error if fetching question details fails
        throw new Error('Failed to fetch question details');
      }
    } catch (error) {
      console.error('Error fetching question details:', error);
    }
  };

  const updateQuestion = async () => {
    try {
      // Update the question using the API
      const response = await fetch(`https://zd6ooaabbe.execute-api.us-east-1.amazonaws.com/questions/edit/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          option1,
          option2,
          option3,
          answer,
          category,
          difficulty,
          explanation,
          hint,
        }),
      });

      if (response.ok) {
        toast.success('Question updated successfully');
        navigate('/questions');
      } else {
        throw new Error('Failed to update question');
      }
    } catch (error) {
      console.error('Error updating question:', error);
      toast.error('Failed to update question');
    }
  };

  if (!question) {
    return <div>Loading question details...</div>;
  }

  return (
    <div className="container">
      <h2>Edit Question</h2>
      <form>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="option1">Option 1:</label>
          <input
            type="text"
            id="option1"
            className="form-control"
            value={option1}
            onChange={(e) => setOption1(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="option2">Option 2:</label>
          <input
            type="text"
            id="option2"
            className="form-control"
            value={option2}
            onChange={(e) => setOption2(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="option3">Option 3:</label>
          <input
            type="text"
            id="option3"
            className="form-control"
            value={option3}
            onChange={(e) => setOption3(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="answer">Answer:</label>
          <input
            type="text"
            id="answer"
            className="form-control"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
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
            <label htmlFor="category">Difficulty:</label>
              <select
                className="form-control"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
        </div>
        <div className="form-group">
          <label htmlFor="explanation">Explanation:</label>
          <textarea
            id="explanation"
            className="form-control"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="hint">Hint:</label>
          <input
            type="text"
            id="hint"
            className="form-control"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            required
          />
        </div>
        <button type="button" className="btn btn-primary my-2" onClick={updateQuestion}>
          Update Question
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditQuestionPage;
