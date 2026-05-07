import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import ApiPage from "./pages/ApiPage";

function App() {
  return (
    <BrowserRouter basename="/react">
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/about">About</Link> |{" "}
        <Link to="/contact">Contact</Link> |{" "}
        <Link to="/api">API Page</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/api" element={<ApiPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;