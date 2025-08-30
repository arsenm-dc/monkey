import { Container, Rectangle, Sprite, Texture, TilingSprite } from 'pixi.js';
import { makeSprite, skyConfig } from '../configs/spriteConfig';
import { Cloud, CloudPool } from '../pools/CloudsPool';
import { LargeTree, LargeTreePool } from '../pools/LargeTreesPool';
import { randomInt } from '../Utils';
import { StaticBuildings } from './StaticBuildings';

const speeds = {
    clouds: 0.2,
    bkgBuildings: 0.3,
    bkgTrees: 0.5,
    largeTrees: 0.8,
    smallTrees: 0.9,
};

const cloudYRange = [120, 800];

export class BoardView extends Container {
    private sky: Sprite;
    private clouds: Cloud[] = [];
    private bkgBuildings: TilingSprite;
    private bkgTrees: TilingSprite;
    private staticBuildings: StaticBuildings;
    private largeTrees: LargeTree[] = [];
    private smallForegroundTrees: TilingSprite;

    constructor() {
        super();

        CloudPool.init();
        LargeTreePool.init();
        this.build();
    }

    public update(dt: number): void {
        // this.updateClouds(dt);
        // this.updateBkgBuildings(dt);
        // this.updateBkgTrees(dt);
        // this.updateLargeTrees(dt);
        // this.updateSmallForegroundTrees(dt);
    }

    public getBounds(skipUpdate?: boolean, rect?: Rectangle): Rectangle {
        return new Rectangle(0, 0, 2048, 1890);
    }

    private build(): void {
        this.buildSky();
        this.buildClouds();
        this.buildBkgBuildings();
        this.buildBkgTrees();
        this.buildStaticBuildings();
        this.buildLargeTrees();
        this.buildSmallForegroundTrees();
    }

    private buildSky(): void {
        this.sky = makeSprite(skyConfig());
        this.addChild(this.sky);
    }

    private buildClouds(): void {
        const cloud1 = CloudPool.getCloud(this);
        cloud1.position.set(200, 300);

        const cloud2 = CloudPool.getCloud(this);
        cloud2.position.set(600, 600);

        const cloud3 = CloudPool.getCloud(this);
        cloud3.position.set(1300, 250);

        const cloud4 = CloudPool.getCloud(this);
        cloud4.position.set(1800, 700);

        this.clouds.push(cloud1, cloud2, cloud3, cloud4);
    }

    private buildBkgBuildings(): void {
        const texture = Texture.from('bkgBuildings.png');
        this.bkgBuildings = new TilingSprite(texture, texture.width, texture.height);
        this.bkgBuildings.y = this.height - this.bkgBuildings.height;
        this.bkgBuildings.name = 'bkgBuildings';
        this.addChild(this.bkgBuildings);
    }

    private buildBkgTrees(): void {
        const texture = Texture.from('bkgTrees.png');
        this.bkgTrees = new TilingSprite(texture, texture.width, texture.height);
        this.bkgTrees.y = this.height - this.bkgTrees.height;
        this.bkgTrees.name = 'bkgTrees';
        this.addChild(this.bkgTrees);
    }

    private buildStaticBuildings(): void {
        this.staticBuildings = new StaticBuildings();
        this.staticBuildings.name = 'staticBuildings';
        this.staticBuildings.position.set(400, 1875);
        this.addChild(this.staticBuildings);
    }

    private buildLargeTrees(): void {
        const tree1 = LargeTreePool.getTree(this);
        tree1.position.set(270, 2000);

        const tree2 = LargeTreePool.getTree(this);
        tree2.position.set(1675, 2000);

        const tree3 = LargeTreePool.getTree(this);
        tree3.position.set(3075, 2000);

        this.largeTrees.push(tree1, tree2, tree3);
    }

    private buildSmallForegroundTrees(): void {
        const texture = Texture.from('tree_2_1.png');
        this.smallForegroundTrees = new TilingSprite(texture, texture.width, texture.height);
        this.smallForegroundTrees.y = this.height - this.smallForegroundTrees.height;
        this.smallForegroundTrees.name = 'smallForegroundTrees';
        this.addChild(this.smallForegroundTrees);
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
        this.smallForegroundTrees.tilePosition.x -= speeds.smallTrees * dt;
    }
}
