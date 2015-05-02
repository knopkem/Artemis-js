/// <reference path="../../../../src/World.ts" />
/// <reference path="../../../../src/Entity.ts" />
/// <reference path="../../../../src/ComponentMapper.ts" />

/// <reference path="../components/Transform.ts" />
/// <reference path="Spatial.ts" />
/// <reference path="Polygon" />



class PlayerShip extends Spatial implements ISpatial {

	private _transform: Transform;
    private _ship: Polygon;
    
    constructor(world: World, owner: Entity) {
        super(world, owner);
    }

    public initalize() {
        var transformMapper: ComponentMapper<Transform> 
            = new ComponentMapper(this._transform, this._world);

        this._transform = <Transform> transformMapper.get(this._owner);

        this._ship = new Polygon();
        this._ship.addPoint(0, -10);
        this._ship.addPoint(10, 10);
        this._ship.addPoint(-10, 10);
        this._ship.setClosed(true);
    }

    public render() {
    }
}