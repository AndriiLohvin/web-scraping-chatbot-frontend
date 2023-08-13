import { Routes, Route } from 'react-router-dom'
import SignIn from "./Views/SignIn.js"
import SignUp from "./Views/SignUp.js"
import Chatbot from "./Views/Chatbot.js"
import Dashboard from "./Views/Dashboard.js"
import './App.css';
import Navbar from './Components/Nabvar.js'
import { PrivateRoute } from './Components/PrivateRoute.js'

function App() {
  return (
    <div className="App gradient-custom">
        <Navbar />
        <Routes>
          <Route path="/" element={ <PrivateRoute> <Dashboard /> </PrivateRoute> } />
          <Route path="signin" element={ <SignIn /> } />  
          <Route path="signup" element={ <SignUp /> } /> 
          <Route path="chatbot/:chatbotId/:chatlogId" element={ <PrivateRoute> <Chatbot /> </PrivateRoute> } />  
        </Routes>          
    </div>
  );
}

export default App;