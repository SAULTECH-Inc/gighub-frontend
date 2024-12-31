import './App.css'
import AppRoutes from "./routes/AppRoutes.tsx";
import { ToastContainer } from 'react-toastify';
function App() {

  return (
    <>
        <AppRoutes/>
        <ToastContainer />
    </>
  )
}

export default App
