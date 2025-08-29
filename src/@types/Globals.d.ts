interface Window {
    game: any;
}

type TutorialSequenceConfig = {
    text: string;
    duration: number;
    clickToComplete: boolean;
};

type AssetNameAndPath = {
    name: string;
    path: string;
};

type SpineFiles = {
    key: string;
    jsonURL: string;
    atlasURL: string;
    preMultipliedAlpha?: boolean;
};

declare namespace GlobalMixins {
    interface DisplayObjectEvents {
        hideComplete: [string];
        showComplete: [string];
        click: [string];
    }
}
