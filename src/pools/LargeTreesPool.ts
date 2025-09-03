import { Container, Point, Sprite } from 'pixi.js';
import { makeSprite } from '../configs/spriteConfig';

export class LargeTree extends Container {
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
        this.sprite = makeSprite({ frame: this.textureName, anchor: new Point(0.5, 1) });
        this.addChild(this.sprite);
    }
}

class LargeTreesPool {
    private pool: LargeTree[] = [];
    private textures: string[] = ['tree_1_1.png', 'tree_1_2.png'];

    public get(parentContainer): LargeTree {
        const element = this.pool.find((c) => !c.parentContainer);
        if (element) {
            element.get(parentContainer);
            return element;
        } else {
            const texture = this.textures[Math.floor(Math.random() * this.textures.length)];
            const newElement = new LargeTree(texture);
            this.pool.push(newElement);
            return newElement;
        }
    }

    public init(): void {
        for (let i = 0; i < 3; i++) {
            this.textures.forEach((t) => this.pool.push(new LargeTree(t)));
        }
    }
}

export const LargeTreePool = new LargeTreesPool();
