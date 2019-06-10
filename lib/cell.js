"use strict";

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _dispatcher = _interopRequireDefault(require("./dispatcher"));

var _helpers = _interopRequireDefault(require("./helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CellComponent =
/*#__PURE__*/
function (_Component) {
  _inherits(CellComponent, _Component);

  function CellComponent() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, CellComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CellComponent)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      editing: _this.props.editing,
      changedValue: _this.props.value
      /**
       * React "render" method, rendering the individual cell
       */

    });

    return _this;
  }

  _createClass(CellComponent, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var props = this.props;
      var selected = props.selected ? 'selected' : '';
      var ref = "input_".concat(props.uid.join('_'));
      var config = props.config || {
        emptyValueSymbol: ''
      };
      var displayValue = props.value === '' || !props.value ? config.emptyValueSymbol : props.value;
      var cellClasses = props.cellClasses && props.cellClasses.length > 0 ? "".concat(props.cellClasses, " ").concat(selected) : selected;
      var cellContent; // Check if header - if yes, render it

      var header = this.renderHeader();

      if (header) {
        return header;
      } // If not a header, check for editing and return


      if (props.selected && props.editing) {
        cellContent = _react["default"].createElement("input", {
          className: "mousetrap",
          onChange: function onChange(event) {
            return _this2.handleChange(event);
          },
          onBlur: function onBlur(event) {
            return _this2.handleBlur(event);
          },
          ref: ref,
          defaultValue: props.value
        });
      }

      return _react["default"].createElement("td", {
        className: cellClasses,
        ref: props.uid.join('_')
      }, _react["default"].createElement("div", {
        className: "reactTableCell"
      }, cellContent, _react["default"].createElement("span", {
        tabIndex: 0,
        role: "textbox",
        onDoubleClick: function onDoubleClick(event) {
          return _this2.handleDoubleClick(event);
        },
        onClick: function onClick(event) {
          return _this2.handleClick(event);
        },
        onKeyDown: function onKeyDown(event) {
          return _this2.handleDoubleClick(event);
        }
      }, displayValue)));
    }
    /**
     * React "componentDidUpdate" method, ensuring correct input focus
     * @param  {React previous properties} prevProps
     * @param  {React previous state} prevState
     */

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props = this.props,
          editing = _this$props.editing,
          selected = _this$props.selected,
          uid = _this$props.uid,
          value = _this$props.value,
          changedValue = _this$props.changedValue,
          onCellValueChange = _this$props.onCellValueChange;
      var stateChangedValue = this.state.changedValue;

      if (editing && selected) {
        var node = this.refs["input_".concat(uid.join('_'))];
        node.focus();
      }

      if (prevProps.selected && prevProps.editing && changedValue !== value) {
        onCellValueChange(uid, stateChangedValue);
      }
    }
    /**
     * Click handler for individual cell, ensuring navigation and selection
     * @param  {event} e
     */

  }, {
    key: "handleClick",
    value: function handleClick() {
      var _this$props2 = this.props,
          uid = _this$props2.uid,
          handleSelectCell = _this$props2.handleSelectCell;
      var cellElement = this.refs[uid.join('_')];
      handleSelectCell(uid, cellElement);
    }
    /**
     * Click handler for individual cell if the cell is a header cell
     * @param  {event} e
     */

  }, {
    key: "handleHeadClick",
    value: function handleHeadClick() {
      var _this$props3 = this.props,
          uid = _this$props3.uid,
          spreadsheetId = _this$props3.spreadsheetId;
      var cellElement = this.refs[uid.join('_')];

      _dispatcher["default"].publish('headCellClicked', cellElement, spreadsheetId);
    }
    /**
     * Double click handler for individual cell, ensuring navigation and selection
     * @param  {event} e
     */

  }, {
    key: "handleDoubleClick",
    value: function handleDoubleClick(e) {
      e.preventDefault();
      var _this$props4 = this.props,
          handleDoubleClickOnCell = _this$props4.handleDoubleClickOnCell,
          uid = _this$props4.uid;
      handleDoubleClickOnCell(uid);
    }
    /**
     * Blur handler for individual cell
     * @param  {event} e
     */

  }, {
    key: "handleBlur",
    value: function handleBlur(e) {
      var newValue = this.refs["input_".concat(this.props.uid.join('_'))].value;
      this.props.onCellValueChange(this.props.uid, newValue, e);
      this.props.handleCellBlur(this.props.uid);

      _dispatcher["default"].publish('cellBlurred', this.props.uid, this.props.spreadsheetId);
    }
    /**
     * Change handler for an individual cell, propagating the value change
     * @param  {event} e
     */

  }, {
    key: "handleChange",
    value: function handleChange() {
      var newValue = this.refs["input_".concat(this.props.uid.join('_'))].value;
      this.setState({
        changedValue: newValue
      });
    }
    /**
     * Checks if a header exists - if it does, it returns a header object
     * @return {false|react} [Either false if it's not a header cell, a react object if it is]
     */

    /* eslint-disable max-lines-per-function */

  }, {
    key: "renderHeader",
    value: function renderHeader() {
      var _this3 = this;

      var props = this.props;
      var selected = props.selected ? 'selected' : '';
      var uid = props.uid;
      var config = props.config || {
        emptyValueSymbol: ''
      };
      var displayValue = props.value === '' || !props.value ? config.emptyValueSymbol : props.value;
      var cellClasses = props.cellClasses && props.cellClasses.length > 0 ? "".concat(this.props.cellClasses, " ").concat(selected) : selected; // Cases

      var headRow = uid[0] === 0;
      var headColumn = uid[1] === 0;
      var headRowAndEnabled = config.hasHeadRow && uid[0] === 0;
      var headColumnAndEnabled = config.hasHeadColumn && uid[1] === 0;
      /*
       * Head Row enabled, cell is in head row
       * Head Column enabled, cell is in head column
       */

      if (headRowAndEnabled || headColumnAndEnabled) {
        if (headColumn && config.hasLetterNumberHeads) {
          // eslint-disable-next-line prefer-destructuring
          displayValue = uid[0];
        } else if (headRow && config.hasLetterNumberHeads) {
          displayValue = _helpers["default"].countWithLetters(uid[1]);
        }

        if (config.isHeadRowString && headRow || config.isHeadColumnString && headColumn) {
          return _react["default"].createElement("th", {
            className: cellClasses,
            ref: this.props.uid.join('_')
          }, _react["default"].createElement("div", null, _react["default"].createElement("span", {
            onClick: function onClick(event) {
              return _this3.handleHeadClick(event);
            },
            role: "button",
            tabIndex: 0,
            onKeyDown: function onKeyDown(event) {
              return _this3.handleHeadClick(event);
            }
          }, displayValue)));
        }

        return _react["default"].createElement("th", {
          ref: this.props.uid.join('_')
        }, displayValue);
      }

      return false;
    }
    /* eslint-enable max-lines-per-function */

  }], [{
    key: "propTypes",
    get: function get() {
      return {
        editing: _propTypes["default"].bool,
        value: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
        selected: _propTypes["default"].bool,
        uid: _propTypes["default"].arrayOf(_propTypes["default"].number).isRequired,
        changedValue: _propTypes["default"].string,
        onCellValueChange: _propTypes["default"].func,
        handleSelectCell: _propTypes["default"].func,
        spreadsheetId: _propTypes["default"].string.isRequired,
        handleDoubleClickOnCell: _propTypes["default"].func,
        handleCellBlur: _propTypes["default"].func,
        cellClasses: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].arrayOf(_propTypes["default"].string)])
      };
    }
  }, {
    key: "defaultProps",
    get: function get() {
      return {
        editing: false,
        changedValue: '',
        value: '',
        selected: false,
        cellClasses: '',
        onCellValueChange: function onCellValueChange() {},
        handleSelectCell: function handleSelectCell() {},
        handleDoubleClickOnCell: function handleDoubleClickOnCell() {},
        handleCellBlur: function handleCellBlur() {}
      };
    }
  }]);

  return CellComponent;
}(_react.Component);

module.exports = CellComponent;