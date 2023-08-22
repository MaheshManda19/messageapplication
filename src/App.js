import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./Auth/Regestration";
import Login from "./Auth/Login";
import { AuthProvider } from "./Auth/Auth";
import {RequireAuth} from "./Auth/RequireAuth";
import UsersList from "./components/Home";
import Chat from "./components/chat";


function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/regestration" element={<Registration />} />
      <Route path="/chat/:username" element={<Chat />} />

        <Route path="/Home" element={<RequireAuth><UsersList /></RequireAuth>} />
     
        
        

      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;

