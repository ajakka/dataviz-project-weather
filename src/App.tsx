import "./App.css";
import React from "react";
import Map from "./components/Map";
import Border from "./components/Border";

function App() {
  return (
    <div className="App" style={{ marginBottom: "4rem" }}>
      <h1>Morocco's weather data</h1>

      <Map onCityPressed={(c) => console.log(c)} />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 8,
          visibility: "hidden",
        }}
      >
        <Border style={{ width: "50%", marginRight: 4 }}>
          {" "}
          Placeholder for temp
        </Border>
        <Border style={{ width: "50%", marginLeft: 4 }}>
          {" "}
          Placeholder for temp
        </Border>
      </div>
    </div>
  );
}

export default App;
