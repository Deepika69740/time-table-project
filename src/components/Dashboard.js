// import React, { useState, useEffect } from 'react';
// import { Button, Card, Col, Row, Container, Navbar, Nav, ProgressBar, Badge } from 'react-bootstrap';
// import { auth, database, ref, onValue } from '../firebase';
// import { signOut } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';
// import TaskForm from './Tasks/TaskForm';
// import TaskCard from './Tasks/TaskCard';
// import { FaCalendarAlt, FaUser, FaBars, FaTasks, FaCheckCircle, FaRegClock, FaBell } from 'react-icons/fa';

// const Dashboard = ({ onLogout }) => {
//   const [userData, setUserData] = useState(null);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showTaskForm, setShowTaskForm] = useState(false);
//   const [editingTask, setEditingTask] = useState(null);
//   const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);
//   const [progress, setProgress] = useState(0);
//   const [activeTab, setActiveTab] = useState('all'); // 'all', 'completed', 'remaining'
//   const [notifications, setNotifications] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);
  
//   const navigate = useNavigate();

//   // Filter tasks based on active tab
//   const filteredTasks = () => {
//     switch(activeTab) {
//       case 'completed':
//         return tasks.filter(task => task.completed);
//       case 'remaining':
//         return tasks.filter(task => !task.completed);
//       default:
//         return tasks;
//     }
//   };

//   // Calculate task statistics
//   const totalTasks = tasks.length;
//   const completedTasks = tasks.filter(task => task.completed).length;
//   const remainingTasks = totalTasks - completedTasks;

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
          
//           // Calculate progress
//           const completed = tasksList.filter(task => task.completed).length;
//           const newProgress = tasksList.length > 0 ? Math.round((completed / tasksList.length) * 100) : 0;
//           setProgress(newProgress);
//         } else {
//           setTasks([]);
//           setProgress(0);
//         }
//       });
//     }
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       setShowSidebar(window.innerWidth > 800);
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

//   useEffect(() => {
//     if (tasks.length > 0) {
//       const currentDate = new Date();
//       const upcomingTasks = tasks.filter(task => {
//         if (!task.dueDate || task.completed) return false;
//         const dueDate = new Date(task.dueDate);
//         const diffTime = dueDate - currentDate;
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//         return diffDays >= 0 && diffDays <= 2; // Tasks due within 2 days
//       });
      
//       if (upcomingTasks.length > 0) {
//         const newNotifications = upcomingTasks.map(task => ({
//           id: task.id,
//           title: task.title,
//           message: `Task due ${new Date(task.dueDate).toLocaleDateString()}`,
//           timestamp: new Date().toISOString(),
//           read: false
//         }));
        
//         setNotifications(prev => {
//           const existingIds = prev.map(n => n.id);
//           const uniqueNew = newNotifications.filter(n => !existingIds.includes(n.id));
//           return [...prev, ...uniqueNew];
//         });
//       }
//     }
//   }, [tasks]);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       onLogout();
//       navigate('/');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const markAllAsRead = () => {
//     setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//   };

//   const removeNotification = (id) => {
//     setNotifications(prev => prev.filter(n => n.id !== id));
//   };

//   if (loading) {
//     return <div className="text-center mt-5">Loading...</div>;
//   }

//   if (!userData) {
//     return <div className="text-center mt-5">User data not found</div>;
//   }

//   const unreadCount = notifications.filter(n => !n.read).length;

//   return (
//     <div className="d-flex flex-column" style={{ minHeight: '100vh', width: '100%' }}>
//       <div className="d-flex flex-grow-1" style={{ width: '100%' }}>
//         <div 
//           className={`sidebar bg-light p-3 ${!showSidebar ? 'd-none' : 'd-lg-block'}`}
//           style={{ 
//             width: '250px',
//             minHeight: 'calc(100vh - 56px)',
//             borderRight: '1px solid #dee2e6',
//             overflowY: 'auto'
//           }}
//         >
//           <Card className="user-card mb-4 border-0 shadow-sm">
//             <Card.Body>
//               <div className="text-center mb-3">
//                 <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
//                      style={{ width: '70px', height: '70px' }}>
//                   <FaUser style={{ fontSize: '1.8rem', color: 'white' }} />
//                 </div>
//                 <h5 className="mt-3 mb-1">{userData.name}</h5>
//                 <small className="text-muted">{userData.email}</small>
//               </div>
              
