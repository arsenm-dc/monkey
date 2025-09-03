import { Container, Sprite } from 'pixi.js';
import { makeSprite } from '../configs/spriteConfig';

export class Vine extends Container {
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

class VinesPool {
    private pool: Vine[] = [];
    private textures: string[] = ['vine_1.png', 'vine_2.png'];

    public get(parentContainer): Vine {
        const element = this.pool.find((c) => !c.parentContainer);
        if (element) {
            element.get(parentContainer);
            return element;
        } else {
            const texture = this.textures[Math.floor(Math.random() * this.textures.length)];
            const newElement = new Vine(texture);
            this.pool.push(newElement);
            return newElement;
        }
    }

    public init(): void {
        for (let i = 0; i < 7; i++) {
            this.textures.forEach((t) => this.pool.push(new Vine(t)));
        }
    }
}

export const VinePool = new VinesPool();
