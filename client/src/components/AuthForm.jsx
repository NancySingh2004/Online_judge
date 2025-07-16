import { TextField, Button, Typography, Box, Paper } from '@mui/material'

const AuthForm = ({ type, formData, setFormData, handleSubmit }) => {
  const isLogin = type === 'login'

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 2,
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: 350 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {isLogin ? 'Login to Your Account' : 'Create an Account'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />

          {!isLogin && (
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          )}

          <TextField
            fullWidth
            label="Password"
            margin="normal"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: '#1976d2' }}
          >
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

export default AuthForm
