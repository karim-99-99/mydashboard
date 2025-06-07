import React from "react";
import Calendar from "./components/Calendar";
import "./App.css";
import Header from "./components/header";
import Appointment from "./components/appointment";
import Charts from "./components/charts";
// import image from "./assets/image.jpg"
function App() {
  return (
    <div className="bg-[#eeeeee]">
          {/* <div
        style={{
          position: 'absolute',
          top: 187,
          left: 110,
          width: '83vw',
          height: '98vh',
          zIndex: -1,
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '10px',
        }}
      ></div> */}
      <Header />
      <Calendar />
      {/* <Appointment /> */}
      {/* <Charts /> */}
    </div>
  );
}

export default App;
