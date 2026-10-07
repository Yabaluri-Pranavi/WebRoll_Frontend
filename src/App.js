import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() {
    return (
        <div>
            <h2>WebRoll - Attendance Management System</h2>
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

            </Routes>
        </BrowserRouter>
    );
}

export default App;