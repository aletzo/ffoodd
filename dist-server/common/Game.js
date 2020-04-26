"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lanceGg = require("lance-gg");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var PADDING = 30;
var WIDTH = 400;
var HEIGHT = 400;
var PADDLE_WIDTH = 10;
var PADDLE_HEIGHT = 50; // A paddle has a health attribute

var Plate =
/*#__PURE__*/
function (_DynamicObject) {
  _inherits(Plate, _DynamicObject);

  function Plate(gameEngine, options, props) {
    var _this;

    _classCallCheck(this, Plate);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Plate).call(this, gameEngine, options, props));
    _this.bites = 0;
    return _this;
  }

  _createClass(Plate, [{
    key: "syncTo",
    value: function syncTo(other) {
      _get(_getPrototypeOf(Plate.prototype), "syncTo", this).call(this, other);

      this.bites = other.bites;
    }
  }], [{
    key: "netScheme",
    get: function get() {
      return Object.assign({
        bites: {
          type: _lanceGg.BaseTypes.TYPES.INT16
        }
      }, _get(_getPrototypeOf(Plate), "netScheme", this));
    }
  }]);

  return Plate;
}(_lanceGg.DynamicObject);

var Game =
/*#__PURE__*/
function (_GameEngine) {
  _inherits(Game, _GameEngine);

  function Game(options) {
    var _this2;

    _classCallCheck(this, Game);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Game).call(this, options));
    _this2.physicsEngine = new _lanceGg.SimplePhysicsEngine({
      gameEngine: _assertThisInitialized(_this2)
    }); // common code

    _this2.on('postStep', _this2.gameLogic.bind(_assertThisInitialized(_this2))); // server-only code


    _this2.on('server__init', _this2.serverSideInit.bind(_assertThisInitialized(_this2)));

    _this2.on('server__playerJoined', _this2.serverSidePlayerJoined.bind(_assertThisInitialized(_this2)));

    _this2.on('server__playerDisconnected', _this2.serverSidePlayerDisconnected.bind(_assertThisInitialized(_this2))); // client-only code


    _this2.on('client__rendererReady', _this2.clientSideInit.bind(_assertThisInitialized(_this2)));

    _this2.on('client__draw', _this2.clientSideDraw.bind(_assertThisInitialized(_this2)));

    return _this2;
  }

  _createClass(Game, [{
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
      if (plates.length < 2) return;
      plates.forEach(function (p, i) {
        if (p.bites === 9) {
          console.log("player ".concat(i, " wins"));
        }
      });
    }
  }, {
    key: "processInput",
    value: function processInput(inputData, playerId) {
      _get(_getPrototypeOf(Game.prototype), "processInput", this).call(this, inputData, playerId); // get the player paddle tied to the player socket


      var playerPlate = this.world.queryObject({
        playerId: playerId
      });

      if (playerPlate) {
        if (inputData.input === 'space') {
          console.log("player ".concat(playerId, " bit"));
          playerPlate.bites++;
        }
      }
    } //
    // SERVER ONLY CODE
    //

  }, {
    key: "serverSideInit",
    value: function serverSideInit() {
      // create the paddles and the ball
      this.addObjectToWorld(new Plate(this, null, {
        playerId: 0,
        bites: 0
      }));
      this.addObjectToWorld(new Plate(this, null, {
        playerId: 0,
        bites: 0
      }));
      this.addObjectToWorld(new Plate(this, null, {
        playerId: 0,
        bites: 0
      }));
      this.addObjectToWorld(new Plate(this, null, {
        playerId: 0,
        bites: 0
      }));
      this.addObjectToWorld(new Plate(this, null, {
        playerId: 0,
        bites: 0
      }));
      this.addObjectToWorld(new Plate(this, null, {
        playerId: 0,
        bites: 0
      }));
    } // attach newly connected player to next available paddle

  }, {
    key: "serverSidePlayerJoined",
    value: function serverSidePlayerJoined(ev) {
      console.log('player joined' + ev.playerId);
      var plates = this.world.queryObjects({
        instanceType: Plate
      });
      var joined = false;
      plates.forEach(function (plate) {
        if (joined) {
          return;
        }

        if (plate.playerId === 0) {
          console.log('player matched to plage' + ev.playerId);
          plate.playerId = ev.playerId;
          joined = true;
        }
      });
      console.log('plates');
      console.log(plates);
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

        console.log('plate removed');

        _this3.removeObjectFromWorld(plate.id);
      });
    } //
    // CLIENT ONLY CODE
    //

  }, {
    key: "clientSideInit",
    value: function clientSideInit() {
      this.controls = new _lanceGg.KeyboardControls(this.renderer.clientEngine);
      this.controls.bindKey('space', 'space');
    }
  }, {
    key: "clientSideDraw",
    value: function clientSideDraw() {
      var plates = this.world.queryObjects({
        instanceType: Plate
      });
      console.log('plates.length');
      console.log(plates.length);

      if (!plates.length) {
        return;
      }

      plates.forEach(function (plate, i) {
        var selector = '#plate' + i;
        console.log('selector');
        console.log(selector);
        var plateElement = document.querySelector(selector);

        if (plateElement) {
          plateElement.classList.remove('hidden');
          plateElement.style.width = (9 - plate.bites) * 20 + 'px';
          plateElement.innerHTML = plate.playerId;
        }
      });
    }
  }]);

  return Game;
}(_lanceGg.GameEngine);

exports.default = Game;
//# sourceMappingURL=Game.js.map