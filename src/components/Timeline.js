import React, { Component } from "react"
import PropTypes from "prop-types"
import "./Timeline.scss"

// d3
import { scaleTime as d3ScaleTime, scaleBand as d3ScaleBand } from "d3-scale"
import { axisTop as d3AxisTop, axisLeft as d3AxisLeft } from "d3-axis"
import { select as d3Select } from "d3-selection"
import { min as d3Min, max as d3Max } from "d3-array"
import { timeDay as d3TimeDay } from "d3-time"

import timelineItems from "../timelineItems"

/**
 * If data is passed in by redux,
 * then when data (dates) updates,
 * whole component should update.
 */

class Timeline extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        start: PropTypes.string,
        end: PropTypes.string,
        name: PropTypes.string
      })
    ).isRequired
  }

  static defaultProps = {
    data: timelineItems
  }

  state = {
    toolText: "",
    clientX: 0,
    clientY: 0
  }

  handleBarHover = e => {
    const toolText = e.target.getAttribute("name")
    const { clientX, clientY } = e
    this.setState({ clientX, clientY, toolText })
  }

  render() {
    let { data, height, width } = this.props
    const margin = { top: 40, right: 0, bottom: 40, left: 40 }
    width = +width - margin.right - margin.left
    height = +height - margin.top - margin.bottom
    console.log(width, height)

    const minDate = new Date(d3Min(data, d => d.start))
    const maxDate = new Date(d3Max(data, d => d.end))

    // Sort data by start date
    data = data.sort((a, b) => new Date(a.start) - new Date(b.start))

    // "X" domain should go from 0 to the length of our data.
    // "X" range should be ... size of the container?
    const xScale = d3ScaleBand()
      // .domain([0, data.length])
      .range([0, width])
      .round(true)
      .padding(0.3)
      .domain(data.map((d, i) => i))

    // "Y" domain should go from the earliest start date to the latest end date in our data.
    // "Y" range should be ... size of the container?
    const yScale = d3ScaleTime()
      .domain([minDate, maxDate])
      .range([0, height])

    // Functions for selecting the scaled x and y values, and height of our bars
    const selectScaledX = d => xScale(data.indexOf(d))
    const selectScaledY = d =>
      Math.floor(yScale(new Date(d.start))) + 5 //FIXME: hacky fixed "scoot" of 5px
      // Math.floor(height - yScale(new Date(d.start))) - 5 //FIXME: hacky fixed "scoot" of 5px
    const selectScaledHeight = d => {
      const duration = d3TimeDay.count(new Date(d.start), new Date(d.end)) + 1
      const minDateCopy = new Date(minDate.valueOf())
      minDateCopy.setDate(minDateCopy.getDate() + duration)
      return Math.floor(yScale(minDateCopy)) - Math.floor(yScale(minDate))
      // return height - Math.floor(yScale(minDateCopy))
    }

    const xAxis = d3AxisTop(xScale).ticks(3)
    // .scale(xScale)

    // Set as many "y" ticks as there are enumerated days in the data.
    const yAxis = d3AxisLeft(yScale)
    // .scale(yScale)

    // Add horizontal grid lines
    const dateArr = d3TimeDay.range(minDate, maxDate, 1)
    // const formattedDateArr = dateArr.map(d => d.toISOString().slice(0,10))
    yAxis.tickValues(dateArr).tickSize(-width)
    // .tickFormat("")

    // Map data to rectangles
    const swatch = [
      "#914AED",
      "#ED314A",
      "#3276DC",
      "#FFD66E",
      "#00D66F",
      "#30CEF2"
    ]
    const bars = data.map((d, i) => ({
      x: selectScaledX(d),
      y: selectScaledY(d),
      height: selectScaledHeight(d),
      width: xScale.bandwidth(),
      fill: swatch[i % swatch.length],
      name: d.name
    }))

    const { clientX, clientY, toolText } = this.state

    return (
      <>
        <div
          className="timeline__tooltip"
          style={{ left: clientX, top: clientY }}>
          {toolText}
        </div>
        <svg
          className="timeline__container"
          height={height}
          width={width}
          overflow="scroll">
          <g
            className="timeline__axis--x"
            ref={node => d3Select(node).call(xAxis)}
          />
          <g
            className="timeline__axis--y"
            ref={node => d3Select(node).call(yAxis)}
          />
          <g className="timeline__bars">
            {bars.map(bar => (
              <rect
                onMouseOver={e => this.handleBarHover(e)}
                className="timeline__bar"
                x={bar.x}
                y={bar.y}
                height={bar.height}
                width={bar.width}
                fill={bar.fill}
                key={`${bar.x},${bar.y}`}
                name={bar.name}
                rx="10" // this should be dynamic
                ry="10" // this should be dynamic
              />
            ))}
          </g>
        </svg>
      </>
    )
  }
}

export default Timeline
