import { GameEngine, BaseTypes, DynamicObject, KeyboardControls, SimplePhysicsEngine } from 'lance-gg'

const BITE_WIDTH = 20
const COUNTS_TO_WIN = 10
const PLATE_BITES = 9
const PLAYER_WIDTH_BUFFER = 60
const PLAYERS_COUNT = 20

const initBites = game => {
  game.controls = new KeyboardControls(game.renderer.clientEngine)

  const order = [0, 1, 2, 3, 4, 5, 6, 7, 8]

  shuffle(order)

  const bites = document.querySelector('#bites')

  order.forEach(o => {
    const button = document.createElement('button')

    button.classList.add('bite')

    button.setAttribute('data-order', o)

    button.innerHTML = 'bite ' + o

    button.addEventListener('click', ev => {
      if (o !== document.querySelectorAll('.bite.hidden').length) {
        return true
      }

      if (button.classList.contains('blocked')) {
        return true
      }

      button.classList.add('hidden')

      game.controls.clientEngine.sendInput('bite')

      if (o === PLATE_BITES - 1) {
        document.querySelectorAll('.bite').forEach(b => b.classList.remove('hidden'))
      }
    })

    bites.appendChild(button)
  })
}

const initPlayers = game => {
  const players = document.querySelector('#players')

  for (let i = 0; i < PLAYERS_COUNT; i++) {
    const player = document.createElement('div')

    player.classList.add('player', 'hidden')

    player.setAttribute('id', 'player' + i)

    players.appendChild(player)
  }
}

const shuffle = arr => {
  let currentIndex = arr.length
  let randomIndex
  let temporaryValue

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = arr[currentIndex]
    arr[currentIndex] = arr[randomIndex]
    arr[randomIndex] = temporaryValue
  }

  return arr
}

// A paddle has a health attribute
class Plate extends DynamicObject {
  constructor (gameEngine, options, props) {
    super(gameEngine, options, props)

    this.bites = 0
    this.blocked = 0
    this.count = 0
  }

  static get netScheme () {
    return Object.assign({
      bites: { type: BaseTypes.TYPES.INT16 },
      count: { type: BaseTypes.TYPES.INT16 }
    }, super.netScheme)
  }

  syncTo (other) {
    super.syncTo(other)

    this.bites = other.bites
    this.count = other.count
  }
}

export default class Game extends GameEngine {
  constructor (options) {
    super(options)
    this.physicsEngine = new SimplePhysicsEngine({ gameEngine: this })

    // common code
    this.on('postStep', this.gameLogic.bind(this))

    // server-only code
    this.on('server__init', this.serverSideInit.bind(this))
    this.on('server__playerJoined', this.serverSidePlayerJoined.bind(this))
    this.on('server__playerDisconnected', this.serverSidePlayerDisconnected.bind(this))

    // client-only code
    this.on('client__rendererReady', this.clientSideInit.bind(this))
    this.on('client__draw', this.clientSideDraw.bind(this))
  }

  registerClasses (serializer) {
    serializer.registerClass(Plate)
  }

  gameLogic () {
    const plates = this.world.queryObjects({ instanceType: Plate })

    if (plates.length < 2) {
      return
    }

    plates.forEach((p, i) => {
      if (p.bites === PLATE_BITES) {
        p.count++
        p.bites = 0

        if (p.count === COUNTS_TO_WIN) {
        }
      }
    })
  }

  processInput (inputData, playerId) {
    super.processInput(inputData, playerId)

    // get the player paddle tied to the player socket
    const plate = this.world.queryObject({ playerId })
    if (plate) {
      if (inputData.input === 'bite') {
        plate.bites++
      }
    }
  }

  //
  // SERVER ONLY CODE
  //
  serverSideInit () {
    const initValues = {
      bites: 0,
      blocked: false,
      count: 0,
      playerId: 0
    }

    for (let i = 0; i < PLAYERS_COUNT; i++) {
      this.addObjectToWorld(new Plate(this, null, initValues))
    }
  }

  // attach newly connected player to next available paddle
  serverSidePlayerJoined (ev) {
    const plates = this.world.queryObjects({ instanceType: Plate })

    let joined = false

    plates.forEach(plate => {
      if (joined) {
        return
      }

      if (plate.playerId === 0) {
        plate.playerId = ev.playerId

        joined = true
      }
    })
  }

  serverSidePlayerDisconnected (ev) {
    const plates = this.world.queryObjects({ instanceType: Plate })

    plates.forEach(plate => {
      if (plate.playerId !== ev.playerId) {
        return
      }
      this.removeObjectFromWorld(plate.id)
    })
  }

  //
  // CLIENT ONLY CODE
  //
  clientSideInit () {
    initBites(this)

    initPlayers(this)
  }

  clientSideDraw () {
    const plates = this.world.queryObjects({ instanceType: Plate })

    if (!plates.length) {
      return
    }

    plates.forEach((plate, i) => {
      const plateElement = document.querySelector('#player' + i)

      if (plateElement && plate.playerId) {
        plateElement.classList.remove('hidden')
        plateElement.style.width = PLAYER_WIDTH_BUFFER + ((PLATE_BITES - plate.bites) * BITE_WIDTH) + 'px'
        plateElement.innerHTML = [plate.playerId, plate.count, plate.bites].join(' ')
      }
    })
  }
}
