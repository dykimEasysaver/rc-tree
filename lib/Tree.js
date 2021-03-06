'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); } /* eslint no-console:0 */


function noop() {}

var Tree = function (_React$Component) {
  _inherits(Tree, _React$Component);

  function Tree(props) {
    _classCallCheck(this, Tree);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    ['onKeyDown', 'onCheck'].forEach(function (m) {
      _this[m] = _this[m].bind(_this);
    });
    _this.contextmenuKeys = [];
    _this.checkedKeysChange = true;

    _this.state = {
      expandedKeys: _this.getDefaultExpandedKeys(props),
      checkedKeys: _this.getDefaultCheckedKeys(props),
      selectedKeys: _this.getDefaultSelectedKeys(props),
      dragNodesKeys: '',
      dragOverNodeKey: '',
      dropNodeKey: ''
    };
    return _this;
  }

  Tree.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var expandedKeys = this.getDefaultExpandedKeys(nextProps, true);
    var checkedKeys = this.getDefaultCheckedKeys(nextProps, true);
    var selectedKeys = this.getDefaultSelectedKeys(nextProps, true);
    var st = {};
    if (expandedKeys) {
      st.expandedKeys = expandedKeys;
    }
    if (checkedKeys) {
      if (nextProps.checkedKeys === this.props.checkedKeys) {
        this.checkedKeysChange = false;
      } else {
        this.checkedKeysChange = true;
      }
      st.checkedKeys = checkedKeys;
    }
    if (selectedKeys) {
      st.selectedKeys = selectedKeys;
    }
    this.setState(st);
  };

  Tree.prototype.onDragStart = function onDragStart(e, treeNode) {
    this.dragNode = treeNode;
    this.dragNodesKeys = this.getDragNodes(treeNode);
    var st = {
      dragNodesKeys: this.dragNodesKeys
    };
    var expandedKeys = this.getExpandedKeys(treeNode, false);
    if (expandedKeys) {
      // Controlled expand, save and then reset
      this.getRawExpandedKeys();
      st.expandedKeys = expandedKeys;
    }
    this.setState(st);
    this.props.onDragStart({
      event: e,
      node: treeNode
    });
    this._dropTrigger = false;
  };

  Tree.prototype.onDragEnterGap = function onDragEnterGap(e, treeNode) {
    var offsetTop = (0, _util.getOffset)(treeNode.refs.selectHandle).top;
    var offsetHeight = treeNode.refs.selectHandle.offsetHeight;
    var pageY = e.pageY;
    var gapHeight = 2;
    if (pageY > offsetTop + offsetHeight - gapHeight) {
      this.dropPosition = 1;
      return 1;
    }
    if (pageY < offsetTop + gapHeight) {
      this.dropPosition = -1;
      return -1;
    }
    this.dropPosition = 0;
    return 0;
  };

  Tree.prototype.onDragEnter = function onDragEnter(e, treeNode) {
    var enterGap = this.onDragEnterGap(e, treeNode);
    if (this.dragNode.props.eventKey === treeNode.props.eventKey && enterGap === 0) {
      this.setState({
        dragOverNodeKey: ''
      });
      return;
    }
    var st = {
      dragOverNodeKey: treeNode.props.eventKey
    };
    var expandedKeys = this.getExpandedKeys(treeNode, true);
    if (expandedKeys) {
      this.getRawExpandedKeys();
      st.expandedKeys = expandedKeys;
    }
    this.setState(st);
    this.props.onDragEnter({
      event: e,
      node: treeNode,
      expandedKeys: expandedKeys && [].concat(_toConsumableArray(expandedKeys)) || [].concat(_toConsumableArray(this.state.expandedKeys))
    });
  };

  Tree.prototype.onDragOver = function onDragOver(e, treeNode) {
    this.props.onDragOver({ event: e, node: treeNode });
  };

  Tree.prototype.onDragLeave = function onDragLeave(e, treeNode) {
    this.props.onDragLeave({ event: e, node: treeNode });
  };

  Tree.prototype.onDrop = function onDrop(e, treeNode) {
    var key = treeNode.props.eventKey;
    this.setState({
      dragOverNodeKey: '',
      dropNodeKey: key
    });
    if (this.dragNodesKeys.indexOf(key) > -1) {
      if (console.warn) {
        console.warn('can not drop to dragNode(include it\'s children node)');
      }
      return false;
    }

    var posArr = treeNode.props.pos.split('-');
    var res = {
      event: e,
      node: treeNode,
      dragNode: this.dragNode,
      dragNodesKeys: [].concat(_toConsumableArray(this.dragNodesKeys)),
      dropPosition: this.dropPosition + Number(posArr[posArr.length - 1])
    };
    if (this.dropPosition !== 0) {
      res.dropToGap = true;
    }
    if ('expandedKeys' in this.props) {
      res.rawExpandedKeys = [].concat(_toConsumableArray(this._rawExpandedKeys)) || [].concat(_toConsumableArray(this.state.expandedKeys));
    }
    this.props.onDrop(res);
    this._dropTrigger = true;
  };

  Tree.prototype.onDragEnd = function onDragEnd(e, treeNode) {
    this.setState({
      dragOverNodeKey: ''
    });
    this.props.onDragEnd({ event: e, node: treeNode });
  };

  Tree.prototype.onExpand = function onExpand(treeNode) {
    var _this2 = this;

    var expanded = !treeNode.props.expanded;
    var controlled = 'expandedKeys' in this.props;
    var expandedKeys = [].concat(_toConsumableArray(this.state.expandedKeys));
    var index = expandedKeys.indexOf(treeNode.props.eventKey);
    if (expanded && index === -1) {
      expandedKeys.push(treeNode.props.eventKey);
    } else if (!expanded && index > -1) {
      expandedKeys.splice(index, 1);
    }
    if (!controlled) {
      this.setState({ expandedKeys: expandedKeys });
    }
    this.props.onExpand(expandedKeys, { node: treeNode, expanded: expanded });

    // after data loaded, need set new expandedKeys
    if (expanded && this.props.loadData) {
      return this.props.loadData(treeNode).then(function () {
        if (!controlled) {
          _this2.setState({ expandedKeys: expandedKeys });
        }
      });
    }
  };

  Tree.prototype.onCheck = function onCheck(treeNode) {
    var _this3 = this;

    var checked = !treeNode.props.checked;
    if (treeNode.props.halfChecked) {
      checked = true;
    }
    var key = treeNode.props.eventKey;
    var checkedKeys = [].concat(_toConsumableArray(this.state.checkedKeys));
    var index = checkedKeys.indexOf(key);

    var newSt = {
      event: 'check',
      node: treeNode,
      checked: checked
    };

    if (this.props.checkStrictly) {
      if (checked && index === -1) {
        checkedKeys.push(key);
      }
      if (!checked && index > -1) {
        checkedKeys.splice(index, 1);
      }
      newSt.checkedNodes = [];
      (0, _util.loopAllChildren)(this.props.children, function (item, ind, pos, keyOrPos) {
        if (checkedKeys.indexOf(keyOrPos) !== -1) {
          newSt.checkedNodes.push(item);
        }
      });
      if (!('checkedKeys' in this.props)) {
        this.setState({
          checkedKeys: checkedKeys
        });
      }
      var halfChecked = this.props.checkedKeys ? this.props.checkedKeys.halfChecked : [];
      this.props.onCheck((0, _util.getStrictlyValue)(checkedKeys, halfChecked), newSt);
    } else {
      if (checked && index === -1) {
        this.treeNodesStates[treeNode.props.pos].checked = true;
        var checkedPositions = [];
        Object.keys(this.treeNodesStates).forEach(function (i) {
          if (_this3.treeNodesStates[i].checked) {
            checkedPositions.push(i);
          }
        });
        (0, _util.handleCheckState)(this.treeNodesStates, (0, _util.filterParentPosition)(checkedPositions), true);
      }
      if (!checked) {
        this.treeNodesStates[treeNode.props.pos].checked = false;
        this.treeNodesStates[treeNode.props.pos].halfChecked = false;
        (0, _util.handleCheckState)(this.treeNodesStates, [treeNode.props.pos], false);
      }
      var checkKeys = (0, _util.getCheck)(this.treeNodesStates);
      newSt.checkedNodes = checkKeys.checkedNodes;
      newSt.checkedNodesPositions = checkKeys.checkedNodesPositions;
      newSt.halfCheckedKeys = checkKeys.halfCheckedKeys;
      this.checkKeys = checkKeys;

      this._checkedKeys = checkedKeys = checkKeys.checkedKeys;
      if (!('checkedKeys' in this.props)) {
        this.setState({
          checkedKeys: checkedKeys
        });
      }
      this.props.onCheck(checkedKeys, newSt);
    }
  };

  Tree.prototype.onSelect = function onSelect(treeNode) {
    var props = this.props;
    var selectedKeys = [].concat(_toConsumableArray(this.state.selectedKeys));
    var eventKey = treeNode.props.eventKey;
    var index = selectedKeys.indexOf(eventKey);
    var selected = void 0;
    if (index !== -1) {
      if (selectedKeys.length !== 1) {
        selected = false;
        selectedKeys.splice(index, 1);
      }
      else {
        selected = true;
      }
    } else {
      selected = true;
      if (!props.multiple) {
        selectedKeys.length = 0;
      }
      selectedKeys.push(eventKey);
    }
    var selectedNodes = [];
    if (selectedKeys.length) {
      (0, _util.loopAllChildren)(this.props.children, function (item) {
        if (selectedKeys.indexOf(item.key) !== -1) {
          selectedNodes.push(item);
        }
      });
    }
    var newSt = {
      event: 'select',
      node: treeNode,
      selected: selected,
      selectedNodes: selectedNodes
    };
    if (!('selectedKeys' in this.props)) {
      this.setState({
        selectedKeys: selectedKeys
      });
    }
    props.onSelect(selectedKeys, newSt);
  };

  Tree.prototype.onMouseEnter = function onMouseEnter(e, treeNode) {
    this.props.onMouseEnter({ event: e, node: treeNode });
  };

  Tree.prototype.onMouseLeave = function onMouseLeave(e, treeNode) {
    this.props.onMouseLeave({ event: e, node: treeNode });
  };

  Tree.prototype.onContextMenu = function onContextMenu(e, treeNode) {
    var selectedKeys = [].concat(_toConsumableArray(this.state.selectedKeys));
    var eventKey = treeNode.props.eventKey;
    if (this.contextmenuKeys.indexOf(eventKey) === -1) {
      this.contextmenuKeys.push(eventKey);
    }
    this.contextmenuKeys.forEach(function (key) {
      var index = selectedKeys.indexOf(key);
      if (index !== -1) {
        selectedKeys.splice(index, 1);
      }
    });
    if (selectedKeys.indexOf(eventKey) === -1) {
      selectedKeys.push(eventKey);
    }
    this.setState({
      selectedKeys: selectedKeys
    });
    this.props.onRightClick({ event: e, node: treeNode });
  };

  // all keyboard events callbacks run from here at first


  Tree.prototype.onKeyDown = function onKeyDown(e) {
    e.preventDefault();
  };

  Tree.prototype.getFilterExpandedKeys = function getFilterExpandedKeys(props, expandKeyProp, expandAll) {
    var keys = props[expandKeyProp];
    if (!expandAll && !props.autoExpandParent) {
      return keys || [];
    }
    var expandedPositionArr = [];
    if (props.autoExpandParent) {
      (0, _util.loopAllChildren)(props.children, function (item, index, pos, newKey) {
        if (keys.indexOf(newKey) > -1) {
          expandedPositionArr.push(pos);
        }
      });
    }
    var filterExpandedKeys = [];
    (0, _util.loopAllChildren)(props.children, function (item, index, pos, newKey) {
      if (expandAll) {
        filterExpandedKeys.push(newKey);
      } else if (props.autoExpandParent) {
        expandedPositionArr.forEach(function (p) {
          if ((p.split('-').length > pos.split('-').length && (0, _util.isInclude)(pos.split('-'), p.split('-')) || pos === p) && filterExpandedKeys.indexOf(newKey) === -1) {
            filterExpandedKeys.push(newKey);
          }
        });
      }
    });
    return filterExpandedKeys.length ? filterExpandedKeys : keys;
  };

  Tree.prototype.getDefaultExpandedKeys = function getDefaultExpandedKeys(props, willReceiveProps) {
    var expandedKeys = willReceiveProps ? undefined : this.getFilterExpandedKeys(props, 'defaultExpandedKeys', props.defaultExpandedKeys.length ? false : props.defaultExpandAll);
    if ('expandedKeys' in props) {
      expandedKeys = (props.autoExpandParent ? this.getFilterExpandedKeys(props, 'expandedKeys', false) : props.expandedKeys) || [];
    }
    return expandedKeys;
  };

  Tree.prototype.getDefaultCheckedKeys = function getDefaultCheckedKeys(props, willReceiveProps) {
    var checkedKeys = willReceiveProps ? undefined : props.defaultCheckedKeys;
    if ('checkedKeys' in props) {
      checkedKeys = props.checkedKeys || [];
      if (props.checkStrictly) {
        if (props.checkedKeys.checked) {
          checkedKeys = props.checkedKeys.checked;
        } else if (!Array.isArray(props.checkedKeys)) {
          checkedKeys = [];
        }
      }
    }
    return checkedKeys;
  };

  Tree.prototype.getDefaultSelectedKeys = function getDefaultSelectedKeys(props, willReceiveProps) {
    var getKeys = function getKeys(keys) {
      if (props.multiple) {
        return [].concat(_toConsumableArray(keys));
      }
      if (keys.length) {
        return [keys[0]];
      }
      return keys;
    };
    var selectedKeys = willReceiveProps ? undefined : getKeys(props.defaultSelectedKeys);
    if ('selectedKeys' in props) {
      selectedKeys = getKeys(props.selectedKeys);
    }
    return selectedKeys;
  };

  Tree.prototype.getRawExpandedKeys = function getRawExpandedKeys() {
    if (!this._rawExpandedKeys && 'expandedKeys' in this.props) {
      this._rawExpandedKeys = [].concat(_toConsumableArray(this.state.expandedKeys));
    }
  };

  Tree.prototype.getOpenTransitionName = function getOpenTransitionName() {
    var props = this.props;
    var transitionName = props.openTransitionName;
    var animationName = props.openAnimation;
    if (!transitionName && typeof animationName === 'string') {
      transitionName = props.prefixCls + '-open-' + animationName;
    }
    return transitionName;
  };

  Tree.prototype.getDragNodes = function getDragNodes(treeNode) {
    var dragNodesKeys = [];
    var tPArr = treeNode.props.pos.split('-');
    (0, _util.loopAllChildren)(this.props.children, function (item, index, pos, newKey) {
      var pArr = pos.split('-');
      if (treeNode.props.pos === pos || tPArr.length < pArr.length && (0, _util.isInclude)(tPArr, pArr)) {
        dragNodesKeys.push(newKey);
      }
    });
    return dragNodesKeys;
  };

  Tree.prototype.getExpandedKeys = function getExpandedKeys(treeNode, expand) {
    var key = treeNode.props.eventKey;
    var expandedKeys = this.state.expandedKeys;
    var expandedIndex = expandedKeys.indexOf(key);
    var exKeys = void 0;
    if (expandedIndex > -1 && !expand) {
      exKeys = [].concat(_toConsumableArray(expandedKeys));
      exKeys.splice(expandedIndex, 1);
      return exKeys;
    }
    if (expand && expandedKeys.indexOf(key) === -1) {
      return expandedKeys.concat([key]);
    }
  };

  Tree.prototype.filterTreeNode = function filterTreeNode(treeNode) {
    var filterTreeNode = this.props.filterTreeNode;
    if (typeof filterTreeNode !== 'function' || treeNode.props.disabled) {
      return false;
    }
    return filterTreeNode.call(this, treeNode);
  };

  Tree.prototype.renderTreeNode = function renderTreeNode(child, index) {
    var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var pos = level + '-' + index;
    var key = child.key || pos;
    var state = this.state;
    var props = this.props;

    // prefer to child's own selectable property if passed
    var selectable = props.selectable;
    if (child.props.hasOwnProperty('selectable')) {
      selectable = child.props.selectable;
    }

    var cloneProps = {
      ref: 'treeNode-' + key,
      root: this,
      eventKey: key,
      pos: pos,
      selectable: selectable,
      loadData: props.loadData,
      onMouseEnter: props.onMouseEnter,
      onMouseLeave: props.onMouseLeave,
      onRightClick: props.onRightClick,
      prefixCls: props.prefixCls,
      showLine: props.showLine,
      showIcon: props.showIcon,
      draggable: props.draggable,
      dragOver: state.dragOverNodeKey === key && this.dropPosition === 0,
      dragOverGapTop: state.dragOverNodeKey === key && this.dropPosition === -1,
      dragOverGapBottom: state.dragOverNodeKey === key && this.dropPosition === 1,
      _dropTrigger: this._dropTrigger,
      expanded: state.expandedKeys.indexOf(key) !== -1,
      selected: state.selectedKeys.indexOf(key) !== -1,
      openTransitionName: this.getOpenTransitionName(),
      openAnimation: props.openAnimation,
      filterTreeNode: this.filterTreeNode.bind(this)
    };
    if (props.checkable) {
      cloneProps.checkable = props.checkable;
      if (props.checkStrictly) {
        if (state.checkedKeys) {
          cloneProps.checked = state.checkedKeys.indexOf(key) !== -1 || false;
        }
        if (props.checkedKeys && props.checkedKeys.halfChecked) {
          cloneProps.halfChecked = props.checkedKeys.halfChecked.indexOf(key) !== -1 || false;
        } else {
          cloneProps.halfChecked = false;
        }
      } else {
        if (this.checkedKeys) {
          cloneProps.checked = this.checkedKeys.indexOf(key) !== -1 || false;
        }
        cloneProps.halfChecked = this.halfCheckedKeys.indexOf(key) !== -1;
      }
    }
    if (this.treeNodesStates && this.treeNodesStates[pos]) {
      (0, _objectAssign2["default"])(cloneProps, this.treeNodesStates[pos].siblingPosition);
    }
    return _react2["default"].cloneElement(child, cloneProps);
  };

  Tree.prototype.render = function render() {
    var _this4 = this;

    var props = this.props;
    var domProps = {
      className: (0, _classnames2["default"])(props.className, props.prefixCls),
      role: 'tree-node'
    };
    if (props.focusable) {
      domProps.tabIndex = '0';
      domProps.onKeyDown = this.onKeyDown;
    }
    var getTreeNodesStates = function getTreeNodesStates() {
      _this4.treeNodesStates = {};
      (0, _util.loopAllChildren)(props.children, function (item, index, pos, keyOrPos, siblingPosition) {
        _this4.treeNodesStates[pos] = {
          siblingPosition: siblingPosition
        };
      });
    };
    if (props.showLine && !props.checkable) {
      getTreeNodesStates();
    }
    if (props.checkable && (this.checkedKeysChange || props.loadData)) {
      if (props.checkStrictly) {
        getTreeNodesStates();
      } else if (props._treeNodesStates) {
        this.treeNodesStates = props._treeNodesStates.treeNodesStates;
        this.halfCheckedKeys = props._treeNodesStates.halfCheckedKeys;
        this.checkedKeys = props._treeNodesStates.checkedKeys;
      } else {
        var checkedKeys = this.state.checkedKeys;
        var checkKeys = void 0;
        if (!props.loadData && this.checkKeys && this._checkedKeys && (0, _util.arraysEqual)(this._checkedKeys, checkedKeys)) {
          // if checkedKeys the same as _checkedKeys from onCheck, use _checkedKeys.
          checkKeys = this.checkKeys;
        } else {
          var checkedPositions = [];
          this.treeNodesStates = {};
          (0, _util.loopAllChildren)(props.children, function (item, index, pos, keyOrPos, siblingPosition) {
            _this4.treeNodesStates[pos] = {
              node: item,
              key: keyOrPos,
              checked: false,
              halfChecked: false,
              siblingPosition: siblingPosition
            };
            if (checkedKeys.indexOf(keyOrPos) !== -1) {
              _this4.treeNodesStates[pos].checked = true;
              checkedPositions.push(pos);
            }
          });
          // if the parent node's key exists, it all children node will be checked
          (0, _util.handleCheckState)(this.treeNodesStates, (0, _util.filterParentPosition)(checkedPositions), true);
          checkKeys = (0, _util.getCheck)(this.treeNodesStates);
        }
        this.halfCheckedKeys = checkKeys.halfCheckedKeys;
        this.checkedKeys = checkKeys.checkedKeys;
      }
    }

    return _react2["default"].createElement(
      'ul',
      _extends({}, domProps, { unselectable: true, ref: 'tree' }),
      _react2["default"].Children.map(props.children, this.renderTreeNode, this)
    );
  };

  return Tree;
}(_react2["default"].Component);

