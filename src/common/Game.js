import {
  BaseTypes,
  DynamicObject,
  GameEngine,
  SimplePhysicsEngine
} from 'lance-gg'

import {
  initBites,
  initNameForm,
  initPlayers,
  initStart,
  initTables
} from './lib/init-helpers.js'

import {
  BITE_WIDTH,
  BLOCKED_TIME_FROM_ATTACK,
  BLOCKED_TIME_FROM_KICK,
  COUNTS_TO_WIN,
  DEBUG,
  PLATE_BITES,
  PLAYER_WIDTH_BUFFER,
  PLAYERS_COUNT
} from './lib/constants.js'

// A paddle has a health attribute
class Plate extends DynamicObject {
  constructor (gameEngine, options, props) {
    super(gameEngine, options, props)

    this.bites = 0
    this.blocked = 0
    this.canAttack = 0
    this.count = 0
    this.isWinner = 0
    this.name = ''
    this.playerId = 0
    this.playing = 0
  }

  static get netScheme () {
    return Object.assign({
      bites: { type: BaseTypes.TYPES.INT8 },
      blocked: { type: BaseTypes.TYPES.INT8 },
      canAttack: { type: BaseTypes.TYPES.INT8 },
      count: { type: BaseTypes.TYPES.INT8 },
      isWinner: { type: BaseTypes.TYPES.INT8 },
      name: { type: BaseTypes.TYPES.STRING },
      playerId: { type: BaseTypes.TYPES.INT8 },
      playing: { type: BaseTypes.TYPES.INT8 }
    }, super.netScheme)
  }

  syncTo (other) {
    super.syncTo(other)

    this.bites = other.bites
    this.blocked = other.blocked
    this.canAttack = other.count
    this.count = other.count
    this.isWinner = other.isWinner
    this.name = other.name
    this.playerId = other.playerId
    this.playing = other.playing
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

    this.on('name', this.name.bind(this))
  }

  name (data) {
    const plate = this.world.queryObject({ playerId: data.playerId })

    if (plate && data.name && data.name.length) {
      plate.name = data.name
    }
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
        p.canAttack = 1
        p.bites = 0

        if (p.count === COUNTS_TO_WIN) {
          p.blocked = 1
          p.playing = 0
          p.isWinner = 1
        }
      }
    })
  }

  processInput (inputData, playerId) {
    super.processInput(inputData, playerId)

    if (inputData.input === 'start') {
      const plates = this.world.queryObjects({ instanceType: Plate })

      plates.forEach(p => {
        p.blocked = 0
        p.playing = 1
      })
    }

    const plate = this.world.queryObject({ playerId })

    if (!plate || !plate.playing) {
      return
    }

    if (plate.blocked === 1) {
      return
    }

    if (inputData.input === 'bite') {
      plate.bites++
    }

    if (inputData.input === 'kickLeft') {
      const plateOnTheLeft = this.world.queryObject({ playerId: playerId - 1 })

      if (plateOnTheLeft) {
        plateOnTheLeft.blocked = 1

        setInterval(() => { plateOnTheLeft.blocked = 0 }, BLOCKED_TIME_FROM_KICK)
      }
    }

    if (inputData.input === 'kickRight') {
      const plateOnTheRight = this.world.queryObject({ playerId: playerId + 1 })

      if (plateOnTheRight) {
        plateOnTheRight.blocked = 1

        setInterval(() => { plateOnTheRight.blocked = 0 }, BLOCKED_TIME_FROM_KICK)
      }
    }

    if (inputData.input === 'attack' && plate.canAttack) {
      plate.canAttack = 0

      const plates = this.world.queryObjects({ instanceType: Plate })

      const otherPlates = plates.filter(p => p.playerId !== playerId)

      otherPlates.map(p => { p.blocked = 1 })

      setInterval(() => otherPlates.map(p => { p.blocked = 0 }), BLOCKED_TIME_FROM_ATTACK)
    }
  }

  //
  // SERVER ONLY CODE
  //
  serverSideInit () {
    const initValues = {
      bites: 0,
      blocked: 1,
      count: 0,
      isWinner: 0,
      name: '',
      playerId: 0,
      playing: 0
    }

    for (let i = 0; i < PLAYERS_COUNT; i++) {
      this.addObjectToWorld(new Plate(this, null, initValues))
    }
  }

  // attach newly connected player to next available paddle
  serverSidePlayerJoined (ev) {
    const plates = this.world.queryObjects({ instanceType: Plate })

    let joined = false

    plates.filter(p => p.playerId === 0).forEach(plate => {
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
    initNameForm(this)
    initPlayers()
    initStart(this)
    initTables()

    if (!DEBUG) {
      window.addEventListener('beforeunload', ev => {
        ev.returnValue = 'Are you sure you want to leave the game?'
      })
    }
  }

  clientSideDraw () {
    const plates = this.world.queryObjects({ instanceType: Plate })

    // const winner = plates.reduce((w, p) => p.isWinner === 1 ? p.playerId : '')

    plates.forEach((p, i) => {
      const plate = document.querySelector('#player' + i)
      const table = document.querySelector('#table' + i)

      if (!plate) {
        return
      }

      if (!p.playerId) {
        plate.classList.add('hidden')
        return
      }

      if (p.isWinner) {
        plate.classList.add('winner')
      }

      plate.classList.toggle('blocked', p.blocked)
      plate.classList.toggle('canAttack', p.canAttack)
      plate.classList.toggle('playing', p.playing)

      if (this.playerId === p.playerId) {
        document.querySelector('#attack').classList.toggle('canAttack', p.canAttack)
      }

      plate.classList.remove('hidden')

      plate.style.width = PLAYER_WIDTH_BUFFER + ((PLATE_BITES - p.bites) * BITE_WIDTH) + 'px'

      const playerInfo = []

      if (DEBUG) {
        playerInfo.push(p.playerId)
      }

      plate.innerHTML = playerInfo
        .concat(p.name, p.count, p.bites)
        .join(' ')

      table.classList.remove('hidden')

      table.innerHTML = p.name.substring(0, 1)
    })
  }
}
