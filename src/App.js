
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";

const API_URL = "http://localhost:8080/api/students";
const ATTENDANCE_URL = "http://localhost:8080/api/attendance";
const SUBJECT_URL = "http://localhost:8080/api/subjects";
const LOGIN_URL = "http://localhost:8080/api/auth/login";

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

      <p><Link to="/students">Manage Student Records</Link></p>
      <p><Link to="/attendance">Manage Attendance</Link></p>
      <p><Link to="/subjects">Manage Subjects</Link></p>

      <footer>WebRoll Attendance Management System</footer>
    </div>
  );
}

function LoginPage({ role }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Invalid username or password."
        );
      }

      if (
        !data.role ||
        data.role.toUpperCase() !== role.toUpperCase()
      ) {
        throw new Error("This account does not have the selected role.");
      }

      if (data.token) {
        localStorage.setItem("webrollToken", data.token);
      }

      localStorage.setItem("webrollRole", data.role);
      localStorage.setItem(
        "webrollUsername",
        data.username || username.trim()
      );

      if (role === "Admin") {
        navigate("/students");
      } else if (role === "Teacher") {
        navigate("/attendance");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error) {
      setMessage(
        error.message || "Could not connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <h1>WebRoll</h1>
      <h2>{role} Login</h2>

      <form onSubmit={handleLogin}>
        <p>
          <input
            type="text"
            placeholder={role === "Student" ? "Roll Number" : "Username"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </p>

        <p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </p>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {message && <p role="alert">{message}</p>}

      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}

function StudentDashboard() {
  const username = localStorage.getItem("webrollUsername");

  return (
    <div className="login-page">
      <h1>WebRoll</h1>
      <h2>Student Dashboard</h2>
      <p>Welcome, {username}!</p>
      <p>Your attendance dashboard will be connected to your own records.</p>
      <button onClick={() => {
        localStorage.removeItem("webrollToken");
        localStorage.removeItem("webrollRole");
        localStorage.removeItem("webrollUsername");
        window.location.href = "/";
      }}>
        Logout
      </button>
    </div>
  );
}

function StudentRecords() {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadStudents() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error();
      setStudents(await res.json());
      setMessage("");
    } catch {
      setMessage("Could not connect to the backend.");
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rollNumber, email }),
      });

      if (!res.ok) throw new Error();

      setName("");
      setRollNumber("");
      setEmail("");
      setMessage("Student saved successfully!");
      await loadStudents();
    } catch {
      setMessage("Could not save student. Check the backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <h1>WebRoll</h1>
      <h2>Student Records</h2>

      <form onSubmit={handleSubmit}>
        <p>
          <input
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </p>
        <p>
          <input
            placeholder="Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            required
          />
        </p>
        <p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </p>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Student"}
        </button>
      </form>

      {message && <p role="status">{message}</p>}

      <h2>Saved Students</h2>
      {students.length ? (
        <ul style={{ textAlign: "left" }}>
          {students.map((s) => (
            <li key={s.studentId}>
              {s.name} | {s.rollNumber} | {s.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No student records found.</p>
      )}

      <button onClick={loadStudents}>Refresh Students</button>
      <p><Link to="/">Back to Home</Link></p>
    </div>
  );
}

function AttendancePage() {
  const [studentId, setStudentId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [status, setStatus] = useState("Present");
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");

  async function loadAttendance() {
    try {
      const res = await fetch(ATTENDANCE_URL);
      if (!res.ok) throw new Error();
      setRecords(await res.json());
    } catch {
      setMessage("Could not load attendance records.");
    }
  }

  useEffect(() => {
    loadAttendance();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(ATTENDANCE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: Number(studentId),
          subjectId: Number(subjectId),
          date,
          status,
        }),
      });

      if (!res.ok) throw new Error();

      setMessage("Attendance saved successfully!");
      await loadAttendance();
    } catch {
      setMessage("Could not save attendance. Check the backend.");
    }
  }

  return (
    <div className="login-page">
      <h1>WebRoll</h1>
      <h2>Mark Attendance</h2>

      <form onSubmit={handleSubmit}>
        <p>
          <input
            type="number"
            placeholder="Student ID"
            min="1"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </p>
        <p>
          <input
            type="number"
            placeholder="Subject ID"
            min="1"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            required
          />
        </p>
        <p>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </p>
        <p>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </p>
        <button type="submit">Save Attendance</button>
      </form>

      {message && <p role="status">{message}</p>}

      <h2>Attendance History</h2>
      {records.length ? (
        <ul style={{ textAlign: "left" }}>
          {records.map((r) => (
            <li key={r.attendanceId}>
              Student: {r.studentId} | Subject: {r.subjectId} |
              Date: {r.date} | Status: {r.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No attendance records found.</p>
      )}

      <button onClick={loadAttendance}>Refresh Attendance</button>
      <p><Link to="/">Back to Home</Link></p>
    </div>
  );
}

function SubjectManagement() {
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState("");

  async function loadSubjects() {
    try {
      const res = await fetch(SUBJECT_URL);
      if (!res.ok) throw new Error();
      setSubjects(await res.json());
    } catch {
      setMessage("Could not load subjects.");
    }
  }

  useEffect(() => {
    loadSubjects();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(SUBJECT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectName, subjectCode }),
      });

      if (!res.ok) throw new Error();

      setSubjectName("");
      setSubjectCode("");
      setMessage("Subject saved successfully!");
      await loadSubjects();
    } catch {
      setMessage("Could not save subject. Check the backend.");
    }
  }

  return (
    <div className="login-page">
      <h1>WebRoll</h1>
      <h2>Subject Management</h2>

      <form onSubmit={handleSubmit}>
        <p>
          <input
            placeholder="Subject Name"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
          />
        </p>
        <p>
          <input
            placeholder="Subject Code"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
            required
          />
        </p>
        <button type="submit">Save Subject</button>
      </form>

      {message && <p role="status">{message}</p>}

      <h2>Saved Subjects</h2>
      {subjects.length ? (
        <ul style={{ textAlign: "left" }}>
          {subjects.map((s) => (
            <li key={s.subjectId}>
              {s.subjectName} | {s.subjectCode}
            </li>
          ))}
        </ul>
      ) : (
        <p>No subjects found.</p>
      )}

      <button onClick={loadSubjects}>Refresh Subjects</button>
      <p><Link to="/">Back to Home</Link></p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login/student"
          element={<LoginPage role="Student" />}
        />
        <Route
          path="/login/teacher"
          element={<LoginPage role="Teacher" />}
        />
        <Route
          path="/login/admin"
          element={<LoginPage role="Admin" />}
        />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/students" element={<StudentRecords />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/subjects" element={<SubjectManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
