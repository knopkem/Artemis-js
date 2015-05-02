/// <reference path="../../../../src/Component.ts" />

class Transform extends Component {
	private _x : number;
    private _y : number;
    private _rotation : number;

    constructor(x: number,y: number) {
		super();
        this._x = x;
        this._y = y;
    }


    public getX() : number {
        return this._x;
    }

    public getY() : number {
        return this._y;
    }

    public setLocation(x: number,y: number) {
        this._x = x;
        this._y = y;
    }

    public addX(x: number) {
        this._x += x;
    }
	
	public addY(y: number) {
        this._y += y;
    }
}