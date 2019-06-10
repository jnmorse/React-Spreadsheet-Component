/* eslint-disable react/no-string-refs */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Dispatcher from './dispatcher'
import Helpers from './helpers'

class CellComponent extends Component {
  static get propTypes() {
    return {
      editing: PropTypes.bool,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      selected: PropTypes.bool,
      uid: PropTypes.arrayOf(PropTypes.number).isRequired,
      changedValue: PropTypes.string,
      onCellValueChange: PropTypes.func,
      handleSelectCell: PropTypes.func,
      spreadsheetId: PropTypes.string.isRequired,
      handleDoubleClickOnCell: PropTypes.func,
      handleCellBlur: PropTypes.func,
      cellClasses: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
      ])
    }
  }

  static get defaultProps() {
    return {
      editing: false,
      changedValue: '',
      value: '',
      selected: false,
      cellClasses: '',
      onCellValueChange: () => {},
      handleSelectCell: () => {},
      handleDoubleClickOnCell: () => {},
      handleCellBlur: () => {}
    }
  }

  state = {
    editing: this.props.editing,
    changedValue: this.props.value
  }

  /**
   * React "render" method, rendering the individual cell
   */
  render() {
    const { props } = this
    const selected = props.selected ? 'selected' : ''
    const ref = `input_${props.uid.join('_')}`
    const config = props.config || { emptyValueSymbol: '' }
    const displayValue =
      props.value === '' || !props.value ? config.emptyValueSymbol : props.value
    const cellClasses =
      props.cellClasses && props.cellClasses.length > 0
        ? `${props.cellClasses} ${selected}`
        : selected
    let cellContent

    // Check if header - if yes, render it
    const header = this.renderHeader()
    if (header) {
      return header
    }

    // If not a header, check for editing and return
    if (props.selected && props.editing) {
      cellContent = (
        <input
          className="mousetrap"
          onChange={event => this.handleChange(event)}
          onBlur={event => this.handleBlur(event)}
          ref={ref}
          defaultValue={props.value}
        />
      )
    }

    return (
      <td className={cellClasses} ref={props.uid.join('_')}>
        <div className="reactTableCell">
          {cellContent}
          <span
            tabIndex={0}
            role="textbox"
            onDoubleClick={event => this.handleDoubleClick(event)}
            onClick={event => this.handleClick(event)}
            onKeyDown={event => this.handleDoubleClick(event)}
          >
            {displayValue}
          </span>
        </div>
      </td>
    )
  }

  /**
   * React "componentDidUpdate" method, ensuring correct input focus
   * @param  {React previous properties} prevProps
   * @param  {React previous state} prevState
   */
  componentDidUpdate(prevProps) {
    const {
      editing,
      selected,
      uid,
      value,
      changedValue,
      onCellValueChange
    } = this.props

    const { changedValue: stateChangedValue } = this.state
    if (editing && selected) {
      const node = this.refs[`input_${uid.join('_')}`]
      node.focus()
    }

    if (prevProps.selected && prevProps.editing && changedValue !== value) {
      onCellValueChange(uid, stateChangedValue)
    }
  }

  /**
   * Click handler for individual cell, ensuring navigation and selection
   * @param  {event} e
   */
  handleClick() {
    const { uid, handleSelectCell } = this.props
    const cellElement = this.refs[uid.join('_')]

    handleSelectCell(uid, cellElement)
  }

  /**
   * Click handler for individual cell if the cell is a header cell
   * @param  {event} e
   */
  handleHeadClick() {
    const { uid, spreadsheetId } = this.props
    const cellElement = this.refs[uid.join('_')]

    Dispatcher.publish('headCellClicked', cellElement, spreadsheetId)
  }

  /**
   * Double click handler for individual cell, ensuring navigation and selection
   * @param  {event} e
   */
  handleDoubleClick(e) {
    e.preventDefault()

    const { handleDoubleClickOnCell, uid } = this.props

    handleDoubleClickOnCell(uid)
  }

  /**
   * Blur handler for individual cell
   * @param  {event} e
   */
  handleBlur(e) {
    const newValue = this.refs[`input_${this.props.uid.join('_')}`].value

    this.props.onCellValueChange(this.props.uid, newValue, e)
    this.props.handleCellBlur(this.props.uid)
    Dispatcher.publish('cellBlurred', this.props.uid, this.props.spreadsheetId)
  }

  /**
   * Change handler for an individual cell, propagating the value change
   * @param  {event} e
   */
  handleChange() {
    const newValue = this.refs[`input_${this.props.uid.join('_')}`].value

    this.setState({ changedValue: newValue })
  }

  /**
   * Checks if a header exists - if it does, it returns a header object
   * @return {false|react} [Either false if it's not a header cell, a react object if it is]
   */
  /* eslint-disable max-lines-per-function */
  renderHeader() {
    const { props } = this
    const selected = props.selected ? 'selected' : ''
    const { uid } = props
    const config = props.config || { emptyValueSymbol: '' }
    let displayValue =
      props.value === '' || !props.value ? config.emptyValueSymbol : props.value
    const cellClasses =
      props.cellClasses && props.cellClasses.length > 0
        ? `${this.props.cellClasses} ${selected}`
        : selected

    // Cases
    const headRow = uid[0] === 0
    const headColumn = uid[1] === 0
    const headRowAndEnabled = config.hasHeadRow && uid[0] === 0
    const headColumnAndEnabled = config.hasHeadColumn && uid[1] === 0

    /*
     * Head Row enabled, cell is in head row
     * Head Column enabled, cell is in head column
     */
    if (headRowAndEnabled || headColumnAndEnabled) {
      if (headColumn && config.hasLetterNumberHeads) {
        // eslint-disable-next-line prefer-destructuring
        displayValue = uid[0]
      } else if (headRow && config.hasLetterNumberHeads) {
        displayValue = Helpers.countWithLetters(uid[1])
      }

      if (
        (config.isHeadRowString && headRow) ||
        (config.isHeadColumnString && headColumn)
      ) {
        return (
          <th className={cellClasses} ref={this.props.uid.join('_')}>
            <div>
              <span
                onClick={event => this.handleHeadClick(event)}
                role="button"
                tabIndex={0}
                onKeyDown={event => this.handleHeadClick(event)}
              >
                {displayValue}
              </span>
            </div>
          </th>
        )
      }
      return <th ref={this.props.uid.join('_')}>{displayValue}</th>
    }
    return false
  }
  /* eslint-enable max-lines-per-function */
}

module.exports = CellComponent
