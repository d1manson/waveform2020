(function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s="8413")})({8413:function(e,t,n){"use strict";n.r(t);const r=Symbol("Comlink.proxy"),o=Symbol("Comlink.endpoint"),a=Symbol("Comlink.releaseProxy"),s=Symbol("Comlink.thrown"),i=e=>"object"===typeof e&&null!==e||"function"===typeof e,c={canHandle:e=>i(e)&&e[r],serialize(e){const{port1:t,port2:n}=new MessageChannel;return f(e,t),[n,[n]]},deserialize(e){return e.start(),p(e)}},u={canHandle:e=>i(e)&&s in e,serialize({value:e}){let t;return t=e instanceof Error?{isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:{isError:!1,value:e},[t,[]]},deserialize(e){if(e.isError)throw Object.assign(new Error(e.value.message),e.value);throw e.value}},l=new Map([["proxy",c],["throw",u]]);function f(e,t=self){t.addEventListener("message",(function n(r){if(!r||!r.data)return;const{id:o,type:a,path:i}=Object.assign({path:[]},r.data),c=(r.data.argumentList||[]).map(E);let u;try{const t=i.slice(0,-1).reduce((e,t)=>e[t],e),n=i.reduce((e,t)=>e[t],e);switch(a){case 0:u=n;break;case 1:t[i.slice(-1)[0]]=E(r.data.value),u=!0;break;case 2:u=n.apply(t,c);break;case 3:{const e=new n(...c);u=w(e)}break;case 4:{const{port1:t,port2:n}=new MessageChannel;f(e,n),u=y(t,[t])}break;case 5:u=void 0;break}}catch(l){u={value:l,[s]:0}}Promise.resolve(u).catch(e=>({value:e,[s]:0})).then(e=>{const[r,s]=A(e);t.postMessage(Object.assign(Object.assign({},r),{id:o}),s),5===a&&(t.removeEventListener("message",n),m(t))})})),t.start&&t.start()}function d(e){return"MessagePort"===e.constructor.name}function m(e){d(e)&&e.close()}function p(e,t){return h(e,[],t)}function g(e){if(e)throw new Error("Proxy has been released and is not useable")}function h(e,t=[],n=function(){}){let r=!1;const s=new Proxy(n,{get(n,o){if(g(r),o===a)return()=>S(e,{type:5,path:t.map(e=>e.toString())}).then(()=>{m(e),r=!0});if("then"===o){if(0===t.length)return{then:()=>s};const n=S(e,{type:0,path:t.map(e=>e.toString())}).then(E);return n.then.bind(n)}return h(e,[...t,o])},set(n,o,a){g(r);const[s,i]=A(a);return S(e,{type:1,path:[...t,o].map(e=>e.toString()),value:s},i).then(E)},apply(n,a,s){g(r);const i=t[t.length-1];if(i===o)return S(e,{type:4}).then(E);if("bind"===i)return h(e,t.slice(0,-1));const[c,u]=_(s);return S(e,{type:2,path:t.map(e=>e.toString()),argumentList:c},u).then(E)},construct(n,o){g(r);const[a,s]=_(o);return S(e,{type:3,path:t.map(e=>e.toString()),argumentList:a},s).then(E)}});return s}function b(e){return Array.prototype.concat.apply([],e)}function _(e){const t=e.map(A);return[t.map(e=>e[0]),b(t.map(e=>e[1]))]}const v=new WeakMap;function y(e,t){return v.set(e,t),e}function w(e){return Object.assign(e,{[r]:!0})}function A(e){for(const[t,n]of l)if(n.canHandle(e)){const[r,o]=n.serialize(e);return[{type:3,name:t,value:r},o]}return[{type:0,value:e},v.get(e)||[]]}function E(e){switch(e.type){case 3:return l.get(e.name).deserialize(e.value);case 0:return e.value}}function S(e,t,n){return new Promise(r=>{const o=R();e.addEventListener("message",(function t(n){n.data&&n.data.id&&n.data.id===o&&(e.removeEventListener("message",t),r(n.data))})),e.start&&e.start(),e.postMessage(Object.assign({id:o},t),n)})}function R(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}var x=n("a90c"),P=n.n(x);const T="#version 300 es\nin lowp vec2 a_wave_data;\nin vec2 a_cut_data;\n\nvoid main() {  \n  gl_Position = vec4(float(gl_InstanceID%54 + gl_VertexID)/60. -1. + float(a_cut_data[0]), float(a_wave_data[gl_VertexID]) -0.5+ a_cut_data[1], 0.0, 1.0);\n}\n",M="#version 300 es\nprecision highp float;\nuniform vec4 u_color;\nout vec4 outColor;\n\nvoid main() {\n  outColor = u_color;\n}\n";function F(e,t,n,r){const o=e.getContext("webgl2"),a=P.a.createProgramFromSources(o,[T,M],null,null,e=>console.dir(e));o.viewport(0,0,400,400),o.useProgram(a);const s=o.getAttribLocation(a,"a_wave_data"),i=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,i),o.bufferData(o.ARRAY_BUFFER,t,o.STATIC_DRAW),o.enableVertexAttribArray(s),o.vertexAttribPointer(s,2,o.BYTE,!0,1,0),o.vertexAttribDivisor(s,1);const c=o.getAttribLocation(a,"a_cut_data"),u=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,u),o.bufferData(o.ARRAY_BUFFER,n,o.STATIC_DRAW),o.enableVertexAttribArray(c),o.vertexAttribPointer(c,2,o.FLOAT,!1,0,0),o.vertexAttribDivisor(c,54);const l=o.getUniformLocation(a,"u_color");o.uniform4fv(l,[1,0,0,1]),o.drawArraysInstanced(o.LINES,0,2,54*r)}var j=F,D=function(e){return new Promise((t,n)=>{const r=new FileReader;r.onload=()=>t(r.result),r.readAsArrayBuffer(e)})},O=async function(e){const t=await D(e),n=new TextDecoder("utf-8").decode(t.slice(0,1205)),r=n.match(/\r\ndata_start/);if(!r)throw"did not find end of header in tet file.";const o=r[0].index+r[0].length;return{header:"TODO: parse header",body:new Int8Array(t.slice(o,-10))}};const k=new Map,I={};let L,C=(e,t)=>null;function B(e){const t=e.name.match(/(.*)(_\d+\.cut|\.set|\.pos|\.\d+)$/);if(!t)return;k.set(e.name,e);const[n,r,o]=t;let a=I[r];if(a||(a={name:r,date:0,set_file:null,pos_file:null,tetrodes:[]},I[r]=a),".set"===o)a.set_file={name:e.name,short:"~.set"},a.date=e.lastModified;else if(".pos"===o)a.pos_file={name:e.name,short:"~.pos"};else{const t=o.match(/\d+/),n=parseInt(t[0]);let r=a.tetrodes[n];r||(r={tet_file:null,cut_files:[],num:n},a.tetrodes[n]=r),o.match(/cut/)?r.cut_files.push({name:e.name,short:"~.cut"}):r.tet_file={name:e.name,short:"~."+n}}}async function H(e){const{header:t,body:n}=await O(e);j(L,n,$(1e3),1e3)}function $(e){const t=new Float32Array(2*e);for(let n=0;n<e;n++)t[2*n+0]=n%2,t[2*n+1]=(2&n)>>1;return t}f({addFiles(e){e.forEach(e=>{k.set(e.name,e),B(e)}),C("update:organised-files",Object.values(I).sort((e,t)=>e.name>t.name?1:-1))},setTriggerFunction(e){C=e},useTileWallCanvas(e){L=e},render({experiment_name:e,tet_num:t}){const n=I[e].tetrodes[t].tet_file.name,r=k.get(n);H(r)}})},a90c:function(e,t){const n=this;function r(e){return e=e||n,e!==e.top}function o(e){n.console&&(n.console.error?n.console.error(e):n.console.log&&n.console.log(e))}r()||(console.log("%c%s","color:blue;font-weight:bold;","for more about webgl-utils.js see:"),console.log("%c%s","color:blue;font-weight:bold;","http://webgl2fundamentals.org/webgl/lessons/webgl-boilerplate.html"));const a=/ERROR:\s*\d+:(\d+)/gi;function s(e,t=""){const n=[...t.matchAll(a)],r=new Map(n.map((e,r)=>{const o=parseInt(e[1]),a=n[r+1],s=a?a.index:t.length,i=t.substring(e.index,s);return[o-1,i]}));return e.split("\n").map((e,t)=>{const n=r.get(t);return`${t+1}: ${e}${n?"\n\n^^^ "+n:""}`}).join("\n")}function i(e,t,n,r){const a=r||o,i=e.createShader(n);e.shaderSource(i,t),e.compileShader(i);const c=e.getShaderParameter(i,e.COMPILE_STATUS);if(!c){const n=e.getShaderInfoLog(i);return a(`Error compiling shader: ${n}\n${s(t,n)}`),e.deleteShader(i),null}return i}function c(e,t,n,r,a){const i=a||o,c=e.createProgram();t.forEach((function(t){e.attachShader(c,t)})),n&&n.forEach((function(t,n){e.bindAttribLocation(c,r?r[n]:n,t)})),e.linkProgram(c);const u=e.getProgramParameter(c,e.LINK_STATUS);if(!u){const n=e.getProgramInfoLog(c);return i(`Error in program linking: ${n}\n${t.map(t=>{const n=s(e.getShaderSource(t)),r=e.getShaderParameter(t,e.SHADER_TYPE);return`${e.enumToString(e,r)}:\n${n}`}).join("\n")}`),e.deleteProgram(c),null}return c}function u(e,t,n,r){let o,a="";const s=document.getElementById(t);if(!s)throw"*** Error: unknown script element"+t;if(a=s.text,!n)if("x-shader/x-vertex"===s.type)o=e.VERTEX_SHADER;else if("x-shader/x-fragment"===s.type)o=e.FRAGMENT_SHADER;else if(o!==e.VERTEX_SHADER&&o!==e.FRAGMENT_SHADER)throw"*** Error: unknown shader type";return i(e,a,n||o,r)}const l=["VERTEX_SHADER","FRAGMENT_SHADER"];function f(e,t,n,r,o){const a=[];for(let s=0;s<t.length;++s)a.push(u(e,t[s],e[l[s]],o));return c(e,a,n,r,o)}function d(e,t,n,r,o){const a=[];for(let s=0;s<t.length;++s)a.push(i(e,t[s],e[l[s]],o));return c(e,a,n,r,o)}function m(e,t){t=t||1;const n=e.clientWidth*t|0,r=e.clientHeight*t|0;return(e.width!==n||e.height!==r)&&(e.width=n,e.height=r,!0)}e.exports={createProgram:c,createProgramFromScripts:f,createProgramFromSources:d,resizeCanvasToDisplaySize:m}}});
//# sourceMappingURL=0.d116776e.worker.js.map