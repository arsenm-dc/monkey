import { Container, Sprite } from 'pixi.js';
import { makeSprite } from '../configs/spriteConfig';

export class Spike extends Container {
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

class SpikesPool {
    private pool: Spike[] = [];
    private textures: string[] = ['spikes.png'];

    public getSpike(parentContainer): Spike {
        const spike = this.pool.find((c) => !c.parentContainer);
        if (spike) {
            spike.get(parentContainer);
            return spike;
        } else {
            const texture = this.textures[Math.floor(Math.random() * this.textures.length)];
            const newSpike = new Spike(texture);
            this.pool.push(newSpike);
            return newSpike;
        }
    }

    public init(): void {
        for (let i = 0; i < 10; i++) {
            this.textures.forEach((t) => this.pool.push(new Spike(t)));
        }
    }
}

export const SpikePool = new SpikesPool();
