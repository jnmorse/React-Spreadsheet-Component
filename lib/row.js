"use strict";

var _react = _interopRequireWildcard(require("react"));

var _cell = _interopRequireDefault(require("./cell"));

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

var RowComponent =
/*#__PURE__*/
function (_Component) {
  _inherits(RowComponent, _Component);

  function RowComponent() {
    _classCallCheck(this, RowComponent);

    return _possibleConstructorReturn(this, _getPrototypeOf(RowComponent).apply(this, arguments));
  }

  _createClass(RowComponent, [{
    key: "render",

    /**
     * React Render method
     * @return {[JSX]} [JSX to render]
     */
    value: function render() {
      var config = this.props.config,
          cells = this.props.cells,
          columns = [],
          key,
          uid,
          selected,
          cellClasses,
          i;

      if (!config.columns || cells.length === 0) {
        return console.error('Table can\'t be initialized without set number of columsn and no data!');
      }

      for (i = 0; i < cells.length; i = i + 1) {
        // If a cell is selected, check if it's this one
        selected = _helpers["default"].equalCells(this.props.selected, [this.props.uid, i]);
        cellClasses = this.props.cellClasses && this.props.cellClasses[i] ? this.props.cellClasses[i] : '';
        key = 'row_' + this.props.uid + '_cell_' + i;
        uid = [this.props.uid, i];
        columns.push(_react["default"].createElement(_cell["default"], {
          key: key,
          uid: uid,
          value: cells[i],
          config: config,
          cellClasses: cellClasses,
          onCellValueChange: this.props.onCellValueChange,
          handleSelectCell: this.props.handleSelectCell,
          handleDoubleClickOnCell: this.props.handleDoubleClickOnCell,
          handleCellBlur: this.props.handleCellBlur,
          spreadsheetId: this.props.spreadsheetId,
          selected: selected,
          editing: this.props.editing
        }));
      }

      return _react["default"].createElement("tr", null, columns);
    }
  }]);

  return RowComponent;
}(_react.Component);

module.exports = RowComponent;