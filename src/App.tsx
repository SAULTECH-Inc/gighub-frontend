import './App.css'
import AppRoutes from "./routes/AppRoutes.tsx";
import { ToastContainer } from 'react-toastify';
function App() {

  return (
    <>
        <AppRoutes/>
        <ToastContainer pauseOnFocusLoss={false} autoClose={1000} hideProgressBar={true} pauseOnHover={false} />
    </>
  )
}

export default App
