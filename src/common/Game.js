import { GameEngine, BaseTypes, TwoVector, DynamicObject, KeyboardControls, SimplePhysicsEngine } from 'lance-gg';

const PADDING = 30;
const WIDTH = 400;
const HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 50;

// A paddle has a health attribute
class Plate extends DynamicObject {

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.bites = 0;
    }

    static get netScheme() {
        return Object.assign({
            bites: { type: BaseTypes.TYPES.INT16 }
        }, super.netScheme);
    }

    syncTo(other) {
        super.syncTo(other);
        this.bites = other.bites;
    }
}

export default class Game extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({ gameEngine: this });

        // common code
        this.on('postStep', this.gameLogic.bind(this));

        // server-only code
        this.on('server__init', this.serverSideInit.bind(this));
        this.on('server__playerJoined', this.serverSidePlayerJoined.bind(this));
        this.on('server__playerDisconnected', this.serverSidePlayerDisconnected.bind(this));

        // client-only code
        this.on('client__rendererReady', this.clientSideInit.bind(this));
        this.on('client__draw', this.clientSideDraw.bind(this));
    }

    registerClasses(serializer) {
        serializer.registerClass(Plate);
    }

    gameLogic() {
        let plates = this.world.queryObjects({ instanceType: Plate });

        if (plates.length < 2) return;

        plates.forEach((p, i) => {
            if (p.bites === 9) {
                console.log(`player ${i} wins`);
            }
        })
    }

    processInput(inputData, playerId) {
        super.processInput(inputData, playerId);

        // get the player paddle tied to the player socket
        let playerPlate = this.world.queryObject({ playerId });
        if (playerPlate) {
            if (inputData.input === 'space') {

                console.log(`player ${playerId} bit`);

                playerPlate.bites++;
            }
        }
    }

    //
    // SERVER ONLY CODE
    //
    serverSideInit() {
        // create the paddles and the ball
        this.addObjectToWorld(new Plate(this, null, { playerId: 0, bites: 0 }));
        this.addObjectToWorld(new Plate(this, null, { playerId: 0, bites: 0 }));
        this.addObjectToWorld(new Plate(this, null, { playerId: 0, bites: 0 }));
        this.addObjectToWorld(new Plate(this, null, { playerId: 0, bites: 0 }));
        this.addObjectToWorld(new Plate(this, null, { playerId: 0, bites: 0 }));
        this.addObjectToWorld(new Plate(this, null, { playerId: 0, bites: 0 }));
    }

    // attach newly connected player to next available paddle
    serverSidePlayerJoined(ev) {
console.log('player joined' + ev.playerId);
        const plates = this.world.queryObjects({ instanceType: Plate });

        let joined = false;

        plates.forEach(plate => {
            if (joined) {
                return;
            }

            if (plate.playerId === 0) {
console.log('player matched to plage' + ev.playerId);
                plate.playerId = ev.playerId;

                joined = true;
            }
        })

console.log('plates');
console.log(plates);


    }

    serverSidePlayerDisconnected(ev) {
        const plates = this.world.queryObjects({ instanceType: Plate });

        plates.forEach(plate => {
            if (plate.playerId !== ev.playerId) {
                return;
            }
            console.log('plate removed');
            this.removeObjectFromWorld(plate.id);
        });
    }

    //
    // CLIENT ONLY CODE
    //
    clientSideInit() {
        this.controls = new KeyboardControls(this.renderer.clientEngine);
        this.controls.bindKey('space', 'space');
    }

    clientSideDraw() {
        let plates = this.world.queryObjects({ instanceType: Plate });

console.log('plates.length');
console.log(plates.length);

        if (!plates.length) {
            return;
        }

        plates.forEach((plate, i) => {
            const selector = '#plate' + i;

console.log('selector');
console.log(selector);

            const plateElement = document.querySelector(selector);

            if (plateElement) {
                plateElement.classList.remove('hidden');
                plateElement.style.width = ((9 - plate.bites) * 20) + 'px';
                plateElement.innerHTML = plate.playerId;
            }
        });
    }
}

