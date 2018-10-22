import React, { Component } from "react"
import styled from "styled-components"

// Internal Modules
import Timeline from "./components/Timeline"
import timelineItems from "./timelineItems"

class App extends Component {
  render() {
    return (
      <div className="App">
        <Page>
          <h1>Your Timeline</h1>
          <Timeline data={timelineItems} width={400} height={800} />
        </Page>
      </div>
    )
  }
}

export default App

// - - - - - - - - - - - - - 

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
`
