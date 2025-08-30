import { Container, Rectangle, Sprite } from 'pixi.js';
import { makeSprite, skyConfig } from '../configs/spriteConfig';
import { Cloud, CloudPool } from '../pools/CloudsPool';

const cloudSpeed = 0.2;

export class BoardView extends Container {
    private sky: Sprite;
    private clouds: Cloud[] = [];

    constructor() {
        super();

        CloudPool.init();
        this.build();
    }

    public update(dt: number): void {
        this.clouds.forEach((c) => {
            c.x -= cloudSpeed * dt;
        });
    }

    public getBounds(skipUpdate?: boolean, rect?: Rectangle): Rectangle {
        return new Rectangle(0, 0, 2048, 1890);
    }

    private build(): void {
        this.buildSky();
        this.buildClouds();
    }

    private buildSky(): void {
        this.sky = makeSprite(skyConfig());
        this.addChild(this.sky);
    }

    private buildClouds(): void {
        const cloud1 = CloudPool.getCloud(this);
        cloud1.position.set(200, 300);

        const cloud2 = CloudPool.getCloud(this);
        cloud2.position.set(700, 600);

        const cloud3 = CloudPool.getCloud(this);
        cloud3.position.set(1300, 500);
        this.clouds.push(cloud1, cloud2, cloud3);
    }
}
