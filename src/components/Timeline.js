import React, { Component } from "react"
import PropTypes from "prop-types"
import "./Timeline.scss"

// d3
import { scaleTime as d3ScaleTime, scaleBand as d3ScaleBand } from "d3-scale"
import { axisTop as d3AxisTop, axisLeft as d3AxisLeft } from "d3-axis"
import { select as d3Select } from "d3-selection"
import { min as d3Min, max as d3Max } from "d3-array"
import { timeDay as d3TimeDay } from "d3-time"
import { timeFormat as d3TimeFormat } from "d3-time-format"

import { connect } from "react-redux"
import { edit, load, select } from "../redux/inlineEdit"

import InlineEdit from "./InlineEdit"

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
    )
  }

  state = {
    toolText: "",
    clientX: 0,
    clientY: 0
  }

  componentDidMount() {
    const { data, loadData } = this.props
    loadData(data)
  }

  handleHoverOn = e => {
    const { clientX, clientY } = e
    this.setState({ clientX, clientY })
    const { selectItem } = this.props
    const hoveredId = e.target.getAttribute("id")
    console.log(hoveredId)
    selectItem(+hoveredId)
  }
  handleHoverOff = () => {
    const { selectItem } = this.props
    selectItem("")
  }
  handleInputChange = val => {
    const { editingId, editItem } = this.props
    // console.log(61", editingId, val)
    editItem(editingId, val)
  }

  render() {
    let { height, width, items } = this.props
    const margin = { top: 15, right: 0, bottom: 40, left: 10 }
    width = +width - margin.right - margin.left
    height = +height - margin.top - margin.bottom

    const minDate = new Date(d3Min(items, d => d.start))
    const maxDate = new Date(d3Max(items, d => d.end))

    // Sort data by start date
    items = items.sort((a, b) => new Date(a.start) - new Date(b.start))

    // "X" domain should go from 0 to the length of our data.
    // "X" range should be ... size of the container?
    const xScale = d3ScaleBand()
      // .domain([0, items.length])
      .range([0, width])
      .round(true)
      .padding(0.5)
      .domain(items.map((d, i) => i))

    // "Y" domain should go from the earliest start date to the latest end date in our data.
    // "Y" range should be ... size of the container?
    const yScale = d3ScaleTime()
      .domain([minDate, maxDate])
      .range([0, height])

    // Functions for selecting the scaled x and y values, and height of our bars
    const selectScaledX = d => xScale(items.indexOf(d))
    const selectScaledY = d => {
      const startDate = new Date(d.start)
      startDate.setDate(startDate.getDate() - 1)
      return Math.floor(yScale(startDate)) + 5 //FIXME: hacky fixed "scoot" of 5px
      // Math.floor(height - yScale(new Date(d.start))) - 5 //FIXME: hacky fixed "scoot" of 5px
    }
    const selectScaledHeight = d => {
      const duration = d3TimeDay.count(new Date(d.start), new Date(d.end)) + 1
      const minDateCopy = new Date(minDate.valueOf())
      minDateCopy.setDate(minDateCopy.getDate() + duration)
      return Math.floor(yScale(minDateCopy)) - Math.floor(yScale(minDate))
      // return height - Math.floor(yScale(minDateCopy))
    }

    const xAxis = d3AxisTop(xScale)
      .tickSize(0)
      .tickValues([])

    // Set as many "y" ticks as there are enumerated days in the data.
    const yAxis = d3AxisLeft(yScale)

    // Add horizontal grid lines
    const dateArr = d3TimeDay.range(minDate, maxDate, 1)
    yAxis
      .tickValues(dateArr)
      .tickSize(-width)
      .tickFormat(d3TimeFormat("%Y-%m-%d"))

    // Map data to rectangles
    const swatch = [
      "#914AED",
      "#ED314A",
      "#3276DC",
      "#FFD66E",
      "#00D66F",
      "#30CEF2"
    ]
    const bars = items.map((d, i) => ({
      x: selectScaledX(d),
      y: selectScaledY(d),
      height: selectScaledHeight(d),
      width: xScale.bandwidth(),
      fill: swatch[i % swatch.length],
      name: d.name,
      id: d.id
    }))

    const { clientX, clientY } = this.state
    const { editingId } = this.props
    const toolText = editingId
      ? items.find(d => d.id === this.props.editingId).name
      : ""
    return (
      <>
        <div
          className="timeline__tooltip"
          style={{ left: clientX, top: clientY }}>
          <InlineEdit onChange={this.handleInputChange} value={toolText} />
        </div>
        <svg
          className="timeline__container"
          height={height}
          width={width}
          overflow="scroll">
          <g
            style={{
              transform: `translate(${margin.left}px,${margin.top}px)`
            }}>
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
                  className="timeline__bar"
                  id={bar.id}
                  onMouseEnter={e => this.handleHoverOn(e)}
                  // onMouseLeave={this.handleHoverOff}
                  x={bar.x}
                  y={bar.y}
                  height={bar.height}
                  width={bar.width}
                  fill={bar.fill}
                  key={`${bar.x},${bar.y}`}
                  name={bar.name}
                  rx={bar.width / 2} // this should be dynamic
                  ry={bar.width / 2} // this should be dynamic
                />
              ))}
            </g>
          </g>
        </svg>
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    items: state.inlineEditReducer.items,
    editingId: state.inlineEditReducer.editingId
  }
}
const mapDispatchToProps = dispatch => {
  return {
    selectItem: id => dispatch(select(id)),
    editItem: (id, val) => dispatch(edit(id, val)),
    loadData: data => dispatch(load(data))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timeline)
