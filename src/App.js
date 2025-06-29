import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import "./components/Auth.css"; 

import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import JoinGame from "./components/JoinGame";

function App() {
  const api_key = "ysgxumzza2q5";
  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(api_key);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (token) {
      client
        .connectUser(
          {
            id: cookies.get("userId"),
            name: cookies.get("username"),
            hashedPassword: cookies.get("hashedPassword"),
          },
          token
        )
        .then(() => setIsAuth(true))
        .catch(() => setIsAuth(false));
    }
  }, [token]);

  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("username");
    cookies.remove("hashedPassword");
    cookies.remove("channelName");
    client.disconnectUser();
    setIsAuth(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {!isAuth ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
              <Route path="/signup" element={<SignUp setIsAuth={setIsAuth} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route
                path="/joingame"
                element={
                  <Chat client={client}>
                    <JoinGame />
                    <button onClick={logOut} className="auth-button">Desconectar</button>
                  </Chat>
                }
              />
              <Route path="*" element={<Navigate to="/joingame" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;