import React, { Component } from "react"
import PropTypes from "prop-types"
import "./Timeline.css"

// d3
import {
  scaleLinear as d3ScaleLinear,
  scaleTime as d3ScaleTime
} from "d3-scale"
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

  render() {

    let { data } = this.props
    const { height, width } = this.props
    const minDate = new Date(d3Min(data, d => d.start))
    const maxDate = new Date(d3Max(data, d => d.end))

    // Sort data by start date
    data = data.sort((a,b) => new Date(a.start) - new Date(b.start))

    // "X" domain should go from 0 to the length of our data.
    // "X" range should be ... size of the container?
    // TODO: Add colors here.
    const xScale = d3ScaleLinear()
      .domain([0, data.length])
      .range([0, width])

    // "Y" domain should go from the earliest start date to the latest end date in our data.
    // "Y" range should be ... size of the container?
    const yScale = d3ScaleTime()
      .domain([minDate, maxDate])
      .range([height, 0])

    // Functions for selecting the scaled x and y values, and height of our bars
    const selectScaledX = d => xScale(data.indexOf(d))
    const selectScaledY = d => (height - yScale(new Date(d.start)))
    const selectScaledHeight = d => {
      const duration = d3TimeDay.count(new Date(d.start), new Date(d.end))
      const minDateCopy = new Date(minDate.valueOf());
      minDateCopy.setDate(minDateCopy.getDate() + duration)
      return (height - yScale(minDateCopy))
    }

    console.log(d3TimeDay.count(new Date(data[0].start), new Date(data[0].end)))

    const xAxis = d3AxisTop(xScale)
    // .scale(xScale)

    // Set as many "y" ticks as there are enumerated days in the data.
    const yAxis = d3AxisLeft(yScale)
      // .scale(yScale)

    // Add horizontal grid lines
    const gridlines = yAxis
      .ticks(d3TimeDay.count(minDate, maxDate))
      .tickSize(-width)
      .tickFormat("")

    // Map data to rectangles
    const bars = data.map(d => ({
      x: selectScaledX(d),
      y: selectScaledY(d),
      height: selectScaledHeight(d),
      // fill: ,
      name: d.name
    }))

    return (
      <svg className="container" height={height} width={width}>
        <div className="tooltip" />
        <g className="xAxis" ref={node => d3Select(node).call(xAxis)} />
        <g className="yAxis" ref={node => d3Select(node).call(yAxis)} />
        <g className="grid" ref={node => d3Select(node).call(gridlines)} />

        <g className="bars">
          {bars.map(bar => (
            <rect
              width="20"
              x={bar.x}
              y={bar.y}
              height={bar.height}
              fill={bar.fill}
              key={`${bar.x},${bar.y}`}
              name={bar.name}
            />
          ))}
        </g>
      </svg>
    )
  }
}

export default Timeline
