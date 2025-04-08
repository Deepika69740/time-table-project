import React, { useState, useEffect } from 'react';
// import { auth, database, ref, get } from '../firebase';
import { auth, database, ref, get } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';

const Dashboard = ({ onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = ref(database, 'users/' + user.uid);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
    <div className="dashboard-container">
      <div className="sidebar">
        <Card className="user-card">
          <Card.Body>
            <Card.Title>User Profile</Card.Title>
            <div className="user-details">
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Joined:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
            </div>
            <Button 
              variant="danger" 
              onClick={handleLogout}
              className="mt-3"
            >
              Logout
            </Button>
          </Card.Body>
        </Card>
      </div>
      <div className="main-content">
        <h2>Welcome to your Dashboard, {userData.name}!</h2>
        <p>This is your personalized dashboard content.</p>
      </div>
    </div>
  );
};

export default Dashboard;