
// import React, { useState, useEffect } from 'react';
// import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
// import { database, ref, push, update } from '../../firebase';
// import { getAuth } from 'firebase/auth';

// const TaskForm = ({ show, onHide, editingTask, setEditingTask, refreshTasks }) => {
//   const [taskName, setTaskName] = useState('');
//   const [fromTime, setFromTime] = useState('');
//   const [toTime, setToTime] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (editingTask) {
//       setTaskName(editingTask.name || '');
//       setFromTime(editingTask.fromTime || '');
//       setToTime(editingTask.toTime || '');
//     } else {
//       setTaskName('');
//       setFromTime('');
//       setToTime('');
//     }
//   }, [editingTask]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
   
//     if (!taskName || !fromTime || !toTime) {
//       setError('All fields are required');
//       return;
//     }

//     if (new Date(toTime) < new Date(fromTime)) {
//       setError('End time must be after start time');
//       return;
//     }

//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (!user) {
//       setError('You must be logged in to manage tasks');
//       return;
//     }

//     try {
//       const taskData = {
//         name: taskName,
//         fromTime: fromTime,
//         toTime: toTime,
//         createdAt: editingTask ? editingTask.createdAt : new Date().toISOString()
//       };

//       if (editingTask) {
//         await update(ref(database, `users/${user.uid}/tasks/${editingTask.id}`), taskData);
//       } else {
//         await push(ref(database, `users/${user.uid}/tasks`), taskData);
//       }

//       setTaskName('');
//       setFromTime('');
//       setToTime('');
//       setError('');
//       setEditingTask(null);
//       onHide();
//       refreshTasks();
//     } catch (error) {
//       setError('Failed to save task: ' + error.message);
//     }
//   };

//   return (
//     <Modal show={show} onHide={() => { setEditingTask(null); onHide(); }} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>{editingTask ? 'Edit Task' : 'Add New Task'}</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form onSubmit={handleSubmit}>
//           <Form.Group as={Row} className="mb-3">
//             <Form.Label column sm={3}>Task Name</Form.Label>
//             <Col sm={9}>
//               <Form.Control
//                 type="text"
//                 value={taskName}
//                 onChange={(e) => setTaskName(e.target.value)}
//                 placeholder="Enter task name"
//                 required
//               />
//             </Col>
//           </Form.Group>

//           <Form.Group as={Row} className="mb-3">
//             <Form.Label column sm={3}>From</Form.Label>
//             <Col sm={9}>
//               <Form.Control
//                 type="datetime-local"
//                 value={fromTime}
//                 onChange={(e) => setFromTime(e.target.value)}
//                 required
//               />
//             </Col>
//           </Form.Group>

//           <Form.Group as={Row} className="mb-3">
//             <Form.Label column sm={3}>To</Form.Label>
//             <Col sm={9}>
//               <Form.Control
//                 type="datetime-local"
//                 value={toTime}
//                 onChange={(e) => setToTime(e.target.value)}
//                 required
//               />
//             </Col>
//           </Form.Group>

//           {error && (
//             <Row>
//               <Col>
//                 <div className="alert alert-danger">{error}</div>
//               </Col>
//             </Row>
//           )}

//           <Row>
//             <Col className="text-end">
//               <Button variant="secondary" onClick={() => { setEditingTask(null); onHide(); }} className="me-2">
//                 Cancel
//               </Button>
//               <Button variant="primary" type="submit">
//                 {editingTask ? 'Update Task' : 'Add Task'}
//               </Button>
//             </Col>
//           </Row>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default TaskForm;




// import React, { useState, useEffect } from 'react';
// import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
// import { database, ref, push, update } from '../../firebase';
// import { getAuth } from 'firebase/auth';
// import emailjs from '@emailjs/browser';
// import Swal from 'sweetalert2'; 

// const TaskForm = ({ show, onHide, editingTask, setEditingTask, refreshTasks }) => {
//   const [taskName, setTaskName] = useState('');
//   const [fromTime, setFromTime] = useState('');
//   const [toTime, setToTime] = useState('');
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
  
//   useEffect(() => {
//     if (editingTask) {
//       setTaskName(editingTask.name || '');
//       setFromTime(editingTask.fromTime || '');
//       setToTime(editingTask.toTime || '');
//     } else {
//       setTaskName('');
//       setFromTime('');
//       setToTime('');
//     }
//   }, [editingTask]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
   
//     if (!taskName || !fromTime || !toTime) {
//       setError('All fields are required');
//       return;
//     }

//     if (new Date(toTime) < new Date(fromTime)) {
//       setError('End time must be after start time');
//       return;
//     }

//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (!user) {
//       setError('You must be logged in to manage tasks');
//       return;
//     }

//     try {
//       const taskData = {
//         name: taskName,
//         fromTime: fromTime,
//         toTime: toTime,
//         createdAt: editingTask ? editingTask.createdAt : new Date().toISOString()
//       };

//       let taskAdded = false;

//       if (editingTask) {
//         await update(ref(database, `users/${user.uid}/tasks/${editingTask.id}`), taskData);
//       } else {
//         await push(ref(database, `users/${user.uid}/tasks`), taskData);
//         taskAdded = true;
//       }

//       // Send email notification only when adding a new task (not editing)
//       if (taskAdded) {
//         const templateParams = {
//           to_email: user.email,
//           user_name: user.displayName || user.email.split('@')[0],
//           task_name: taskName,
//           from_time: new Date(fromTime).toLocaleString(),
//           to_time: new Date(toTime).toLocaleString(),
//         };

