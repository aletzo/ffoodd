"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lanceGg = require("lance-gg");

var _initHelpers = require("./lib/init-helpers.js");

var _constants = require("./lib/constants.js");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

// A paddle has a health attribute
var Plate = /*#__PURE__*/function (_DynamicObject) {
  _inherits(Plate, _DynamicObject);

  var _super = _createSuper(Plate);

  function Plate(gameEngine, options, props) {
    var _this;

    _classCallCheck(this, Plate);

    _this = _super.call(this, gameEngine, options, props);
    _this.bites = 0;
    _this.blocked = 0;
    _this.canAttack = 0;
    _this.count = 0;
    _this.isWinner = 0;
    _this.nameee = '';
    _this.playerId = 0;
    _this.playing = 0;
    return _this;
  }

  _createClass(Plate, [{
    key: "syncTo",
    value: function syncTo(other) {
      _get(_getPrototypeOf(Plate.prototype), "syncTo", this).call(this, other);

      this.bites = other.bites;
      this.blocked = other.blocked;
      this.canAttack = other.count;
      this.count = other.count;
      this.isWinner = other.isWinner;
      this.nameee = other.nameee;
      this.playerId = other.playerId;
      this.playing = other.playing;
    }
  }], [{
    key: "netScheme",
    get: function get() {
      return Object.assign({
        bites: {
          type: _lanceGg.BaseTypes.TYPES.INT8
        },
        blocked: {
          type: _lanceGg.BaseTypes.TYPES.INT8
        },
        canAttack: {
          type: _lanceGg.BaseTypes.TYPES.INT8
        },
        count: {
          type: _lanceGg.BaseTypes.TYPES.INT8
        },
        isWinner: {
          type: _lanceGg.BaseTypes.TYPES.INT8
        },
        nameee: {
          type: _lanceGg.BaseTypes.TYPES.STRING
        },
        playerId: {
          type: _lanceGg.BaseTypes.TYPES.INT8
        },
        playing: {
          type: _lanceGg.BaseTypes.TYPES.INT8
        }
      }, _get(_getPrototypeOf(Plate), "netScheme", this));
    }
  }]);

  return Plate;
}(_lanceGg.DynamicObject);

