import axios from 'axios';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// API endpoint for predicting sausage images
export const predictSausage = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  
  try {
    const response = await apiClient.post('/predict', formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'An error occurred during prediction');
  }
};

export default {
  predictSausage
};