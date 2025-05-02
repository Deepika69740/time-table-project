

// import React, { useEffect, useState } from 'react';
// import { Card, Button, ButtonGroup, Form } from 'react-bootstrap';
// import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
// import { database, ref, remove, update, onValue } from '../../firebase';
// import { getAuth } from 'firebase/auth';

// const TaskCard = ({ task, id, setEditingTask, setShowTaskForm, refreshTasks, setUserProgress }) => {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const [currentProgress, setCurrentProgress] = useState(0);

//   // Load current progress when component mounts
//   useEffect(() => {
//     if (user) {
//       const progressRef = ref(database, `users/${user.uid}/progress`);
//       const unsubscribe = onValue(progressRef, (snapshot) => {
//         if (snapshot.exists()) {
//           setCurrentProgress(snapshot.val().value || 0);
//         }
//       });
//       return () => unsubscribe();
//     }
//   }, [user]);

//   const handleDelete = async () => {
//     if (!user) {
//       alert('You must be logged in to delete tasks');
//       return;
//     }

//     try {
//       // Decrease progress by 5% if task was completed
//       if (task.completed) {
//         const newProgress = Math.max(0, currentProgress - 5);
//         await update(ref(database, `users/${user.uid}/progress`), { value: newProgress });
//         setUserProgress(newProgress);
//       }

//       await remove(ref(database, `users/${user.uid}/tasks/${id}`));
//       refreshTasks();
//     } catch (error) {
//       console.error('Error deleting task:', error);
//     }
//   };

//   const handleEdit = () => {
//     setEditingTask({
//       id,
//       name: task.name,
//       fromTime: task.fromTime,
//       toTime: task.toTime
//     });
//     setShowTaskForm(true);
//   };

//   const handleCompleteToggle = async () => {
//     if (!user) {
//       alert('You must be logged in to update tasks');
//       return;
//     }

//     try {
//       const newCompletedStatus = !task.completed;
      
//       // Update task completion status
//       await update(ref(database, `users/${user.uid}/tasks/${id}`), {
//         completed: newCompletedStatus
//       });

//       // Update progress (increase or decrease by 5%)
//       const progressChange = newCompletedStatus ? 10 : -10;
//       const newProgress = Math.min(100, Math.max(0, currentProgress + progressChange));
      
//       await update(ref(database, `users/${user.uid}/progress`), { value: newProgress });
//       setUserProgress(newProgress);
      
//       refreshTasks();
//     } catch (error) {
//       console.error('Error updating task:', error);
//     }
//   };

//   return (
//     <Card className="h-100">
//       <Card.Body className="d-flex flex-column">
//         <Card.Title className={task.completed ? 'text-success' : ''}>
//           {task.completed && <FaCheck className="me-2" />}
//           {task.name}
//         </Card.Title>
//         <Card.Text className="mb-2">
//           <strong>From:</strong> {new Date(task.fromTime).toLocaleString()}
//         </Card.Text>
//         <Card.Text className="mb-3">
//           <strong>To:</strong> {new Date(task.toTime).toLocaleString()}
//         </Card.Text>
        
//         {/* Completion Checkbox */}
//         <Form.Group className="mb-3">
//           <Form.Check
//             type="checkbox"
//             label={task.completed ? <span className="text-success">Completed</span> : "Mark as completed"}
//             checked={task.completed}
//             onChange={handleCompleteToggle}
//             id={`task-complete-${id}`}
//           />
//         </Form.Group>

//         <ButtonGroup className="mt-auto">
//           <Button variant="outline-primary" size="sm" onClick={handleEdit}>
//             <FaEdit /> Edit
//           </Button>
//           <Button variant="outline-danger" size="sm" onClick={handleDelete}>
//             <FaTrash /> Delete
//           </Button>
//         </ButtonGroup>
//       </Card.Body>
//     </Card>
//   );
// };

// export default TaskCard;









// this code is for if you delete the card after the complition it doest not deleted from the apllication and progress bar deos not dec by 10% dec by 5%
// import React, { useEffect, useState } from 'react';
// import { Card, Button, ButtonGroup, Form } from 'react-bootstrap';
// import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
// import { database, ref, remove, update, onValue } from '../../firebase';
// import { getAuth } from 'firebase/auth';


