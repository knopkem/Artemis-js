/// <reference path="../../../../src/Component.ts" />

class Velocity extends Component {
	private _velocity : number;
    private _angle: number;

    constructor(velocity: number) {
        super();
        this._velocity = velocity;
    }
    public getVelocity() : number {
        return this._velocity;
    }
    public setVelocity(velocity: number){
        this._velocity = velocity;
    }
    public getAngle() : number{
        return this._angle;
    }
    public setAngle(angle: number){
        this._angle = angle;
    }
    public addAngle(a: number) {
        this._angle = (this._angle + a) % 360;
    }
    public getAngleAsRadians() {
        return Math.toRadians(this._angle);
    }
}