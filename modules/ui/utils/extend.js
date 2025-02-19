export function extendClass(clazz, overrides) {
    for (const funcName of Object.getOwnPropertyNames(overrides)) {
        const func = overrides[funcName];
        const orig = clazz.prototype[funcName];
        clazz.prototype[funcName] = function (...args) {
            return func.call(this, {
                super: (...args) => orig?.call(this, ...args),
            }, ...args);
        };
    }
}

export function extendModel(model, overrides) {
    extendClass(model.constructor, overrides);
}
