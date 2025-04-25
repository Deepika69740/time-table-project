// import React, { useState, useEffect } from 'react';
// import { Button, Card, Col, Row, Container, Navbar, Nav } from 'react-bootstrap';
// import { auth, database, ref, onValue } from '../firebase';
// import { signOut } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';
// import TaskForm from './Tasks/TaskForm';
// import TaskCard from './Tasks/TaskCard';
// import { FaCalendarAlt, FaUser, FaBars } from 'react-icons/fa';

// const Dashboard = ({ onLogout }) => {
//   const [userData, setUserData] = useState(null);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showTaskForm, setShowTaskForm] = useState(false);
//   const [editingTask, setEditingTask] = useState(null);
//   const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);
//   const navigate = useNavigate();

//   const fetchTasks = () => {
//     const user = auth.currentUser;
//     if (user) {
//       const tasksRef = ref(database, `users/${user.uid}/tasks`);
//       onValue(tasksRef, (snapshot) => {
//         const tasksData = snapshot.val();
//         if (tasksData) {
//           const tasksList = Object.entries(tasksData).map(([id, task]) => ({
//             id,
//             ...task
//           }));
//           setTasks(tasksList);
//         } else {
//           setTasks([]);
//         }
//       });
//     }
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       setShowSidebar(window.innerWidth > 768);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (user) {
//       const userRef = ref(database, 'users/' + user.uid);
//       onValue(userRef, (snapshot) => {
//         if (snapshot.exists()) {
//           setUserData(snapshot.val());
//         }
//       });
//       fetchTasks();
//     }
//     setLoading(false);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       onLogout();
//       navigate('/');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   if (loading) {
//     return <div className="text-center mt-5">Loading...</div>;
//   }

//   if (!userData) {
//     return <div className="text-center mt-5">User data not found</div>;
//   }

//   return (
//     <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
//       {/* Full-width Navbar with shadow */}
//       <Navbar bg="dark" variant="dark" expand="lg" className="px-3 w-100 shadow-sm" style={{ height: '60px' }}>
//         <Container fluid className="px-0">
//           <Button 
//             variant="dark" 
//             className="me-2 d-md-none"
//             onClick={() => setShowSidebar(!showSidebar)}
//           >
//             <FaBars />
//           </Button>
          
//           <Navbar.Brand href="#" className="d-flex align-items-center ms-md-2">
//             <FaCalendarAlt className="me-2" style={{ fontSize: '1.5rem' }} />
//             <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>T T Scheduler</span>
//           </Navbar.Brand>
          
//           <Navbar.Collapse className="justify-content-end">
//             <Nav className="align-items-center">
//               <div className="d-flex align-items-center me-3 text-white">
//                 <FaUser className="me-2" />
//                 <span>{userData.name}</span>
//               </div>
//               <Button 
//                 variant="outline-light" 
//                 size="sm"
//                 onClick={handleLogout}
//               >
//                 Logout
//               </Button>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       {/* Main Content Container */}
//       <Container fluid className="flex-grow-1 p-0">
//         <Row className="g-0" style={{ height: 'calc(100vh - 60px)' }}>
//           {/* Sidebar */}
//           <Col 
//             md={3} 
//             className={`sidebar bg-light p-3 ${!showSidebar ? 'd-none' : 'd-md-block'}`}
//             style={{ overflowY: 'auto' }}
//           >
//             <Card className="user-card mb-4">
//               <Card.Body>
//                 <Card.Title>User Profile</Card.Title>
//                 <div className="user-details">
//                   <p><strong>Name:</strong> {userData.name}</p>
//                   <p><strong>Email:</strong> {userData.email}</p>
//                   <p><strong>Joined:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
//                 </div>
//                 <Button
//                   variant="primary"
//                   onClick={() => setShowTaskForm(true)}
//                   className="w-100 mb-3"
//                 >
//                   Add Task
//                 </Button>
//               </Card.Body>
//             </Card>
//           </Col>

//           {/* Main Content Area */}
//           <Col 
//             md={9} 
//             className="main-content p-4" 
//             style={{ 
//               overflowY: 'auto',
//               height: 'calc(100vh - 60px)'
//             }}
//           >
//             <h2>Welcome, {userData.name}!</h2>
//             <Row className="task-list mt-4">
//               {tasks.length > 0 ? (
//                 tasks.map(task => (
//                   <Col key={task.id} xs={12} sm={6} lg={4} className="mb-4">
//                     <TaskCard
//                       task={task}
//                       id={task.id}
//                       setEditingTask={setEditingTask}
//                       setShowTaskForm={setShowTaskForm}
//                       refreshTasks={fetchTasks}
//                     />
//                   </Col>
//                 ))
//               ) : (
//                 <Col>
//                   <p>No tasks found. Add your first task!</p>
//                 </Col>
//               )}
//             </Row>
//           </Col>
//         </Row>
//       </Container>

//       <TaskForm
//         show={showTaskForm}
//         onHide={() => setShowTaskForm(false)}
//         editingTask={editingTask}
//         setEditingTask={setEditingTask}
//         refreshTasks={fetchTasks}
//       />
//     </div>
//   );
// };

// export default Dashboard;






import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Container, Navbar, Nav, ProgressBar } from 'react-bootstrap';
import { auth, database, ref, onValue } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import TaskForm from './Tasks/TaskForm';
import TaskCard from './Tasks/TaskCard';
import { FaCalendarAlt, FaUser, FaBars } from 'react-icons/fa';

