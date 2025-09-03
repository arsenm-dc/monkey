import { animate } from 'animejs';
import { Container, Point, Rectangle, Sprite, Text, Texture, TilingSprite } from 'pixi.js';
import { makeSprite } from '../configs/spriteConfig';
import { Building, BuildingPool } from '../pools/BuildingsPool';
import { Cloud, CloudPool } from '../pools/CloudsPool';
import { LargeTree, LargeTreePool } from '../pools/LargeTreesPool';
import { MediumTree, MediumTreePool } from '../pools/MediumTreesPool';
import { FunctionType, Number, NumbersPool } from '../pools/NumbersPool';
import { SmallTree, SmallTreePool } from '../pools/SmallTreesPool';
import { Spike, SpikePool } from '../pools/SpikesPool';
import { VineBushPool } from '../pools/VineBushPool';
import { Vine, VinePool } from '../pools/VinesPool';
import { delayRunnable, getGameBounds, randomInt, sample } from '../Utils';
import { Monkey } from './Monkey';

const speeds = {
    sky: 0.1,
    clouds: 0.2,
    bkgBuildings: 0.3,
    bkgTrees: 0.5,
    buildings: 0.8,
    largeTrees: 1,
    smallForegroundTrees: 1.3,
    mediumTrees: 2,
    smallTrees: 2.3,
    fog: 1.6,
    ground: 2.5,
    smallFrontTrees: 3,
};

const cloudYRange = [120, 800];

const zIndex = {
    sky: 0,
    clouds: 1,
    bkgBuildings: 2,
    bkgTrees: 3,
    buildings: 4,
    largeTrees: 5,
    smallForegroundTrees: 6,
    mediumTrees: 7,
    smallTrees: 8,
    fog: 9,
    smallFrontTrees: 10,
    vines: 80,
    ground: 90,
    number: 95,
    spikes: 99,
    pit1: 100,
    monkey: 101,
    pit2: 102,
    button: 1000,
};

const monkeyPos = {
    x: 700,
    y: 750,
};
const WIDTH = 2048;
const HEIGHT = 1890;

const DT = 2;

export class BoardView extends Container {
    private sky: TilingSprite;
    private clouds: Cloud[] = [];
    private bkgBuildings: TilingSprite;
    private bkgTrees: TilingSprite;
    private buildings: Building[] = [];
    private largeTrees: LargeTree[] = [];
    private smallForegroundTrees: TilingSprite;
    private mediumTrees: MediumTree[] = [];
    private smallTrees: SmallTree[] = [];
    private pits: Sprite[] = [];
    private spikes: Spike[] = [];
    private fog: TilingSprite;
    private ground: TilingSprite;
    private smallFrontTrees: TilingSprite;

    private numbers: Number[] = [];
    private randomNumbers: Number[] = [];
    private monkey: Monkey;

    private playButton: Sprite;

    private isAlive = false;

    private gameWidth: number;
    private targetX: number;

    private currentValue = 1;
    private counter: Text;

    private vines: Vine[] = [];

    constructor() {
        super();
        this.sortableChildren = true;

        CloudPool.init();
        LargeTreePool.init();
        MediumTreePool.init();
        SmallTreePool.init();
        BuildingPool.init();
        NumbersPool.init();
        SpikePool.init();

        VinePool.init();
        VineBushPool.init();
    }

    public update(d: number): void {
        if (!this.isAlive) return;
        const dt = d * 5; // Control the speed
        this.updateClouds(dt);
        this.updateLargeTrees(dt);
        this.updateBuildings(dt);
        this.updateMediumTrees(dt);
        this.updateSmallTrees(dt);
        this.updateRandomNumbers(dt);
        this.updateSpikes(dt);

        this.updateTileSprites(dt);
    }

    public getBounds(skipUpdate?: boolean, rect?: Rectangle): Rectangle {
        return new Rectangle(400, 400, 900, 1450);
    }

    public build(): void {
        const { width } = getGameBounds();

        this.gameWidth = width * (1 / this.scale.x);
        this.targetX = -this.gameWidth / 4 - 200;
        this.buildSky();
        this.buildClouds();
        this.buildBkgBuildings();
        this.buildBkgTrees();
        this.buildBuildings();
        this.buildLargeTrees();
        this.buildSmallForegroundTrees();
        this.buildMediumTrees();
        this.buildSmallTrees();
        this.buildFog();
        this.buildSmallFrontTrees();
        this.buildSpikes();
        this.buildVines();

        this.buildMonkey();
        this.buildButton();
        this.buildCounter();
        this.buildRandomNumbers();
    }

