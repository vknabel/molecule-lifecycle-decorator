"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReplaySubject_1 = require("rxjs/ReplaySubject");
var Subject_1 = require("rxjs/Subject");
function moleculeLifecycleMapping() {
    return {
        ngOnChanges: [new Subject_1.Subject(), false],
        ngOnInit: [new ReplaySubject_1.ReplaySubject(), true],
        ngDoCheck: [new Subject_1.Subject(), false],
        ngAfterContentInit: [new ReplaySubject_1.ReplaySubject(), true],
        ngAfterContentChecked: [new Subject_1.Subject(), false],
        ngAfterViewInit: [new ReplaySubject_1.ReplaySubject(), true],
        ngAfterViewChecked: [new Subject_1.Subject(), false],
        ngOnDestroy: [new ReplaySubject_1.ReplaySubject(), true],
        ionViewDidLoad: [new ReplaySubject_1.ReplaySubject(), true],
        ionViewWillEnter: [new Subject_1.Subject(), false],
        ionViewDidEnter: [new Subject_1.Subject(), false],
        ionViewWillLeave: [new Subject_1.Subject(), false],
        ionViewDidLeave: [new Subject_1.Subject(), false],
        ionViewWillUnload: [new ReplaySubject_1.ReplaySubject(), true]
    };
}
function patchHookForComponent(component, hook, patch) {
    var initialHook = component[hook] || (function () { return void 0; });
    component[hook] = function (parameter) {
        initialHook(parameter);
        patch(parameter);
    };
}
function once(sideEffect) {
    var hasBeenPatched = false;
    return function () {
        if (!hasBeenPatched) {
            hasBeenPatched = true;
            sideEffect();
        }
    };
}
function MoleculeLifecycle() {
    return function (component) {
        var hookSubjects = moleculeLifecycleMapping();
        var _loop_1 = function (hook) {
            var _a = hookSubjects[hook], subject = _a[0], shallComplete = _a[1];
            var stream = subject.asObservable();
            var overrideHookOnce = once(function () {
                return patchHookForComponent(component.prototype, hook, function (parameter) {
                    subject.next(parameter);
                    if (shallComplete) {
                        subject.complete();
                    }
                });
            });
            Object.defineProperty(component.prototype, hook + "$", {
                get: function () {
                    overrideHookOnce();
                    return stream;
                }
            });
        };
        for (var _i = 0, _a = Object.keys(hookSubjects); _i < _a.length; _i++) {
            var hook = _a[_i];
            _loop_1(hook);
        }
        return component;
    };
}
exports.MoleculeLifecycle = MoleculeLifecycle;
