import React, { Component } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

class InlineEdit extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired, // to be called onBlur
    value: PropTypes.string
  }
  static defaultProps = {
    value: ""
  }
  state = {
    editing: false,
    value: this.props.value // initialize to given value
  }
  componentDidMount() {
    // const { value } = this.props
    // this.setState({ value })
  }
  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      const { value } = this.props
      this.setState({ editing: false, value })
    }
  }
  handleBlur = () => {
    this.props.onChange(this.state.value)
    this.setState({ editing: false })
  }
  handleFocus = () => {
    this.setState({ editing: true })
  }
  handleInputChange = e => {
    const { onChange } = this.props
    const { value } = e.target
    if (e.key === "Enter") {
      onChange(this.state.value) // only call this onBlur, Enter
      return this.setState({ editing: false })
    }
    this.setState({ value })
  }
  handleKeyPress = e => {
    const { onChange } = this.props
    if (e.key === "Enter") {
      onChange(this.state.value) // only call this onBlur, Enter
      return this.setState({ editing: false })
    }
  }
  render() {
    const { editing } = this.state
    const { value } = this.state
    const width = (value.length) * 7 + "px"
    return (
      <Container value={value} width={width}>
        {editing ? (
          <Input
            value={value}
            onBlur={this.handleBlur}
            width={width}
            onChange={e => this.handleInputChange(e)}
            onKeyPress={this.handleKeyPress}
            autoFocus
          />
        ) : (
          <Text
            width={width}
            onClick={this.handleFocus}>
            {value}
          </Text>
        )}
      </Container>
    )
  }
}

export default InlineEdit

const Container = styled.div`
  visibility: ${props => (props.value !== "" ? "visible" : "hidden")};
  min-height: 1em;
  width: ${props => props.width};
  font-size: 12px;
`

const Input = styled.input`
  text-align: center;
  padding: 0.1rem;
  width: ${props => props.width};
  font-size: 12px;

  border: none;
  outline: none;
  border-radius: 3px;
  background: rgb(152, 152, 152, 0.7);
  color: white;
`
const Text = styled.div`
  text-align: center;
  padding: 0.1rem;

  color: black;
`