    private buildSky(): void {
        const texture = Texture.from('sky.png');
        this.sky = new TilingSprite(texture, this.gameWidth * 2, texture.height);
        this.sky.x = -this.gameWidth / 2;
        this.sky.zIndex = zIndex.sky;
        this.addChild(this.sky);
    }

    private buildClouds(): void {
        const positions = [
            { x: 200, y: 300 },
            { x: 600, y: 600 },
            { x: 1300, y: 250 },
            { x: 1800, y: 700 },
            { x: 2300, y: 500 },
        ];
        positions.forEach(({ x, y }) => {
            const cloud = CloudPool.get(this);
            cloud.zIndex = zIndex.clouds;
            cloud.position.set(x, y);
            this.clouds.push(cloud);
        });
    }

    private buildBkgBuildings(): void {
        const texture = Texture.from('bkgBuildings.png');
        this.bkgBuildings = new TilingSprite(texture, this.gameWidth * 2, texture.height);
        this.bkgBuildings.x = -this.gameWidth / 2;
        this.bkgBuildings.y = HEIGHT - this.bkgBuildings.height;
        this.bkgBuildings.name = 'bkgBuildings';
        this.bkgBuildings.zIndex = zIndex.bkgBuildings;
        this.addChild(this.bkgBuildings);
    }

    private buildBkgTrees(): void {
        const texture = Texture.from('bkgTrees.png');
        this.bkgTrees = new TilingSprite(texture, this.gameWidth * 2, texture.height);
        this.bkgTrees.x = -this.gameWidth / 2;
        this.bkgTrees.y = HEIGHT - this.bkgTrees.height;
        this.bkgTrees.name = 'bkgTrees';
        this.bkgTrees.zIndex = zIndex.bkgTrees;
        this.addChild(this.bkgTrees);
    }

    private buildBuildings(): void {
        const positions = [
            400, 1930, 1610, 1665, 1305, 540, 825, 655, 1305, 1135, 1705, 2090, 200, 2220, 2800, 2350, 2600, 2200, 3000,
            3090, 3230, 3330, 3480, 3670, 3820, 3970, 4100, 4330, 4550,
        ];
        positions.forEach((x) => {
            const building = BuildingPool.get(this);
            building.zIndex = zIndex.buildings;
            building.position.set(x, 1875);
            this.buildings.push(building);
        });
    }

    private buildLargeTrees(): void {
        const position = [-1200, 120, 1575, 2975, 4400, 5700];
        position.forEach((x) => {
            const tree = LargeTreePool.get(this);
            tree.zIndex = zIndex.largeTrees;
            tree.position.set(x, 2000);
            this.largeTrees.push(tree);
        });
    }

    private buildSmallForegroundTrees(): void {
        const texture = Texture.from('tree_2_1.png');
        this.smallForegroundTrees = new TilingSprite(texture, this.gameWidth * 2, texture.height);
        this.smallForegroundTrees.x = -this.gameWidth / 2;
        this.smallForegroundTrees.y = HEIGHT - this.smallForegroundTrees.height;
        this.smallForegroundTrees.name = 'smallForegroundTrees';
        this.smallForegroundTrees.zIndex = zIndex.smallForegroundTrees;
        this.addChild(this.smallForegroundTrees);
    }

    private buildMediumTrees(): void {
        const positions = [-700, 270, 1275, 2275, 3275, 4275, 5300];
        positions.forEach((x) => {
            const tree = MediumTreePool.get(this);
            tree.zIndex = zIndex.mediumTrees;
            tree.position.set(x, 2000);
            this.mediumTrees.push(tree);
        });
    }

    private buildSmallTrees(): void {
        const positions = [-700, 0, 700, 1400, 2100, 2800, 3500, 4200];
        positions.forEach((x) => {
            const tree = SmallTreePool.get(this);
            tree.zIndex = zIndex.smallTrees;
            tree.position.set(x, 2000);
            this.smallTrees.push(tree);
        });
    }

    private buildVines(): void {
        const width = 300;
        const startX = -1200;
        const count = 20;
        for (let i = 0; i < count; i++) {
            const x = startX + i * width;
            const vine = VinePool.get(this);
            vine.zIndex = zIndex.vines;
            vine.position.set(x, 0);
            this.vines.push(vine);
        }
    }

