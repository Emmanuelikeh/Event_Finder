import logo from './logo.svg';
import './App.css';
import LoginPage from './Pages/LoginPage';
import SignUp from './Pages/SignUp';
import Dashboard from './Pages/Dashboard';
import {BrowserRouter as Router, Route, Switch, Routes, BrowserRouter} from 'react-router-dom';
import Layout from './Components/Layout';
import Postings from './Pages/Postings';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignUp/>} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/postings"  element={<Layout><Postings/></Layout>} />

    </Routes>
    </BrowserRouter>
  );
}

export default App;
