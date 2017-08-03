# MoleculeLifecycle

[![CircleCI](https://img.shields.io/circleci/project/github/vknabel/molecule-lifecycle-decorator.svg?style=flat-square)](https://circleci.com/gh/vknabel/molecule-lifecycle-decorator)
[![Codecov](https://img.shields.io/codecov/c/github/vknabel/molecule-lifecycle-decorator.svg?style=flat-square)](https://codecov.io/gh/vknabel/molecule-lifecycle-decorator)
[![npm (scoped)](https://img.shields.io/npm/v/@ionic-decorator/molecule-lifecycle-decorator.svg?style=flat-square)](https://www.npmjs.com/package/@molecule/lifecycle-decorator)

The `@MoleculeLifecycle`-Decorator creates rxjs streams for all Angular and Ionic lifecycle hooks.
Hooks will only be overridden when requesting their stream, in order to reduce unnecessary overhead.

```typescript
@MoleculeLifecycle()
@Component({
  template: '{{latestDescription$|async}}'
})
export class YourComponent implements OnMoleculeLifecycle {
  @Input() description: Observable<string> | string;
  readonly latestDescription$: Observable<string>;
  readonly ngOnChanges$: Observable<SimpleChanges>;
  readonly ngOnDestroy$: Observable<void>;

  constructor() {
    this.latestDescription$ = this.ngOnChanges$.pluck('description', 'currentValue')
      .switchMap(newValue => {
        if (newValue instanceof Observable) {
          return <Observable<string>>newValue;
        } else {
          return Observable.of(newValue);
        }
      })
      .takeUntil(this.ngOnDestroy$)
      .subsrcibe();
  }
}
```

## Installation

```bash
$ npm install --save @molecule/lifecycle-decorator
```

## Author

Valentin Knabel, [@vknabel](https://twitter.com/vknabel), dev@vknabel.com

## License

@molecule/lifecycle-decorator is available under the [MIT](LICENSE) license.
