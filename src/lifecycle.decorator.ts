import { SimpleChanges, Type } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';

export interface AllMoleculeLifecycles {
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

export type OnMoleculeLifecycle = Partial<AllMoleculeLifecycles>;

function moleculeLifecycleMapping(): {
  [hook: string]: [Subject<any>, boolean | undefined];
} {
  return {
    ngOnChanges: [new Subject<SimpleChanges>(), false],
    ngOnInit: [new ReplaySubject<void>(), true],
    ngDoCheck: [new Subject<void>(), false],
    ngAfterContentInit: [new ReplaySubject<void>(), true],
    ngAfterContentChecked: [new Subject<void>(), false],
    ngAfterViewInit: [new ReplaySubject<void>(), true],
    ngAfterViewChecked: [new Subject<void>(), false],
    ngOnDestroy: [new ReplaySubject<void>(), true],

    ionViewDidLoad: [new ReplaySubject<void>(), true],
    ionViewWillEnter: [new Subject<void>(), false],
    ionViewDidEnter: [new Subject<void>(), false],
    ionViewWillLeave: [new Subject<void>(), false],
    ionViewDidLeave: [new Subject<void>(), false],
    ionViewWillUnload: [new ReplaySubject<void>(), true]
  };
}

function patchHookForComponent<T>(
  component: { [hook: string]: (...parameters: any[]) => void },
  hook: string,
  patch: (parameter: any) => void
) {
  const initialHook = component[hook] || (() => void 0);
  component[hook] = (parameter: {}) => {
    initialHook(parameter);
    patch(parameter);
  };
}

function once(sideEffect: () => void): () => void {
  let hasBeenPatched = false;
  return () => {
    if (!hasBeenPatched) {
      hasBeenPatched = true;
      sideEffect();
    }
  };
}

export function MoleculeLifecycle(): <T>(
  component: Type<T>
) => Type<T & AllMoleculeLifecycles> {
  return (component: any) => {
    const hookSubjects = moleculeLifecycleMapping();
    for (const hook of Object.keys(hookSubjects)) {
      const [subject, shallComplete] = hookSubjects[hook];
      const stream = subject.asObservable();
      const overrideHookOnce = once(() =>
        patchHookForComponent(component.prototype, hook, parameter => {
          subject.next(parameter);
          if (shallComplete) {
            subject.complete();
          }
        })
      );
      Object.defineProperty(component.prototype, `${hook}$`, {
        get: () => {
          overrideHookOnce();
          return stream;
        }
      });
    }
    return component;
  };
}