    private buildSpikes(): void {
        const positions = [-720, 0, 720, 1440, 2160, 2880, 3600, 4320];
        positions.forEach((x) => {
            const tree = SpikePool.get(this);
            tree.zIndex = zIndex.spikes;
            tree.position.set(x, 1850);
            this.spikes.push(tree);
        });
    }

    private buildRandomNumbers(): void {
        let x = 2000;
        for (let i = 0; i < 8; i++) {
            x += Math.random() * 200 + 200;
            const { fn, number, y } = this.getRandomNumber();
            const n = NumbersPool.get(this, fn, number);
            n.zIndex = zIndex.number;
            n.position.set(x, y);
            this.randomNumbers.push(n);
        }
    }

    private buildFog(): void {
        const texture = Texture.from('fog.png');
        this.fog = new TilingSprite(texture, this.gameWidth, texture.height);
        // this.fog.x = -this.gameWidth / 4;
        this.fog.y = HEIGHT - this.fog.height - 40;
        this.fog.name = 'fog';
        this.fog.zIndex = zIndex.fog;
        this.addChild(this.fog);
    }

    private buildGround(): void {
        const texture = Texture.from('ground.png');
        this.ground = new TilingSprite(texture, this.gameWidth, texture.height);
        // this.fog.x = -this.gameWidth / 4;
        this.ground.y = HEIGHT - this.ground.height;
        this.ground.name = 'ground';
        this.ground.zIndex = zIndex.ground;
        this.addChild(this.ground);
    }

    private buildSmallFrontTrees(): void {
        const texture = Texture.from('tree_5_1.png');
        this.smallFrontTrees = new TilingSprite(texture, this.gameWidth, texture.height);
        // this.smallFrontTrees.x = -this.gameWidth / 4;
        this.smallFrontTrees.y = HEIGHT - this.smallFrontTrees.height;
        this.smallFrontTrees.name = 'smallFrontTrees';
        this.smallFrontTrees.zIndex = zIndex.smallFrontTrees;
        this.addChild(this.smallFrontTrees);
    }

    private buildMonkey(): void {
        this.monkey = new Monkey();
        this.monkey.name = 'monkey';
        this.monkey.position.set(monkeyPos.x, monkeyPos.y);
        this.monkey.zIndex = zIndex.monkey;
        this.monkey.setActive(false);

        this.addChild(this.monkey);
    }

    private buildButton(): void {
        this.playButton = makeSprite({
            frame: 'play.png',
            name: 'playButton',
            x: 850,
            y: 1700,
        });
        this.playButton.zIndex = zIndex.button;
        this.playButton.eventMode = 'static';
        this.playButton.on('pointerdown', () => {
            this.isAlive = true;
            this.monkey.setActive(true);
            this.dropMonkey();
            this.playButton.visible = false;
            this.playButton.eventMode = 'none';
        });
        this.addChild(this.playButton);
    }

    private buildCounter(): void {
        this.counter = new Text(this.currentValue, {
            fill: 0xffffff,
            fontWeight: '900',
            fontSize: 48,
        });
        this.counter.position.set(1100, 1680);
        this.counter.zIndex = zIndex.button;
        this.addChild(this.counter);
    }

    private updateLargeTrees(dt: number): void {
        this.largeTrees.forEach((c, i) => {
            c.x -= speeds.largeTrees * dt;
            if (c.x + c.width / 2 <= this.targetX) {
                this.largeTrees.splice(i, 1);
                c.remove();
                const newTree = LargeTreePool.get(this);
                newTree.position.set(this.largeTrees[this.largeTrees.length - 1].x + 1400, 2000);
                this.largeTrees.push(newTree);
            }
        });
    }

    private updateBuildings(dt: number): void {
        this.buildings.forEach((c, i) => {
            c.x -= speeds.buildings * dt;
            if (c.x + c.width / 2 <= this.targetX) {
                this.buildings.splice(i, 1);
                c.remove();
                const newBuilding = BuildingPool.get(this);
                newBuilding.position.set(this.buildings[this.buildings.length - 1].x + Math.random() * 50 + 150, 1875);
                this.buildings.push(newBuilding);
            }
        });
    }

    private updateMediumTrees(dt: number): void {
        this.mediumTrees.forEach((c, i) => {
            c.x -= speeds.mediumTrees * dt;
            if (c.x + c.width / 2 <= this.targetX) {
                this.mediumTrees.splice(i, 1);
                c.remove();

                const newTree = MediumTreePool.get(this);
                newTree.position.set(this.mediumTrees[this.mediumTrees.length - 1].x + 1000, 2000);
                this.mediumTrees.push(newTree);
            }
        });
    }

