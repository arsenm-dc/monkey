import { animate } from 'animejs';
import { Container, Point } from 'pixi.js';
import { makeSprite } from '../configs/spriteConfig';

const config = [
    {
        frame: 'building_1.png',
        x: 0,
        y: 0,
    },
    {
        frame: 'building_2.png',
        x: 1360,
        y: 0,
    },
    {
        frame: 'building_3.png',
        x: 1010,
        y: 0,
    },
    {
        frame: 'building_4.png',
        x: 1265,
        y: 0,
    },
    {
        frame: 'building_5.png',
        x: 905,
        y: 0,
    },
    {
        frame: 'building_6.png',
        x: 105,
        y: 0,
    },
    {
        frame: 'building_7.png',
        x: 365,
        y: 0,
    },
    {
        frame: 'building_8.png',
        x: 205,
        y: 0,
    },
    {
        frame: 'building_9.png',
        x: 775,
        y: 0,
    },
    {
        frame: 'building_10.png',
        x: 635,
        y: 0,
    },
    {
        frame: 'building_11.png',
        x: 1155,
        y: 0,
    },
    {
        frame: 'building_12.png',
        x: 1475,
        y: 0,
    },
    {
        frame: 'building_13.png',
        x: -200,
        y: 0,
    },
];

export class StaticBuildings extends Container {
    constructor() {
        super();

        this.build();
    }

    private build(): void {
        config.forEach(({ frame, x, y }, i) => {
            const building = makeSprite({ frame, x, y, anchor: new Point(0.5, 1) });
            building.name = `building_${i + 1}`;
            animate(building, {
                alpha: Math.random() * 0.1 + 0.75,
                duration: Math.random() * 1000 + 1000,
                ease: 'linear',
                loop: true,
                alternate: true,
            });
            this.addChild(building);
        });
    }
}