var Game = /*#__PURE__*/function (_GameEngine) {
  _inherits(Game, _GameEngine);

  var _super2 = _createSuper(Game);

  function Game(options) {
    var _this2;

    _classCallCheck(this, Game);

    _this2 = _super2.call(this, options);
    _this2.physicsEngine = new _lanceGg.SimplePhysicsEngine({
      gameEngine: _assertThisInitialized(_this2)
    }); // common code

    _this2.on('postStep', _this2.gameLogic.bind(_assertThisInitialized(_this2))); // server-only code


    _this2.on('server__init', _this2.serverSideInit.bind(_assertThisInitialized(_this2)));

    _this2.on('server__playerJoined', _this2.serverSidePlayerJoined.bind(_assertThisInitialized(_this2)));

    _this2.on('server__playerDisconnected', _this2.serverSidePlayerDisconnected.bind(_assertThisInitialized(_this2))); // client-only code


    _this2.on('client__rendererReady', _this2.clientSideInit.bind(_assertThisInitialized(_this2)));

    _this2.on('client__draw', _this2.clientSideDraw.bind(_assertThisInitialized(_this2)));

    _this2.on('nameee', _this2.nameee.bind(_assertThisInitialized(_this2)));

    return _this2;
  }

  _createClass(Game, [{
    key: "nameee",
    value: function nameee(data) {
      var plate = this.world.queryObject({
        playerId: data.playerId
      });
      console.log('data');
      console.log(data);

      if (plate && data.name && data.name.length) {
        plate.nameee = data.name;
      }
    }
  }, {
    key: "registerClasses",
    value: function registerClasses(serializer) {
      serializer.registerClass(Plate);
    }
  }, {
    key: "gameLogic",
    value: function gameLogic() {
      var plates = this.world.queryObjects({
        instanceType: Plate
      });

      if (plates.length < 2) {
        return;
      }

      plates.forEach(function (p, i) {
        if (p.bites === _constants.PLATE_BITES) {
          p.count++;
          p.canAttack = 1;
          p.bites = 0;

          if (p.count === _constants.COUNTS_TO_WIN) {
            p.blocked = 1;
            p.playing = 0;
            p.isWinner = 1;
          }
        }
      });
    }
  }, {
    key: "processInput",
    value: function processInput(inputData, playerId) {
      _get(_getPrototypeOf(Game.prototype), "processInput", this).call(this, inputData, playerId);

      if (inputData.input === 'start') {
        var plates = this.world.queryObjects({
          instanceType: Plate
        });
        plates.forEach(function (p) {
          p.blocked = 0;
          p.playing = 1;
        });
      }

      var plate = this.world.queryObject({
        playerId: playerId
      });

      if (!plate || !plate.playing) {
        return;
      }

      if (plate.blocked === 1) {
        return;
      }

      if (inputData.input === 'bite') {
        plate.bites++;
      }

      if (inputData.input === 'kickLeft') {
        var plateOnTheLeft = this.world.queryObject({
          playerId: playerId - 1
        });

        if (plateOnTheLeft) {
          plateOnTheLeft.blocked = 1;
          setInterval(function () {
            plateOnTheLeft.blocked = 0;
          }, _constants.BLOCKED_TIME_FROM_KICK);
        }
      }

      if (inputData.input === 'kickRight') {
        var plateOnTheRight = this.world.queryObject({
          playerId: playerId + 1
        });

        if (plateOnTheRight) {
          plateOnTheRight.blocked = 1;
          setInterval(function () {
            plateOnTheRight.blocked = 0;
          }, _constants.BLOCKED_TIME_FROM_KICK);
        }
      }

      if (inputData.input === 'attack' && plate.canAttack) {
        plate.canAttack = 0;

        var _plates = this.world.queryObjects({
          instanceType: Plate
        });

        var otherPlates = _plates.filter(function (p) {
          return p.playerId !== playerId;
        });

        otherPlates.map(function (p) {
          p.blocked = 1;
        });
        setInterval(function () {
          return otherPlates.map(function (p) {
            p.blocked = 0;
          });
        }, _constants.BLOCKED_TIME_FROM_ATTACK);
      }
    } //
    // SERVER ONLY CODE
    //

  }, {
    key: "serverSideInit",
    value: function serverSideInit() {
      var initValues = {
        bites: 0,
        blocked: 1,
        count: 0,
        isWinner: 0,
        nameee: '',
        playerId: 0,
        playing: 0
      };

      for (var i = 0; i < _constants.PLAYERS_COUNT; i++) {
        this.addObjectToWorld(new Plate(this, null, initValues));
      }
    } // attach newly connected player to next available paddle

  }, {
    key: "serverSidePlayerJoined",
    value: function serverSidePlayerJoined(ev) {
      var plates = this.world.queryObjects({
        instanceType: Plate
      });
      var joined = false;
      plates.filter(function (p) {
        return p.playerId === 0;
      }).forEach(function (plate) {
        if (joined) {
          return;
        }

        if (plate.playerId === 0) {
          plate.playerId = ev.playerId;
          joined = true;
        }
      });
    }
  }, {
    key: "serverSidePlayerDisconnected",
    value: function serverSidePlayerDisconnected(ev) {
      var _this3 = this;

      var plates = this.world.queryObjects({
        instanceType: Plate
      });
      plates.forEach(function (plate) {
        if (plate.playerId !== ev.playerId) {
          return;
        }

        _this3.removeObjectFromWorld(plate.id);
      });
    } //
    // CLIENT ONLY CODE
    //

  }, {
    key: "clientSideInit",
    value: function clientSideInit() {
      (0, _initHelpers.initBites)(this);
      (0, _initHelpers.initNameForm)(this);
      (0, _initHelpers.initPlayers)();
      (0, _initHelpers.initStart)(this);
      (0, _initHelpers.initTables)();

      if (!_constants.DEBUG) {
        window.addEventListener('beforeunload', function (ev) {
          ev.returnValue = 'Are you sure you want to leave the game?';
        });
      }
    }
  }, {
    key: "clientSideDraw",
    value: function clientSideDraw() {
      var _this4 = this;

      var plates = this.world.queryObjects({
        instanceType: Plate
      }); // const winner = plates.reduce((w, p) => p.isWinner === 1 ? p.playerId : '')

      plates.forEach(function (p, i) {
        var plate = document.querySelector('#player' + i);
        var table = document.querySelector('#table' + i);

        if (!plate) {
          return;
        }

        if (!p.playerId) {
          plate.classList.add('hidden');
          return;
        }

        if (p.isWinner) {
          plate.classList.add('winner');
        }

        plate.classList.toggle('blocked', p.blocked);
        plate.classList.toggle('canAttack', p.canAttack);
        plate.classList.toggle('playing', p.playing);

        if (_this4.playerId === p.playerId) {
          document.querySelector('#attack').classList.toggle('canAttack', p.canAttack);
        }

        plate.classList.remove('hidden');
        plate.style.width = _constants.PLAYER_WIDTH_BUFFER + (_constants.PLATE_BITES - p.bites) * _constants.BITE_WIDTH + 'px';
        var playerInfo = [];

        if (_constants.DEBUG) {
          playerInfo.push(p.playerId);
        }

        plate.innerHTML = playerInfo.concat(p.nameee, p.count, p.bites).join(' ');
        table.classList.remove('hidden');
        table.innerHTML = p.nameee.substring(0, 1);
      });
    }
  }]);

  return Game;
}(_lanceGg.GameEngine);

exports["default"] = Game;
//# sourceMappingURL=Game.js.map