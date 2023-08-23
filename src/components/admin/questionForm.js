import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


const QuestionForm = ({ onSubmit }) => {
  const [description, setDescription] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [explanation, setExplanation] = useState('');
  const [hint, setHint] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation: Check if any required fields are empty
    const errors = {};
    if (!description.trim()) {
      errors.description = 'Description is required';
    }
    if (!option1.trim()) {
      errors.option1 = 'Option 1 is required';
    }
    if (!option2.trim()) {
      errors.option2 = 'Option 2 is required';
    }
    if (!option3.trim()) {
      errors.option3 = 'Option 3 is required';
    }
    if (!answer.trim()) {
      errors.answer = 'Answer is required';
    }
    if (!category.trim()) {
      errors.category = 'Category is required';
    }
    if (!difficulty.trim()) {
      errors.difficulty = 'Difficulty is required';
    }
    if (!explanation.trim()) {
      errors.explanation = 'Explanation is required';
    }
    if (!hint.trim()) {
      errors.hint = 'Hint is required';
    }

    // Create the question data to be sent in the POST request
    const newQuestion = {
      description,
      option1,
      option2,
      option3,
      answer,
      category,
      difficulty,
      explanation,
      hint,
      questiontag: '', // Initialize category as an empty string for now
    };

    const payload = {
      text: description,
    };

    try {
      const response = await axios.post('https://us-central1-serverless-project-sdp36.cloudfunctions.net/question-tag-automatic', payload);
      console.log(response.data.category);

      // Once you get the category from the response, update the newQuestion object
      newQuestion.questiontag = response.data.category;

      console.log('New Question:', newQuestion); // Print the newQuestion object before sending

      // Send a POST request to add the new question using the API
      try {
        const response = await fetch('https://zd6ooaabbe.execute-api.us-east-1.amazonaws.com/questions/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newQuestion),
        });

        if (response.ok) {
          toast.success('Question added successfully');
          setDescription('');
          setOption1('');
          setOption2('');
          setOption3('');
          setAnswer('');
          setCategory('');
          setDifficulty('');
          setExplanation('');
          setHint('');
          navigate('/questions')
        } else {
          throw new Error('Failed to add question');
        }
      } catch (error) {
        console.error('Error adding question:', error);
        toast.error('Failed to add question');
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card w-50">
        <div className="card-body">
          <h3 className="card-title text-center">Add Question</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Question"
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                value={option1}
                onChange={(e) => setOption1(e.target.value)}
                placeholder="Option 1"
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                value={option2}
                onChange={(e) => setOption2(e.target.value)}
                placeholder="Option 2"
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                value={option3}
                onChange={(e) => setOption3(e.target.value)}
                placeholder="Option 3"
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Answer"
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
                required
              />
            </div>
            <div className="form-group mb-3">
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
            <div className="form-group mb-3">
              <textarea
                className="form-control"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explanation"
                required
              />
            </div>
            <div className="form-group mb-3">
              <textarea
                className="form-control"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                placeholder="Hint"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Question</button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
      );
};

export default QuestionForm;
