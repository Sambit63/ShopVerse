import { useState } from 'react'
// import './App.css'
import { Toaster } from 'react-hot-toast';
import AllRoutes from "./routes/AllRoutes";
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            borderRadius: "12px",
            padding: "16px",
            fontSize: "14px",
          },
        }}
      />
      <AllRoutes/>
    </>
  )
}

export default App
