"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var lifecycle_decorator_1 = require("./lifecycle.decorator");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/do");
require("rxjs/add/operator/first");
require("rxjs/add/operator/pluck");
function myComponentType() {
    var MyComponent = (function () {
        function MyComponent() {
        }
        return MyComponent;
    }());
    MyComponent = __decorate([
        lifecycle_decorator_1.MoleculeLifecycle(),
        core_1.Component({
            template: ''
        })
    ], MyComponent);
    return MyComponent;
}
describe('molecule lifecycle decorator', function () {
    var cut;
    var sut;
    beforeEach(function () {
        cut = myComponentType();
        sut = new cut();
    });
    [
        'ngOnChanges',
        'ngOnInit',
        'ngDoCheck',
        'ngAfterContentInit',
        'ngAfterContentChecked',
        'ngAfterViewInit',
        'ngAfterViewChecked',
        'ngOnDestroy',
        'ionViewDidLoad',
        'ionViewWillEnter',
        'ionViewWillLeave',
        'ionViewDidLeave',
        'ionViewWillUnload'
    ].forEach(itForHook);
    function itForHook(hook) {
        it("#" + hook + "$ is an observable", function () {
            expect(sut.ngOnChanges$).toEqual(jasmine.any(Observable_1.Observable));
        });
        it("#" + hook + " created as function after first access to #" + hook + "$", function () {
            var _ = sut.ngOnChanges$;
            expect(sut.ngOnChanges).toEqual(jasmine.any(Function));
        });
        it("#" + hook + "$ not defined on classes", function () {
            expect(cut.ngOnChanges$).toBeUndefined();
        });
        it("#" + hook + " not defined without access to #" + hook + "$", function () {
            expect(sut.ngOnChanges).toBeUndefined();
        });
        it("#" + hook + "$ emits after calling #" + hook, function (done) {
            var hook$ = sut[hook + "$"];
            hook$.first().do(function (next) { return expect(next).toEqual('c'); }, function (error) { return fail(error); }, function () { return done(); }).subscribe();
            sut[hook]('c');
        });
    }
});
