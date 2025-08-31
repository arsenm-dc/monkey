import { animate } from 'animejs';
import { Container, Rectangle, Sprite, Texture, TilingSprite } from 'pixi.js';
import { makeSprite, skyConfig } from '../configs/spriteConfig';
import { Building, BuildingPool } from '../pools/BuildingsPool';
import { Cloud, CloudPool } from '../pools/CloudsPool';
import { LargeTree, LargeTreePool } from '../pools/LargeTreesPool';
import { MediumTree, MediumTreePool } from '../pools/MediumTreesPool';
import { Number, NumbersPool } from '../pools/NumbersPool';
import { SmallTree, SmallTreePool } from '../pools/SmallTreesPool';
import { randomInt, sample } from '../Utils';
import { Monkey } from './Monkey';

const speeds = {
    clouds: 0.2,
    bkgBuildings: 0.3,
    bkgTrees: 0.5,
    buildings: 0.8,
    largeTrees: 1,
    smallForegroundTrees: 1.3,
    mediumTrees: 2,
    smallTrees: 2.3,
    fog: 1.6,
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
    number: 11,
    monkey: 12,
};

const monkeyPos = {
    x: 600,
    y: 750,
};

export class BoardView extends Container {
    private sky: Sprite;
    private clouds: Cloud[] = [];
    private bkgBuildings: TilingSprite;
    private bkgTrees: TilingSprite;
    private buildings: Building[] = [];
    private largeTrees: LargeTree[] = [];
    private smallForegroundTrees: TilingSprite;
    private mediumTrees: MediumTree[] = [];
    private smallTrees: SmallTree[] = [];
    private fog: TilingSprite;
    private smallFrontTrees: TilingSprite;

    private numbers: Number[] = [];
    private monkey: Monkey;

    constructor() {
        super();
        this.sortableChildren = true;
        CloudPool.init();
        LargeTreePool.init();
        MediumTreePool.init();
        SmallTreePool.init();
        BuildingPool.init();
        NumbersPool.init();

        this.build();
    }

    public update(dt: number): void {
        this.updateClouds(dt);
        this.updateBkgBuildings(dt);
        this.updateBkgTrees(dt);
        this.updateLargeTrees(dt);
        this.updateBuildings(dt);
        this.updateSmallForegroundTrees(dt);
        this.updateMediumTrees(dt);
        this.updateSmallTrees(dt);
        this.updateFog(dt);
        this.updateSmallFrontTrees(dt);
    }

    public getBounds(skipUpdate?: boolean, rect?: Rectangle): Rectangle {
        return new Rectangle(0, 0, 2048, 1890);
    }

    private build(): void {
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

        this.buildMonkey();
        this.dropMonkey();
    }

    private buildSky(): void {
        this.sky = makeSprite(skyConfig());
        this.sky.zIndex = zIndex.sky;
        this.addChild(this.sky);
    }

    private buildClouds(): void {
        const positions = [
            { x: 200, y: 300 },
            { x: 600, y: 600 },
            { x: 1300, y: 250 },
            { x: 1800, y: 700 },
        ];
        positions.forEach(({ x, y }) => {
            const cloud = CloudPool.getCloud(this);
            cloud.zIndex = zIndex.clouds;
            cloud.position.set(x, y);
            this.clouds.push(cloud);
        });
    }

    private buildBkgBuildings(): void {
        const texture = Texture.from('bkgBuildings.png');
        this.bkgBuildings = new TilingSprite(texture, texture.width, texture.height);
        this.bkgBuildings.y = this.height - this.bkgBuildings.height;
        this.bkgBuildings.name = 'bkgBuildings';
        this.bkgBuildings.zIndex = zIndex.bkgBuildings;
        this.addChild(this.bkgBuildings);
    }

    private buildBkgTrees(): void {
        const texture = Texture.from('bkgTrees.png');
        this.bkgTrees = new TilingSprite(texture, texture.width, texture.height);
        this.bkgTrees.y = this.height - this.bkgTrees.height;
        this.bkgTrees.name = 'bkgTrees';
        this.bkgTrees.zIndex = zIndex.bkgTrees;
        this.addChild(this.bkgTrees);
    }

    private buildBuildings(): void {
        const positions = [
            400, 1760, 1410, 1665, 1305, 505, 765, 605, 1175, 1035, 1555, 1875, 200, 2000, 2320, 2110, 2420, 2200, 2550,
            2660, 2790, 2900, 3010,
        ];
        positions.forEach((x) => {
            const building = BuildingPool.getBuilding(this);
            building.zIndex = zIndex.buildings;
            building.position.set(x, 1875);
            this.buildings.push(building);
        });
    }

    private buildLargeTrees(): void {
        const position = [120, 1575, 2975];
        position.forEach((x) => {
            const tree = LargeTreePool.getTree(this);
            tree.zIndex = zIndex.largeTrees;
            tree.position.set(x, 2000);
            this.largeTrees.push(tree);
        });
    }

    private buildSmallForegroundTrees(): void {
        const texture = Texture.from('tree_2_1.png');
        this.smallForegroundTrees = new TilingSprite(texture, texture.width, texture.height);
        this.smallForegroundTrees.y = this.height - this.smallForegroundTrees.height;
        this.smallForegroundTrees.name = 'smallForegroundTrees';
        this.smallForegroundTrees.zIndex = zIndex.smallForegroundTrees;
        this.addChild(this.smallForegroundTrees);
    }

    private buildMediumTrees(): void {
        const positions = [270, 1275, 2275, 3275];
        positions.forEach((x) => {
            const tree = MediumTreePool.getTree(this);
            tree.zIndex = zIndex.mediumTrees;
            tree.position.set(x, 2000);
            this.mediumTrees.push(tree);
        });
    }

