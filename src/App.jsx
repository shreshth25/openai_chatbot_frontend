import { BrowserRouter, Route, Routes } from "react-router-dom";
import AIChat from "./pages/AIChat"
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<AIChat/>}></Route>
      <Route exact path="/login" element={<Login/>}></Route>
    </Routes>
  </BrowserRouter>
  )

}

export default App;
