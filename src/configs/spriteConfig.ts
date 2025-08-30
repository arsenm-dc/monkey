import { Point, Sprite, Texture } from 'pixi.js';

export const makeSprite = (config: SpriteConfig): Sprite => {
    const {
        frame,
        atlas = '',
        x = 0,
        y = 0,
        scaleX = 1,
        scaleY = 1,
        anchor = new Point(0.5, 0.5),
        tint = 0xffffff,
        alpha = 1,
        rotation = 0,
        name = '',
    } = config;

    const texture = Texture.from(frame);
    const sprite = new Sprite(texture);
    sprite.position.set(x, y);
    sprite.scale.set(scaleX, scaleY);
    sprite.anchor.set(anchor.x, anchor.y);
    sprite.tint = tint;
    sprite.alpha = alpha;
    sprite.rotation = rotation;
    name && (sprite.name = name);
    return sprite;
};

export const skyConfig = () => {
    return {
        frame: 'sky.png',
        name: 'sky',
        anchor: new Point(0, 0),
    };
};
