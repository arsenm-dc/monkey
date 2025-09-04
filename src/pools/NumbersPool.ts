import { Container, Text } from 'pixi.js';
import { Chips } from '../views/Chips';
import { Eagle } from '../views/Eagle';
import { Naipes } from '../views/Naipes';

export const DEFAULT_FONT = 'RubikBold';

export type FunctionType = 'add' | 'multiply' | 'divide';

export const getNumberText = (fn: FunctionType, value: number): string => {
    const sign = fn === 'add' ? '+' : fn === 'divide' ? '/' : 'x';
    return `${sign}${value}`;
};

export class Number extends Container {
    private _parentContainer: Container | null;
    private text: Text;
    private bkgNaipes: Naipes;
    private bkgChips: Chips;
    private bkgEagle: Eagle;
    private _fn: FunctionType;
    private _value: number;

    private _speed: number;

    constructor() {
        super();
        this.build();
    }

    public get parentContainer(): Container | null {
        return this._parentContainer;
    }

    public get fn(): FunctionType {
        return this._fn;
    }

    public get numberValue(): number {
        return this._value;
    }

    public get speed(): number {
        return this._speed;
    }

    public spin(): void {
        this.bkgChips.visible && this.bkgChips.spin();
        this.bkgNaipes.visible && this.bkgNaipes.spin();
    }

    public get(parentContainer: Container, fn: FunctionType, value: number): void {
        this._parentContainer = parentContainer;
        this._parentContainer?.addChild(this);

        this._speed = Math.random() + 3;

        this._fn = fn;
        this._value = value;

        this.text.text = getNumberText(this._fn, this._value);
        this.updateTint();
        this.spin();
    }

    public remove(): void {
        this._parentContainer?.removeChild(this);
        this._parentContainer = null;
        this.alpha = 1;
    }

    private build(): void {
        this.bkgNaipes = new Naipes();
        this.bkgNaipes.visible = false;
        this.addChild(this.bkgNaipes);

        this.bkgChips = new Chips();
        this.bkgChips.visible = false;
        this.addChild(this.bkgChips);

        this.bkgEagle = new Eagle();
        this.bkgEagle.visible = false;
        this.addChild(this.bkgEagle);

        this.text = new Text('', {
            fill: 0xffffff,
            fontWeight: '900',
            fontSize: 42,
            fontFamily: DEFAULT_FONT,
        });
        this.text.anchor.set(0.5, 0.5);
        this.bkgNaipes.y = 70;
        this.bkgChips.y = 50;
        this.bkgEagle.y = 120;
        this.addChild(this.text);
    }

    private updateTint(): void {
        if (this._fn === 'add') {
            this.text.visible = true;
            this.bkgNaipes.visible = false;
            this.bkgChips.visible = true;
            this.bkgEagle.visible = false;
        } else if (this._fn === 'multiply') {
            this.text.visible = true;
            this.bkgChips.visible = false;
            this.bkgEagle.visible = false;
            this.bkgNaipes.visible = true;
            this.bkgNaipes.updateSlot(Math.random() > 0.5 ? 'Diamonds_C0' : 'Hearts_D0');
        } else {
            this.bkgChips.visible = false;
            this.bkgNaipes.visible = false;
            this.bkgEagle.visible = true;
            this.text.visible = false;
            this.bkgNaipes.updateSlot('spades');
        }
    }
}

class NumberPool {
    private pool: Number[] = [];

    public get(parentContainer: Container, fn: FunctionType, value: number): Number {
        const element = this.pool.find((n) => !n.parentContainer);

        if (element) {
            element.get(parentContainer, fn, value);
            return element;
        } else {
            const newElement = new Number();
            this.pool.push(newElement);
            newElement.get(parentContainer, fn, value);
            return newElement;
        }
    }

    public init(): void {
        for (let i = 0; i < 10; i++) {
            this.pool.push(new Number());
        }
    }
}

export const NumbersPool = new NumberPool();
