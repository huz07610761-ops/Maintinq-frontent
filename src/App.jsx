import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { AppProvider } from './context/AppContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import AssetPublicPage from './pages/public/AssetPublicPage'
import ScanQR from './pages/public/ScanQR'
import Dashboard from './pages/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster position='top-right'/>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path='/dashboard'  element={<Dashboard/>} />
          <Route path='/scan' element={<ScanQR/>} />
          <Route path="/asset/:id" element={<AssetPublicPage/>} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
