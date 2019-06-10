/* eslint-disable react/prop-types */
import React, { Component } from 'react'

import RowComponent from './row'
import Dispatcher from './dispatcher'
import Helpers from './helpers'

const $ = require('jquery')

class SpreadsheetComponent extends Component {
  state = {
    data: [],
    selected: null,
    lastBlurred: null,
    selectedElement: null,
    editing: false,
    id: this.props.spreadsheetId || Helpers.makeSpreadsheetId()
  }

  constructor(props) {
    super(props)

    const initialData = this.props.initialData || {}

    if (!initialData.rows) {
      initialData.rows = []

      for (let i = 0; i < this.props.config.rows; i += 1) {
        initialData.rows[i] = []
        for (let ci = 0; ci < this.props.config.columns; ci += 1) {
          initialData.rows[i][ci] = ''
        }
      }
    }

    this.state.data = initialData
  }

  /**
   * React 'componentDidMount' method
   */
  componentDidMount() {
    this.bindKeyboard()

    /*
     * $('body').on('focus', 'input', function(e) {
     *   $(this)
     *     .one('mouseup', function() {
     *       $(this).select()
     *       return false
     *     })
     *     .select()
     * })
     */
  }

  /**
   * React Render method
   * @return {[JSX]} [JSX to render]
   */
  /* eslint-disable max-lines-per-function */
  render() {
    const { data } = this.state
    const { config /* , cellClasses */ } = this.props

    // Sanity checks
    if (!data.rows && !config.rows) {
      throw new Error(
        'Table Component: Number of colums not defined in both data and config!'
      )
    }

    // Create Rows
    const rows = data.rows.map((row, i) => (
      <RowComponent
        cells={row}
        uid={i}
        // eslint-disable-next-line react/no-array-index-key
        key={`row_${i}`}
        config={config}
        selected={this.state.selected}
        editing={this.state.editing}
        handleSelectCell={this.handleSelectCell}
        handleDoubleClickOnCell={this.handleDoubleClickOnCell}
        handleCellBlur={this.handleCellBlur}
        onCellValueChange={this.handleCellValueChange}
        spreadsheetId={this.state.id}
        className="cellComponent"
      />
    ))

    return (
      <table
        data-spreasheet-id={this.state.id}
        ref={`react-spreadsheet-${this.state.id}`}
      >
        <tbody>{rows}</tbody>
      </table>
    )
  }
  /* eslint-enable max-lines-per-function */

  /**
   * Binds the various keyboard events dispatched to table functions
   */
  /* eslint-disable max-lines-per-function */
  bindKeyboard() {
    Dispatcher.setupKeyboardShortcuts(
      $(this.refs[`react-spreadsheet-${this.state.id}`])[0],
      this.state.id
    )

    Dispatcher.subscribe(
      'up_keyup',
      data => {
        this.navigateTable('up', data)
      },
      this.state.id
    )
    Dispatcher.subscribe(
      'down_keyup',
      data => {
        this.navigateTable('down', data)
      },
      this.state.id
    )
    Dispatcher.subscribe(
      'left_keyup',
      data => {
        this.navigateTable('left', data)
      },
      this.state.id
    )
    Dispatcher.subscribe(
      'right_keyup',
      data => {
        this.navigateTable('right', data)
      },
      this.state.id
    )
    Dispatcher.subscribe(
      'tab_keyup',
      data => {
        this.navigateTable('right', data, null, true)
      },
      this.state.id
    )

    // Prevent brower's from jumping to URL bar
    Dispatcher.subscribe(
      'tab_keydown',
      event => {
        if (
          $(document.activeElement) &&
          $(document.activeElement)[0].tagName === 'INPUT'
        ) {
          if (event.preventDefault) {
            return event.preventDefault()
          }
        }

        // Oh, old IE, you 💩
        return false
      },
      this.state.id
    )

    Dispatcher.subscribe(
      'remove_keydown',
      event => {
        if (!$(event.target).is('input, textarea')) {
          if (event.preventDefault) {
            event.preventDefault()
          }
        }

        // Oh, old IE, you 💩
        return false
      },
      this.state.id
    )

    Dispatcher.subscribe(
      'enter_keyup',
      () => {
        if (this.state.selectedElement) {
          this.setState(prevState => ({ editing: !prevState.editing }))
        }
        $(this.refs[`react-spreadsheet-${this.state.id}`])
          .first()
          .focus()
      },
      this.state.id
    )

    // Go into edit mode when the user starts typing on a field
    Dispatcher.subscribe(
      'letter_keydown',
      () => {
        if (!this.state.editing && this.state.selectedElement) {
          Dispatcher.publish(
            'editStarted',
            this.state.selectedElement,
            this.state.id
          )
          this.setState({ editing: true })
        }
      },
      this.state.id
    )

    // Delete on backspace and delete
    Dispatcher.subscribe(
      'remove_keyup',
      () => {
        if (
          this.state.selected &&
          !Helpers.equalCells(this.state.selected, this.state.lastBlurred)
        ) {
          this.handleCellValueChange(this.state.selected, '')
        }
      },
      this.state.id
    )
  }
  /* eslint-enable max-lines-per-function */

