import {Routes, Route, BrowserRouter } from 'react-router-dom'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import HomePage from './pages/HomePage'


function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<HomePage/>}/> 
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
