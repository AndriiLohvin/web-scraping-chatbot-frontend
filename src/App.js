import { Routes, Route } from 'react-router-dom'
import SignIn from "./Views/SignIn.js"
import SignUp from "./Views/SignUp.js"
import Home from "./Views/Home.js"

import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Home /> } />  
        <Route path="signin" element={ <SignIn /> } />  
        <Route path="signup" element={ <SignUp /> } />  
      </Routes>          
    </div>
  );
}

export default App;
