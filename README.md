# waveform2020

wasm/rust/webgl GUI for exploring/managing ephys data

--

I installed wasm-pack with:

```
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

---

To build wasm do:

```
wasm-pack build
```

Note that this builds into the `/wasm/pkg` directory, which is then linked to from within the `js/package.json` file by
relative path reference, though you need to run `npm i` in the `js` directory to setup the symkink.
