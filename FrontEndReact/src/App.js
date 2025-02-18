import "./css/App.css";
import "./css/Props.css";
import "./css/Icons.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar2 from "./components/Navbar2";
import HomePage from "./Pages/HomePage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import NotFoundPage from "./Pages/NotFoundPage";
import MyLearningPage from "./Pages/MyLearningPage";
import TeacherMainPage from "./Pages/TeacherMainPage";
import ExamPage from "./Pages/ExamPage";
import CourseDetails from "./Pages/CourseDetails";
import CartPage from "./Pages/CartPage";
import TeacherModuleManagementPage from './Pages/TeacherModuleManagementPage';
import TeacherCourseManagementPage from './Pages/TeacherCourseManagementPage';
import WishlistPage from "./Pages/WishlistPage";
import CourseContentPage from "./Pages/CourseContentPage";

function App() {
  const current_theme = localStorage.getItem("current_theme");
  const [theme, setTheme] = useState(current_theme ? current_theme : "dark");

  useEffect(() => {
    localStorage.setItem("current_theme", theme);
  }, [theme]);

  return (
    <Router>
      <div className={`container ${theme}`}>
        {/* Navbar sempre presente */}
        <Navbar2 theme={theme} setTheme={setTheme} />

        {/* Área das páginas */}
        <div className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/mylearning" element={<MyLearningPage />} />
            <Route path="/coursepage/:id" element={<CourseDetails />} />
            <Route path="/teachermain" element={<TeacherMainPage />} />
            <Route path="/exampage" element={<ExamPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/teachercoursemanagement" element={<TeacherCourseManagementPage />} />
            <Route path="/teachermodulemanagement" element={<TeacherModuleManagementPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/coursecontent/:id" element={<CourseContentPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
