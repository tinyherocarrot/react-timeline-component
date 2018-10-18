import React, { Component } from "react"
// import "./App.css"

import Timeline from "./components/Timeline"

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header" style={{textAlign: "center", paddingTop: "20px"}}>
          <Timeline width={400} height={800}/>
        </header>
      </div>
    )
  }
}

export default App
