import { Container, Sprite, Text } from 'pixi.js';
import { makeSprite } from '../configs/spriteConfig';

export type FunctionType = 'add' | 'multiply' | 'divide';

export class Number extends Container {
    private _parentContainer: Container | null;
    private text: Text;
    private bkg: Sprite;
    private fn: FunctionType;
    private value: number;

    constructor() {
        super();
        this.build();
    }

    public get parentContainer(): Container | null {
        return this._parentContainer;
    }

    public get(parentContainer: Container, fn: FunctionType, value: number): void {
        this._parentContainer = parentContainer;
        this._parentContainer?.addChild(this);

        this.fn = fn;
        this.value = value;

        this.text.text = this.getText();
        this.updateTint();
    }

    public remove(): void {
        this._parentContainer?.removeChild(this);
        this._parentContainer = null;
        this.alpha = 1;
    }

    private build(): void {
        this.bkg = makeSprite({ frame: 'circle.png' });
        this.addChild(this.bkg);

        this.text = new Text('', {
            fill: 0x000000,
            fontWeight: '900',
        });
        this.text.anchor.set(0.5, 0.5);
        this.addChild(this.text);
        this.scale.set(1.5);
    }

    private updateTint(): void {
        this.bkg.tint = this.fn === 'add' ? '0x03cafc' : this.fn === 'divide' ? '0xd6133a' : '0x75d613';
    }

    private getText(): string {
        const sign = this.fn === 'add' ? '+' : this.fn === 'divide' ? '/' : 'x';
        return `${sign}${this.value}`;
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
