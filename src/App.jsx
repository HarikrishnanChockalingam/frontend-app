import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header.jsx';
import SkillShareForm from './components/SkillShareForm.jsx';
import SkillShareList from './components/SkillShareList.jsx';
import './App.css';

const EditSkillShare = ({ onAdd, setError }) => {
  const { id } = useParams();
  return <SkillShareForm onAdd={onAdd} setError={setError} editId={id} />;
};

function App() {
  const [skillShares, setSkillShares] = useState([]);
  const [error, setError] = useState('');

  const fetchSkillShares = async () => {
    try {
      const response = await axios.get('https://backend-app-oz8v.onrender.com/api/skillshares/allSkillShares');
      setSkillShares(response.data);
    } catch (error) {
      console.error('Failed to fetch skill shares:', error);
    }
  };

  useEffect(() => {
    fetchSkillShares();
  }, []);

  const handleSkillShareChange = () => {
    fetchSkillShares();
    setError('');
  };

  return (
    <Router>
      <div className="App">
        <Header />
        
        <nav style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ marginRight: '1rem', textDecoration: 'none', color: '#3b82f6' }}>
            View Skills
          </Link>
          <Link to="/add" style={{ textDecoration: 'none', color: '#3b82f6' }}>
            Add Skill
          </Link>
        </nav>

        {error && (
          <div style={{ 
            background: '#fee2e2', 
            color: '#dc2626', 
            padding: '1rem', 
            margin: '1rem auto', 
            maxWidth: '600px', 
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <Routes>
          <Route 
            path="/" 
            element={<SkillShareList skillShares={skillShares} onChange={handleSkillShareChange} />} 
          />
          <Route 
            path="/add" 
            element={<SkillShareForm onAdd={handleSkillShareChange} setError={setError} />} 
          />
          <Route 
            path="/edit/:id" 
            element={<EditSkillShare onAdd={handleSkillShareChange} setError={setError} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
