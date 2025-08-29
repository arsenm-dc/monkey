import { Spine } from 'pixi-spine';
import { Assets, Container } from 'pixi.js';
import { spines } from '../assets/assetsNames/spines';

export class BoardView extends Container {
    constructor() {
        super();
        this.build();
    }

    private build(): void {
        const spin = Assets.cache.get(spines[0].jsonURL).spineData;
        const spine: Spine = new Spine(spin);

        // 'Death start'
        // 'Falling'
        // 'Falling for death'
        // 'Landing'
        // 'Swing'
        // 'spike death'

        spine.state.setAnimation(0, 'spike death', true);
        this.addChild(spine);
    }
}