Tree.propTypes = {
  prefixCls: _propTypes2["default"].string,
  children: _propTypes2["default"].any,
  showLine: _propTypes2["default"].bool,
  showIcon: _propTypes2["default"].bool,
  selectable: _propTypes2["default"].bool,
  multiple: _propTypes2["default"].bool,
  checkable: _propTypes2["default"].oneOfType([_propTypes2["default"].bool, _propTypes2["default"].node]),
  _treeNodesStates: _propTypes2["default"].object,
  checkStrictly: _propTypes2["default"].bool,
  draggable: _propTypes2["default"].bool,
  autoExpandParent: _propTypes2["default"].bool,
  defaultExpandAll: _propTypes2["default"].bool,
  defaultExpandedKeys: _propTypes2["default"].arrayOf(_propTypes2["default"].string),
  expandedKeys: _propTypes2["default"].arrayOf(_propTypes2["default"].string),
  defaultCheckedKeys: _propTypes2["default"].arrayOf(_propTypes2["default"].string),
  checkedKeys: _propTypes2["default"].oneOfType([_propTypes2["default"].arrayOf(_propTypes2["default"].string), _propTypes2["default"].object]),
  defaultSelectedKeys: _propTypes2["default"].arrayOf(_propTypes2["default"].string),
  selectedKeys: _propTypes2["default"].arrayOf(_propTypes2["default"].string),
  onExpand: _propTypes2["default"].func,
  onCheck: _propTypes2["default"].func,
  onSelect: _propTypes2["default"].func,
  loadData: _propTypes2["default"].func,
  onMouseEnter: _propTypes2["default"].func,
  onMouseLeave: _propTypes2["default"].func,
  onRightClick: _propTypes2["default"].func,
  onDragStart: _propTypes2["default"].func,
  onDragEnter: _propTypes2["default"].func,
  onDragOver: _propTypes2["default"].func,
  onDragLeave: _propTypes2["default"].func,
  onDrop: _propTypes2["default"].func,
  onDragEnd: _propTypes2["default"].func,
  filterTreeNode: _propTypes2["default"].func,
  openTransitionName: _propTypes2["default"].string,
  openAnimation: _propTypes2["default"].oneOfType([_propTypes2["default"].string, _propTypes2["default"].object])
};

Tree.defaultProps = {
  prefixCls: 'rc-tree',
  showLine: false,
  showIcon: true,
  selectable: true,
  multiple: false,
  checkable: false,
  checkStrictly: false,
  draggable: false,
  autoExpandParent: true,
  defaultExpandAll: false,
  defaultExpandedKeys: [],
  defaultCheckedKeys: [],
  defaultSelectedKeys: [],
  onExpand: noop,
  onCheck: noop,
  onSelect: noop,
  onDragStart: noop,
  onDragEnter: noop,
  onDragOver: noop,
  onDragLeave: noop,
  onDrop: noop,
  onDragEnd: noop
};

exports["default"] = Tree;
module.exports = exports['default'];