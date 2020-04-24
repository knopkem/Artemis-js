var AClass = (function () {
    function AClass() {
    }
    AClass.prototype.getClassName = function () {
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((this).constructor.toString());
        return (results && results.length > 1) ? results[1] : "";
    };
    return AClass;
})();
// Todo: implement intersect
var BitSet = (function () {
    function BitSet() {
        this._words = [];
        this.BITS_OF_A_WORD = 32;
        this.SHIFTS_OF_A_WORD = 5;
        this.words = function () {
            return this._words.length;
        };
        this.cardinality = function () {
            var next, sum = 0, arrOfWords = this._words, maxWords = this.words();
            for (next = 0; next < maxWords; next += 1) {
                var nextWord = arrOfWords[next] || 0;
                for (var bits = nextWord; bits !== 0; bits &= (bits - 1)) {
                    sum += 1;
                }
            }
            return sum;
        };
        this.or = function (set) {
            if (this === set) {
                return this;
            }
            var next, commons = Math.min(this.words(), set.words());
            for (next = 0; next < commons; next += 1) {
                this._words[next] = (this._words[next] || 0) | (set._words[next] || 0);
            }
            if (commons < set.words()) {
                this._words = this._words.concat(set._words.slice(commons, set.words()));
            }
            return this;
        };
        this.and = function (set) {
            if (this === set) {
                return this;
            }
            var next, commons = Math.min(this.words(), set.words()), words = this._words, i;
            for (next = 0; next < commons; next += 1) {
                words[next] = (words[next] || 0) & (set._words[next] || 0);
            }
            if (commons > set.words()) {
                for (i = commons; i < set.words(); i += 1) {
                    words.pop();
                }
            }
            return this;
        };
        this.xor = function (set) {
            var next, commons = Math.min(this.words(), set.words());
            for (next = 0; next < commons; next += 1) {
                this._words[next] = (this._words[next] || 0) ^ (set._words[next] || 0);
            }
            var maxWords = 0;
            if (commons < set.words()) {
                maxWords = set.words();
                for (next = commons; next < maxWords; next += 1) {
                    this._words[next] = (set._words[next] || 0) ^ 0;
                }
            }
            else {
                maxWords = this.words();
                for (next = commons; next < maxWords; next += 1) {
                    this._words[next] = (this._words[next] || 0) ^ 0;
                }
            }
            return this;
        };
        this.nextSetBit = function (pos) {
            var next = this.whichWord(pos), words = this._words;
            if (next >= words.length) {
                return -1;
            }
            var firstWord = words[next], maxWords = this.words(), bit;
            if (firstWord) {
                for (bit = pos & 31; bit < this.BITS_OF_A_WORD; bit += 1) {
                    if ((firstWord & this.mask(bit))) {
                        return (next << this.SHIFTS_OF_A_WORD) + bit;
                    }
                }
            }
            for (next = next + 1; next < maxWords; next += 1) {
                var nextWord = words[next];
                if (nextWord) {
                    for (bit = 0; bit < this.BITS_OF_A_WORD; bit += 1) {
                        if ((nextWord & this.mask(bit)) !== 0) {
                            return (next << this.SHIFTS_OF_A_WORD) + bit;
                        }
                    }
                }
            }
            return -1;
        };
        this.prevSetBit = function (pos) {
            var prev = this.whichWord(pos), words = this._words;
            if (prev >= words.length) {
                return -1;
            }
            var lastWord = words[prev], bit;
            if (lastWord) {
                for (bit = pos & 31; bit >= 0; bit -= 1) {
                    if ((lastWord & this.mask(bit))) {
                        return (prev << this.SHIFTS_OF_A_WORD) + bit;
                    }
                }
            }
            for (prev = prev - 1; prev >= 0; prev -= 1) {
                var prevWord = words[prev];
                if (prevWord) {
                    for (bit = this.BITS_OF_A_WORD - 1; bit >= 0; bit -= 1) {
                        if ((prevWord & this.mask(bit)) !== 0) {
                            return (prev << this.SHIFTS_OF_A_WORD) + bit;
                        }
                    }
                }
            }
            return -1;
        };
    }
    BitSet.prototype.set = function (pos) {
        var which = this.whichWord(pos), words = this._words;
        return words[which] = words[which] | this.mask(pos);
    };
    BitSet.prototype.clear = function (pos) {
        if (!pos) {
            this._words = [];
            return;
        }
        var which = this.whichWord(pos), words = this._words;
        return words[which] = words[which] & ~this.mask(pos);
    };
    BitSet.prototype.get = function (pos) {
        var which = this.whichWord(pos), words = this._words;
        return words[which] & this.mask(pos);
    };
    BitSet.prototype.whichWord = function (pos) {
        return pos >> this.SHIFTS_OF_A_WORD;
    };
    BitSet.prototype.mask = function (pos) {
        return 1 << (pos & 31);
    };
    BitSet.prototype.isEmpty = function () {
        return this._words.length == 0;
    };
    BitSet.prototype.intersects = function (input) {
        return false;
    };
    return BitSet;
})();
var ComponentType = (function () {
    function ComponentType(type) {
        this._index = ComponentType.INDEX++;
    }
    ComponentType.prototype.getIndex = function () {
        return this._index;
    };
    ComponentType.INDEX = 0;
    return ComponentType;
})();
/// <reference path="AClass" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Component = (function (_super) {
    __extends(Component, _super);
    function Component() {
        _super.apply(this, arguments);
    }
    return Component;
})(AClass);
/// <reference path="ComponentType.ts" />
/// <reference path="depends/hashtable.d.ts" />
/// <reference path="Component.ts" />
var ComponentTypeManager = (function () {
    function ComponentTypeManager() {
    }
    ComponentTypeManager.getTypeFor = function (component) {
        if (!this.TYPE_MAP.containsKey(component.getClassName())) {
            this.TYPE_MAP.put(component.getClassName(), new ComponentType(component));
        }
        return this.TYPE_MAP.get(component.getClassName());
    };
    ComponentTypeManager.getIndexFor = function (c) {
        var cpt = this.getTypeFor(c);
        return cpt.getIndex();
    };
    ComponentTypeManager.TYPE_MAP = new Hashtable();
    return ComponentTypeManager;
})();
/// <reference path="utils/BitSet.ts" />
/// <reference path="ComponentType.ts" />
/// <reference path="ComponentTypeManager.ts" />
var Aspect = (function () {
    function Aspect() {
        this._allSet = new BitSet();
        this._exclusionSet = new BitSet();
        this._oneSet = new BitSet();
    }
    Aspect.prototype.getAllSet = function () {
        return this._allSet;
    };
    Aspect.prototype.getExclusionSet = function () {
        return this._exclusionSet;
    };
    Aspect.prototype.getOneSet = function () {
        return this._oneSet;
    };
    Aspect.prototype.all = function (type, types) {
        this._allSet.set(ComponentTypeManager.getIndexFor(type));
        for (var t in types) {
            this._allSet.set(ComponentTypeManager.getIndexFor(t));
        }
        return this;
    };
    Aspect.prototype.exclude = function (type, types) {
        this._exclusionSet.set(ComponentTypeManager.getIndexFor(type));
        for (var t in types) {
            this._exclusionSet.set(ComponentTypeManager.getIndexFor(t));
        }
        return this;
    };
    Aspect.prototype.one = function (type, types) {
        this._oneSet.set(ComponentTypeManager.getIndexFor(type));
        for (var t in types) {
            this._oneSet.set(ComponentTypeManager.getIndexFor(t));
        }
        return this;
    };
    Aspect.getAspectFor = function (type, types) {
        return this.getAspectForAll(type, types);
    };
    Aspect.getAspectForAll = function (type, types) {
        var aspect = new Aspect();
        aspect.all(type, types);
        return aspect;
    };
    Aspect.getAspectForOne = function (type, types) {
        var aspect = new Aspect();
        aspect.one(type, types);
        return aspect;
    };
    Aspect.getEmpty = function () {
        return new Aspect();
    };
    return Aspect;
})();
///<reference path='ImmutableBag.ts'/>
var Bag = (function () {
    function Bag(capacity) {
        if (capacity === void 0) { capacity = 64; }
        this._data = new Object[capacity];
        this._size = 0;
    }
    Bag.prototype.remove = function (index) {
        var e = this._data[index];
        this._data[index] = this._data[--this._size];
        this._data[this._size] = null;
        return e;
    };
    Bag.prototype.removeLast = function () {
        if (this._size > 0) {
            var e = this._data[--this._size];
            this._data[this._size] = null;
            return e;
        }
        return null;
    };
    Bag.prototype.removeType = function (e) {
        for (var i = 0; i < this._size; i++) {
            var e2 = this._data[i];
            if (e == e2) {
                this._data[i] = this._data[--this._size];
                this._data[this._size] = null;
                return true;
            }
        }
        return false;
    };
    Bag.prototype.contains = function (e) {
        for (var i = 0; this._size > i; i++) {
            if (e == this._data[i]) {
                return true;
            }
        }
        return false;
    };
    Bag.prototype.removeAll = function (bag) {
        var modified = false;
        for (var i = 0; i < bag.size(); i++) {
            var e1 = bag.get(i);
            for (var j = 0; j < this._size; j++) {
                var e2 = this._data[j];
                if (e1 == e2) {
                    this.remove(j);
                    j--;
                    modified = true;
                    break;
                }
            }
        }
        return modified;
    };
    Bag.prototype.get = function (index) {
        return this._data[index];
    };
    Bag.prototype.size = function () {
        return this._size;
    };
    Bag.prototype.getCapacity = function () {
        return this._data.length;
    };
    Bag.prototype.isIndexWithinBounds = function (index) {
        return index < this.getCapacity();
    };
    Bag.prototype.isEmpty = function () {
        return this._size == 0;
    };
    Bag.prototype.add = function (e) {
        if (this._size == this._data.length) {
            this.grow();
        }
        this._data[this._size++] = e;
    };
    Bag.prototype.set = function (index, e) {
        if (index >= this._data.length) {
            this.grow(index * 2);
        }
        this._size = Math.max(this._size, index + 1);
        this._data[index] = e;
    };
    Bag.prototype.grow = function (newCapacity) {
        if (!newCapacity) {
            newCapacity = (this._data.length * 3) / 2 + 1;
        }
        var oldData = this._data;
        this._data = new Object[newCapacity];
    };
    Bag.prototype.ensureCapacity = function (index) {
        if (index >= this._data.length) {
            this.grow(index * 2);
        }
    };
    Bag.prototype.clear = function () {
        for (var i = 0; i < this._size; i++) {
            this._data[i] = null;
        }
        this._size = 0;
    };
    Bag.prototype.addAll = function (items) {
        for (var i = 0; items.size() > i; i++) {
            this.add(items.get(i));
        }
    };
    return Bag;
})();
/// <reference path='Entity.ts'/>
/// <reference path='EntityObserver.ts'/>
/// <reference path='World.ts'/>
/// <reference path='AClass.ts'/>
var Manager = (function (_super) {
    __extends(Manager, _super);
    function Manager() {
        _super.apply(this, arguments);
    }
    Manager.prototype.initialize = function () {
        throw new Error('This method is abstract');
    };
    Manager.prototype.setWorld = function (world) {
        this._world = world;
    };
    Manager.prototype.getWorld = function () {
        return this._world;
    };
    Manager.prototype.added = function (e) {
    };
    Manager.prototype.changed = function (e) {
    };
    Manager.prototype.deleted = function (e) {
    };
    Manager.prototype.disabled = function (e) {
    };
    Manager.prototype.enabled = function (e) {
    };
    return Manager;
})(AClass);
/// <reference path="Manager.ts" />
var IdentifierPool = (function () {
    function IdentifierPool() {
        this._ids = new Bag();
    }
    IdentifierPool.prototype.checkOut = function () {
        if (this._ids.size() > 0) {
            return this._ids.removeLast();
        }
        return this._nextAvailableId++;
    };
    IdentifierPool.prototype.checkIn = function (id) {
        this._ids.add(id);
    };
    return IdentifierPool;
})();
var EntityManager = (function (_super) {
    __extends(EntityManager, _super);
    function EntityManager() {
        _super.call(this);
        this._entities = new Bag();
        this._disabled = new BitSet();
        this._identifierPool = new IdentifierPool();
    }
    EntityManager.prototype.initialize = function () {
    };
    EntityManager.prototype.createEntityInstance = function () {
        var e = new Entity(this._world, this._identifierPool.checkOut());
        this._created++;
        return e;
    };
    EntityManager.prototype.added = function (e) {
        this._active++;
        this._added++;
        this._entities.set(e.getId(), e);
    };
    EntityManager.prototype.enabled = function (e) {
        this._disabled.clear(e.getId());
    };
    EntityManager.prototype.disabled = function (e) {
        this._disabled.set(e.getId());
    };
    EntityManager.prototype.deleted = function (e) {
        this._entities.set(e.getId(), null);
        this._disabled.clear(e.getId());
        this._identifierPool.checkIn(e.getId());
        this._active--;
        this._deleted++;
    };
    EntityManager.prototype.isActive = function (entityId) {
        return this._entities.get(entityId) != null;
    };
    EntityManager.prototype.isEnabled = function (entityId) {
        return !this._disabled.get(entityId);
    };
    EntityManager.prototype.getEntity = function (entityId) {
        return this._entities.get(entityId);
    };
    EntityManager.prototype.getActiveEntityCount = function () {
        return this._active;
    };
    EntityManager.prototype.getTotalCreated = function () {
        return this._created;
    };
    EntityManager.prototype.getTotalAdded = function () {
        return this._added;
    };
    EntityManager.prototype.getTotalDeleted = function () {
        return this._deleted;
    };
    return EntityManager;
})(Manager);
/// <reference path="ComponentType.ts" />
/// <reference path="ComponentTypeManager.ts" />
/// <reference path="utils/Bag.ts" />
/// <reference path="World.ts" />
var ComponentMapper = (function () {
    function ComponentMapper(type, world) {
        this._type = ComponentTypeManager.getTypeFor(type);
        this._components = world.getComponentManager().getComponentsByType(this._type);
    }
    ComponentMapper.prototype.get = function (e) {
        return this._components.get(e.getId());
    };
    ComponentMapper.prototype.getSafe = function (e) {
        if (this._components.isIndexWithinBounds(e.getId())) {
            return this._components.get(e.getId());
        }
        return null;
    };
    ComponentMapper.prototype.has = function (e) {
        return this.getSafe(e) != null;
    };
    ComponentMapper.getFor = function (type, world) {
        return new ComponentMapper(type, world);
    };
    return ComponentMapper;
})();
/// <reference path='Entity.ts'/>
/// <reference path='AClass.ts'/>
/// <reference path='EntityObserver.ts'/>
/// <reference path='Aspect.ts'/>
/// <reference path='utils/BitSet.ts'/>
/// <reference path='utils/Bag.ts'/>
/// <reference path="depends/hashtable.d.ts" />
var SystemIndexManager = (function () {
    function SystemIndexManager() {
    }
    SystemIndexManager.getIndexFor = function (es) {
        var index = this._indices.get(es.getClassName());
        if (index == null) {
            index = this.INDEX++;
            this._indices.put(es.getClassName(), index);
        }
        return index;
    };
    SystemIndexManager.INDEX = 0;
    SystemIndexManager._indices = new Hashtable();
    return SystemIndexManager;
})();
var EntitySystem = (function (_super) {
    __extends(EntitySystem, _super);
    function EntitySystem(aspect) {
        _super.call(this);
        this._actives = new Bag();
        this._aspect = aspect;
        this._allSet = aspect.getAllSet();
        this._exclusionSet = aspect.getExclusionSet();
        this._oneSet = aspect.getOneSet();
        this._systemIndex = SystemIndexManager.getIndexFor(this);
        this._dummy = this._allSet.isEmpty() && this._oneSet.isEmpty();
    }
    EntitySystem.prototype.dispose = function () {
    };
    EntitySystem.prototype.begin = function () {
    };
    EntitySystem.prototype.process = function () {
        if (this.checkProcessing()) {
            this.begin();
            this.processEntities(this._actives);
            this.end();
        }
    };
    EntitySystem.prototype.end = function () {
    };
    EntitySystem.prototype.processEntities = function (entities) {
    };
    EntitySystem.prototype.checkProcessing = function () {
        return false;
    };
    EntitySystem.prototype.initialize = function () {
    };
    EntitySystem.prototype.inserted = function (e) {
    };
    EntitySystem.prototype.removed = function (e) {
    };
    EntitySystem.prototype.check = function (e) {
        if (this._dummy) {
            return;
        }
        var contains = e.getSystemBits().get(this._systemIndex) ? true : false;
        var interested = true;
        var componentBits = e.getComponentBits();
        if (!this._allSet.isEmpty()) {
            for (var i = this._allSet.nextSetBit(0); i >= 0; i = this._allSet.nextSetBit(i + 1)) {
                if (!componentBits.get(i)) {
                    interested = false;
                    break;
                }
            }
        }
        if (!this._exclusionSet.isEmpty() && interested) {
            interested = !this._exclusionSet.intersects(componentBits);
        }
        if (!this._oneSet.isEmpty()) {
            interested = this._oneSet.intersects(componentBits);
        }
        if (interested && !contains) {
            this.insertToSystem(e);
        }
        else if (!interested && contains) {
            this.removeFromSystem(e);
        }
    };
    EntitySystem.prototype.removeFromSystem = function (e) {
        this._actives.removeType(e);
        e.getSystemBits().clear(this._systemIndex);
        this.removed(e);
    };
    EntitySystem.prototype.insertToSystem = function (e) {
        this._actives.add(e);
        e.getSystemBits().set(this._systemIndex);
        this.inserted(e);
    };
    EntitySystem.prototype.added = function (e) {
        this.check(e);
    };
    EntitySystem.prototype.changed = function (e) {
        this.check(e);
    };
    EntitySystem.prototype.deleted = function (e) {
        if (e.getSystemBits().get(this._systemIndex)) {
            this.removeFromSystem(e);
        }
    };
    EntitySystem.prototype.disabled = function (e) {
        if (e.getSystemBits().get(this._systemIndex)) {
            this.removeFromSystem(e);
        }
    };
    EntitySystem.prototype.enabled = function (e) {
        this.check(e);
    };
    EntitySystem.prototype.setWorld = function (world) {
        this._world = world;
    };
    EntitySystem.prototype.isPassive = function () {
        return this._passive;
    };
    EntitySystem.prototype.setPassive = function (passive) {
        this._passive = passive;
    };
    EntitySystem.prototype.getActives = function () {
        return this._actives;
    };
    return EntitySystem;
})(AClass);
/// <reference path='utils/Bag.ts'/>
/// <reference path='utils/BitSet.ts'/>
/// <reference path='Manager.ts'/>
/// <reference path='Entity.ts'/>
/// <reference path='EntityManager.ts'/>
/// <reference path='ComponentManager.ts'/>
/// <reference path='ComponentMapper.ts'/>
/// <reference path='EntitySystem.ts'/>
/// <reference path="depends/hashtable.d.ts" />
var AddPerformer = (function () {
    function AddPerformer() {
    }
    AddPerformer.prototype.perform = function (observer, e) {
        observer.added(e);
    };
    return AddPerformer;
})();
var ChangePerformer = (function () {
    function ChangePerformer() {
    }
    ChangePerformer.prototype.perform = function (observer, e) {
        observer.changed(e);
    };
    return ChangePerformer;
})();
var DisablePerformer = (function () {
    function DisablePerformer() {
    }
    DisablePerformer.prototype.perform = function (observer, e) {
        observer.disabled(e);
    };
    return DisablePerformer;
})();
var EnablePerformer = (function () {
    function EnablePerformer() {
    }
    EnablePerformer.prototype.perform = function (observer, e) {
        observer.enabled(e);
    };
    return EnablePerformer;
})();
var DeletePerformer = (function () {
    function DeletePerformer() {
    }
    DeletePerformer.prototype.perform = function (observer, e) {
        observer.deleted(e);
    };
    return DeletePerformer;
})();
var ComponentMapperInitHelper = (function () {
    function ComponentMapperInitHelper() {
    }
    ComponentMapperInitHelper.config = function (target, world) {
        try {
        }
        catch (e) {
            throw new Error("Error while setting component mappers");
        }
    };
    return ComponentMapperInitHelper;
})();
var World = (function () {
    function World() {
        this._managers = new Hashtable();
        this._systems = new Hashtable();
        this._managersBag = new Bag();
        this._systemsBag = new Bag();
        this._added = new Bag();
        this._changed = new Bag();
        this._deleted = new Bag();
        this._enable = new Bag();
        this._disable = new Bag();
        this._cm = new ComponentManager();
        this.setManager(this._cm);
        this._em = new EntityManager();
        this.setManager(this._em);
        this._mAddedPerformer = new AddPerformer();
        this._mChangedPerformer = new ChangePerformer();
        this._mDisabledPerformer = new DisablePerformer();
        this._mEnabledPerformer = new EnablePerformer();
        this._mDeletedPerformer = new DeletePerformer();
    }
    World.prototype.initialize = function () {
        for (var i = 0; i < this._managersBag.size(); i++) {
            this._managersBag.get(i).initialize();
        }
        for (var i = 0; i < this._systemsBag.size(); i++) {
            ComponentMapperInitHelper.config(this._systemsBag.get(i), this);
            this._systemsBag.get(i).initialize();
        }
    };
    World.prototype.getEntityManager = function () {
        return this._em;
    };
    World.prototype.getComponentManager = function () {
        return this._cm;
    };
    World.prototype.setManager = function (manager) {
        this._managers[manager.getClass()] = manager;
        this._managersBag.add(manager);
        manager.setWorld(this);
        return manager;
    };
    World.prototype.getManager = function (managerType) {
        return managerType.cast(this._managers[managerType]);
    };
    World.prototype.deleteManager = function (manager) {
        this._managersBag.removeType(manager);
    };
    World.prototype.getDelta = function () {
        return this._delta;
    };
    World.prototype.setDelta = function (delta) {
        this._delta = delta;
    };
    World.prototype.addEntity = function (e) {
        this._added.add(e);
    };
    World.prototype.changedEntity = function (e) {
        this._changed.add(e);
    };
    World.prototype.deleteEntity = function (e) {
        if (!this._deleted.contains(e)) {
            this._deleted.add(e);
        }
    };
    World.prototype.enable = function (e) {
        this._enable.add(e);
    };
    World.prototype.disable = function (e) {
        this._disable.add(e);
    };
    World.prototype.createEntity = function () {
        return this._em.createEntityInstance();
    };
    World.prototype.getEntity = function (entityId) {
        return this._em.getEntity(entityId);
    };
    World.prototype.getSystems = function () {
        return this._systemsBag;
    };
    World.prototype.setSystem = function (system) {
        return this.setSystem2(system, false);
    };
    World.prototype.setSystem2 = function (system, passive) {
        system.setWorld(this);
        system.setPassive(passive);
        this._systems.put(system.getClassName(), system);
        this._systemsBag.add(system);
        return system;
    };
    World.prototype.deleteSystem = function (system) {
        this._systems.remove(system.getClassName());
        this._systemsBag.removeType(system);
    };
    World.prototype.notifySystems = function (performer, e) {
        for (var i = 0, s = this._systemsBag.size(); s > i; i++) {
            performer.perform(this._systemsBag.get(i), e);
        }
    };
    World.prototype.notifyManagers = function (performer, e) {
        for (var a = 0; this._managersBag.size() > a; a++) {
            performer.perform(this._managersBag.get(a), e);
        }
    };
    World.prototype.getSystem = function (type) {
        return this._systems[type];
    };
    World.prototype.check = function (entities, performer) {
        if (!entities.isEmpty()) {
            for (var i = 0; entities.size() > i; i++) {
                var e = entities.get(i);
                this.notifyManagers(performer, e);
                this.notifySystems(performer, e);
            }
            entities.clear();
        }
    };
    World.prototype.process = function () {
        this.check(this._added, this._mAddedPerformer);
        this.check(this._changed, this._mChangedPerformer);
        this.check(this._disable, this._mDisabledPerformer);
        this.check(this._enable, this._mEnabledPerformer);
        this.check(this._deleted, this._mDeletedPerformer);
        this._cm.clean();
        for (var i = 0; this._systemsBag.size() > i; i++) {
            var system = this._systemsBag.get(i);
            if (!system.isPassive()) {
                system.process();
            }
        }
    };
    World.prototype.getMapper = function (type) {
        return ComponentMapper.getFor(type, this);
    };
    return World;
})();
/// <reference path='utils/Bag.ts'/>
/// <reference path='utils/BitSet.ts'/>
/// <reference path='World.ts'/>
/// <reference path='EntityManager.ts'/>
/// <reference path='ComponentManager.ts'/>
/// <reference path='ComponentTypeManager.ts'/>
var Entity = (function () {
    function Entity(world, id) {
        this._world = world;
        this._id = id;
        this._entityManager = world.getEntityManager();
        this._componentManager = world.getComponentManager();
        this._systemBits = new BitSet();
        this._componentBits = new BitSet();
        this.reset();
    }
    Entity.prototype.getId = function () {
        return this._id;
    };
    Entity.prototype.getComponentBits = function () {
        return this._componentBits;
    };
    Entity.prototype.getSystemBits = function () {
        return this._systemBits;
    };
    Entity.prototype.reset = function () {
        this._systemBits.clear();
        this._componentBits.clear();
    };
    Entity.prototype.toString = function () {
        return "Entity[" + this._id + "]";
    };
    Entity.prototype.addComponent = function (component) {
        this.addComponentWithType(component, ComponentTypeManager.getTypeFor(component));
        return this;
    };
    Entity.prototype.addComponentWithType = function (component, type) {
        this._componentManager.addComponent(this, type, component);
        return this;
    };
    Entity.prototype.removeComponent = function (component) {
        this.removeComponentByComponentType(ComponentTypeManager.getTypeFor(component));
        return this;
    };
    Entity.prototype.removeComponentByComponentType = function (type) {
        this._componentManager.removeComponent(this, type);
        return this;
    };
    Entity.prototype.isActive = function () {
        return this._entityManager.isActive(this._id);
    };
    Entity.prototype.isEnabled = function () {
        return this._entityManager.isEnabled(this._id);
    };
    Entity.prototype.getComponent = function (type) {
        return this._componentManager.getComponent(this, type);
    };
    Entity.prototype.getComponents = function (fillBag) {
        return this._componentManager.getComponentsFor(this, fillBag);
    };
    Entity.prototype.addToWorld = function () {
        this._world.addEntity(this);
    };
    Entity.prototype.changedInWorld = function () {
        this._world.changedEntity(this);
    };
    Entity.prototype.deleteFromWorld = function () {
        this._world.deleteEntity(this);
    };
    Entity.prototype.enable = function () {
        this._world.enable(this);
    };
    Entity.prototype.disable = function () {
        this._world.disable(this);
    };
    Entity.prototype.getWorld = function () {
        return this._world;
    };
    return Entity;
})();
/// <reference path='utils/Bag.ts'/>
/// <reference path='utils/BitSet.ts'/>
/// <reference path='Component.ts'/>
/// <reference path='Entity.ts'/>
/// <reference path='Manager.ts'/>
/// <reference path='ComponentType.ts'/>
var ComponentManager = (function (_super) {
    __extends(ComponentManager, _super);
    function ComponentManager() {
        _super.call(this);
        this._componentsByType = new Bag();
        this._deleted = new Bag();
    }
    ComponentManager.prototype.initialize = function () {
    };
    ComponentManager.prototype.removeComponentsOfEntity = function (e) {
        var componentBits = e.getComponentBits();
        for (var i = componentBits.nextSetBit(0); i >= 0; i = componentBits.nextSetBit(i + 1)) {
            this._componentsByType.get(i).set(e.getId(), null);
        }
        componentBits.clear();
    };
    ComponentManager.prototype.addComponent = function (e, type, component) {
        this._componentsByType.ensureCapacity(type.getIndex());
        var components;
        components = this._componentsByType.get(type.getIndex());
        if (components == null) {
            components = new Bag();
            this._componentsByType.set(type.getIndex(), components);
        }
        components.set(e.getId(), component);
        e.getComponentBits().set(type.getIndex());
    };
    ComponentManager.prototype.removeComponent = function (e, type) {
        if (e.getComponentBits().get(type.getIndex())) {
            this._componentsByType.get(type.getIndex()).set(e.getId(), null);
            e.getComponentBits().clear(type.getIndex());
        }
    };
    ComponentManager.prototype.getComponentsByType = function (type) {
        var components = this._componentsByType.get(type.getIndex());
        if (components == null) {
            components = new Bag();
            this._componentsByType.set(type.getIndex(), components);
        }
        return components;
    };
    ComponentManager.prototype.getComponent = function (e, type) {
        var components = this._componentsByType.get(type.getIndex());
        if (components != null) {
            return components.get(e.getId());
        }
        return null;
    };
    ComponentManager.prototype.getComponentsFor = function (e, fillBag) {
        var componentBits = e.getComponentBits();
        for (var i = componentBits.nextSetBit(0); i >= 0; i = componentBits.nextSetBit(i + 1)) {
            fillBag.add(this._componentsByType.get(i).get(e.getId()));
        }
        return fillBag;
    };
    ComponentManager.prototype.deleted = function (e) {
        this._deleted.add(e);
    };
    ComponentManager.prototype.clean = function () {
        if (this._deleted.size() > 0) {
            for (var i = 0; this._deleted.size() > i; i++) {
                this.removeComponentsOfEntity(this._deleted.get(i));
            }
            this._deleted.clear();
        }
    };
    return ComponentManager;
})(Manager);
/// <reference path="../EntitySystem.ts" />
/// <reference path="../Entity.ts" />
/// <reference path="../Aspect.ts" />
var EntityProcessingSystem = (function (_super) {
    __extends(EntityProcessingSystem, _super);
    function EntityProcessingSystem(aspect) {
        _super.call(this, aspect);
    }
    EntityProcessingSystem.prototype.process = function (e) {
        throw new Error('abstract function called');
    };
    EntityProcessingSystem.prototype.processEntities = function (entities) {
        for (var i = 0, s = entities.size(); s > i; i++) {
            this.process(entities.get(i));
        }
    };
    EntityProcessingSystem.prototype.checkProcessing = function () {
        return true;
    };
    return EntityProcessingSystem;
})(EntitySystem);
//# sourceMappingURL=artemis.js.map