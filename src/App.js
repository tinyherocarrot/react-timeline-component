import React, { Component } from "react"
// import "./App.css"

import Timeline from "./components/Timeline"

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Timeline width={400} height={800}/>
        </header>
      </div>
    )
  }
}

export default App
