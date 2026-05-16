<<<<<<< HEAD
=======
import { GoogleOAuthProvider } from '@react-oauth/google';
>>>>>>> 7ba8efab5d7ed634e2885490524dd019b0a2596a
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";

<<<<<<< HEAD
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
=======

const clientId = "418733621307-ajvgk9mk30meca1cs7k83tcl63mse6b5.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <UserProvider>
        <App />
      </UserProvider>
    </GoogleOAuthProvider>
>>>>>>> 7ba8efab5d7ed634e2885490524dd019b0a2596a
  </StrictMode>
);