// const TaskCard = ({ task, id, setEditingTask, setShowTaskForm, refreshTasks, setUserProgress }) => {
//   const auth = getAuth();
//   const user = auth.currentUser;
//   const [currentProgress, setCurrentProgress] = useState(0);

//   // Validate and complete task data
//   const getValidTaskData = (taskData) => {
//     return {
//       name: taskData.name || 'Unnamed Task',
//       fromTime: taskData.fromTime || Date.now(),
//       toTime: taskData.toTime || Date.now() + 3600000, // Default 1 hour duration
//       completed: taskData.completed || false,
//       createdAt: taskData.createdAt || Date.now() // Using Date.now() instead of serverTimestamp
//     };
//   };

//   // Load current progress when component mounts
//   useEffect(() => {
//     if (user) {
//       const progressRef = ref(database, `users/${user.uid}/progress`);
//       const unsubscribe = onValue(progressRef, (snapshot) => {
//         if (snapshot.exists()) {
//           setCurrentProgress(snapshot.val().value || 0);
//         }
//       });
//       return () => unsubscribe();
//     }
//   }, [user]);

//   const handleDelete = async () => {
//     if (!user) {
//       alert('You must be logged in to delete tasks');
//       return;
//     }

//     try {
//       // Decrease progress by 10% if task was completed
//       if (task.completed) {
//         const newProgress = Math.max(0, currentProgress - 10);
//         await update(ref(database, `users/${user.uid}/progress`), { value: newProgress });
//         setUserProgress(newProgress);
//       }

//       await remove(ref(database, `users/${user.uid}/tasks/${id}`));
//       refreshTasks();
//     } catch (error) {
//       console.error('Error deleting task:', error);
//     }
//   };

//   const handleEdit = () => {
//     setEditingTask({
//       id,
//       ...getValidTaskData(task) // Use validated task data
//     });
//     setShowTaskForm(true);
//   };

//   const handleCompleteToggle = async () => {
//     if (!user) {
//       alert('You must be logged in to update tasks');
//       return;
//     }

//     try {
//       const newCompletedStatus = !task.completed;
      
//       // Update task with validated data
//       const updatedTask = getValidTaskData({
//         ...task,
//         completed: newCompletedStatus
//       });

//       await update(ref(database, `users/${user.uid}/tasks/${id}`), updatedTask);

//       // Update progress (increase or decrease by 10%)
//       const progressChange = newCompletedStatus ? 10 : -10;
//       const newProgress = Math.min(100, Math.max(0, currentProgress + progressChange));
      
//       await update(ref(database, `users/${user.uid}/progress`), { value: newProgress });
//       setUserProgress(newProgress);
      
//       refreshTasks();
//     } catch (error) {
//       console.error('Error updating task:', error);
//     }
//   };

//   return (
//     <Card className="h-100">
//       <Card.Body className="d-flex flex-column">
//         <Card.Title className={task.completed ? 'text-success' : ''}>
//           {task.completed && <FaCheck className="me-2" />}
//           {task.name || 'Unnamed Task'}
//         </Card.Title>
//         <Card.Text className="mb-2">
//           <strong>From:</strong> {new Date(task.fromTime).toLocaleString()}
//         </Card.Text>
//         <Card.Text className="mb-3">
//           <strong>To:</strong> {new Date(task.toTime).toLocaleString()}
//         </Card.Text>
        
//         {/* Completion Checkbox */}
//         <Form.Group className="mb-3">
//           <Form.Check
//             type="checkbox"
//             label={task.completed ? <span className="text-success">Completed</span> : "Mark as completed"}
//             checked={task.completed}
//             onChange={handleCompleteToggle}
//             id={`task-complete-${id}`}
//           />
//         </Form.Group>

//         <ButtonGroup className="mt-auto">
//           <Button variant="outline-primary" size="sm" onClick={handleEdit}>
//             <FaEdit /> Edit
//           </Button>
//           <Button variant="outline-danger" size="sm" onClick={handleDelete}>
//             <FaTrash /> Delete
//           </Button>
//         </ButtonGroup>
//       </Card.Body>
//     </Card>
//   );
// };

