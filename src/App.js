
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";

const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:8080").replace(
  /\/+$/,
  ""
);
const API_URL = `${API_BASE_URL}/api/students`;
const ATTENDANCE_URL = `${API_BASE_URL}/api/attendance`;
const SUBJECT_URL = `${API_BASE_URL}/api/subjects`;
const LOGIN_URL = `${API_BASE_URL}/api/auth/login`;

const roleCards = [
  {
    title: "Student",
    description: "Check your attendance, review trends, and stay on top of class participation.",
    link: "/login/student",
    badge: "Personal access",
  },
  {
    title: "Teacher",
    description: "Mark attendance quickly, manage sessions, and keep class records organized.",
    link: "/login/teacher",
    badge: "Daily workflow",
  },
  {
    title: "Administrator",
    description: "Oversee student records, subjects, and attendance operations from a single portal.",
    link: "/login/admin",
    badge: "Full control",
  },
];

const quickActions = [
  { title: "Manage Students", label: "Records", to: "/students" },
  { title: "Mark Attendance", label: "Check-in", to: "/attendance" },
  { title: "Manage Subjects", label: "Catalog", to: "/subjects" },
];

function Home() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand" aria-label="WebRoll home">
          <span className="brand-mark">W</span>
          <span>WebRoll</span>
        </div>

        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/students">Students</Link>
          <Link to="/attendance">Attendance</Link>
          <Link to="/subjects">Subjects</Link>
        </nav>

        <Link className="btn btn-primary" to="/login/student">
          Open portal
        </Link>
      </header>

      <main className="home-page">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">SMART • SIMPLE • ORGANIZED</span>
            <h1>Attendance that feels effortless.</h1>
            <p>
              WebRoll brings student records, class tracking, and attendance updates into one
              clean digital experience built for modern campuses.
            </p>

            <div className="cta-row">
              <Link className="btn btn-primary" to="/login/student">
                Student login
              </Link>
              <Link className="btn btn-secondary" to="/login/teacher">
                Teacher portal
              </Link>
            </div>

            <ul className="trust-list">
              <li>Live attendance updates</li>
              <li>Faster admin operations</li>
              <li>Clear role-based access</li>
            </ul>
          </div>

          <div className="hero-visual" aria-label="WebRoll dashboard preview">
            <div className="dashboard-card">
              <div className="dashboard-header">
                <div>
                  <span className="mini-label">This week</span>
                  <h3>Performance overview</h3>
                </div>
                <span className="chip positive">+18.4%</span>
              </div>

              <div className="chart-bars" aria-hidden="true">
                <span style={{ height: "42%" }} />
                <span style={{ height: "58%" }} />
                <span style={{ height: "72%" }} />
                <span style={{ height: "68%" }} />
                <span style={{ height: "88%" }} />
                <span style={{ height: "96%" }} />
                <span style={{ height: "100%" }} />
              </div>

              <div className="summary-row">
                <div>
                  <strong>98.4%</strong>
                  <span>Attendance accuracy</span>
                </div>
                <div>
                  <strong>2 min</strong>
                  <span>Avg. check-in</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-row" aria-label="Performance statistics">
          <div className="stat-card">
            <strong>98.4%</strong>
            <span>Attendance accuracy</span>
          </div>
          <div className="stat-card">
            <strong>3x</strong>
            <span>Faster admin workflow</span>
          </div>
          <div className="stat-card">
            <strong>24/7</strong>
            <span>Access from any device</span>
          </div>
        </section>

        <section className="role-grid" aria-label="Portal options">
          {roleCards.map((role) => (
            <div className="role-card" key={role.title}>
              <span className="card-badge">{role.badge}</span>
              <h2>{role.title}</h2>
              <p>{role.description}</p>
              <Link to={role.link}>Enter portal</Link>
            </div>
          ))}
        </section>

        <section className="quick-actions" aria-label="Quick actions">
          {quickActions.map((item) => (
            <Link className="action-card" key={item.title} to={item.to}>
              <span>{item.label}</span>
              <strong>{item.title}</strong>
            </Link>
          ))}
        </section>
      </main>

      <footer className="site-footer">WebRoll Attendance Management System</footer>
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
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Invalid username or password.");
      }

      if (!data.role || data.role.toUpperCase() !== role.toUpperCase()) {
        throw new Error("This account does not have the selected role.");
      }

      if (data.token) {
        localStorage.setItem("webrollToken", data.token);
      }

      localStorage.setItem("webrollRole", data.role);
      localStorage.setItem("webrollUsername", data.username || username.trim());

      if (role === "Admin") {
        navigate("/students");
      } else if (role === "Teacher") {
        navigate("/attendance");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error) {
      setMessage(error.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <div className="auth-summary">
          <div className="brand small">
            <span className="brand-mark">W</span>
            <span>WebRoll</span>
          </div>

          <h2>Powering smarter attendance.</h2>
          <p>
            Secure access for every role with a simple, faster, and more transparent campus
            workflow.
          </p>

          <div className="feature-pill">{role} workspace</div>
          <div className="feature-pill alt">Daily tracking</div>
        </div>

        <div className="auth-card">
          <div className="card-header">
            <span className="status-dot" aria-hidden="true" />
            {role} Access
          </div>

          <h1>Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue to your {role.toLowerCase()} portal.</p>

          <form onSubmit={handleLogin} className="form-stack">
            <input
              className="text-input"
              type="text"
              placeholder={role === "Student" ? "Roll Number" : "Username"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              className="text-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {message && (
            <p className="alert-message" role="alert">
              {message}
            </p>
          )}

          <button type="button" className="btn btn-secondary back-btn" onClick={() => navigate("/")}>
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentDashboard() {
  const username = localStorage.getItem("webrollUsername");

  return (
    <div className="page-shell">
      <div className="module-shell">
        <div className="module-card">
          <div className="module-header">
            <div>
              <span className="eyebrow dark">STUDENT</span>
              <h2>Dashboard</h2>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                localStorage.removeItem("webrollToken");
                localStorage.removeItem("webrollRole");
                localStorage.removeItem("webrollUsername");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </div>

          <div className="module-body">
            <h3>Welcome, {username}!</h3>
            <p>Your attendance dashboard will be connected to your own records.</p>
            <div className="status-box">
              <span className="status-dot success" aria-hidden="true" />
              Portal ready for attendance tracking
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentRecords() {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ name, rollNumber, password }),
      });

      if (!res.ok) throw new Error();

      setName("");
      setRollNumber("");
      setPassword("");
      setMessage("Student saved successfully!");
      await loadStudents();
    } catch {
      setMessage("Could not save student. Check the backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell">
      <div className="module-shell">
        <div className="module-card">
          <div className="module-header">
            <div>
              <span className="eyebrow dark">ADMIN</span>
              <h2>Student Records</h2>
            </div>
            <Link className="btn btn-secondary" to="/">
              Back to home
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="form-stack module-form">
            <input
              className="text-input"
              placeholder="Student Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="text-input"
              placeholder="Roll Number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
            />
            <input
              className="text-input"
              type="password"
              placeholder="Password (at least 8 characters)"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save student"}
            </button>
          </form>

          {message && <p className="alert-message">{message}</p>}

          <h3 className="list-title">Saved students</h3>
          {students.length ? (
            <ul className="record-list">
              {students.map((s) => (
                <li key={s.studentId}>
                  <strong>{s.name}</strong>
                  <span>{s.rollNumber}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No student records found.</p>
          )}

          <button type="button" className="btn btn-secondary refresh-btn" onClick={loadStudents}>
            Refresh records
          </button>
        </div>
      </div>
    </div>
  );
}

function AttendancePage() {
  const [studentId, setStudentId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
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
    <div className="page-shell">
      <div className="module-shell">
        <div className="module-card">
          <div className="module-header">
            <div>
              <span className="eyebrow dark">TEACHER</span>
              <h2>Mark Attendance</h2>
            </div>
            <Link className="btn btn-secondary" to="/">
              Back to home
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="form-stack module-form">
            <input
              className="text-input"
              type="number"
              placeholder="Student ID"
              min="1"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
            <input
              className="text-input"
              type="number"
              placeholder="Subject ID"
              min="1"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
            />
            <input
              className="text-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <select
              className="text-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
            <button type="submit" className="btn btn-primary">
              Save attendance
            </button>
          </form>

          {message && <p className="alert-message">{message}</p>}

          <h3 className="list-title">Attendance history</h3>
          {records.length ? (
            <ul className="record-list">
              {records.map((r) => (
                <li key={r.attendanceId}>
                  <strong>Student: {r.studentId}</strong>
                  <span>Subject: {r.subjectId}</span>
                  <em>
                    {r.date} • {r.status}
                  </em>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No attendance records found.</p>
          )}

          <button type="button" className="btn btn-secondary refresh-btn" onClick={loadAttendance}>
            Refresh records
          </button>
        </div>
      </div>
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
    <div className="page-shell">
      <div className="module-shell">
        <div className="module-card">
          <div className="module-header">
            <div>
              <span className="eyebrow dark">ADMIN</span>
              <h2>Subject Management</h2>
            </div>
            <Link className="btn btn-secondary" to="/">
              Back to home
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="form-stack module-form">
            <input
              className="text-input"
              placeholder="Subject Name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
            />
            <input
              className="text-input"
              placeholder="Subject Code"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">
              Save subject
            </button>
          </form>

          {message && <p className="alert-message">{message}</p>}

          <h3 className="list-title">Saved subjects</h3>
          {subjects.length ? (
            <ul className="record-list">
              {subjects.map((s) => (
                <li key={s.subjectId}>
                  <strong>{s.subjectName}</strong>
                  <span>{s.subjectCode}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No subjects found.</p>
          )}

          <button type="button" className="btn btn-secondary refresh-btn" onClick={loadSubjects}>
            Refresh subjects
          </button>
        </div>
      </div>
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
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/students" element={<StudentRecords />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/subjects" element={<SubjectManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
