
import React, { useEffect, useState } from 'react';
import { Card, Button, ButtonGroup, Form, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaCheck, FaBell, FaExclamationTriangle } from 'react-icons/fa';
import { database, ref, remove, update, onValue, get } from '../../firebase';
import { getAuth } from 'firebase/auth';
import Swal from 'sweetalert2';

const TaskCard = ({ task, id, setEditingTask, setShowTaskForm, refreshTasks, setUserProgress }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [currentProgress, setCurrentProgress] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

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

  // Show success alert when a new task is created
  useEffect(() => {
    if (!user || !task) return;

    // Check if this is a newly created task (within last 5 seconds)
    if (task.createdAt && Date.now() - new Date(task.createdAt).getTime() < 5000) {
      showSuccessAlert('Task created successfully!');
    }
  }, [task, user]);

  // Check for task completion time
  useEffect(() => {
    if (!user || !task || task.completed) return;

    const toTime = new Date(task.toTime).getTime();
    const timeLeft = toTime - Date.now();
    
    if (timeLeft > 0) {
      const timer = setTimeout(async () => {
        const taskRef = ref(database, `users/${user.uid}/tasks/${id}`);
        const snapshot = await get(taskRef);
        
        if (snapshot.exists() && !snapshot.val().completed) {
          showSuccessAlert(`Time completed for task: ${task.name}`);
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
    
    // Show SweetAlert confirmation dialog
    Swal.fire({
      title: 'Delete Task',
      text: `Do you want to delete this task: "${task.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (task.completed) {
            const newProgress = Math.max(0, currentProgress - 10);
            await update(ref(database, `users/${user.uid}/progress`), { value: newProgress });
            
            // Check if setUserProgress is a function before calling it
            if (typeof setUserProgress === 'function') {
              setUserProgress(newProgress);
            } else {
              console.log('setUserProgress is not a function, skipping state update');
            }
          }
    
          await remove(ref(database, `users/${user.uid}/tasks/${id}`));
          refreshTasks();
          
          // Show success message after deletion
          Swal.fire({
            title: 'Deleted!',
            text: 'Your task has been deleted.',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          });
        } catch (error) {
          console.error('Error deleting task:', error);
          showErrorAlert('Failed to delete task: ' + error.message);
        }
      }
    });
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
        
        // Check if setUserProgress is a function before calling it
        if (typeof setUserProgress === 'function') {
          setUserProgress(newProgress);
        } else {
          console.log('setUserProgress is not a function, skipping state update');
        }
        
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
          </ButtonGroup>
        </Card.Body>
      </Card>
    </>
  );
};

export default TaskCard;
