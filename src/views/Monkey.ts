import { animate } from 'animejs';
import { Spine } from 'pixi-spine';
import { Assets, Container, Text } from 'pixi.js';
import { spines } from '../assets/assetsNames/spines';
import { FunctionType, getNumberText } from '../pools/NumbersPool';

export class Monkey extends Container {
    private spine: Spine;
    private number: Text;

    constructor() {
        super();

        this.build();
    }

    public showNumberEffect(fn: FunctionType, value: number): void {
        this.number.text = getNumberText(fn, value);

        this.number.style.fill = fn === 'divide' ? '0xc90443' : '0x1ab518';

        this.number.y = -270;
        this.number.alpha = 1;
        animate(this.number, {
            y: '-=200',
            alpha: 0,
            duration: 800,
            ease: 'inSine',
        });
    }

    public setActive(value: boolean): void {
        this.spine.state.timeScale = value ? 1.5 : 0;
    }

    public swingUp(): void {
        this.spine.state.setAnimation(0, 'Swing', false);
    }

    public fall(): void {
        this.spine.state.setAnimation(0, 'Falling for death', true);
    }

    public land(): void {
        this.spine.state.setAnimation(0, 'Landing', false);
    }

    public drop(): void {
        this.spine.state.setAnimation(0, 'Falling', true);
    }

    private build(): void {
        this.buildSpine();
        this.buildNumber();
    }

    private buildNumber(): void {
        this.number = new Text('+12', {
            fill: 0xffffff,
            fontWeight: '900',
            fontSize: 48,
        });
        this.number.anchor.set(0.5, 0.5);
        this.number.position.set(-40, -270);
        this.number.alpha = 0;
        this.addChild(this.number);
    }

    private buildSpine(): void {
        const json = spines.find((d) => d.key === 'Monkey')?.jsonURL;
        if (!json) return;
        const data = Assets.cache.get(json).spineData;
        this.spine = new Spine(data);

        this.spine.state.addListener({
            complete: (entry) => {
                // @ts-ignore
                if (entry.animation.name === 'Swing') {
                    this.spine.state.setAnimation(0, 'Falling', true);
                }
            },
        });
        // 'Death start'
        // 'Falling'
        // 'Falling for death'
        // 'Landing'
        // 'Swing'
        // 'spike death'

        this.spine.state.data.setMix('Falling', 'Falling for death', 1);
        this.spine.state.data.setMix('Falling', 'Landing', 1);
        this.spine.state.setAnimation(0, 'Swing', true);
        this.spine.scale.set(0.15);
        this.addChild(this.spine);
    }
}
