import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/login";
import { Home } from "./components/home";
import { Navigation } from "./components/navigation";
import { Logout } from "./components/logout";
import { Form } from "./components/form";

function App() {
  return (
    <BrowserRouter>
      <Navigation></Navigation>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
