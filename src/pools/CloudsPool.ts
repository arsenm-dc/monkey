import { Container, Sprite } from 'pixi.js';
import { makeSprite } from '../configs/spriteConfig';

export class Cloud extends Container {
    private _parentContainer: Container | null;
    private sprite: Sprite;

    constructor(private textureName: string) {
        super();
        this.build();
    }

    public get parentContainer(): Container | null {
        return this._parentContainer;
    }

    public get(parentContainer): void {
        this._parentContainer = parentContainer;
        this._parentContainer?.addChild(this);
    }

    public remove(): void {
        this._parentContainer?.removeChild(this);
        this._parentContainer = null;
    }

    private build(): void {
        this.sprite = makeSprite({ frame: this.textureName });
        this.addChild(this.sprite);
    }
}

class CloudsPool {
    private pool: Cloud[] = [];
    private textures: string[] = ['cloud_1_1.png', 'cloud_1_2.png', 'cloud_1_3.png'];

    public getCloud(parentContainer): Cloud {
        const cloud = this.pool.find((c) => !c.parentContainer);
        if (cloud) {
            cloud.get(parentContainer);
            return cloud;
        } else {
            const texture = this.textures[Math.floor(Math.random() * this.textures.length)];
            const newCloud = new Cloud(texture);
            this.pool.push(newCloud);
            return newCloud;
        }
    }

    public init(): void {
        for (let i = 0; i < 3; i++) {
            this.textures.forEach((t) => this.pool.push(new Cloud(t)));
        }
    }
}

export const CloudPool = new CloudsPool();
