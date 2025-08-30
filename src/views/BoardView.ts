import { Container, Rectangle, Texture, TilingSprite } from 'pixi.js';

export class BoardView extends Container {
    constructor() {
        super();
        this.build();
    }

    public getBounds(skipUpdate?: boolean, rect?: Rectangle): Rectangle {
        return new Rectangle(0, 0, 2048, 1890);
    }

    private build(): void {
        this.buildSky();
        // const spin = Assets.cache.get(spines[0].jsonURL).spineData;
        // const spine: Spine = new Spine(spin);

        // // 'Death start'
        // // 'Falling'
        // // 'Falling for death'
        // // 'Landing'
        // // 'Swing'
        // // 'spike death'

        // spine.state.setAnimation(0, 'spike death', true);
        // this.addChild(spine);
    }

    private buildSky(): void {
        const texture = Texture.from('sky.png');
        const sky = new TilingSprite(texture, 4000, 2000);
        this.addChild(sky);

        // const texture2 = Texture.from('stars.png');
        // const stars = new TilingSprite(texture2, 1000, 500);
        // stars.scale.set(3);
        // this.addChild(stars);
    }
}