  /**
   * Navigates the table and moves selection
   * @param  {string} direction                               [Direction ('up' || 'down' || 'left' || 'right')]
   * @param  {Array: [number: row, number: cell]} originCell  [Origin Cell]
   * @param  {boolean} inEdit                                 [Currently editing]
   */
  /* eslint-disable max-lines-per-function */
  navigateTable(direction, data, originCell, inEdit) {
    /*
     * Only traverse the table if the user isn't editing a cell,
     * unless override is given
     */
    if (!inEdit && this.state.editing) {
      return false
    }

    // Use the curently active cell if one isn't passed
    const $origin = $(originCell || this.state.selectedElement)

    // Prevent default
    if (data.preventDefault) {
      data.preventDefault()
    } else {
      // Oh, old IE, you 💩
      // eslint-disable-next-line no-param-reassign
      data.returnValue = false
    }

    const cellIndex = $origin.index()
    let target

    if (direction === 'up') {
      target = $origin
        .closest('tr')
        .prev()
        .children()
        .eq(cellIndex)
        .find('span')
    } else if (direction === 'down') {
      target = $origin
        .closest('tr')
        .next()
        .children()
        .eq(cellIndex)
        .find('span')
    } else if (direction === 'left') {
      target = $origin
        .closest('td')
        .prev()
        .find('span')
    } else if (direction === 'right') {
      target = $origin
        .closest('td')
        .next()
        .find('span')
    }

    if (target.length > 0) {
      return target.click()
    }

    return this.extendTable(direction, originCell)
  }
  /* eslint-enable max-lines-per-function */

  /**
   * Extends the table with an additional row/column, if permitted by config
   * @param  {string} direction [Direction ('up' || 'down' || 'left' || 'right')]
   */
  // eslint-disable-next-line consistent-return
  extendTable(direction) {
    const { config } = this.props
    const { data } = this.state
    let newRow
    let i

    if (direction === 'down' && config.canAddRow) {
      newRow = []

      for (i = 0; i < this.state.data.rows[0].length; i += 1) {
        newRow[i] = ''
      }

      data.rows.push(newRow)
      Dispatcher.publish('rowCreated', data.rows.length, this.state.id)
      return this.setState({ data })
    }

    if (direction === 'right' && config.canAddColumn) {
      for (i = 0; i < data.rows.length; i += 1) {
        data.rows[i].push('')
      }

      Dispatcher.publish('columnCreated', data.rows[0].length, this.state.id)
      return this.setState({ data })
    }
  }

  /**
   * Callback for 'selectCell', updating the selected Cell
   * @param  {Array: [number: row, number: cell]} cell [Selected Cell]
   * @param  {object} cellElement [Selected Cell Element]
   */
  handleSelectCell(cell, cellElement) {
    Dispatcher.publish('cellSelected', cell, this.state.id)
    $(this.refs[`react-spreadsheet-${this.state.id}`])
      .first()
      .focus()

    this.setState({
      selected: cell,
      selectedElement: cellElement
    })
  }

  /**
   * Callback for 'cellValueChange', updating the cell data
   * @param  {Array: [number: row, number: cell]} cell [Selected Cell]
   * @param  {object} newValue                         [Value to set]
   */
  handleCellValueChange(cell, newValue) {
    const { data } = this.state
    const row = cell[0]
    const column = cell[1]
    const oldValue = data.rows[row][column]

    Dispatcher.publish(
      'cellValueChanged',
      [cell, newValue, oldValue],
      this.state.id
    )

    data.rows[row][column] = newValue
    this.setState({
      data
    })

    Dispatcher.publish('dataChanged', data, this.state.id)
  }

  /**
   * Callback for 'doubleClickonCell', enabling 'edit' mode
   */
  handleDoubleClickOnCell() {
    this.setState({
      editing: true
    })
  }

  /**
   * Callback for 'cellBlur'
   */
  handleCellBlur(cell) {
    if (this.state.editing) {
      Dispatcher.publish('editStopped', this.state.selectedElement)
    }

    this.setState({
      editing: false,
      lastBlurred: cell
    })
  }
}

module.exports = SpreadsheetComponent