    private updateSmallTrees(dt: number): void {
        this.smallTrees.forEach((c, i) => {
            c.x -= speeds.smallTrees * dt;
            if (c.x + c.width / 2 <= this.targetX) {
                this.smallTrees.splice(i, 1);
                c.remove();
                const newTree = SmallTreePool.get(this);
                newTree.position.set(this.smallTrees[this.smallTrees.length - 1].x + 1000, 2000);
                this.smallTrees.push(newTree);
            }
        });
    }

    private updateSpikes(dt: number): void {
        this.spikes.forEach((c, i) => {
            c.x -= speeds.ground * dt;
            if (c.x + c.width / 2 <= this.targetX) {
                this.spikes.splice(i, 1);
                c.remove();
                const newSpike = SpikePool.get(this);
                newSpike.position.set(this.spikes[this.spikes.length - 1].x + 720, 1850);
                this.spikes.push(newSpike);
            }
        });
    }

    private updateClouds(dt: number): void {
        this.clouds.forEach((c, i) => {
            c.x -= speeds.clouds * dt;
            if (c.x + c.width / 2 <= this.targetX) {
                this.clouds.splice(i, 1);
                c.remove();
                const newCloud = CloudPool.get(this);
                newCloud.position.set(
                    WIDTH + newCloud.width / 2 + Math.random() * 400,
                    randomInt(cloudYRange[0], cloudYRange[1]),
                );
                this.clouds.push(newCloud);
            }
        });
    }

    private updateRandomNumbers(dt: number): void {
        this.randomNumbers.forEach((n, i) => {
            n.x -= n.speed * dt;
            if (n.x + n.width / 2 <= this.targetX) {
                this.randomNumbers.splice(i, 1);
                n.remove();

                const { fn, number, y } = this.getRandomNumber();
                const newNumber = NumbersPool.get(this, fn, number);
                newNumber.scale.set(1 + Math.random() * 0.2);
                newNumber.position.set(this.gameWidth * 1.2 + Math.random() * 400, y);
                this.randomNumbers.push(newNumber);
            }
        });
    }

    private updateTileSprites(dt): void {
        this.smallFrontTrees.tilePosition.x -= speeds.fog * dt;
        this.fog.tilePosition.x -= speeds.fog * dt;
        this.smallForegroundTrees.tilePosition.x -= speeds.smallForegroundTrees * dt;
        // this.sky.tilePosition.x -= speeds.sky * dt;
        this.bkgBuildings.tilePosition.x -= speeds.bkgBuildings * dt;
        this.bkgTrees.tilePosition.x -= speeds.bkgTrees * dt;
    }

    private dropMonkey(): void {
        let chance = Math.random();
        if (this.currentValue === 1) {
            chance = Math.random() * 0.55;
        }
        this.monkey.drop();

        if (chance <= 0.6) {
            this.reJump();
        } else if (chance > 0.6 && chance <= 0.8) {
            this.fallToDie();
        } else {
            this.fallToLand();
        }
    }

    private reJump(): void {
        const y = Math.random() * 600 + 1200;
        const duration = (y - monkeyPos.y) * DT;
        const number = this.getNumber(y);

        animate(this.monkey, {
            y,
            ease: 'inCubic',
            duration,
            onComplete: () => {
                this.monkey.swingUp();
                this.swingUp();
                const { fn, numberValue } = number;
                this.monkey.showNumberEffect(fn, numberValue);
            },
        });

        this.moveNumber(number, duration);
    }

    private fallToDie(): void {
        // DIE
        const y = 2400;
        const duration = (y - monkeyPos.y) * DT;

        const pit = makeSprite({
            frame: 'ground_pit_1.png',
            anchor: new Point(0.5, 1),
            x: this.gameWidth * 1.5,
            y: 1850,
        });
        this.addChild(pit);
        pit.zIndex = zIndex.pit1;
        this.pits.push(pit);

        const pitFront = makeSprite({
            frame: 'ground_pit_front_1.png',
            anchor: new Point(0.5, 1),
            x: this.gameWidth * 1.5,
            y: 1870,
        });
        this.addChild(pitFront);
        pitFront.zIndex = zIndex.pit2;
        this.pits.push(pitFront);

        this.movePit(this.pits, duration);
        this.monkey.fall();
        animate(this.monkey, {
            y,
            ease: 'inCubic',
            duration,
            onComplete: () => {
                this.isAlive = false;
                delayRunnable(2, () => {
                    this.reset();
                });
            },
        });
    }

