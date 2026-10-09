
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";
import "./App.css";

function Home() {
  return (
    <div className="home">
      <p>SMART • SIMPLE • ORGANIZED</p>

      <h1>Welcome to WebRoll</h1>

      <p>Attendance management made easier. Sign in to continue to your portal.</p>

      <div className="login-options">
        <section>
          <h2>Student</h2>
          <p>View your attendance and attendance history.</p>
          <Link to="/login/student">Student Login</Link>
        </section>

        <section>
          <h2>Teacher</h2>
          <p>Manage classes and record student attendance.</p>
          <Link to="/login/teacher">Teacher Login</Link>
        </section>

        <section>
          <h2>Administrator</h2>
          <p>Manage users, subjects, and attendance records.</p>
          <Link to="/login/admin">Admin Login</Link>
        </section>
      </div>

      <footer>WebRoll Attendance Management System</footer>
    </div>
  );
}

function LoginPage({ role }) {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <h1>WebRoll</h1>
      <h2>{role} Login</h2>

      <form onSubmit={(e) => {
        e.preventDefault();
        alert("Login functionality will be added later.");
      }}>
        <p>
          <input type="text" placeholder="Username" required />
        </p>
        <p>
          <input type="password" placeholder="Password" required />
        </p>
        <button type="submit">Login</button>
      </form>

      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/student" element={<LoginPage role="Student" />} />
        <Route path="/login/teacher" element={<LoginPage role="Teacher" />} />
        <Route path="/login/admin" element={<LoginPage role="Admin" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
