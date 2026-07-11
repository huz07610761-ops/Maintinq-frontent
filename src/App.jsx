import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { AppProvider } from './context/AppContext'
import { BrowserRouter, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster position='top-right'/>
        <Routes>
          <Route path="/" element={} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
