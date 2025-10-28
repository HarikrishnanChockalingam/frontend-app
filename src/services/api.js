import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/skillshares';

export const skillShareAPI = {
  getAllSkillShares: () => axios.get(`${API_BASE_URL}/allSkillShares`),
  getSkillShareById: (id) => axios.get(`${API_BASE_URL}/${id}`),
  addSkillShare: (skillShare) => axios.post(`${API_BASE_URL}/addSkillShare`, skillShare),
  updateSkillShare: (id, skillShare) => axios.put(`${API_BASE_URL}/${id}`, skillShare),
  deleteSkillShare: (id) => axios.delete(`${API_BASE_URL}/${id}`)
};

export default skillShareAPI;