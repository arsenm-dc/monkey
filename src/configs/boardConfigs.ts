export const VINE_Y = 1050;
export const VINE_BUSHES_Y = 650;
export const getVineY = () => VINE_Y + Math.random() * 150;

export const BUILDINGS_Y = 1875;
export const TREE_Y = 2000;
export const SPIKES_Y = 1850;

export const speeds = {
    sky: 0.1,
    clouds: 0.2,
    bkgBuildings: 0.3,
    bkgTrees: 0.5,
    buildings: 0.8,
    largeTrees: 1,
    smallForegroundTrees: 1.3,
    mediumTrees: 2,
    smallTrees: 2.3,
    fog: 1.6,
    ground: 2.5,
    smallFrontTrees: 3,
};

export const cloudYRange = [120, 800];

export const zIndex = {
    sky: 0,
    clouds: 1,
    bkgBuildings: 2,
    bkgTrees: 3,
    buildings: 4,
    largeTrees: 5,
    smallForegroundTrees: 6,
    mediumTrees: 7,
    smallTrees: 8,
    fog: 9,
    smallFrontTrees: 10,
    vines: 80,
    ground: 90,
    number: 95,
    spikes: 99,
    pit1: 100,
    monkey: 101,
    pit2: 102,
    button: 1000,
};

export const monkeyPos = {
    x: 500,
    y: 900,
};
export const WIDTH = 2048;
export const HEIGHT = 1890;

export const DT = 2;
