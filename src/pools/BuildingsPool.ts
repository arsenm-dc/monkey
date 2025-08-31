import { Container, Point, Sprite } from 'pixi.js';
import { makeSprite } from '../configs/spriteConfig';

export class Building extends Container {
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

class BuildingsPool {
    private pool: Building[] = [];
    private textures: string[] = [
        'building_1.png',
        'building_2.png',
        'building_3.png',
        'building_4.png',
        'building_5.png',
        'building_6.png',
        'building_7.png',
        'building_8.png',
        'building_9.png',
        'building_10.png',
        'building_11.png',
        'building_12.png',
        'building_13.png',
    ];

    public getBuilding(parentContainer): Building {
        const building = this.pool.find((c) => !c.parentContainer);
        if (building) {
            building.get(parentContainer);
            return building;
        } else {
            const texture = this.textures[Math.floor(Math.random() * this.textures.length)];
            const newBuilding = new Building(texture);
            this.pool.push(newBuilding);
            return newBuilding;
        }
    }

    public init(): void {
        for (let i = 0; i < 3; i++) {
            this.textures.forEach((t) => this.pool.push(new Building(t)));
        }
    }
}

export const BuildingPool = new BuildingsPool();
