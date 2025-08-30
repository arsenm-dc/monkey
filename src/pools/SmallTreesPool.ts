import { Container, Point, Sprite } from 'pixi.js';
import { makeSprite } from '../configs/spriteConfig';

export class SmallTree extends Container {
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

class SmallTreesPool {
    private pool: SmallTree[] = [];
    private textures: string[] = ['tree_4_1.png', 'tree_4_2.png', 'tree_4_3.png', 'tree_4_4.png', 'tree_4_5.png'];

    public getTree(parentContainer): SmallTree {
        const tree = this.pool.find((c) => !c.parentContainer);
        if (tree) {
            tree.get(parentContainer);
            return tree;
        } else {
            const texture = this.textures[Math.floor(Math.random() * this.textures.length)];
            const newTree = new SmallTree(texture);
            this.pool.push(newTree);
            return newTree;
        }
    }

    public init(): void {
        for (let i = 0; i < 3; i++) {
            this.textures.forEach((t) => this.pool.push(new SmallTree(t)));
        }
    }
}

export const SmallTreePool = new SmallTreesPool();
