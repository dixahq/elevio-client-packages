# client-packages

This repository contains all the packages to install [Elev.io](https://elev.io/) into your site using an npm package.
Currently there are two packages, one that gives you imperative functions to call and the other is a React integration.

You can See documentation of all methods available here: [https://api-docs.elevio.help/en/articles/89-how-to-install-elevio-via-npm](https://api-docs.elevio.help/en/articles/89-how-to-install-elevio-via-npm)

## Usage

### Npm module

Install the package with

```
npm i elevio
```

### Normal api usage (non-React)

Then you can pull in the Elevio package

```js
import Elevio from 'elevio/lib/client';
```

or

```js
import { client as Elevio } from 'elevio';
```

Then make sure before you call any other functions you call the `load` function and pass in your account id (see the [installation](https://app.elev.io/installation) page to get our account id). This loads the Elevio javascript and sets up the javascript ready to use.

**_NOTE_**
You are free to use the `on` function to setup any event listens at any time you like, so you don't have to wait for the `load` function to complete before calling that.

```js
Elevio.load('my-account-id').then(() => {
  console.log('Elevio has loaded, ready to use!');
});
```

Then you are free to call any functions you like, so if you want to open the assistant you can do this

```js
Elevio.open();
Elevio.setKeywords(['keyword1', 'keyword2']);
```

To subscribe to events you can use the `on` function, like so

```js
Elevio.on('widget:opened', () => {
  console.log('Elevio has opened!!!');
});

Elevio.on('widget:closed', () => {
  console.log('Elevio has closed!!!');
});
```

#### Angular usage

If you are using Angular it is required to use an NgZone so that Elevio doesn't interfere with Angular's change tracking.

```js
import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-elevio',
  templateUrl: './elevio.component.html',
  styleUrls: []
})
export class ElevioAndGridComponent {
  article: number;

  constructor(private _ngZone: NgZone) { }

  onClick() {
    this._ngZone.runOutsideAngular(() => {
      (window as any)._elev.openArticle(this.article);
    });
  }
}
```

For more details see this article [ngZone.runOutsideAngular](https://medium.com/@krzysztof.grzybek89/how-runoutsideangular-might-reduce-change-detection-calls-in-your-app-6b4dab6e374d).

### React usage

You can view documentation of all available props here [https://api-docs.elevio.help/en/articles/90-how-to-integrate-elevio-into-react](https://api-docs.elevio.help/en/articles/90-how-to-integrate-elevio-into-react)

Import the package

```jsx
import Elevio from 'elevio/lib/react';
```

Then drop the Elevio component into your component hierarchy, making sure you pass the required account id.

```jsx
<div>
  <Elevio accountId="MY_ACCOUNT_ID" />
</div>
```

**_NOTE_**
you can also use a combination of the standard client usage if you want to do something imperative or something that isn't supported by the React wrapper.

## Building

To build these packages first close this repository and then install all the decencies.

```bash
npm i
```

Then you can rebuild all the packages by running the npm script `build`.

```
npm run build
```

This build the Elevio package and puts the build files in the `lib` folder.

## Running examples

First install all dependencies by running `npm install`.

Then fire up the server by running the command `npm run example-server`.
You can then open a browser to [http://localhost:4000](http://localhost:4000) to see an index of the example projects.

## Running tests

Make sure you have all dependencies installed, then run

```bash
  npm run ci
```

or if you want to run Cypress interactively get the example server running and then

```bash
  npx cypress open
```

## Submitting issues / pull requests

If you find an issue or something missing with these packages please feel free to open a ticket. It's helpful if you can describe how the issue is occurring and what your desired outcome is.

## Typescript support

These packages have been built using Typescript and the type definitions are included in the package.

## License

This elevio package is [MIT licensed](./LICENSE).
