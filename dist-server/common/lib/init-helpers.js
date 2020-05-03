"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPlayers = exports.initBites = void 0;

var _lanceGg = require("lance-gg");

var _misc = require("./misc.js");

var _constants = require("./constants.js");

var initBites = function initBites(game) {
  game.controls = new _lanceGg.KeyboardControls(game.renderer.clientEngine);
  var order = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  if (!_constants.DEBUG) {
    (0, _misc.shuffle)(order);
  }

  var bites = document.querySelector('#bites');
  order.forEach(function (o) {
    var button = document.createElement('button');
    button.classList.add('bite', 'button');
    button.setAttribute('data-order', o);

    if (_constants.DEBUG) {
      button.innerHTML = 'bite ' + o;
    }

    button.addEventListener('click', function (ev) {
      if (o !== document.querySelectorAll('.bite.hidden').length) {
        return true;
      }

      if (button.classList.contains('blocked')) {
        return true;
      }

      button.classList.add('hidden');
      game.controls.clientEngine.sendInput('bite');

      if (o === _constants.PLATE_BITES - 1) {
        if (!_constants.DEBUG) {
          var _bites = document.querySelector('#bites');

          for (var i = _bites.children.length; i >= 0; i--) {
            _bites.appendChild(_bites.children[Math.random() * i | 0]);
          }
        }

        document.querySelectorAll('.bite').forEach(function (b) {
          return b.classList.remove('hidden');
        });
      }
    });
    bites.appendChild(button);
  });
};

exports.initBites = initBites;

var initPlayers = function initPlayers(game) {
  var players = document.querySelector('#players');

  for (var i = 0; i < _constants.PLAYERS_COUNT; i++) {
    var player = document.createElement('div');
    player.classList.add('player', 'hidden');
    player.setAttribute('id', 'player' + i);
    players.appendChild(player);
  }
};

exports.initPlayers = initPlayers;
//# sourceMappingURL=init-helpers.js.map