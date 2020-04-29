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

var BITE_WIDTH = 20;
var COUNTS_TO_WIN = 10;
var PLATE_BITES = 9;
var PLAYER_WIDTH_BUFFER = 60;
var PLAYERS_COUNT = 20;

var initBites = function initBites(game) {
  game.controls = new _lanceGg.KeyboardControls(game.renderer.clientEngine);
  var order = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  shuffle(order);
  var bites = document.querySelector('#bites');
  order.forEach(function (o) {
    var button = document.createElement('button');
    button.classList.add('bite');
    button.setAttribute('data-order', o);
    button.innerHTML = 'bite ' + o;
    button.addEventListener('click', function (ev) {
      if (o !== document.querySelectorAll('.bite.hidden').length) {
        return true;
      }

      if (button.classList.contains('blocked')) {
        return true;
      }

      button.classList.add('hidden');
      game.controls.clientEngine.sendInput('bite');

      if (o === PLATE_BITES - 1) {
        document.querySelectorAll('.bite').forEach(function (b) {
          return b.classList.remove('hidden');
        });
      }
    });
    bites.appendChild(button);
  });
};

var initPlayers = function initPlayers(game) {
  var players = document.querySelector('#players');

  for (var i = 0; i < PLAYERS_COUNT; i++) {
    var player = document.createElement('div');
    player.classList.add('player', 'hidden');
    player.setAttribute('id', 'player' + i);
    players.appendChild(player);
  }
};

var shuffle = function shuffle(arr) {
  var currentIndex = arr.length;
  var randomIndex;
  var temporaryValue; // While there remain elements to shuffle...

  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1; // And swap it with the current element.

    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }

  return arr;
}; // A paddle has a health attribute


var Plate =
/*#__PURE__*/
function (_DynamicObject) {
  _inherits(Plate, _DynamicObject);

  function Plate(gameEngine, options, props) {
    var _this;

    _classCallCheck(this, Plate);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Plate).call(this, gameEngine, options, props));
    _this.bites = 0;
    _this.blocked = 0;
    _this.count = 0;
    return _this;
  }

  _createClass(Plate, [{
    key: "syncTo",
    value: function syncTo(other) {
      _get(_getPrototypeOf(Plate.prototype), "syncTo", this).call(this, other);

      this.bites = other.bites;
      this.count = other.count;
    }
  }], [{
    key: "netScheme",
    get: function get() {
      return Object.assign({
        bites: {
          type: _lanceGg.BaseTypes.TYPES.INT16
        },
        count: {
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

      if (plates.length < 2) {
        return;
      }

      plates.forEach(function (p, i) {
        if (p.bites === PLATE_BITES) {
          p.count++;
          p.bites = 0;

          if (p.count === COUNTS_TO_WIN) {}
        }
      });
    }
  }, {
    key: "processInput",
    value: function processInput(inputData, playerId) {
      _get(_getPrototypeOf(Game.prototype), "processInput", this).call(this, inputData, playerId); // get the player paddle tied to the player socket


      var plate = this.world.queryObject({
        playerId: playerId
      });

      if (plate) {
        if (inputData.input === 'bite') {
          plate.bites++;
        }
      }
    } //
    // SERVER ONLY CODE
    //

  }, {
    key: "serverSideInit",
    value: function serverSideInit() {
      var initValues = {
        bites: 0,
        blocked: false,
        count: 0,
        playerId: 0
      };

      for (var i = 0; i < PLAYERS_COUNT; i++) {
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
      plates.forEach(function (plate) {
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
      initBites(this);
      initPlayers(this);
    }
  }, {
    key: "clientSideDraw",
    value: function clientSideDraw() {
      var plates = this.world.queryObjects({
        instanceType: Plate
      });

      if (!plates.length) {
        return;
      }

      plates.forEach(function (plate, i) {
        var plateElement = document.querySelector('#player' + i);

        if (plateElement && plate.playerId) {
          plateElement.classList.remove('hidden');
          plateElement.style.width = PLAYER_WIDTH_BUFFER + (PLATE_BITES - plate.bites) * BITE_WIDTH + 'px';
          plateElement.innerHTML = [plate.playerId, plate.count, plate.bites].join(' ');
        }
      });
    }
  }]);

  return Game;
}(_lanceGg.GameEngine);

exports.default = Game;
//# sourceMappingURL=Game.js.map