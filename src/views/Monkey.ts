import { Spine } from 'pixi-spine';
import { Assets, Container } from 'pixi.js';
import { spines } from '../assets/assetsNames/spines';

export class Monkey extends Container {
    private spine: Spine;
    constructor() {
        super();

        this.build();
    }

    private build(): void {
        this.buildSpine();
    }

    private buildSpine(): void {
        const data = Assets.cache.get(spines[0].jsonURL).spineData;
        this.spine = new Spine(data);

        // 'Death start'
        // 'Falling'
        // 'Falling for death'
        // 'Landing'
        // 'Swing'
        // 'spike death'
        // this.spine.state.setAnimation(0, 'Falling', true);
        this.spine.scale.set(0.15);
        this.addChild(this.spine);
    }
}
