import {  Routes, Route, Link, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ApiPage from "./pages/ApiPage";
import Posts from "./pages/Posts";
import DataTablePage from "./pages/DataTablePage";

function App() {
  return (
   <BrowserRouter>
      
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/about">About</Link> |{" "}
        <Link to="/contact">Contact</Link> |{" "}
        <Link to="/api">API</Link> |{" "}
        <Link to="/posts">Posts</Link> |{" "}
        <Link to="/datatable">DataTable</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/api" element={<ApiPage />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/datatable" element={<DataTablePage />} />
      </Routes>
    </BrowserRouter> 
  );
}

export default App;