const Dashboard = ({ onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const fetchTasks = () => {
    const user = auth.currentUser;
    if (user) {
      const tasksRef = ref(database, `users/${user.uid}/tasks`);
      onValue(tasksRef, (snapshot) => {
        const tasksData = snapshot.val();
        if (tasksData) {
          const tasksList = Object.entries(tasksData).map(([id, task]) => ({
            id,
            ...task
          }));
          setTasks(tasksList);
        } else {
          setTasks([]);
        }
      });

      // Fetch progress
      const progressRef = ref(database, `users/${user.uid}/progress`);
      onValue(progressRef, (snapshot) => {
        if (snapshot.exists()) {
          setProgress(snapshot.val().value || 0);
        }
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(database, 'users/' + user.uid);
      onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      });
      fetchTasks();
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!userData) {
    return <div className="text-center mt-5">User data not found</div>;
  }

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Navbar bg="dark" variant="dark" expand="lg" className="px-3 w-100 shadow-sm" style={{ height: '60px' }}>
        <Container fluid className="px-0">
          <Button 
            variant="dark" 
            className="me-2 d-md-none"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <FaBars />
          </Button>
          
          <Navbar.Brand href="#" className="d-flex align-items-center ms-md-2">
            <FaCalendarAlt className="me-2" style={{ fontSize: '1.5rem' }} />
            <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>T T Scheduler</span>
          </Navbar.Brand>
          
          <Navbar.Collapse className="justify-content-end">
            <Nav className="align-items-center">
              <div className="d-flex align-items-center me-3 text-white">
                <FaUser className="me-2" />
                <span>{userData.name}</span>
              </div>
              <Button 
                variant="outline-light" 
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="flex-grow-1 p-0">
        <Row className="g-0" style={{ height: 'calc(100vh - 60px)' }}>
          {/* Sidebar */}
          <Col 
            md={3} 
            className={`sidebar bg-light p-3 ${!showSidebar ? 'd-none' : 'd-md-block'}`}
            style={{ overflowY: 'auto' }}
          >
            <Card className="user-card mb-4">
              <Card.Body>
                <Card.Title>User Profile</Card.Title>
                <div className="user-details">
                  <p><strong>Name:</strong> {userData.name}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <p><strong>Joined:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setShowTaskForm(true)}
                  className="w-100 mb-3"
                >
                  Add Task
                </Button>
                
                {/* Progress Bar moved to sidebar */}
                <div className="mt-4">
                  <h6>Task Progress</h6>
                  <ProgressBar now={progress} label={`${progress}%`} />
                  <div className="text-center mt-2">
                    <small>{progress}% of tasks completed</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content Area */}
          <Col 
            md={9} 
            className="main-content p-4" 
            style={{ 
              overflowY: 'auto',
              height: 'calc(100vh - 60px)'
            }}
          >
            <h2>Welcome, {userData.name}!</h2>
            <Row className="task-list mt-4">
              {tasks.length > 0 ? (
                tasks.map(task => (
                  <Col key={task.id} xs={12} sm={6} lg={4} className="mb-4">
                    <TaskCard
                      task={task}
                      id={task.id}
                      setEditingTask={setEditingTask}
                      setShowTaskForm={setShowTaskForm}
                      refreshTasks={fetchTasks}
                    />
                  </Col>
                ))
              ) : (
                <Col>
                  <p>No tasks found. Add your first task!</p>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Container>

      <TaskForm
        show={showTaskForm}
        onHide={() => setShowTaskForm(false)}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        refreshTasks={fetchTasks}
      />
    </div>
  );
};

export default Dashboard;









