import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin/Admin";
import Identification from "./pages/Identification/Identification";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import TeacherContextProvider from "./context/TeacherContext";

function App() {
   return (
      <Router>
         <TeacherContextProvider>
            <Navbar />
            <Routes>
               <Route path="/" element={<Admin />} />
               <Route path="/identification" element={<Identification />} />
               <Route path="/home" element={<Home />} />
            </Routes>
         </TeacherContextProvider>
      </Router>
   );
}

export default App;
