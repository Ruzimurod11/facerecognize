import React, { useEffect, useRef, useState } from "react";
import { IoCameraOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoDownloadOutline } from "react-icons/io5";
import { api } from "../../api";
import "./Identification.scss";
import { useNavigate } from "react-router-dom";
import { TeacherContext } from "../../context/TeacherContext";

type IdImage = { id: number; imgId: number; faceImgId: number };

interface IGetImage {
   data: [number: IdImage];
   errorMessage: "";
   success: boolean;
   timestamp: number;
}

const Identification: React.FC = () => {
   const { setMenu } = React.useContext(TeacherContext);
   // const [base64Image, setBase64Image] = useState<string>("");
   const [id, setId] = React.useState<string>("");
   const videoRef = useRef<HTMLVideoElement>(null);
   const [isEnabled, setIsEnabled] = useState<boolean>(false);
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const [imageUrl, setImageUrl] = useState<File | undefined>();
   const navigate = useNavigate();

   const startVideo = async () => {
      try {
         const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
         });
         if (videoRef.current) {
            videoRef.current.srcObject = stream;
         }
      } catch (err) {
         console.error("Ошибка при доступе к камере:", err);
      }
   };

   const stopVideo = async () => {
      if (videoRef.current && videoRef.current.srcObject) {
         const stream = videoRef.current.srcObject as MediaStream;
         const tracks = stream.getTracks();
         tracks.forEach((track) => track.stop());
      }
   };

   useEffect(() => {
      stopVideo();

      if (isEnabled) {
         startVideo();
         const timer = setTimeout(() => {
            capturePhoto();
         }, 12000); // Захват через 6 секунд

         return () => clearTimeout(timer);
      }
   }, [isEnabled]);

   const capturePhoto = () => {
      if (videoRef.current && canvasRef.current) {
         const context = canvasRef.current.getContext("2d");
         if (context) {
            const videoWidth = videoRef.current.videoWidth;
            const videoHeight = videoRef.current.videoHeight;

            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            // Рисуем кадр с видео на canvas
            context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

            // Получаем изображение в формате base64
            const imageUrl = canvasRef.current.toDataURL("image/png");

            const base64ToBlob = (base64: string) => {
               const byteCharacters = atob(base64.split(",")[1]);
               const byteArrays: number[] = [];

               for (let offset = 0; offset < byteCharacters.length; offset++) {
                  byteArrays.push(byteCharacters.charCodeAt(offset));
               }

               return new Blob([new Uint8Array(byteArrays)], {
                  type: "image/png",
               });
            };

            const base64ToFile = (base64: string, filename: string): File => {
               const blob = base64ToBlob(base64);
               return new File([blob], filename, { type: blob.type });
            };

            const file = base64ToFile(imageUrl, "photo.png");
            setImageUrl(file);

            // Автоматически отправляем фото на сервер
            handleOnSubmit(file);
            getImage(id);
         }
      }
   };

   const deletePhoto = () => {
      const context = canvasRef.current?.getContext("2d");
      if (context && canvasRef.current) {
         context.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
         );
      }
   };

   const downloadPhoto = () => {
      if (canvasRef.current) {
         const link = document.createElement("a");
         link.download = "photo.png";
         link.href = canvasRef.current.toDataURL("image/png");
         link.click();
      }
   };

   // Функция отправки данных на сервер
   async function handleOnSubmit(file: File) {
      if (!id || !file) return;

      const formData = new FormData();
      formData.append("teacherId", id);
      formData.append("file", file);

      try {
         const response = await api("v1/teacher/face/recognize/by/id", {
            method: "POST",
            body: formData,
         });

         if (response.ok) {
            setIsEnabled(false);
            console.log("Фото успешно отправлено на сервер");
            navigate("/home");
            setMenu("home");
         } else {
            console.log("Ошибка при отправке фото");
         }
      } catch (err) {
         console.log("Ошибка:", err);
      }
   }

   async function getImage(id: string) {
      try {
         const response = await api("v1/teacher/face/list/" + id);
         const data: IGetImage = await response.json();
         localStorage.setItem("url", JSON.stringify(data.data[0].imgId));
         // console.log(data.data[0].imgId);
      } catch (err) {
         console.log(err);
      }
   }

   return (
      <div className="identification__container">
         <div className="identification__image-id">
            <p>Teacher Id</p>
            <input
               value={id}
               onChange={(e) => {
                  setId(e.target.value);
                  setIsEnabled(!isEnabled);
               }}
               type="text"
               name="teacherId"
               className="identification__image-input"
               placeholder="Type here"
            />
         </div>
         <video ref={videoRef} playsInline muted autoPlay></video>
         <div className="controls">
            <div className="button" onClick={() => setIsEnabled(!isEnabled)}>
               <span className="button__item">{isEnabled ? "off" : "on"}</span>
            </div>
            <div className="button" onClick={capturePhoto}>
               <IoCameraOutline className="button__item" />
            </div>
            <div className="button" onClick={deletePhoto}>
               <RiDeleteBin6Line className="button__item" />
            </div>
            <div className="button" onClick={downloadPhoto}>
               <IoDownloadOutline className="button__item" />
            </div>
         </div>

         <canvas ref={canvasRef} className="canvas" />

         {/* Остальная логика не изменяется */}
      </div>
   );
};

export default Identification;
