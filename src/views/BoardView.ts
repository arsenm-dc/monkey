import { Container, Rectangle, Sprite, Texture, TilingSprite } from 'pixi.js';
import { makeSprite, skyConfig } from '../configs/spriteConfig';
import { Cloud, CloudPool } from '../pools/CloudsPool';
import { randomInt } from '../Utils';

const cloudSpeed = 0.2;
const bkgBuildingsSpeed = 0.3;
const cloudYRange = [120, 800];

export class BoardView extends Container {
    private sky: Sprite;
    private clouds: Cloud[] = [];
    private bkgBuildings: TilingSprite;

    constructor() {
        super();

        CloudPool.init();
        this.build();
    }

    public update(dt: number): void {
        // this.updateClouds(dt);
        // this.updateBkgBuildings();
    }

    public getBounds(skipUpdate?: boolean, rect?: Rectangle): Rectangle {
        return new Rectangle(0, 0, 2048, 1890);
    }

    private build(): void {
        this.buildSky();
        this.buildClouds();
        this.buildBkgBuildings();
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

    private updateClouds(dt: number): void {
        this.clouds.forEach((c, i) => {
            c.x -= cloudSpeed * dt;

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

    private updateBkgBuildings(): void {
        this.bkgBuildings.tilePosition.x -= bkgBuildingsSpeed;
    }
}
