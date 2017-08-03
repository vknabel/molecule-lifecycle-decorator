import { Component, SimpleChanges } from '@angular/core';
import { AllMoleculeLifecycles, MoleculeLifecycle } from './lifecycle.decorator';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/pluck';

function myComponentType(): { new(): AllMoleculeLifecycles; } {
  @MoleculeLifecycle()
  @Component({
    template: ''
  })
  class MyComponent implements AllMoleculeLifecycles {
    readonly ngOnChanges$: Observable<SimpleChanges>;
    readonly ngOnInit$: Observable<void>;
    readonly ngDoCheck$: Observable<void>;
    readonly ngAfterContentInit$: Observable<void>;
    readonly ngAfterContentChecked$: Observable<void>;
    readonly ngAfterViewInit$: Observable<void>;
    readonly ngAfterViewChecked$: Observable<void>;
    readonly ngOnDestroy$: Observable<void>;

    readonly ionViewDidLoad$: Observable<void>;
    readonly ionViewWillEnter$: Observable<void>;
    readonly ionViewDidEnter$: Observable<void>;
    readonly ionViewWillLeave$: Observable<void>;
    readonly ionViewDidLeave$: Observable<void>;
    readonly ionViewWillUnload$: Observable<void>;
  }
  return MyComponent;
}

describe('molecule lifecycle decorator', () => {
  let cut: { new(): AllMoleculeLifecycles; };
  let sut: AllMoleculeLifecycles;

  beforeEach(() => {
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

  function itForHook(hook: string): void {
    it(`#${hook}$ is an observable`, () => {
      expect(sut.ngOnChanges$).toEqual(jasmine.any(Observable));
    });

    it(`#${hook} created as function after first access to #${hook}$`, () => {
      const _ = sut.ngOnChanges$;
      expect((<any>sut).ngOnChanges).toEqual(jasmine.any(Function));
    });

    it(`#${hook}$ not defined on classes`, () => {
      expect((<any>cut).ngOnChanges$).toBeUndefined();
    });

    it(`#${hook} not defined without access to #${hook}$`, () => {
      expect((<any>sut).ngOnChanges).toBeUndefined();
    });

    it(`#${hook}$ emits after calling #${hook}`, done => {
      const hook$ = sut[`${hook}$`];
      hook$.first().do(
        next => expect(next).toEqual('c'),
        error => fail(error),
        () => done()
      ).subscribe();
      sut[hook]('c');
    });
  }
});
