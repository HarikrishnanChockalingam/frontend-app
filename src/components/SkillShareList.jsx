import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SkillShareList = ({ skillShares, onChange }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill share?')) {
      try {
        await axios.delete(`http://localhost:8080/api/skillshares/${id}`);
        onChange();
      } catch (error) {
        console.error('Failed to delete skill share:', error);
      }
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Skill Sharing Community</h2>
      
      {skillShares.length === 0 ? (
        <div className="empty-state">
          No skill shares found. Be the first to share your skills!
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {skillShares.map(skillShare => (
            <div key={skillShare.id} style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>{skillShare.skillName}</h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
                    <span><strong>Category:</strong> {skillShare.category}</span>
                    <span><strong>Level:</strong> {skillShare.skillLevel}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/edit/${skillShare.id}`} className="btn-secondary" style={{ textDecoration: 'none', fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(skillShare.id)}
                    style={{ 
                      background: '#ef4444', 
                      color: 'white', 
                      border: 'none', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <p style={{ margin: '0 0 1rem 0', color: '#374151' }}>{skillShare.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#6b7280' }}>
                <span><strong>Contact:</strong> {skillShare.userEmail}</span>
                <span><strong>Availability:</strong> {skillShare.availability}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillShareList;