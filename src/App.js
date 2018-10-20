import React, { Component } from "react"
import InlineEdit from "./components/InlineEdit.js"
import Timeline from "./components/Timeline"

import timelineItems from "./timelineItems"

class App extends Component {
  render() {
    return (
      <div className="App">
        <InlineEdit
            onChange={val => console.log(val)}
            value={"toolText"}
          />
        <header className="App-header" style={{textAlign: "center", paddingTop: "20px"}}>
          <Timeline data={timelineItems} width={400} height={800}/>
        </header>
      </div>
    )
  }
}

export default App
