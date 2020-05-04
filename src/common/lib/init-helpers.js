import { KeyboardControls } from 'lance-gg'

import { shuffle } from './misc.js'

import { DEBUG, PLATE_BITES, PLAYERS_COUNT } from './constants.js'

const initBites = game => {
  game.controls = new KeyboardControls(game.renderer.clientEngine)

  const order = [0, 1, 2, 3, 4, 5, 6, 7, 8]

  if (!DEBUG) {
    shuffle(order)
  }

  const bites = document.querySelector('#bites')

  order.forEach(o => {
    const button = document.createElement('button')

    button.classList.add('bite', 'button')

    button.setAttribute('data-order', o)

    if (DEBUG) {
      button.innerHTML = 'bite ' + o
    }

    button.addEventListener('click', ev => {
      if (o !== document.querySelectorAll('.bite.hidden').length) {
        return true
      }

      const plate = game.world.queryObject({ playerId: game.playerId })

      if (!plate) {
        return true
      }

      if (plate.blocked) {
        return true
      }

      if (!plate.playing) {
        return true
      }

      button.classList.add('hidden')

      game.controls.clientEngine.sendInput('bite')

      if (o === PLATE_BITES - 1) {
        if (!DEBUG) {
          const bites = document.querySelector('#bites')

          for (let i = bites.children.length; i >= 0; i--) {
            bites.appendChild(bites.children[Math.random() * i | 0])
          }
        }

        document.querySelectorAll('.bite').forEach(b => b.classList.remove('hidden'))
      }
    })

    bites.appendChild(button)
  })
}

const initNameForm = game => {
  document.querySelector('#nameInput').addEventListener('keyup', ev => {
    const nameButton = document.querySelector('#nameButton')

    if (!ev.target.value.length) {
      nameButton.classList.add('disabled')
      nameButton.disabled = true

      return true
    }

    nameButton.disabled = false
  })

  document.querySelector('#nameButton').addEventListener('click', ev => {
    if (ev.target.disabled) {
      return true
    }

    game.emit('name', {
      name: document.querySelector('#nameInput').value,
      playerId: game.playerId
    })

    ev.target.classList.add('hidden')
    document.querySelector('#nameInput').classList.add('hidden')
  })
}

const initPlayers = () => {
  const players = document.querySelector('#players')

  for (let i = 0; i < PLAYERS_COUNT; i++) {
    const player = document.createElement('div')

    player.classList.add('player', 'hidden')

    player.setAttribute('id', 'player' + i)

    players.appendChild(player)
  }
}

const initStart = game => {
  document.querySelector('#start').addEventListener('click', ev => {
    game.controls.clientEngine.sendInput('start')

    ev.target.classList.add('hidden')
  })
}

const initTables = () => {
  const tables = document.querySelector('#tables')

  for (let i = 0; i < PLAYERS_COUNT; i++) {
    const table = document.createElement('div')

    table.classList.add('table', 'button', 'hidden')

    table.setAttribute('id', 'table' + i)

    tables.appendChild(table)
  }
}

export { initBites, initNameForm, initPlayers, initStart, initTables }
