/// <reference path="../../../../src/Component.ts" />

class Expires extends Component{
	
	private _lifeTime : number;
	
	constructor(lifeTime: number) {
		super();
		this._lifeTime = lifeTime;
	}
	
	public getLifetime() : number {
        return this._lifeTime;
    }
    public setLifeTime(lifeTime: number) {
        this._lifeTime = lifeTime;
    }
    public reduceLifeTime(lifeTime: number) {
        this._lifeTime -= lifeTime;
    }
    public isExpired() : boolean {
        return this._lifeTime <= 0;
    }
}