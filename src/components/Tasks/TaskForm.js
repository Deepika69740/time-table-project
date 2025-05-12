
// import React, { useState, useEffect, useRef } from 'react';
// import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
// import { database, ref, push, update } from '../../firebase';
// import { getAuth } from 'firebase/auth';
// import Swal from 'sweetalert2';
// import emailjs from '@emailjs/browser';

// const TaskForm = ({ show, onHide, editingTask, setEditingTask, refreshTasks }) => {
//   const [taskName, setTaskName] = useState('');
//   const [fromTime, setFromTime] = useState('');
//   const [toTime, setToTime] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const formRef = useRef(null); // To prevent duplicate submissions
  
//   // EmailJS configuration
//   const SERVICE_ID = "service_7s8qa0f";
//   const TEMPLATE_ID = "template_k8j29w7";
//   const PUBLIC_KEY = "h7FW0ReYv7_70X8U5";

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
//     setError('');
//     setLoading(false);
//   }, [editingTask, show]);

//   const formatDateTime = (dateTimeStr) => {
//     const date = new Date(dateTimeStr);
//     return date.toLocaleString();
//   };

//   const sendNotificationEmail = async (taskData, user) => {
//     try {
//       const templateParams = {
//         user_name: user.displayName || user.email.split('@')[0],
//         task_name: taskData.name,
//         from_time: formatDateTime(taskData.fromTime),
//         to_time: formatDateTime(taskData.toTime),
//         to_email: user.email
//       };

//       const response = await emailjs.send(
//         SERVICE_ID,
//         TEMPLATE_ID,
//         templateParams,
//         PUBLIC_KEY
//       );
//       console.log("Email sent:", response);
//       return true;
//     } catch (error) {
//       console.error("Email failed:", error);
//       return false;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Prevent duplicate submissions
//     if (loading) return;
//     setLoading(true);
//     setError('');

//     // Validate form
//     if (!taskName || !fromTime || !toTime) {
//       setError('All fields are required');
//       setLoading(false);
//       return;
//     }

//     if (new Date(toTime) < new Date(fromTime)) {
//       setError('End time must be after start time');
//       setLoading(false);
//       return;
//     }

//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (!user) {
//       setError('You must be logged in to manage tasks');
//       setLoading(false);
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
//         // Update task (no email)
//         await update(ref(database, `users/${user.uid}/tasks/${editingTask.id}`), taskData);
//       } else {
//         // Add new task (send email)
//         const taskRef = await push(ref(database, `users/${user.uid}/tasks`), taskData);
        
//         // Only send email if task was successfully added
//         if (taskRef.key) {
//           await sendNotificationEmail(taskData, user);
//         }
//       }

//       // Success message
//       Swal.fire({
//         icon: 'success',
//         title: 'Success!',
//         text: `Task ${editingTask ? 'updated' : 'added'} successfully!`,
//         timer: 3000,
//         showConfirmButton: false,
//       });

//       // Reset form
//       setTaskName('');
//       setFromTime('');
//       setToTime('');
//       setEditingTask(null);
//       onHide();
//       refreshTasks();
//     } catch (error) {
//       setError('Failed to save task: ' + error.message);
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={() => { setEditingTask(null); onHide(); }} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>{editingTask ? 'Edit Task' : 'Add New Task'}</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form onSubmit={handleSubmit} ref={formRef}>
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
//               <Button
//                 variant="secondary"
//                 onClick={() => { setEditingTask(null); onHide(); }}
//                 className="me-2"
//                 disabled={loading}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="primary"
//                 type="submit"
//                 disabled={loading}
//               >
//                 {loading ? 'Processing...' : (editingTask ? 'Update Task' : 'Add Task')}
//               </Button>
//             </Col>
//           </Row>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default TaskForm;









import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { database, ref, push, update } from '../../firebase';
import { getAuth } from 'firebase/auth';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

const TaskForm = ({ show, onHide, editingTask, setEditingTask, refreshTasks }) => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  
  // EmailJS configuration
  const SERVICE_ID = "service_96ek2a6";
  const TEMPLATE_ID = "template_1ii65ac";
  const PUBLIC_KEY = "Iy-Xbj1Xdn4QmMdV4";

  useEffect(() => {
    if (editingTask) {
      setTaskName(editingTask.name || '');
      setDescription(editingTask.description || '');
      setFromTime(editingTask.fromTime || '');
      setToTime(editingTask.toTime || '');
    } else {
      setTaskName('');
      setDescription('');
      setFromTime('');
      setToTime('');
    }
    setError('');
    setLoading(false);
  }, [editingTask, show]);

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  const sendNotificationEmail = async (taskData, user) => {
    try {
      const templateParams = {
        user_name: user.displayName || user.email.split('@')[0],
        task_name: taskData.name,
        task_description: taskData.description || 'No description provided',
        from_time: formatDateTime(taskData.fromTime),
        to_time: formatDateTime(taskData.toTime),
        to_email: user.email
      };

      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );
      console.log("Email sent:", response);
      return true;
    } catch (error) {
      console.error("Email failed:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;
    setLoading(true);
    setError('');

    // Validate form
    if (!taskName || !fromTime || !toTime) {
      setError('All fields except description are required');
      setLoading(false);
      return;
    }

    if (new Date(toTime) < new Date(fromTime)) {
      setError('End time must be after start time');
      setLoading(false);
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError('You must be logged in to manage tasks');
      setLoading(false);
      return;
    }

    try {
      const taskData = {
        name: taskName,
        description: description,
        fromTime: fromTime,
        toTime: toTime,
        createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
        completed: editingTask ? editingTask.completed : false,
        emailSent: editingTask ? editingTask.emailSent : false
      };

      if (editingTask) {
        await update(ref(database, `users/${user.uid}/tasks/${editingTask.id}`), taskData);
      } else {
        const taskRef = await push(ref(database, `users/${user.uid}/tasks`), taskData);
        
        if (taskRef.key) {
          await sendNotificationEmail(taskData, user);
        }
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: `Task ${editingTask ? 'updated' : 'added'} successfully!`,
        timer: 3000,
        showConfirmButton: false,
      });

      // Reset form
      setTaskName('');
      setDescription('');
      setFromTime('');
      setToTime('');
      setEditingTask(null);
      onHide();
      refreshTasks();
    } catch (error) {
      setError('Failed to save task: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={() => { setEditingTask(null); onHide(); }} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingTask ? 'Edit Task' : 'Add New Task'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} ref={formRef}>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>Task Name</Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name"
                required
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>Description</Form.Label>
            <Col sm={9}>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description (optional)"
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
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Processing...' : (editingTask ? 'Update Task' : 'Add Task')}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TaskForm;



















