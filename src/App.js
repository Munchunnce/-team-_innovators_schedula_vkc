import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from './components/Login';
import Signup from './components/Signup';
import Otp from './components/Otp';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path='/login' element={<Login />}></Route>
          <Route path='/otp' element={<Otp />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
