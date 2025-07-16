import { useState } from 'react'
import AuthForm from '../components/AuthForm'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData)
      localStorage.setItem('token', res.data.token)
      navigate('/problems')
    } catch (err) {
      alert('Login failed. Please check your credentials.')
    }
  }

  return <AuthForm type="login" formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} />
}

export default Login
