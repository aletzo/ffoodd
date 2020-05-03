import {
  BaseTypes,
  DynamicObject,
  GameEngine,
  SimplePhysicsEngine
} from 'lance-gg'

import { initBites, initPlayers } from './lib/init-helpers.js'

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

    // get the player paddle tied to the player socket
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

    if (plate.canAttack && inputData.input === 'attack') {
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

    console.log('this')
    console.log(this)

    initPlayers(this)

    if (!DEBUG) {
      window.addEventListener('beforeunload', ev => {
        ev.returnValue = 'Are you sure you want to leave the game?'
      })
    }
  }

  clientSideDraw () {
    const plates = this.world.queryObjects({ instanceType: Plate })

    // const winner = plates.reduce((w, p) => p.isWinner === 1 ? p.playerId : '')

    plates.filter(p => p.playerId !== 0).forEach((plate, i) => {
      const plateElement = document.querySelector('#player' + i)

      if (!plateElement) {
        return
      }

      if (!plate.playerId) {
        plateElement.classList.add('hidden')
        return
      }

      if (plate.isWinner) {
        plateElement.classList.add('winner')
      }

      plateElement.classList.toggle('blocked', plate.blocked)
      plateElement.classList.toggle('canAttack', plate.blocked)
      plateElement.classList.toggle('playing', plate.playing)

      plateElement.classList.remove('hidden')

      plateElement.style.width = PLAYER_WIDTH_BUFFER + ((PLATE_BITES - plate.bites) * BITE_WIDTH) + 'px'

      const playerInfo = []

      if (DEBUG) {
        playerInfo.push(plate.playerId)
      }

      plateElement.innerHTML = playerInfo
        .concat(plate.name, plate.count, plate.bites)
        .join(' ')
    })
  }
}
