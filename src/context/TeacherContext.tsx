import React, { PropsWithChildren } from "react";

export interface TeacherContextType {
   menu: string;
   setMenu: React.Dispatch<React.SetStateAction<string>>;
}

export const TeacherContext = React.createContext<TeacherContextType | null>(
   null
);

const TeacherContextProvider: React.FC<PropsWithChildren<{}>> = (props) => {
   const [menu, setMenu] = React.useState<string>("admin");

   const contextValue = {
      menu,
      setMenu,
   };

   return (
      <TeacherContext.Provider value={contextValue}>
         {props.children}
      </TeacherContext.Provider>
   );
};

export default TeacherContextProvider;
