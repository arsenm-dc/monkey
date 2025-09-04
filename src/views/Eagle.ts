import { Spine } from 'pixi-spine';
import { Assets, Container } from 'pixi.js';
import { spines } from '../assets/assetsNames/spines';

export class Eagle extends Container {
    private spine: Spine;
    constructor() {
        super();

        this.build();
    }

    public spin(): void {
        //
    }

    private build(): void {
        this.buildSpine();
    }

    private buildSpine(): void {
        const json = spines.find((d) => d.key === 'easgle_spine')?.jsonURL;
        if (!json) return;
        const data = Assets.cache.get(json).spineData;
        this.spine = new Spine(data);
        this.spine.skeleton.setSkinByName('default');
        this.spine.state.setAnimation(0, 'Idle_fly', true);
        this.spine.state.timeScale = 2;
        // 'Idle_fly'
        this.spine.scale.set(0.124);
        this.addChild(this.spine);
    }
}
