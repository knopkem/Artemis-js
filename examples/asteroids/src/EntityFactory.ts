/// <reference path="../../../src/World.ts" />
/// <reference path="../../../src/Entity.ts" />
/// <reference path="components/Transform.ts" />
/// <reference path="components/SpatialForm.ts" />
/// <reference path="components/Velocity.ts" />
/// <reference path="components/Expires.ts" />



class EntityFactory {
	 public static createMissile(world: World) : Entity {

        var e : Entity = world.createEntity();
        e.setGroup("BULLETS");

        e.addComponent(new Transform());
        e.addComponent(new SpatialForm("Missile"));
        e.addComponent(new Velocity());
        e.addComponent(new Expires(1000));

        return e;
    }
}
