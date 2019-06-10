"use strict";

var _react = _interopRequireWildcard(require("react"));

var _row = _interopRequireDefault(require("./row"));

var _dispatcher = _interopRequireDefault(require("./dispatcher"));

var _helpers = _interopRequireDefault(require("./helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var $ = require('jquery');

var SpreadsheetComponent =
/*#__PURE__*/
function (_Component) {
  _inherits(SpreadsheetComponent, _Component);

  function SpreadsheetComponent(props) {
    var _this;

    _classCallCheck(this, SpreadsheetComponent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SpreadsheetComponent).call(this, props));
    var initialData = _this.props.initialData || {};

    if (!initialData.rows) {
      initialData.rows = [];

      for (var i = 0; i < _this.props.config.rows; i = i + 1) {
        initialData.rows[i] = [];

        for (var ci = 0; ci < _this.props.config.columns; ci = ci + 1) {
          initialData.rows[i][ci] = '';
        }
      }
    }

    _this.state = {
      data: initialData,
      selected: null,
      lastBlurred: null,
      selectedElement: null,
      editing: false,
      id: _this.props.spreadsheetId || _helpers["default"].makeSpreadsheetId()
    };
    return _this;
  }
  /**
   * React 'componentDidMount' method
   */


  _createClass(SpreadsheetComponent, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.bindKeyboard();
      $('body').on('focus', 'input', function (e) {
        $(this).one('mouseup', function () {
          $(this).select();
          return false;
        }).select();
      });
    }
    /**
     * React Render method
     * @return {[JSX]} [JSX to render]
     */

  }, {
    key: "render",
    value: function render() {
      var data = this.state.data,
          config = this.props.config,
          _cellClasses = this.props.cellClasses,
          rows = [],
          key,
          i,
          cellClasses; // Sanity checks

      if (!data.rows && !config.rows) {
        return console.error('Table Component: Number of colums not defined in both data and config!');
      } // Create Rows


      for (i = 0; i < data.rows.length; i = i + 1) {
        key = 'row_' + i;
        cellClasses = _cellClasses && _cellClasses.rows && _cellClasses.rows[i] ? _cellClasses.rows[i] : null;
        rows.push(_react["default"].createElement(_row["default"], {
          cells: data.rows[i],
          cellClasses: cellClasses,
          uid: i,
          key: key,
          config: config,
          selected: this.state.selected,
          editing: this.state.editing,
          handleSelectCell: this.handleSelectCell.bind(this),
          handleDoubleClickOnCell: this.handleDoubleClickOnCell.bind(this),
          handleCellBlur: this.handleCellBlur.bind(this),
          onCellValueChange: this.handleCellValueChange.bind(this),
          spreadsheetId: this.state.id,
          className: "cellComponent"
        }));
      }

      return _react["default"].createElement("table", {
        tabIndex: "0",
        "data-spreasheet-id": this.state.id,
        ref: "react-spreadsheet-" + this.state.id
      }, _react["default"].createElement("tbody", null, rows));
    }
    /**
     * Binds the various keyboard events dispatched to table functions
     */

  }, {
    key: "bindKeyboard",
    value: function bindKeyboard() {
      var _this2 = this;

      _dispatcher["default"].setupKeyboardShortcuts($(this.refs["react-spreadsheet-" + this.state.id])[0], this.state.id);

      _dispatcher["default"].subscribe('up_keyup', function (data) {
        _this2.navigateTable('up', data);
      }, this.state.id);

      _dispatcher["default"].subscribe('down_keyup', function (data) {
        _this2.navigateTable('down', data);
      }, this.state.id);

      _dispatcher["default"].subscribe('left_keyup', function (data) {
        _this2.navigateTable('left', data);
      }, this.state.id);

      _dispatcher["default"].subscribe('right_keyup', function (data) {
        _this2.navigateTable('right', data);
      }, this.state.id);

      _dispatcher["default"].subscribe('tab_keyup', function (data) {
        _this2.navigateTable('right', data, null, true);
      }, this.state.id); // Prevent brower's from jumping to URL bar


      _dispatcher["default"].subscribe('tab_keydown', function (data) {
        if ($(document.activeElement) && $(document.activeElement)[0].tagName === 'INPUT') {
          if (data.preventDefault) {
            data.preventDefault();
          } else {
            // Oh, old IE, you 💩
            data.returnValue = false;
          }
        }
      }, this.state.id);

      _dispatcher["default"].subscribe('remove_keydown', function (data) {
        if (!$(data.target).is('input, textarea')) {
          if (data.preventDefault) {
            data.preventDefault();
          } else {
            // Oh, old IE, you 💩
            data.returnValue = false;
          }
        }
      }, this.state.id);

      _dispatcher["default"].subscribe('enter_keyup', function () {
        if (_this2.state.selectedElement) {
          _this2.setState({
            editing: !_this2.state.editing
          });
        }

        $(_this2.refs["react-spreadsheet-" + _this2.state.id]).first().focus();
      }, this.state.id); // Go into edit mode when the user starts typing on a field


      _dispatcher["default"].subscribe('letter_keydown', function () {
        if (!_this2.state.editing && _this2.state.selectedElement) {
          _dispatcher["default"].publish('editStarted', _this2.state.selectedElement, _this2.state.id);

          _this2.setState({
            editing: true
          });
        }
      }, this.state.id); // Delete on backspace and delete


      _dispatcher["default"].subscribe('remove_keyup', function () {
        if (_this2.state.selected && !_helpers["default"].equalCells(_this2.state.selected, _this2.state.lastBlurred)) {
          _this2.handleCellValueChange(_this2.state.selected, '');
        }
      }, this.state.id);
    }
    /**
     * Navigates the table and moves selection
     * @param  {string} direction                               [Direction ('up' || 'down' || 'left' || 'right')]
     * @param  {Array: [number: row, number: cell]} originCell  [Origin Cell]
     * @param  {boolean} inEdit                                 [Currently editing]
     */

  }, {
    key: "navigateTable",
    value: function navigateTable(direction, data, originCell, inEdit) {
      // Only traverse the table if the user isn't editing a cell,
      // unless override is given
      if (!inEdit && this.state.editing) {
        return false;
      } // Use the curently active cell if one isn't passed


      if (!originCell) {
        originCell = this.state.selectedElement;
      } // Prevent default


      if (data.preventDefault) {
        data.preventDefault();
      } else {
        // Oh, old IE, you 💩
        data.returnValue = false;
      }

      var $origin = $(originCell),
          cellIndex = $origin.index(),
          target;

      if (direction === 'up') {
        target = $origin.closest('tr').prev().children().eq(cellIndex).find('span');
      } else if (direction === 'down') {
        target = $origin.closest('tr').next().children().eq(cellIndex).find('span');
      } else if (direction === 'left') {
        target = $origin.closest('td').prev().find('span');
      } else if (direction === 'right') {
        target = $origin.closest('td').next().find('span');
      }

      if (target.length > 0) {
        target.click();
      } else {
        this.extendTable(direction, originCell);
      }
    }
    /**
     * Extends the table with an additional row/column, if permitted by config
     * @param  {string} direction [Direction ('up' || 'down' || 'left' || 'right')]
     */

  }, {
    key: "extendTable",
    value: function extendTable(direction) {
      var config = this.props.config,
          data = this.state.data,
          newRow,
          i;

      if (direction === 'down' && config.canAddRow) {
        newRow = [];

        for (i = 0; i < this.state.data.rows[0].length; i = i + 1) {
          newRow[i] = '';
        }

        data.rows.push(newRow);

        _dispatcher["default"].publish('rowCreated', data.rows.length, this.state.id);

        return this.setState({
          data: data
        });
      }

      if (direction === 'right' && config.canAddColumn) {
        for (i = 0; i < data.rows.length; i = i + 1) {
          data.rows[i].push('');
        }

        _dispatcher["default"].publish('columnCreated', data.rows[0].length, this.state.id);

        return this.setState({
          data: data
        });
      }
    }
    /**
     * Callback for 'selectCell', updating the selected Cell
     * @param  {Array: [number: row, number: cell]} cell [Selected Cell]
     * @param  {object} cellElement [Selected Cell Element]
     */

  }, {
    key: "handleSelectCell",
    value: function handleSelectCell(cell, cellElement) {
      _dispatcher["default"].publish('cellSelected', cell, this.state.id);

      $(this.refs["react-spreadsheet-" + this.state.id]).first().focus();
      this.setState({
        selected: cell,
        selectedElement: cellElement
      });
    }
    /**
     * Callback for 'cellValueChange', updating the cell data
     * @param  {Array: [number: row, number: cell]} cell [Selected Cell]
     * @param  {object} newValue                         [Value to set]
     */

  }, {
    key: "handleCellValueChange",
    value: function handleCellValueChange(cell, newValue) {
      var data = this.state.data,
          row = cell[0],
          column = cell[1],
          oldValue = data.rows[row][column];

      _dispatcher["default"].publish('cellValueChanged', [cell, newValue, oldValue], this.state.id);

      data.rows[row][column] = newValue;
      this.setState({
        data: data
      });

      _dispatcher["default"].publish('dataChanged', data, this.state.id);
    }
    /**
     * Callback for 'doubleClickonCell', enabling 'edit' mode
     */

  }, {
    key: "handleDoubleClickOnCell",
    value: function handleDoubleClickOnCell() {
      this.setState({
        editing: true
      });
    }
    /**
     * Callback for 'cellBlur'
     */

  }, {
    key: "handleCellBlur",
    value: function handleCellBlur(cell) {
      if (this.state.editing) {
        _dispatcher["default"].publish('editStopped', this.state.selectedElement);
      }

      this.setState({
        editing: false,
        lastBlurred: cell
      });
    }
  }]);

  return SpreadsheetComponent;
}(_react.Component);

module.exports = SpreadsheetComponent;