//               {/* <ProgressBar 
//                 variant="primary" 
//                 now={progress} 
//                 label={`${progress}%`} 
//                 className="mb-3" 
//                 style={{ height: '10px' }}
//               /> */}
              
//               <div className="d-grid gap-1">
//                 <Button
//                   variant="primary"
//                   onClick={() => {
//                     setEditingTask(null);
//                     setShowTaskForm(true);
//                   }}
//                 >
//                   + Add New Task
//                 </Button>
//               </div>
//             </Card.Body>
//           </Card>
          
//           {/* <Nav className="flex-column">
//             <Nav.Link href="#dashboard" className="mb-2 d-flex align-items-center">
//               <FaCalendarAlt className="me-3" /> Dashboard
//             </Nav.Link>
//             <Nav.Link href="#tasks" className="mb-2 d-flex align-items-center">
//               <FaTasks className="me-3" /> Tasks
//             </Nav.Link>
//             <Nav.Link href="#calendar" className="mb-2 d-flex align-items-center">
//               <FaCalendarAlt className="me-3" /> Calendar
//             </Nav.Link>
//           </Nav> */}
//         </div>

//         {/* Main Content Area - Full Width */}
//         <div 
//           className="flex-grow-1 p-3" 
//           style={{ 
//             minHeight: 'calc(100vh - 56px)',
//             overflowY: 'auto',
//             backgroundColor: '#f8f9fa',
//             width: showSidebar ? 'calc(100% - 250px)' : '100%'
//           }}
//         >
//           {/* Page Header with Toggle Button */}
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <div className="d-flex align-items-center">
//               {!showSidebar && (
//                 <Button 
//                   variant="light" 
//                   className="me-3 p-1 border" 
//                   onClick={() => setShowSidebar(!showSidebar)}
//                 >
//                   <FaBars />
//                 </Button>
//               )}
//               <h4 className="mb-0">Dashboard</h4>
//             </div>
//             <Button 
//               variant="primary" 
//               size="sm"
//               onClick={() => {
//                 setEditingTask(null);
//                 setShowTaskForm(true);
//               }}
//             >
//               + Add Task
//             </Button>
//           </div>
          
//           {/* Task Statistics Cards */}
//           <Row className="mb-4 g-3">
//             <Col md={4}>
//               <Card 
//                 className={`shadow-sm border-0 h-100 cursor-pointer ${activeTab === 'all' ? 'border-primary' : ''}`}
//                 onClick={() => setActiveTab('all')}
//               >
//                 <Card.Body className="d-flex align-items-center">
//                   <div className="bg-primary bg-opacity-10 rounded p-3 me-3">
//                     <FaTasks className="text-primary" size={24} />
//                   </div>
//                   <div>
//                     <h6 className="text-muted mb-1">Total Tasks</h6>
//                     <h3 className="mb-0">{totalTasks}</h3>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
            
//             <Col md={4}>
//               <Card 
//                 className={`shadow-sm border-0 h-100 cursor-pointer ${activeTab === 'completed' ? 'border-success' : ''}`}
//                 onClick={() => setActiveTab('completed')}
//               >
//                 <Card.Body className="d-flex align-items-center">
//                   <div className="bg-success bg-opacity-10 rounded p-3 me-3">
//                     <FaCheckCircle className="text-success" size={24} />
//                   </div>
//                   <div>
//                     <h6 className="text-muted mb-1">Completed</h6>
//                     <h3 className="mb-0">{completedTasks}</h3>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
            
//             <Col md={4}>
//               <Card 
//                 className={`shadow-sm border-0 h-100 cursor-pointer ${activeTab === 'remaining' ? 'border-warning' : ''}`}
//                 onClick={() => setActiveTab('remaining')}
//               >
//                 <Card.Body className="d-flex align-items-center">
//                   <div className="bg-warning bg-opacity-10 rounded p-3 me-3">
//                     <FaRegClock className="text-warning" size={24} />
//                   </div>
//                   <div>
//                     <h6 className="text-muted mb-1">Remaining</h6>
//                     <h3 className="mb-0">{remainingTasks}</h3>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
          
