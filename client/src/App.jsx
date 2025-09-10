import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import HomePage from "./pages/HomePage";
import BlogAddPage from "./pages/BlogAddPages";
import TournamentMatch from "./components/TournamentMatch";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blog-add-page" element={<BlogAddPage />} />
        <Route path="/tournament" element={<TournamentMatch />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