// export default TaskCard;







import React, { useEffect, useState } from 'react';
import { Card, Button, ButtonGroup, Form, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaCheck, FaBell, FaExclamationTriangle } from 'react-icons/fa';
import { database, ref, remove, update, onValue, get } from '../../firebase';
import { getAuth } from 'firebase/auth';
import emailjs from '@emailjs/browser';

const TaskCard = ({ task, id, setEditingTask, setShowTaskForm, refreshTasks, setUserProgress }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [currentProgress, setCurrentProgress] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  // EmailJS configuration with your provided keys
  const emailjsConfig = {
    serviceId: 'service_szu69jq',
    templateId: 'template_ontzlde',
    publicKey: 'mH_QxxPTCRYvCp6XR'
  };

  // Alert helper functions
  const showErrorAlert = (message) => {
    setAlertMessage(message);
    setAlertVariant('danger');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const showSuccessAlert = (message) => {
    setAlertMessage(message);
    setAlertVariant('success');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  // Send email notification
  const sendEmailNotification = async (notificationType) => {
    try {
      if (!user?.email) {
        throw new Error('No user email available');
      }

      const emailData = {
        from_email: "embadisagar2601@2601",
        to_email: user.email,
        task_name: task.name,
        due_date: new Date(task.toTime).toLocaleString(),
        message: notificationType === 'created' 
          ? `Your task "${task.name}" has been created with deadline at ${new Date(task.toTime).toLocaleString()}`
          : `The time for your task "${task.name}" has been completed`
      };

      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        emailData,
        emailjsConfig.publicKey
      );

      console.log(`${notificationType} notification sent to ${user.email}`);
      return true;
    } catch (error) {
      console.error(`Failed to send ${notificationType} notification:`, error);
      showErrorAlert(`Failed to send ${notificationType} notification`);
      return false;
    }
  };

  // Validate and complete task data
  const getValidTaskData = (taskData) => {
    return {
      name: taskData.name || 'Unnamed Task',
      fromTime: taskData.fromTime || Date.now(),
      toTime: taskData.toTime || Date.now() + 3600000,
      completed: taskData.completed || false,
      createdAt: taskData.createdAt || Date.now()
    };
  };

  // Load current progress when component mounts
  useEffect(() => {
    if (user) {
      const progressRef = ref(database, `users/${user.uid}/progress`);
      const unsubscribe = onValue(progressRef, (snapshot) => {
        if (snapshot.exists()) {
          setCurrentProgress(snapshot.val().value || 0);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  // Send notification when task is first created
  useEffect(() => {
    if (!user || !task) return;

    // Check if this is a newly created task (within last 5 seconds)
    if (Date.now() - task.createdAt < 5000) {
      sendEmailNotification('created')
        .then(success => {
          if (success) {
            showSuccessAlert('Task created notification sent to your email!');
          }
        });
    }
  }, [task, user]);

  // Check for task completion time
  useEffect(() => {
    if (!user || !task || task.completed) return;

    const timeLeft = task.toTime - Date.now();
    if (timeLeft > 0) {
      const timer = setTimeout(async () => {
        const taskRef = ref(database, `users/${user.uid}/tasks/${id}`);
        const snapshot = await get(taskRef);
        
        if (snapshot.exists() && !snapshot.val().completed) {
          const emailSent = await sendEmailNotification('completed');
          if (emailSent) {
            showSuccessAlert(`Time completion notification sent for: ${task.name}`);
          }
        }
      }, timeLeft);

      return () => clearTimeout(timer);
    }
  }, [task, user, id]);

  const handleDelete = async () => {
    if (!user) {
      showErrorAlert('You must be logged in to delete tasks');
      return;
    }

    try {
      if (task.completed) {
        const newProgress = Math.max(0, currentProgress - 10);
        await update(ref(database, `users/${user.uid}/progress`), { value: newProgress });
        setUserProgress(newProgress);
      }

      await remove(ref(database, `users/${user.uid}/tasks/${id}`));
      refreshTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      showErrorAlert('Failed to delete task');
    }
  };

  const handleEdit = () => {
    setEditingTask({
      id,
      ...getValidTaskData(task)
    });
    setShowTaskForm(true);
  };

  const handleCompleteToggle = async () => {
    if (!user) {
      showErrorAlert('You must be logged in to update tasks');
      return;
    }
    
    try {
      // Make sure id is defined
      if (!id) {
        console.error('Task ID is undefined');
        showErrorAlert('Failed to update task: Missing task ID');
        return;
      }
      
      const newCompletedStatus = !task.completed;
      
      // Directly update the task without using getValidTaskData
      // Only update the completed field to minimize what could go wrong
      await update(ref(database, `users/${user.uid}/tasks/${id}`), {
        completed: newCompletedStatus
      });
      
      console.log('Task update successful');
      
      // Update progress separately
      try {
        const progressChange = newCompletedStatus ? 10 : -10;
        // Ensure currentProgress is a number
        const progressRef = ref(database, `users/${user.uid}/progress`);
        const progressSnapshot = await get(progressRef);
        let currentProgressValue = 0;
        
        if (progressSnapshot.exists()) {
          currentProgressValue = progressSnapshot.val().value || 0;
        }
        
        const newProgress = Math.min(100, Math.max(0, currentProgressValue + progressChange));
        
        await update(progressRef, { value: newProgress });
        setUserProgress(newProgress);
        console.log('Progress update successful');
      } catch (progressError) {
        console.error('Error updating progress:', progressError);
        // Continue execution even if progress update fails
      }
      
      refreshTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      showErrorAlert('Failed to update task: ' + error.message);
    }
  };
  // Test notification buttons
  const testCreatedNotification = async () => {
    try {
      const success = await sendEmailNotification('created');
      if (success) {
        showSuccessAlert('Test creation notification sent! Check your email.');
      }
    } catch (error) {
      console.error('Test failed:', error);
      showErrorAlert(`Test failed: ${error.message}`);
    }
  };

  const testCompletedNotification = async () => {
    try {
      const success = await sendEmailNotification('completed');
      if (success) {
        showSuccessAlert('Test completion notification sent! Check your email.');
      }
    } catch (error) {
      console.error('Test failed:', error);
      showErrorAlert(`Test failed: ${error.message}`);
    }
  };

  return (
    <>
      {showAlert && (
        <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
          {alertVariant === 'danger' ? (
            <FaExclamationTriangle className="me-2" />
          ) : (
            <FaBell className="me-2" />
          )}
          {alertMessage}
        </Alert>
      )}

      <Card className="h-100">
        <Card.Body className="d-flex flex-column">
          <Card.Title className={task.completed ? 'text-success' : ''}>
            {task.completed && <FaCheck className="me-2" />}
            {task.name || 'Unnamed Task'}
          </Card.Title>
          <Card.Text className="mb-2">
            <strong>From:</strong> {new Date(task.fromTime).toLocaleString()}
          </Card.Text>
          <Card.Text className="mb-3">
            <strong>To:</strong> {new Date(task.toTime).toLocaleString()}
          </Card.Text>
          
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label={task.completed ? <span className="text-success">Completed</span> : "Mark as completed"}
              checked={task.completed}
              onChange={handleCompleteToggle}
              id={`task-complete-${id}`}
            />
          </Form.Group>

          <ButtonGroup className="mt-auto">
            <Button variant="outline-primary" size="sm" onClick={handleEdit}>
              <FaEdit /> Edit
            </Button>
            <Button variant="outline-danger" size="sm" onClick={handleDelete}>
              <FaTrash /> Delete
            </Button>
            {/* <Button 
              variant="outline-info" 
              size="sm" 
              onClick={testCreatedNotification}
              title="Test creation notification"
            >
              Test Add Notification
            </Button> */}
            {/* <Button 
              variant="outline-warning" 
              size="sm" 
              onClick={testCompletedNotification}
              title="Test completion notification"
            >
              Test Time Up Notification
            </Button> */}
          </ButtonGroup>
        </Card.Body>
      </Card>
    </>
  );
};

export default TaskCard;