//           {/* Task List */}
//           <Card className="shadow-sm border-0">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center mb-4">
//                 <div>
//                   <h5 className="mb-0">Your {activeTab === 'completed' ? 'Completed' : activeTab === 'remaining' ? 'Remaining' : ''} Tasks</h5>
//                   <small className="text-muted">
//                     {activeTab === 'all' && `${totalTasks} total tasks`}
//                     {activeTab === 'completed' && `${completedTasks} completed tasks`}
//                     {activeTab === 'remaining' && `${remainingTasks} remaining tasks`}
//                   </small>
//                 </div>
//                 <Button 
//                   variant="outline-primary" 
//                   size="sm"
//                   onClick={() => {
//                     setEditingTask(null);
//                     setShowTaskForm(true);
//                   }}
//                 >
//                   + Add Task
//                 </Button>
//               </div>
              
//               {filteredTasks().length > 0 ? (
//                 <Row className="g-3">
//                   {filteredTasks().map(task => (
//                     <Col key={task.id} xs={12} sm={6} lg={4}>
//                       <TaskCard
//                         task={task}
//                         id={task.id}
//                         setEditingTask={setEditingTask}
//                         setShowTaskForm={setShowTaskForm}
//                         refreshTasks={fetchTasks}
//                       />
//                     </Col>
//                   ))}
//                 </Row>
//               ) : (
//                 <div className="text-center py-5">
//                   <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center p-4 mb-3">
//                     {activeTab === 'completed' ? (
//                       <FaCheckCircle size={32} className="text-muted" />
//                     ) : activeTab === 'remaining' ? (
//                       <FaRegClock size={32} className="text-muted" />
//                     ) : (
//                       <FaTasks size={32} className="text-muted" />
//                     )}
//                   </div>
//                   <h5 className="mb-2">
//                     {activeTab === 'completed' ? 'No completed tasks yet' : 
//                      activeTab === 'remaining' ? 'All tasks completed!' : 
//                      'No tasks found'}
//                   </h5>
//                   <p className="text-muted mb-3">
//                     {activeTab === 'all' ? 'Add your first task to get started' : ''}
//                   </p>
//                   {activeTab === 'all' && (
//                     <Button 
//                       variant="primary"
//                       onClick={() => setShowTaskForm(true)}
//                     >
//                       Create Task
//                     </Button>
//                   )}
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         </div>
//       </div>

//       {/* Task Form Modal */}
//       <TaskForm
//         show={showTaskForm}
//         onHide={() => {
//           setShowTaskForm(false);
//           setEditingTask(null);
//         }}
//         editingTask={editingTask}
//         setEditingTask={setEditingTask}
//         refreshTasks={fetchTasks}
//       />
      
//     </div>
//   );
// };

// export default Dashboard;