    private buildSmallTrees(): void {
        const positions = [0, 700, 1400, 2100, 2800];
        positions.forEach((x) => {
            const tree = SmallTreePool.getTree(this);
            tree.zIndex = zIndex.smallTrees;
            tree.position.set(x, 2000);
            this.smallTrees.push(tree);
        });
    }

    private buildFog(): void {
        const texture = Texture.from('fog.png');
        this.fog = new TilingSprite(texture, 2048, texture.height);
        this.fog.y = this.height - this.fog.height - 40;
        this.fog.name = 'fog';
        this.fog.zIndex = zIndex.fog;
        this.addChild(this.fog);
    }

    private buildSmallFrontTrees(): void {
        const texture = Texture.from('tree_5_1.png');
        this.smallFrontTrees = new TilingSprite(texture, 2048, texture.height);
        this.smallFrontTrees.y = this.height - this.smallFrontTrees.height;
        this.smallFrontTrees.name = 'smallFrontTrees';
        this.smallFrontTrees.zIndex = zIndex.smallFrontTrees;
        this.addChild(this.smallFrontTrees);
    }

    private buildMonkey(): void {
        this.monkey = new Monkey();
        this.monkey.name = 'monkey';
        this.monkey.position.set(monkeyPos.x, monkeyPos.y);
        this.monkey.zIndex = zIndex.monkey;
        this.addChild(this.monkey);
    }

    private updateLargeTrees(dt: number): void {
        this.largeTrees.forEach((c, i) => {
            c.x -= speeds.largeTrees * dt;
            if (c.x + c.width / 2 <= 0) {
                this.largeTrees.splice(i, 1);
                c.remove();
                const newTree = LargeTreePool.getTree(this);
                newTree.position.set(this.largeTrees[this.largeTrees.length - 1].x + 1400, 2000);
                this.largeTrees.push(newTree);
            }
        });
    }

    private updateBuildings(dt: number): void {
        this.buildings.forEach((c, i) => {
            c.x -= speeds.buildings * dt;
            if (c.x + c.width / 2 <= 0) {
                this.buildings.splice(i, 1);
                c.remove();
                const newBuilding = BuildingPool.getBuilding(this);
                newBuilding.position.set(this.buildings[this.buildings.length - 1].x + Math.random() * 30 + 100, 1875);
                this.buildings.push(newBuilding);
            }
        });
    }

    private updateMediumTrees(dt: number): void {
        this.mediumTrees.forEach((c, i) => {
            c.x -= speeds.mediumTrees * dt;
            if (c.x + c.width / 2 <= 0) {
                this.mediumTrees.splice(i, 1);
                c.remove();

                const newTree = MediumTreePool.getTree(this);
                newTree.position.set(this.mediumTrees[this.mediumTrees.length - 1].x + 1000, 2000);
                this.mediumTrees.push(newTree);
            }
        });
    }

    private updateSmallTrees(dt: number): void {
        this.smallTrees.forEach((c, i) => {
            c.x -= speeds.smallTrees * dt;
            if (c.x + c.width / 2 <= 0) {
                this.smallTrees.splice(i, 1);
                c.remove();
                const newTree = SmallTreePool.getTree(this);
                newTree.position.set(this.smallTrees[this.smallTrees.length - 1].x + 1000, 2000);
                this.smallTrees.push(newTree);
            }
        });
    }

    private updateClouds(dt: number): void {
        this.clouds.forEach((c, i) => {
            c.x -= speeds.clouds * dt;
            if (c.x + c.width / 2 <= 0) {
                this.clouds.splice(i, 1);
                c.remove();
                const newCloud = CloudPool.getCloud(this);
                newCloud.position.set(
                    this.sky.width + newCloud.width / 2 + Math.random() * 400,
                    randomInt(cloudYRange[0], cloudYRange[1]),
                );
                this.clouds.push(newCloud);
            }
        });
    }

    private updateBkgBuildings(dt): void {
        this.bkgBuildings.tilePosition.x -= speeds.bkgBuildings * dt;
    }

    private updateBkgTrees(dt): void {
        this.bkgTrees.tilePosition.x -= speeds.bkgTrees * dt;
    }

    private updateSmallForegroundTrees(dt): void {
        this.smallForegroundTrees.tilePosition.x -= speeds.smallForegroundTrees * dt;
    }

    private updateFog(dt): void {
        this.fog.tilePosition.x -= speeds.fog * dt;
    }

    private updateSmallFrontTrees(dt): void {
        this.smallFrontTrees.tilePosition.x -= speeds.fog * dt;
    }

    private dropMonkey(): void {
        const y = Math.random() * 500 + 1200;
        const duration = (y - monkeyPos.y) * 2.666;
        const number = this.getNumber(y);

        animate(this.monkey, {
            y,
            ease: 'inCubic',
            duration,
            onComplete: () => {
                this.monkey.swingUp();
                this.swingUp();
            },
        });

        this.moveNumber(number, duration);
    }

    private swingUp(): void {
        const duration = (this.monkey.y - 750) * 2.666;
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
                animate(number, {
                    y: '-=100',
                    alpha: 0,
                    duration: 200,
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

    private getNumber(y: number): Number {
        const number = NumbersPool.getNumber(this, sample(['add', 'divide', 'multiply']), randomInt(1, 10));
        number.position.set(2200, y - this.monkey.height);
        number.zIndex = zIndex.number;
        this.numbers.push(number);
        return number;
    }
}
