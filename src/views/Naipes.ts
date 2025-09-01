import { Spine } from 'pixi-spine';
import { Assets, Container } from 'pixi.js';
import { spines } from '../assets/assetsNames/spines';

export class Naipes extends Container {
    private spine: Spine;
    constructor() {
        super();

        this.build();
    }

    public spin(): void {
        this.spine.state.setAnimation(0, 'Spin', false);
    }

    public updateSlot(slotName: string): void {
        const index = this.spine.skeleton.findSlotIndex(slotName);
        if (index !== -1) {
            this.spine.slotContainers.forEach((c, i) => {
                c.renderable = i === index || i === 0;
            });
        }
    }

    private build(): void {
        this.buildSpine();
    }

    private buildSpine(): void {
        const data = Assets.cache.get(spines[1].jsonURL).spineData;
        this.spine = new Spine(data);
        // 'Spin'
        this.spine.scale.set(0.15);
        this.addChild(this.spine);
    }
}
