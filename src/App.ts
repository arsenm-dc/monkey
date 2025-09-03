import { lego, legoLogger } from '@armathai/lego';
import { PixiStatsPlugin } from '@armathai/pixi-stats';
import { Application, Assets } from 'pixi.js';
import PixiStage from './MainStage';
import { fitDimension } from './Utils';
import { assets } from './assets/assetsNames/assets';
import { atlases } from './assets/assetsNames/atlas';
import { spines } from './assets/assetsNames/spines';
import { ScreenSizeConfig } from './configs/ScreenSizeConfig';
import { MainGameEvents, WindowEvent } from './events/MainEvents';

class App extends Application {
    public stage: PixiStage;

    public constructor() {
        super({
            backgroundColor: 0x280c70,
            backgroundAlpha: 1,
            powerPreference: 'high-performance',
            antialias: true,
            resolution: Math.max(window.devicePixelRatio || 1, 2),
            sharedTicker: true,
        });
    }

    public async init(): Promise<void> {
        this.stage = new PixiStage();
        // @ts-ignore
        this.view.classList.add('app');
        // @ts-ignore
        document.body.appendChild(this.view);

        if (process.env.NODE_ENV !== 'production') {
            this.initStats();
            this.initLego();
        }
        await this.loadAssets();
        this.onLoadComplete();
    }

    public appResize(): void {
        const { clientWidth: w, clientHeight: h } = document.body;
        if (w === 0 || h === 0) return;

        const { min, max } = ScreenSizeConfig.size.ratio;
        const { width, height } = fitDimension({ width: w, height: h }, min, max);

        this.resizeCanvas(width, height);
        this.resizeRenderer(width, height);

        this.stage.resize();

        lego.event.emit(MainGameEvents.Resize);
    }

    public onFocusChange(focus: boolean): void {
        lego.event.emit(WindowEvent.FocusChange, focus);
    }

    private async loadAssets(): Promise<void> {
        for (const asset of assets) {
            const { name, path } = asset;
            Assets.add({ alias: name, src: path });
            await Assets.load(name);
        }
        for (const atlas of atlases) {
            const { name, json } = atlas;
            Assets.add({ alias: name, src: json });
            await Assets.load(name);
        }
        for (const spine of spines) {
            const { key: name, jsonURL, atlasURL } = spine;
            Assets.add({ alias: name, src: jsonURL });
            await Assets.load(name);
        }
        // SoundController.loadSounds();
    }

    private onLoadComplete(): void {
        this.appResize();
        this.stage.start();
        this.ticker.add((dt) => this.stage.update(dt));

        lego.event.emit(MainGameEvents.MainViewReady);
    }

    private resizeCanvas(width: number, height: number): void {
        const { style } = this.renderer.view;
        if (!style) return;
        style.width = `${width}px`;
        style.height = `${height}px`;
    }

    private resizeRenderer(width: number, height: number): void {
        this.renderer.resize(width, height);
    }

    private initLego(): void {
        legoLogger.start(lego, Object.freeze({}));
    }

    private initStats(): void {
        //@ts-ignore
        const stats = new PixiStatsPlugin(this);
        document.body.appendChild(stats.stats.dom);
        stats.stats.showPanel(0);
        this.ticker.add(() => stats.stats.update());
    }
}

export default App;
