import React from 'react';
import { useGlobalContext } from '../context/GlobalContext';

const Dashboard = () => {
  const { user } = useGlobalContext();

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? <p>Welcome, {user.name}</p> : <p>Please log in</p>}
    </div>
  );
};

export default Dashboard;
