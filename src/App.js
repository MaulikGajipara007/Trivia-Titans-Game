import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuestionForm from "./components/admin/questionForm";
import GameForm from "./components/admin/gameForm";
import AddQuestionFrom from "./components/admin/addQuestion";
import GameList from "./components/user/lobby";
import GameDetailsPage from "./components/user/gameDetails";
import QuestionList from "./components/admin/viewQuestions";
import EditQuestionPage from "./components/admin/editQuestion";
import GameDetailsPageAdmin from "./components/admin/gameDetails";
import EditGamePage from "./components/admin/editGame";
import EditGameQuestionPage from "./components/admin/editGameQuestion";
import AdminHomePage from "./components/admin/home";
import InGame from "./Page/InGame";
import DataStudioEmbed from "./components/InGame/DataStudioEmbed";
import Registration from "./components/user-authentication/Registration";
import VerifyUser from "./components/user-authentication/VerifyUser";
import Login from "./components/user-authentication/Login";
import ForgotPassword from "./components/user-authentication/ForgotPassword";
import ResetPassword from "./components/user-authentication/ResetPassword";
import Team from "./Page/MyTeam";
import Leaderboard from "./Page/Leaderboard";
import PlayedGameDetailsPage from "./components/user/playedGameDetails";
import GameStats from "./components/admin/gameStats.js";

import WebSocketComponent from "./components/InGame/WebSocketComponent";
import Main from "./components/user-profile/UserProfilePage";
import { ThemeProvider } from "@chakra-ui/react";
import { theme } from "./helpers";

const App = () => {
  const reportId =
    "https://lookerstudio.google.com/embed/reporting/7b6362bf-f191-4c25-8e46-e955b1447fc6/page/2rpXD";

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Router>
          <Routes>
            <Route path="/createquestion" element={<QuestionForm />} />
            <Route path="/creategame" element={<GameForm />} />
            <Route path="/addquestions/:gameId" element={<AddQuestionFrom />} />
            <Route path="/games" element={<GameList />} />
            <Route path="/gamedetails/:gameId" element={<GameDetailsPage />} />
            <Route path="/questions" element={<QuestionList />} />
            <Route
              path="/editquestions/:questionId"
              element={<EditQuestionPage />}
            />
            <Route
              path="/admin/gamedetails"
              element={<GameDetailsPageAdmin />}
            />
            <Route path="/editgame/:gameId" element={<EditGamePage />} />
            <Route
              path="/editgamequestion/:gameId"
              element={<EditGameQuestionPage />}
            />
            <Route path="/admin/home" element={<AdminHomePage />} />
            <Route path="/inGame/:quizID" element={<InGame />} />
            <Route
              path="/reportAnalytics"
              element={<DataStudioEmbed reportId={reportId} />}
            />
            <Route path="/user/register" element={<Registration />} />
            <Route path="/user/verify-email" element={<VerifyUser />} />
            <Route path="/user/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="user/forgot-password" element={<ForgotPassword />} />
            <Route path="/user/reset-password" element={<ResetPassword />} />
            <Route path="/myteam" element={<Team />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/inGame" element={<InGame />} />
            <Route path="/websocket" element={<WebSocketComponent />} />
            <Route
              path="/datastudiotest"
              element={<DataStudioEmbed reportId={reportId} />}
            />
            <Route path="user/profile" element={<Main />} />
            <Route path="/gamestats" element={<GameStats />} />
            <Route
              path="/playedgamedetails/:gameId"
              element={<PlayedGameDetailsPage />}
            />
            <Route
              path="/editquestions/:questionId"
              element={<EditQuestionPage />}
            />
            <Route
              path="/admin/gamedetails"
              element={<GameDetailsPageAdmin />}
            />
            <Route
              path="/editgamequestion/:gameId"
              element={<EditGameQuestionPage />}
            />
            <Route
              path="/reportAnalytics"
              element={<DataStudioEmbed reportId={reportId} />}
            />
            <Route path="/user/register" element={<Registration />} />
            <Route path="/user/verify-email" element={<VerifyUser />} />
            <Route path="/user/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="user/forgot-password" element={<ForgotPassword />} />
            <Route path="/user/reset-password" element={<ResetPassword />} />
          </Routes>
        </Router>
        <ToastContainer />
      </div>
    </ThemeProvider>
  );
};

export default App;
