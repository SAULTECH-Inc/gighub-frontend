import './App.css'
import AppRoutes from "./routes/AppRoutes.tsx";
import { ToastContainer } from 'react-toastify';
import {BrowserRouter} from "react-router-dom";
function App() {

  return (
    <>
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
        <ToastContainer pauseOnFocusLoss={false} autoClose={1000} hideProgressBar={true} pauseOnHover={false} />
    </>
  )
}

export default App
