import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import { api } from "../../api";
import {
   TeacherContext,
   TeacherContextType,
} from "../../context/TeacherContext";
import { IoLogOutOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

const Navbar: React.FC = () => {
   const { menu, setMenu } = React.useContext(
      TeacherContext
   ) as TeacherContextType;
   const [token, setToken] = React.useState("");
   const navigate = useNavigate();

   const [image, setImage] = React.useState<string>("");

   const getAvatar = async (imgId: string) => {
      try {
         const response = await api("v1/file/view/" + imgId);
         const data = response.url;

         console.log(data);

         //==============
         setImage(data);
      } catch (error) {
         console.error(error);
      }
   };

   React.useEffect(() => {
      const imgId = localStorage.getItem("url");

      if (imgId) {
         const parseImgId = JSON.parse(imgId);
         console.log(parseImgId);
         getAvatar(parseImgId.toString());
         setToken(parseImgId.toString());
      }
   }, []);

   const logout = () => {
      localStorage.removeItem("url");
      setToken("");
      navigate("/admin");
      setMenu("/admin");
   };
   return (
      <div className="navbar">
         <div className="navbar__container">
            <div className="navbar__item menu">
               <li
                  onClick={() => setMenu("admin")}
                  className={`menu__item ${menu === "admin" ? "active" : ""}`}>
                  <Link to="/">Admin</Link>
               </li>
               <li
                  onClick={() => setMenu("home")}
                  className={`menu__item ${menu === "home" ? "active" : ""}`}>
                  <Link to="/home">Home</Link>
               </li>
               <li
                  onClick={() => setMenu("identification")}
                  className={`menu__item ${
                     menu === "identification" ? "active" : ""
                  }`}>
                  <Link to="/identification">Identification</Link>
               </li>
            </div>

            {!token ? (
               <div>
                  <CgProfile className="navbar__profile-icon" />
               </div>
            ) : (
               <div className="navbar-profile">
                  <div className="navbar__avatar __ibg">
                     <img src={image} alt="" />
                  </div>
                  <ul className="navbar-profile-dropdown">
                     <li>
                        <IoLogOutOutline />
                        <p onClick={logout}>Logout</p>
                     </li>
                  </ul>
               </div>
            )}
         </div>
      </div>
   );
};

export default Navbar;