    private fallToLand(): void {
        // LAND

        const y = 1870;
        const duration = (y - monkeyPos.y) * DT;

        const land = makeSprite({
            frame: 'landing_platform.png',
            x: this.gameWidth * 1.5,
            y: 1900,
        });
        this.addChild(land);
        land.zIndex = zIndex.pit1;
        this.pits.push(land);
        this.moveLand(this.pits[0], duration);
        animate(this.monkey, {
            y,
            ease: 'inQuart',
            duration,
            onComplete: () => {
                this.isAlive = false;
                this.monkey.land();
                delayRunnable(3, () => {
                    this.reset();
                });
            },
        });
    }

    private swingUp(): void {
        const duration = (this.monkey.y - 750) * DT;
        animate(this.monkey, {
            y: 750,
            ease: 'outCubic',
            duration,
            onComplete: () => {
                this.dropMonkey();
            },
        });
    }

    private moveNumber(number: Number, duration: number): void {
        animate(number, {
            x: monkeyPos.x,
            duration,
            ease: 'linear',
            onComplete: () => {
                const { fn, numberValue } = number;
                this.updateCounter(fn, numberValue);
                animate(number, {
                    y: '-=100',
                    alpha: 0,
                    duration: 400,
                    ease: 'linear',
                    onComplete: () => {
                        const index = this.numbers.indexOf(number);
                        this.numbers.splice(index, 1);
                        number.remove();
                    },
                });
            },
        });
    }

    private movePit(pits: Sprite[], duration: number): void {
        animate(pits, {
            x: monkeyPos.x - pits[0].width / 4,
            duration,
            ease: 'linear',
        });
    }

    private moveLand(land: Sprite, duration: number): void {
        animate(land, {
            x: monkeyPos.x,
            duration,
            ease: 'linear',
        });
    }

    private getRandomNumber(): { fn; number; y } {
        const fn = sample(['add', 'divide', 'multiply', 'add', 'multiply']);
        const number = fn === 'add' ? randomInt(1, 10) : fn === 'divide' ? 2 : sample([2, 3, 4, 5]);
        const forbiddenYs = this.numbers.map((n) => n.y);
        const y = getRandomY(1000, 1800, forbiddenYs);

        return { fn, number, y };
    }

    private getNumber(y: number): Number {
        const fn = this.currentValue === 1 ? sample(['add', 'multiply']) : sample(['add', 'divide', 'multiply']);
        const n = fn === 'add' ? randomInt(1, 10) : fn === 'divide' ? 2 : sample([2, 3, 4, 5]);

        const number = NumbersPool.get(this, fn, n);
        number.position.set(WIDTH + 200, y - this.monkey.height);
        number.zIndex = zIndex.number;
        this.numbers.push(number);
        return number;
    }

    private reset(): void {
        this.monkey.position.set(monkeyPos.x, monkeyPos.y);
        this.monkey.drop();
        this.monkey.setActive(false);
        this.playButton.visible = true;
        this.playButton.eventMode = 'static';

        // clear counter
        this.currentValue = 1;
        this.counter.text = `${this.currentValue}`;

        this.randomNumbers.forEach((n) => {
            n.remove();
        });
        this.randomNumbers = [];
        this.numbers.forEach((n) => {
            n.remove();
        });
        this.numbers = [];
        this.pits.forEach((p) => p.destroy());
        this.pits = [];
        this.buildRandomNumbers();
    }

    private updateCounter(fn: FunctionType, numberValue: number): void {
        switch (fn) {
            case 'add':
                this.currentValue += numberValue;
                break;
            case 'divide':
                this.currentValue /= numberValue;
                break;
            case 'multiply':
                this.currentValue *= numberValue;
            default:
                break;
        }

        this.counter.text = `${this.currentValue.toFixed(2)}`;
    }
}

const getRandomY = (allowedMin: number, allowedMax: number, forbiddenYs: number[], buffer = 10): number => {
    let y;
    let isValid = false;

    while (!isValid) {
        y = Math.floor(Math.random() * (allowedMax - allowedMin + 1)) + allowedMin;
        isValid = forbiddenYs.every((fy) => Math.abs(y - fy) > buffer);
    }

    return y;
};