import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Container, Navbar, Nav, ProgressBar, Badge } from 'react-bootstrap';
import { auth, database, ref, onValue } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import TaskForm from './Tasks/TaskForm';
import TaskCard from './Tasks/TaskCard';
import { FaCalendarAlt, FaUser, FaBars, FaTasks, FaCheckCircle, FaRegClock, FaBell } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const Dashboard = ({ onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'completed', 'remaining'
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [emailSent, setEmailSent] = useState(false); // Track if email has been sent for this session
  
  const navigate = useNavigate();

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("h7FW0ReYv7_70X8U5"); // Initialize with your public key
  }, []);

  // Filter tasks based on active tab
  const filteredTasks = () => {
    switch(activeTab) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'remaining':
        return tasks.filter(task => !task.completed);
      default:
        return tasks;
    }
  };

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const remainingTasks = totalTasks - completedTasks;

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
          
          // Calculate progress
          const completed = tasksList.filter(task => task.completed).length;
          const newProgress = tasksList.length > 0 ? Math.round((completed / tasksList.length) * 100) : 0;
          setProgress(newProgress);
        } else {
          setTasks([]);
          setProgress(0);
        }
        setLoading(false); // Move here to ensure loading state is updated after data fetch
      });
    } else {
      setLoading(false); // Also update loading state if no user
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 800);
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
        } else {
          setLoading(false); // Update loading if no user data
        }
      });
      fetchTasks();
    } else {
      setLoading(false); // Update loading if no user
    }
  }, []); // Remove userData and emailSent from dependencies to prevent infinite loops

  // Separate useEffect for sending email to prevent loops
  useEffect(() => {
    // Only attempt to send email if we have user data and haven't sent one yet
    if (userData && !emailSent) {
      const user = auth.currentUser;
      if (!user) return;
      
      const templateParams = {
        to_email: user.email, // Use auth.currentUser.email instead of userData.email
        user_name: userData.name || user.displayName || 'User',
        login_time: new Date().toLocaleString(),
      };

      try {
        emailjs
          .send('service_7s8qa0f', 'template_k8j29w7', templateParams)
          .then((response) => {
            console.log('Email sent successfully:', response.status, response.text);
            setEmailSent(true); // Prevent sending multiple emails
          })
          .catch((error) => {
            console.error('Failed to send email:', error);
          });
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }
  }, [userData, emailSent]); // Only run when userData changes

  useEffect(() => {
    if (tasks.length > 0) {
      const currentDate = new Date();
      const upcomingTasks = tasks.filter(task => {
        // Check if task has fromTime (not dueDate as in original code)
        if (!task.fromTime || task.completed) return false;
        const dueDate = new Date(task.fromTime);
        const diffTime = dueDate - currentDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 2; // Tasks due within 2 days
      });
      
      if (upcomingTasks.length > 0) {
        const newNotifications = upcomingTasks.map(task => ({
          id: task.id,
          title: task.name, // Use task.name instead of task.title
          message: `Task due ${new Date(task.fromTime).toLocaleDateString()}`,
          timestamp: new Date().toISOString(),
          read: false
        }));
        
        setNotifications(prev => {
          const existingIds = prev.map(n => n.id);
          const uniqueNew = newNotifications.filter(n => !existingIds.includes(n.id));
          return [...prev, ...uniqueNew];
        });
      }
    }
  }, [tasks]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (onLogout) onLogout(); // Check if onLogout is defined
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!userData) {
    return <div className="text-center mt-5">User data not found</div>;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh', width: '100%' }}>
      <div className="d-flex flex-grow-1" style={{ width: '100%' }}>
        <div 
          className={`sidebar bg-light p-3 ${!showSidebar ? 'd-none' : 'd-lg-block'}`}
          style={{ 
            width: '250px',
            minHeight: 'calc(100vh - 56px)',
            borderRight: '1px solid #dee2e6',
            overflowY: 'auto'
          }}
        >
          <Card className="user-card mb-4 border-0 shadow-sm">
            <Card.Body>
              <div className="text-center mb-3">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{ width: '70px', height: '70px' }}>
                  <FaUser style={{ fontSize: '1.8rem', color: 'white' }} />
                </div>
                <h5 className="mt-3 mb-1">{userData.name || 'User'}</h5>
                <small className="text-muted">{userData.email || auth.currentUser?.email}</small>
              </div>
              
              {/* Progress bar commented out in original code */}
              {/* <ProgressBar 
                variant="primary" 
                now={progress} 
                label={`${progress}%`} 
                className="mb-3" 
                style={{ height: '10px' }}
              /> */}
              
              <div className="d-grid gap-1">
                <Button
                  variant="primary"
                  onClick={() => {
                    setEditingTask(null);
                    setShowTaskForm(true);
                  }}
                >
                  + Add New Task
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          {/* Navigation commented out in original code */}
          {/* <Nav className="flex-column">
            <Nav.Link href="#dashboard" className="mb-2 d-flex align-items-center">
              <FaCalendarAlt className="me-3" /> Dashboard
            </Nav.Link>
            <Nav.Link href="#tasks" className="mb-2 d-flex align-items-center">
              <FaTasks className="me-3" /> Tasks
            </Nav.Link>
            <Nav.Link href="#calendar" className="mb-2 d-flex align-items-center">
              <FaCalendarAlt className="me-3" /> Calendar
            </Nav.Link>
          </Nav> */}
        </div>

        {/* Main Content Area - Full Width */}
        <div 
          className="flex-grow-1 p-3" 
          style={{ 
            minHeight: 'calc(100vh - 56px)',
            overflowY: 'auto',
            backgroundColor: '#f8f9fa',
            width: showSidebar ? 'calc(100% - 250px)' : '100%'
          }}
        >
          {/* Page Header with Toggle Button */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              {!showSidebar && (
                <Button 
                  variant="light" 
                  className="me-3 p-1 border" 
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <FaBars />
                </Button>
              )}
              <h4 className="mb-0">Dashboard</h4>
            </div>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => {
                setEditingTask(null);
                setShowTaskForm(true);
              }}
            >
              + Add Task
            </Button>
          </div>
          
          {/* Task Statistics Cards */}
          <Row className="mb-4 g-3">
            <Col md={4}>
              <Card 
                className={`shadow-sm border-0 h-100 cursor-pointer ${activeTab === 'all' ? 'border-primary' : ''}`}
                onClick={() => setActiveTab('all')}
                style={{ cursor: 'pointer' }} // Add cursor style explicitly
              >
                <Card.Body className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 rounded p-3 me-3">
                    <FaTasks className="text-primary" size={24} />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Total Tasks</h6>
                    <h3 className="mb-0">{totalTasks}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card 
                className={`shadow-sm border-0 h-100 cursor-pointer ${activeTab === 'completed' ? 'border-success' : ''}`}
                onClick={() => setActiveTab('completed')}
                style={{ cursor: 'pointer' }} // Add cursor style explicitly
              >
                <Card.Body className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 rounded p-3 me-3">
                    <FaCheckCircle className="text-success" size={24} />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Completed</h6>
                    <h3 className="mb-0">{completedTasks}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card 
                className={`shadow-sm border-0 h-100 cursor-pointer ${activeTab === 'remaining' ? 'border-warning' : ''}`}
                onClick={() => setActiveTab('remaining')}
                style={{ cursor: 'pointer' }} // Add cursor style explicitly
              >
                <Card.Body className="d-flex align-items-center">
                  <div className="bg-warning bg-opacity-10 rounded p-3 me-3">
                    <FaRegClock className="text-warning" size={24} />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Remaining</h6>
                    <h3 className="mb-0">{remainingTasks}</h3>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Task List */}
          <Card className="shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="mb-0">Your {activeTab === 'completed' ? 'Completed' : activeTab === 'remaining' ? 'Remaining' : ''} Tasks</h5>
                  <small className="text-muted">
                    {activeTab === 'all' && `${totalTasks} total tasks`}
                    {activeTab === 'completed' && `${completedTasks} completed tasks`}
                    {activeTab === 'remaining' && `${remainingTasks} remaining tasks`}
                  </small>
                </div>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => {
                    setEditingTask(null);
                    setShowTaskForm(true);
                  }}
                >
                  + Add Task
                </Button>
              </div>
              
              {filteredTasks().length > 0 ? (
                <Row className="g-3">
                  {filteredTasks().map(task => (
                    <Col key={task.id} xs={12} sm={6} lg={4}>
                      <TaskCard
                        task={task}
                        id={task.id}
                        setEditingTask={setEditingTask}
                        setShowTaskForm={setShowTaskForm}
                        refreshTasks={fetchTasks}
                      />
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-5">
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center p-4 mb-3">
                    {activeTab === 'completed' ? (
                      <FaCheckCircle size={32} className="text-muted" />
                    ) : activeTab === 'remaining' ? (
                      <FaRegClock size={32} className="text-muted" />
                    ) : (
                      <FaTasks size={32} className="text-muted" />
                    )}
                  </div>
                  <h5 className="mb-2">
                    {activeTab === 'completed' ? 'No completed tasks yet' : 
                     activeTab === 'remaining' ? 'All tasks completed!' : 
                     'No tasks found'}
                  </h5>
                  <p className="text-muted mb-3">
                    {activeTab === 'all' ? 'Add your first task to get started' : ''}
                  </p>
                  {activeTab === 'all' && (
                    <Button 
                      variant="primary"
                      onClick={() => setShowTaskForm(true)}
                    >
                      Create Task
                    </Button>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Task Form Modal */}
      <TaskForm
        show={showTaskForm}
        onHide={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        refreshTasks={fetchTasks}
      />
      
      {/* Add a logout button */}
      <div className="text-center p-3 bg-light border-top">
        
      </div>
    </div>
  );
};

export default Dashboard;