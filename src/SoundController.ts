// import { audioAssets } from './assets/assetsNames/audio';

class SoundControl {
    private sounds: any;
    public constructor() {
        this.sounds = {};
    }

    public loadSounds(): void {
        // audioAssets.forEach(({ name, path }) => {
        //     this.sounds[name] = new Howl({ src: path });
        // });
    }

    private gameModelUpdate(): void {
        this.sounds.sound.play();
    }
}

const SoundController = new SoundControl();
export default SoundController;