//         emailjs
//           .send('service_0x9tr4w', 'template_fs3wu8n', templateParams, 'LSYUfA2MmOon_Fzlv')
//           .then((response) => {
//             // Show SweetAlert2 success popup for 3 seconds
//             Swal.fire({
//               icon: 'success',
//               title: 'Success!',
//               text: 'Task added and email notification sent successfully!',
//               timer: 3000, // Display for 3 seconds
//               timerProgressBar: true, // Show a progress bar
//               showConfirmButton: false, // Hide the "OK" button
//             });
//           })
//           .catch((error) => {
//             console.error('Failed to send email:', error);
//             setError('Failed to send email notification: ' + error.message);
//           });
//       }

//       setTaskName('');
//       setFromTime('');
//       setToTime('');
//       setError('');
//       setEditingTask(null);
//       onHide();
//       refreshTasks();
//     } catch (error) {
//       setError('Failed to save task: ' + error.message);
//     }
//   };

//   return (
//     <Modal show={show} onHide={() => { setEditingTask(null); onHide(); }} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>{editingTask ? 'Edit Task' : 'Add New Task'}</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form onSubmit={handleSubmit}>
//           <Form.Group as={Row} className="mb-3">
//             <Form.Label column sm={3}>Task Name</Form.Label>
//             <Col sm={9}>
//               <Form.Control
//                 type="text"
//                 value={taskName}
//                 onChange={(e) => setTaskName(e.target.value)}
//                 placeholder="Enter task name"
//                 required
//               />
//             </Col>
//           </Form.Group>

//           <Form.Group as={Row} className="mb-3">
//             <Form.Label column sm={3}>From</Form.Label>
//             <Col sm={9}>
//               <Form.Control
//                 type="datetime-local"
//                 value={fromTime}
//                 onChange={(e) => setFromTime(e.target.value)}
//                 required
//               />
//             </Col>
//           </Form.Group>

//           <Form.Group as={Row} className="mb-3">
//             <Form.Label column sm={3}>To</Form.Label>
//             <Col sm={9}>
//               <Form.Control
//                 type="datetime-local"
//                 value={toTime}
//                 onChange={(e) => setToTime(e.target.value)}
//                 required
//               />
//             </Col>
//           </Form.Group>

//           {error && (
//             <Row>
//               <Col>
//                 <div className="alert alert-danger">{error}</div>
//               </Col>
//             </Row>
//           )}

//           <Row>
//             <Col className="text-end">
//               <Button variant="secondary" onClick={() => { setEditingTask(null); onHide(); }} className="me-2">
//                 Cancel
//               </Button>
//               <Button variant="primary" type="submit">
//                 {editingTask ? 'Update Task' : 'Add Task'}
//               </Button>
//             </Col>
//           </Row>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default TaskForm;


import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { database, ref, push, update } from '../../firebase';
import { getAuth } from 'firebase/auth';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2'; 

const TaskForm = ({ show, onHide, editingTask, setEditingTask, refreshTasks }) => {
  const [taskName, setTaskName] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  useEffect(() => {
    if (editingTask) {
      setTaskName(editingTask.name || '');
      setFromTime(editingTask.fromTime || '');
      setToTime(editingTask.toTime || '');
    } else {
      setTaskName('');
      setFromTime('');
      setToTime('');
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple submissions

    if (!taskName || !fromTime || !toTime) {
      setError('All fields are required');
      return;
    }

    if (new Date(toTime) < new Date(fromTime)) {
      setError('End time must be after start time');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError('You must be logged in to manage tasks');
      return;
    }

    setIsSubmitting(true); // Disable further submissions

    try {
      const taskData = {
        name: taskName,
        fromTime: fromTime,
        toTime: toTime,
        createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      };

      let taskAdded = false;

      if (editingTask) {
        await update(ref(database, `users/${user.uid}/tasks/${editingTask.id}`), taskData);
      } else {
        await push(ref(database, `users/${user.uid}/tasks`), taskData);
        taskAdded = true;
      }

      // Send email notification only when adding a new task (not editing)
      if (taskAdded) {
        const templateParams = {
          to_email: user.email,
          user_name: user.displayName || user.email.split('@')[0],
          task_name: taskName,
          from_time: new Date(fromTime).toLocaleString(),
          to_time: new Date(toTime).toLocaleString(),
        };

        await emailjs.send('service_0x9tr4w', 'template_fs3wu8n', templateParams, 'LSYUfA2MmOon_Fzlv')
          .then((response) => {
            // Show SweetAlert2 success popup for 3 seconds
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Task added and email notification sent successfully!',
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          })
          .catch((error) => {
            console.error('Failed to send email:', error);
            setError('Failed to send email notification: ' + error.message);
            setIsSubmitting(false); // Re-enable submission on error
            return;
          });
      }

      // Reset form and close modal only after successful submission
      setTaskName('');
      setFromTime('');
      setToTime('');
      setError('');
      setEditingTask(null);
      setIsSubmitting(false);
      onHide();
      refreshTasks();
    } catch (error) {
      setError('Failed to save task: ' + error.message);
      setIsSubmitting(false); // Re-enable submission on error
    }
  };

  return (
    <Modal show={show} onHide={() => { setEditingTask(null); onHide(); }} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingTask ? 'Edit Task' : 'Add New Task'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>Task Name</Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name"
                required
                disabled={isSubmitting}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>From</Form.Label>
            <Col sm={9}>
              <Form.Control
                type="datetime-local"
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>To</Form.Label>
            <Col sm={9}>
              <Form.Control
                type="datetime-local"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </Col>
          </Form.Group>

          {error && (
            <Row>
              <Col>
                <div className="alert alert-danger">{error}</div>
              </Col>
            </Row>
          )}

          <Row>
            <Col className="text-end">
              <Button
                variant="secondary"
                onClick={() => { setEditingTask(null); onHide(); }}
                className="me-2"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {editingTask ? 'Update Task' : 'Add Task'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TaskForm;