import React from 'react';
import { Link } from 'react-router-dom';

const AdminHomePage = () => {
  return (
    <div className="container">
      <h1 className="mt-3 mb-4">Welcome to the Home Page</h1>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <img src="/hacker.png" className="card-img-top" alt="Game" style={{ height: '200px', width: '100%' }} />
            <div className="card-body">
              <h5 className="card-title">Create Game</h5>
              <p className="card-text">Create a new game for users to play.</p>
              <Link to="/creategame" className="btn btn-primary">
                Create Game
              </Link>
            </div>
          </div>

          <div className="card mb-4">
            <img src="/ques.png" className="card-img-top" alt="Question" style={{ height: '200px', width: '100%' }} />
            <div className="card-body">
              <h5 className="card-title">Create Question</h5>
              <p className="card-text">Create a new question for games.</p>
              <Link to="/createquestion" className="btn btn-primary">
                Create Question
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-4">
            <img src="/viewGames.png" className="card-img-top" alt="View Games" style={{ height: '200px', width: '100%' }} />
            <div className="card-body">
              <h5 className="card-title">View Games</h5>
              <p className="card-text">View and manage existing games.</p>
              <Link to="/admin/gamedetails" className="btn btn-primary">
                View Games
              </Link>
            </div>
          </div>

          <div className="card mb-4">
            <img src="/viewQues.png" className="card-img-top" alt="View Questions" style={{ height: '200px', width: '100%' }} />
            <div className="card-body">
              <h5 className="card-title">View Questions</h5>
              <p className="card-text">View and manage existing questions.</p>
              <Link to="/questions" className="btn btn-primary">
                View Questions
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <img src="/ana.png" className="card-img-top" alt="Monitor Data" style={{ height: '250px', width: '100%' }} />
        <div className="card-body">
          <h5 className="card-title">Monitor and Analyze Gameplay Data</h5>
          <p className="card-text">Monitor and analyze data related to gameplay and user engagement.</p>
          <Link to="/gamestats" className="btn btn-primary">
            Monitor Data
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
