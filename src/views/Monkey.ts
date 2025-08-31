import { Spine } from 'pixi-spine';
import { Assets, Container } from 'pixi.js';
import { spines } from '../assets/assetsNames/spines';

export class Monkey extends Container {
    private spine: Spine;
    constructor() {
        super();

        this.build();
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

    private build(): void {
        this.buildSpine();
    }

    private buildSpine(): void {
        const data = Assets.cache.get(spines[0].jsonURL).spineData;
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
        this.spine.state.setAnimation(0, 'Falling', true);
        this.spine.scale.set(0.15);
        this.addChild(this.spine);
    }
}
