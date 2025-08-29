import { Container } from 'pixi.js';
import { BackgroundView } from './views/BackgroundView';
import { GameView } from './views/GameView';

class PixiStage extends Container {
    private bgView: BackgroundView;
    private gameView: GameView;

    constructor() {
        super();
    }

    public resize(): void {
        this.bgView?.rebuild();
        this.gameView?.rebuild();
    }

    public start(): void {
        this.bgView = new BackgroundView();
        this.addChild(this.bgView);
        this.gameView = new GameView();
        this.addChild(this.gameView);
    }
}

export default PixiStage;
