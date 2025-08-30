import { Container } from 'pixi.js';
import { GameView } from './views/GameView';

class PixiStage extends Container {
    private gameView: GameView;

    constructor() {
        super();
    }

    public update(dt: number): void {
        console.log(dt);
        this.gameView?.update(dt);
    }

    public resize(): void {
        this.gameView?.rebuild();
    }

    public start(): void {
        this.gameView = new GameView();
        this.addChild(this.gameView);
    }
}

export default PixiStage;
