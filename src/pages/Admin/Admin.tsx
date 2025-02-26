import React from "react";
import "./Admin.scss";
import uploadArea from "../../assets/upload_area.png";
import { api } from "../../api";
import { SiPanasonic } from "react-icons/si";

interface FormState {
   id?: number;
   firstName: string;
   lastName: string;
   phone: string;
   pinfl: string;
   degree: string;
   position: string;
}

interface FormImage {
   teacherId: number;
   file: string;
}

const Admin: React.FC = () => {
   const [id, setId] = React.useState<string>("");
   const [image, setImage] = React.useState<File | undefined>();
   const [data, setData] = React.useState<FormState>({
      firstName: "",
      lastName: "",
      phone: "",
      pinfl: "",
      degree: "",
      position: "",
   });
   const [formData, setFormData] = React.useState<FormState>({
      firstName: "",
      lastName: "",
      phone: "",
      pinfl: "",
      degree: "",
      position: "",
   });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setFormData((prevState) => ({
         ...prevState,
         [name]: value,
      }));
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         setImage(file);
      }
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      await api("teachers/create", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            pinfl: formData.pinfl,
            degree: formData.degree,
            position: formData.position,
         }),
      })
         .then((res) => res.json())
         .then((data) => setData(data))
         .catch((err) => {
            console.log(err);
         });
   };

   const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!id || !image) return;

      const formData1 = new FormData();
      formData1.append("teacherId", id.toString());
      formData1.append("file", image);

      await api("v1/teacher/face/register", {
         method: "POST",
         body: formData1,
      })
         .then((res) => {
            if (res.ok) {
               console.log("Success");
            } else {
               console.log("Error");
            }
         })
         .catch((err) => {
            console.log(err);
         });
   };

   return (
      <div className="admin">
         <div className="admin__title">Create teacher</div>
         <form className="admin__teacher" onSubmit={handleSubmit}>
            <div className="admin__items">
               <div className="admin__teacher-name">
                  <p>First name</p>
                  <input
                     onChange={handleChange}
                     type="text"
                     name="firstName"
                     className="admin__teacher-input"
                     value={formData.firstName}
                     placeholder="Type here"
                  />
               </div>
               <div className="admin__teacher-name flex-col">
                  <p>Last name</p>
                  <input
                     onChange={handleChange}
                     type="text"
                     className="admin__teacher-input"
                     name="lastName"
                     value={formData.lastName}
                     placeholder="Type here"
                  />
               </div>
               <div className="admin__teacher-name flex-col">
                  <p>Phone number</p>
                  <input
                     onChange={handleChange}
                     type="text"
                     name="phone"
                     className="admin__teacher-input"
                     value={formData.phone}
                     placeholder="Type here"
                  />
               </div>
               <div className="admin__teacher-name flex-col">
                  <p>Jshshir</p>
                  <input
                     onChange={handleChange}
                     type="text"
                     name="pinfl"
                     className="admin__teacher-input"
                     value={formData.pinfl}
                     placeholder="Type here"
                  />
               </div>
               <div className="admin__teacher-name flex-col">
                  <p>Degree</p>
                  <input
                     onChange={handleChange}
                     type="text"
                     name="degree"
                     className="admin__teacher-input"
                     value={formData.degree}
                     placeholder="Type here"
                  />
               </div>
               <div className="admin__teacher-name flex-col">
                  <p>Position</p>
                  <input
                     onChange={handleChange}
                     type="text"
                     name="position"
                     className="admin__teacher-input"
                     value={formData.position}
                     placeholder="Type here"
                  />
               </div>
            </div>

            <div className="admin__btn">
               <button type="submit" className="admin__btn-btn">
                  Add
               </button>
               {data?.id && (
                  <div className="admin__btn-popup">
                     {data?.id ? (
                        <span>
                           Sizning id ingiz:
                           <span className="admin__btn-id">
                              {data?.id}
                           </span>{" "}
                        </span>
                     ) : null}
                  </div>
               )}
            </div>
         </form>

         <hr className="admin__line" />

         {/* Add images */}

         <div className="admin__title">Add image</div>
         <form className="admin__image" onSubmit={handleOnSubmit}>
            <div className="admin__image-id">
               <p>Teacher Id</p>
               <input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  type="string"
                  name="teacherId"
                  className="admin__image-input"
                  placeholder="Type here"
               />
            </div>
            <div>
               <p className="admin__image-title">Upload Image</p>
               <label htmlFor="image">
                  <img
                     src={image ? URL.createObjectURL(image) : uploadArea}
                     alt="image"
                  />
               </label>
               <div className="send">
                  <input
                     type="file"
                     id="image"
                     name="image"
                     onChange={handleFileChange}
                  />
               </div>
            </div>
            <button className="admin__image-btn">Add image</button>
         </form>
      </div>
   );
};

export default Admin;
