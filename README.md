# waveform2020

See original version [here](https://github.com/d1manson/waveform).

This version is still in early development. The aim is to have it run
in latest Chrome (again, rather than only via Electron), support more
data formats, be faster, and hopefully be easier to maintain and extend.

---

## Development

The code uses Vue3 via the Vue CLI tool. It makes heavy use of WebWorkers,
using the [comlink](https://github.com/GoogleChromeLabs/comlink) library to
aid with main<=>worker thread communication. There's also a custom vue mixin
added to that here (see `worker_vue_mixin.js`). Waveforms are rendered using
WebGL 2.0.

Devloped using node 14.13.0, install dependencies with:

```
npm install
```

During development use this command:

```
npm run serve
```

This hot reloads the bundle, though changes to the worker don't hot reload.

Before pushing to production run this (TODO: setup CI somehow):

```
npm run build
```

## Rough Roadmap

- Get waves rendering with real cut data, in both density and raw colour mode.
- Import pos data, including smoothing.
- Plot spatial and directional ratemaps.
- Plot clusters
- Interactive cutting and "proper" system design (currently code is incredibly rough and POC only).
- support for open ePhys tetrode data
