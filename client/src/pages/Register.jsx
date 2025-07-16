import { useState } from 'react'
import AuthForm from '../components/AuthForm'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData)
      alert('Registration successful! You can now login.')
      navigate('/login')
    } catch (err) {
      alert('Registration failed. Try using a different username.')
    }
  }

  return <AuthForm type="register" formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} />
}

export default Register
