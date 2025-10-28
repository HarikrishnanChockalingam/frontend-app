import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SkillShareForm = ({ onAdd, setError, editId }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    skillName: '',
    category: '',
    skillLevel: '',
    userEmail: '',
    description: '',
    availability: ''
  });
  
  const isEditing = !!editId;

  useEffect(() => {
    if (isEditing) {
      axios.get(`http://localhost:8080/api/skillshares/${editId}`)
        .then(response => {
          setFormData(response.data);
        })
        .catch(error => {
          setError('Failed to load skill share data');
        });
    }
  }, [editId, isEditing, setError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.skillName.trim()) {
      setError('Skill name is required');
      return false;
    }
    if (!formData.userEmail.trim()) {
      setError('User email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.userEmail)) {
      setError('Please provide a valid email');
      return false;
    }
    if (!formData.category.trim()) {
      setError('Category is required');
      return false;
    }
    if (!formData.skillLevel.trim()) {
      setError('Skill level is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.availability.trim()) {
      setError('Availability is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/skillshares/${editId}`, formData);
      } else {
        await axios.post('http://localhost:8080/api/skillshares/addSkillShare', formData);
      }
      
      onAdd();
      navigate('/');
      
      setFormData({
        skillName: '',
        category: '',
        skillLevel: '',
        userEmail: '',
        description: '',
        availability: ''
      });
    } catch (error) {
      setError('Failed to save skill share');
    }
  };

  return (
    <div className="form-container">
      <h2>{isEditing ? 'Edit Skill Share' : 'Create Skill Share'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Skill Name</label>
          <input
            type="text"
            name="skillName"
            value={formData.skillName}
            onChange={handleChange}
            placeholder="Skill name"
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            <option value="Technology">Technology</option>
            <option value="Music">Music</option>
            <option value="Arts & Crafts">Arts & Crafts</option>
            <option value="Sports">Sports</option>
            <option value="Languages">Languages</option>
            <option value="Cooking">Cooking</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Skill Level</label>
          <select
            name="skillLevel"
            value={formData.skillLevel}
            onChange={handleChange}
          >
            <option value="">Select skill level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input
            type="email"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleChange}
            placeholder="Your email"
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your skill and what you can teach..."
            rows="4"
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Availability</label>
          <select
            name="availability"
            value={formData.availability}
            onChange={handleChange}
          >
            <option value="">Select availability</option>
            <option value="Available">Available</option>
            <option value="Evenings">Evenings</option>
            <option value="Weekend Only">Weekend Only</option>
            <option value="By Appointment">By Appointment</option>
          </select>
        </div>
        
        <button type="submit" className="btn-primary">
          {isEditing ? 'Update Skill Share' : 'Add Skill Share'}
        </button>
      </form>
    </div>
  );
};

export default SkillShareForm;
