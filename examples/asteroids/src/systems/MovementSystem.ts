/// <reference path="../../../../src/systems/EntityProcessingSystem.ts" />
/// <reference path="../../../../src/ComponentMapper.ts" />
/// <reference path="../components/Velocity.ts" />
/// <reference path="../components/Transform.ts" />


class MovementSystem extends EntityProcessingSystem{

    private _velocityMapper: ComponentMapper<Velocity>;
    private _transformMapper: ComponentMapper<Transform>;
    
    constructor(aspect: Aspect) {
        super(aspect);
    }

    public initialize() {
        this._velocityMapper = new ComponentMapper<Velocity>(new Velocity(1), this._world );
        this._transformMapper = new ComponentMapper<Transform>(new Transform(0, 0), this._world );
    }
 
    public process(entity: Entity) {
        var velocity: Velocity = <Velocity>this._velocityMapper.get(entity);
        var v : number = velocity.getVelocity();

        var transform: Transform = <Transform>this._transformMapper.get(entity);
        var r: number = velocity.getAngleAsRadians();

        var xn: number = transform.getX() + (TrigLUT.cos(r) * v * this._world.getDelta());
        var yn: number = transform.getY() + (TrigLUT.sin(r) * v * this._world.getDelta());

        transform.setLocation(xn, yn);
    }
}
