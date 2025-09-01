import { Container, Text } from 'pixi.js';
import { Naipes } from '../views/Naipes';

export type FunctionType = 'add' | 'multiply' | 'divide';

export class Number extends Container {
    private _parentContainer: Container | null;
    private text: Text;
    private bkg: Naipes;
    private _fn: FunctionType;
    private _value: number;

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

    public get(parentContainer: Container, fn: FunctionType, value: number): void {
        this._parentContainer = parentContainer;
        this._parentContainer?.addChild(this);

        this._fn = fn;
        this._value = value;

        this.text.text = this.getText();
        this.updateTint();
    }

    public remove(): void {
        this._parentContainer?.removeChild(this);
        this._parentContainer = null;
        this.alpha = 1;
    }

    private build(): void {
        this.bkg = new Naipes();
        this.addChild(this.bkg);

        this.text = new Text('', {
            fill: 0xffffff,
            fontWeight: '900',
            fontSize: 32,
        });
        this.text.anchor.set(0.5, 0.5);
        this.text.y = -40;
        this.addChild(this.text);
        this.scale.set(1.5);
    }

    private updateTint(): void {
        if (this._fn === 'add') {
            this.bkg.updateSlot('Hearts_D0');
        } else if (this._fn === 'multiply') {
            this.bkg.updateSlot('Diamonds_C0');
        } else {
            this.bkg.updateSlot(Math.random() > 0.5 ? 'clubs' : 'spades');
        }
    }

    private getText(): string {
        const sign = this._fn === 'add' ? '+' : this._fn === 'divide' ? '/' : 'x';
        return `${sign}${this._value}`;
    }
}

class NumberPool {
    private pool: Number[] = [];

    public getNumber(parentContainer: Container, fn: FunctionType, value: number): Number {
        const number = this.pool.find((n) => !n.parentContainer);

        if (number) {
            number.get(parentContainer, fn, value);
            return number;
        } else {
            const newNumber = new Number();
            this.pool.push(newNumber);
            newNumber.get(parentContainer, fn, value);
            return newNumber;
        }
    }

    public init(): void {
        for (let i = 0; i < 10; i++) {
            this.pool.push(new Number());
        }
    }
}

export const NumbersPool = new NumberPool();
