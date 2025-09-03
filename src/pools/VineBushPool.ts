import { Container, Sprite } from 'pixi.js';
import { makeSprite } from '../configs/spriteConfig';

export class VineBush extends Container {
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

class VineBushesPool {
    private pool: VineBush[] = [];
    private textures: string[] = ['bush.png'];

    public get(parentContainer): VineBush {
        const element = this.pool.find((c) => !c.parentContainer);
        if (element) {
            element.get(parentContainer);
            return element;
        } else {
            const texture = this.textures[0];
            const newElement = new VineBush(texture);
            this.pool.push(newElement);
            return newElement;
        }
    }

    public init(): void {
        for (let i = 0; i < 7; i++) {
            this.textures.forEach((t) => this.pool.push(new VineBush(t)));
        }
    }
}

export const VineBushPool = new VineBushesPool();
