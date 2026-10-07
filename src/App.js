import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <h1>WebRoll</h1>
            <h2>Attendance Management System</h2>

            <p>Select your login type</p>

            <div>
                <Link to="/teacher-login">
                    <button>Teacher Login</button>
                </Link>

                <Link to="/admin-login">
                    <button>Admin Login</button>
                </Link>

                <Link to="/student-login">
                    <button>Student Login</button>
                </Link>
            </div>
        </div>
    );
}

function LoginPage({ type }) {
    return (
        <div>
            <h2>{type} Login</h2>

            <input
                type="text"
                placeholder="Username"
            />

            <br />
            <br />

            <input
                type="password"
                placeholder="Password"
            />

            <br />
            <br />

            <button>Login</button>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/teacher-login"
                    element={<LoginPage type="Teacher" />}
                />

                <Route
                    path="/admin-login"
                    element={<LoginPage type="Admin" />}
                />

                <Route
                    path="/student-login"
                    element={<LoginPage type="Student" />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;