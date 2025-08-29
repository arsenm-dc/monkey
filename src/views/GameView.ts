import { ICellConfig, PixiGrid } from '@armathai/pixi-grid';
import { getGameViewGridConfig } from '../configs/gridConfigs/GameViewGC';
import { BoardView } from './BoardView';

export class GameView extends PixiGrid {
    constructor() {
        super();
        this.build();
    }

    public getGridConfig(): ICellConfig {
        return getGameViewGridConfig();
    }

    public rebuild(config?: ICellConfig | undefined): void {
        super.rebuild(this.getGridConfig());
    }

    private build(): void {
        const board = new BoardView()
        board.on('imageClick', () => {
            console.warn('image click event in game view');
            
        })

        this.setChild('board', board)
    }
}
