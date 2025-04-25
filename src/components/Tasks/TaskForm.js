// import React, { useState, useEffect } from 'react';
// import { Modal, Form, Button,Row,Col } from 'react-bootstrap';
// import { database, ref, push, update } from '../../firebase';
// import { getAuth } from 'firebase/auth';


// const TaskForm = ({ show, onHide, editingTask, setEditingTask, refreshTasks }) => {
//   const [taskName, setTaskName] = useState('');
//   const [completionTime, setCompletionTime] = useState('');
//   const [error, setError] = useState('');


//   useEffect(() => {
//     if (editingTask) {
//       setTaskName(editingTask.name);
//       setCompletionTime(editingTask.completionTime);
//     } else {
//       setTaskName('');
//       setCompletionTime('');
//     }
//   }, [editingTask]);


//   const handleSubmit = async (e) => {
//     e.preventDefault();
   
//     if (!taskName || !completionTime) {
//       setError('Both fields are required');
//       return;
//     }


//     const auth = getAuth();
//     const user = auth.currentUser;


//     if (!user) {
//       setError('You must be logged in to manage tasks');
//       return;
//     }


//     try {
//       if (editingTask) {
//         // Update existing task
//         await update(ref(database, `users/${user.uid}/tasks/${editingTask.id}`), {
//           name: taskName,
//           completionTime: completionTime
//         });
//       } else {
//         // Add new task
//         await push(ref(database, `users/${user.uid}/tasks`), {
//           name: taskName,
//           completionTime: completionTime,
//           createdAt: new Date().toISOString(),
//           completed: false
//         });
//       }


//       setTaskName('');
//       setCompletionTime('');
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
//     <Modal.Header closeButton>
//       <Modal.Title>{editingTask ? 'Edit Task' : 'Add New Task'}</Modal.Title>
//     </Modal.Header>
//     <Modal.Body>
//       <Form onSubmit={handleSubmit}>
//         <Form.Group as={Row} className="mb-3">
//           <Form.Label column sm={3}>Task Name</Form.Label>
//           <Col sm={9}>
//             <Form.Control
//               type="text"
//               value={taskName}
//               onChange={(e) => setTaskName(e.target.value)}
//               placeholder="Enter task name"
//               required
//             />
//           </Col>
//         </Form.Group>

//         <Form.Group as={Row} className="mb-3">
//           <Form.Label column sm={3}>Due Date</Form.Label>
//           <Col sm={9}>
//             <Form.Control
//               type="datetime-local"
//               value={completionTime}
//               onChange={(e) => setCompletionTime(e.target.value)}
//               required
//             />
//           </Col>
//         </Form.Group>

//         {error && (
//           <Row>
//             <Col>
//               <div className="alert alert-danger">{error}</div>
//             </Col>
//           </Row>
//         )}

//         <Row>
//           <Col className="text-end">
//             <Button variant="secondary" onClick={() => { setEditingTask(null); onHide(); }} className="me-2">
//               Cancel
//             </Button>
//             <Button variant="primary" type="submit">
//               {editingTask ? 'Update Task' : 'Add Task'}
//             </Button>
//           </Col>
//         </Row>
//       </Form>
//     </Modal.Body>
//   </Modal>
//   );
// };


// export default TaskForm;
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { database, ref, push, update } from '../../firebase';
import { getAuth } from 'firebase/auth';

const TaskForm = ({ show, onHide, editingTask, setEditingTask, refreshTasks }) => {
  const [taskName, setTaskName] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [error, setError] = useState('');

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

    try {
      const taskData = {
        name: taskName,
        fromTime: fromTime,
        toTime: toTime,
        createdAt: editingTask ? editingTask.createdAt : new Date().toISOString()
      };

      if (editingTask) {
        await update(ref(database, `users/${user.uid}/tasks/${editingTask.id}`), taskData);
      } else {
        await push(ref(database, `users/${user.uid}/tasks`), taskData);
      }

      setTaskName('');
      setFromTime('');
      setToTime('');
      setError('');
      setEditingTask(null);
      onHide();
      refreshTasks();
    } catch (error) {
      setError('Failed to save task: ' + error.message);
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
              <Button variant="secondary" onClick={() => { setEditingTask(null); onHide(); }} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
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