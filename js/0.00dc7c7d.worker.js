(function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s="8413")})({8413:function(e,t,n){"use strict";n.r(t);const r=Symbol("Comlink.proxy"),o=Symbol("Comlink.endpoint"),a=Symbol("Comlink.releaseProxy"),s=Symbol("Comlink.thrown"),i=e=>"object"===typeof e&&null!==e||"function"===typeof e,c={canHandle:e=>i(e)&&e[r],serialize(e){const{port1:t,port2:n}=new MessageChannel;return g(e,t),[n,[n]]},deserialize(e){return e.start(),f(e)}},l={canHandle:e=>i(e)&&s in e,serialize({value:e}){let t;return t=e instanceof Error?{isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:{isError:!1,value:e},[t,[]]},deserialize(e){if(e.isError)throw Object.assign(new Error(e.value.message),e.value);throw e.value}},u=new Map([["proxy",c],["throw",l]]);function g(e,t=self){t.addEventListener("message",(function n(r){if(!r||!r.data)return;const{id:o,type:a,path:i}=Object.assign({path:[]},r.data),c=(r.data.argumentList||[]).map(S);let l;try{const t=i.slice(0,-1).reduce((e,t)=>e[t],e),n=i.reduce((e,t)=>e[t],e);switch(a){case 0:l=n;break;case 1:t[i.slice(-1)[0]]=S(r.data.value),l=!0;break;case 2:l=n.apply(t,c);break;case 3:{const e=new n(...c);l=y(e)}break;case 4:{const{port1:t,port2:n}=new MessageChannel;g(e,n),l=w(t,[t])}break;case 5:l=void 0;break}}catch(u){l={value:u,[s]:0}}Promise.resolve(l).catch(e=>({value:e,[s]:0})).then(e=>{const[r,s]=x(e);t.postMessage(Object.assign(Object.assign({},r),{id:o}),s),5===a&&(t.removeEventListener("message",n),_(t))})})),t.start&&t.start()}function p(e){return"MessagePort"===e.constructor.name}function _(e){p(e)&&e.close()}function f(e,t){return m(e,[],t)}function d(e){if(e)throw new Error("Proxy has been released and is not useable")}function m(e,t=[],n=function(){}){let r=!1;const s=new Proxy(n,{get(n,o){if(d(r),o===a)return()=>A(e,{type:5,path:t.map(e=>e.toString())}).then(()=>{_(e),r=!0});if("then"===o){if(0===t.length)return{then:()=>s};const n=A(e,{type:0,path:t.map(e=>e.toString())}).then(S);return n.then.bind(n)}return m(e,[...t,o])},set(n,o,a){d(r);const[s,i]=x(a);return A(e,{type:1,path:[...t,o].map(e=>e.toString()),value:s},i).then(S)},apply(n,a,s){d(r);const i=t[t.length-1];if(i===o)return A(e,{type:4}).then(S);if("bind"===i)return m(e,t.slice(0,-1));const[c,l]=v(s);return A(e,{type:2,path:t.map(e=>e.toString()),argumentList:c},l).then(S)},construct(n,o){d(r);const[a,s]=v(o);return A(e,{type:3,path:t.map(e=>e.toString()),argumentList:a},s).then(S)}});return s}function h(e){return Array.prototype.concat.apply([],e)}function v(e){const t=e.map(x);return[t.map(e=>e[0]),h(t.map(e=>e[1]))]}const b=new WeakMap;function w(e,t){return b.set(e,t),e}function y(e){return Object.assign(e,{[r]:!0})}function x(e){for(const[t,n]of u)if(n.canHandle(e)){const[r,o]=n.serialize(e);return[{type:3,name:t,value:r},o]}return[{type:0,value:e},b.get(e)||[]]}function S(e){switch(e.type){case 3:return u.get(e.name).deserialize(e.value);case 0:return e.value}}function A(e,t,n){return new Promise(r=>{const o=E();e.addEventListener("message",(function t(n){n.data&&n.data.id&&n.data.id===o&&(e.removeEventListener("message",t),r(n.data))})),e.start&&e.start(),e.postMessage(Object.assign({id:o},t),n)})}function E(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}var R=n("a90c"),P=n.n(R);let I=(e,t)=>null;function F(e){I=e}function T(e,t,n){I(e,n?w(t,n):t)}const k=4,D=50,M=4,$=1+M,j=D-1,O=$+j,L=1024,C=1024,B=2,U=2,H=2,N=128,z=(j*B+U)*k,V=Math.floor(L/z),Y=Math.floor(C/(N+H)),G=V*Y,W=`#version 300 es\n// see notes on normalizing unsigned/signed data here:\n// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer\n\nin lowp vec2 a_voltage; // values between [-1, 1]\nin vec2 a_group_col_row; // values between [0, 1]\nuniform lowp int u_page;\n\nin lowp float a_group_color; // values between [0, 1]\nflat out lowp float v_group_color;\n\nvoid main() {  \n\n  int segment_within_channel = gl_InstanceID % ${O}; \n\n  // because of the way we've setup our instanced rendinering, the builtin\n  // gl_VertexID variable is either 0 or 1, indicating left or right of line segment.\n  int t_within_channel = (segment_within_channel - ${$} + gl_VertexID);\n  int channel_within_spike = \n    (gl_InstanceID % ${O*k})\n    / ${O};\n\n  // the first 5 line segments are nonsense (so we clip them out):\n  // segment 0: previous_byte -- time_byte_1   (to make this work for first wave we ask that the voltage data to be prefixed with a dummy byte)\n  // segment 1: time_byte_1 -- time_byte_2\n  // segment 2: time_byte_2 -- time_byte_3\n  // segment 3: time_byte_3 -- time_byte_4\n  // segment 4: time_byte_4 -- voltage_samp_1\n  // then it's real line segments:\n  // segment 5: voltage_samp_1 -- voltage_samp_2\n  // segment 6: voltage_samp_2 -- voltage_samp_3\n  // ..\n  // segment 52: voltage_samp_48 -- voltage_samp_49\n  // segment 53: voltage_samp_49 -- voltage_samp_50\n\n  gl_Position = vec4(\n\n    // x coordinate\n    -1. \n    + a_group_col_row.x * 255. * ${z.toFixed(1)} * 2./${L.toFixed(1)} \n    + float(\n        // this bit is in pixel coordinates\n        channel_within_spike * \n          ${j*B+U} + \n        t_within_channel * ${B}\n      ) \n      // convert to [-1,+1] gl coords\n      * 2./${L.toFixed(1)},\n\n    // y coordinate\n    -1. \n     + (a_group_col_row.y *255. - float(u_page) * ${Y.toFixed(1)})\n     * ${(N+H).toFixed(1)} * 2./${C.toFixed(1)}\n     + (\n      // this is [0, 2]\n      a_voltage[gl_VertexID] + 1.\n      ) \n      // convert to [-1, +1] gl coords\n      * ${N.toFixed(1)} /${C.toFixed(1)},\n\n    // depth ..we don't care\n    0.0, // we don't care about depth\n\n    // clip\n    segment_within_channel >= ${$}\n     ? 1.0 : 0.0\n\n    );\n\n    v_group_color = a_group_color ;\n\n}\n`,X="#version 300 es\n\nflat in lowp float v_group_color;\nout lowp vec4 outColor;\n\nvoid main() {\n  outColor = vec4(v_group_color*20.,  sin(v_group_color*100.) ,  sin(v_group_color*150.), 1.);\n}\n",K=new OffscreenCanvas(L,C),q=K.getContext("webgl2"),J=P.a.createProgramFromSources(q,[W,X],null,null,e=>console.dir(e));q.viewport(0,0,L,C),q.useProgram(J);const Q={voltage:q.getAttribLocation(J,"a_voltage"),group_col_row:q.getAttribLocation(J,"a_group_col_row"),group_color:q.getAttribLocation(J,"a_group_color"),page:q.getUniformLocation(J,"u_page")};q.enableVertexAttribArray(Q.voltage),q.enableVertexAttribArray(Q.group_col_row),q.enableVertexAttribArray(Q.group_color);const Z={voltage:q.createBuffer(),group:q.createBuffer()},ee=[];function te(e,t){ee[e]=t.getContext("2d")}function ne(e){const t=e.length,n=new Uint8Array(3*t);for(let r=0;r<t;r++)n[3*r+0]=e[r]%V,n[3*r+1]=e[r]/V|0,n[3*r+2]=e[r];return n}function re(e,t,n){q.bindBuffer(q.ARRAY_BUFFER,Z.voltage),q.bufferData(q.ARRAY_BUFFER,e,q.STATIC_DRAW),q.vertexAttribPointer(Q.voltage,2,q.BYTE,!0,1,0),q.vertexAttribDivisor(Q.voltage,1),q.bindBuffer(q.ARRAY_BUFFER,Z.group),q.bufferData(q.ARRAY_BUFFER,ne(t),q.STATIC_DRAW),q.vertexAttribPointer(Q.group_col_row,2,q.UNSIGNED_BYTE,!0,3,0),q.vertexAttribDivisor(Q.group_col_row,O*k),q.vertexAttribPointer(Q.group_color,1,q.UNSIGNED_BYTE,!0,3,2),q.vertexAttribDivisor(Q.group_color,O*k);const r=Math.ceil(n/G);for(let o=0;o<r;o++){q.uniform1i(Q.page,o),q.drawArraysInstanced(q.LINES,0,2,O*k*t.length);for(let e=o*G;e<Math.min(ee.length,(o+1)*G);e++){const t=e%V,n=(e/V|0)-o*Y;ee[e].clearRect(0,0,z,N),ee[e].drawImage(K,t*z,C-1-n*(N+H)-N,z,N,0,0,z,N)}0}}var oe=function(e){return new Promise((t,n)=>{const r=new FileReader;r.onload=()=>t(r.result),r.readAsArrayBuffer(e)})},ae=async function(e){const t=await oe(e),n=new TextDecoder("utf-8").decode(t.slice(0,1205)),r=n.match(/\r\ndata_start/);if(!r)throw"did not find end of header in tet file.";const o=r.index+r[0].length;return{header:"TODO: parse header",webgl_voltage_data:new Int8Array(t.slice(o-1,-10))}};const se=/n_clusters:\s*(\S*)\s*n_channels:\s*(\S*)\s*n_params:\s*(\S*)\s*times_used_in_Vt:\s*(\S*)\s*(\S*)\s*(\S*)\s*(\S*)/,ie=/Exact_cut_for: ((?:[\s\S](?! spikes:))*[\s\S])\s*spikes: ([0-9]*)/,ce=/([0-9]+)/g;var le=async function(e){const t=await oe(e),n=new TextDecoder("utf-8").decode(t);let r=se.exec(n);const o={};o.n_clusters=parseInt(r[1]),o.n_channels=parseInt(r[2]),o.n_params=parseInt(r[3]),r=ie.exec(n),o.exp=r[1],o.n_spikes=parseInt(r[2]),o.data_start=r.index+r[0].length,o.is_clu=!1;const a=n.slice(o.data_start).match(ce),s=new Uint16Array(a.length),i=new Uint32Array(o.n_clusters);for(let c=0;c<s.length;c++)s[c]=parseInt(a[c]),i[s[c]]++;return{cut:s,header:o,group_counts:i}};const ue=new Map,ge={};function pe(e){const t=e.name.match(/(.*)(_\d+\.cut|\.set|\.pos|\.\d+)$/);if(!t)return;ue.set(e.name,e);const[n,r,o]=t;let a=ge[r];if(a||(a={name:r,date:0,set_file:null,pos_file:null,tetrodes:[]},ge[r]=a),".set"===o)a.set_file={name:e.name,short:"~.set"},a.date=e.lastModified;else if(".pos"===o)a.pos_file={name:e.name,short:"~.pos"};else{const t=o.match(/\d+/),n=parseInt(t[0]);let r=a.tetrodes[n];r||(r={tet_file:null,cut_files:[],num:n},a.tetrodes[n]=r),o.match(/cut/)?r.cut_files.push({name:e.name,short:"~.cut"}):r.tet_file={name:e.name,short:"~."+n}}}async function _e(e,t){const{webgl_voltage_data:n}=await ae(e),{cut:r,group_counts:o}=await le(t);T("update:cut-counts",o),re(n,r,o.length)}g({addFiles(e){e.forEach(e=>{ue.set(e.name,e),pe(e)}),T("update:organised-files",Object.values(ge).sort((e,t)=>e.name>t.name?1:-1))},setTriggerFunction:F,addCanvasById(e,t,n){"waves"===e&&te(t,n)},render({experiment_name:e,tet_num:t,cut_file_name:n}){const r=ge[e].tetrodes[t].tet_file.name,o=ue.get(r),a=ue.get(n);_e(o,a)}})},a90c:function(e,t){const n=this;function r(e){return e=e||n,e!==e.top}function o(e){n.console&&(n.console.error?n.console.error(e):n.console.log&&n.console.log(e))}r()||(console.log("%c%s","color:blue;font-weight:bold;","for more about webgl-utils.js see:"),console.log("%c%s","color:blue;font-weight:bold;","http://webgl2fundamentals.org/webgl/lessons/webgl-boilerplate.html"));const a=/ERROR:\s*\d+:(\d+)/gi;function s(e,t=""){const n=[...t.matchAll(a)],r=new Map(n.map((e,r)=>{const o=parseInt(e[1]),a=n[r+1],s=a?a.index:t.length,i=t.substring(e.index,s);return[o-1,i]}));return e.split("\n").map((e,t)=>{const n=r.get(t);return`${t+1}: ${e}${n?"\n\n^^^ "+n:""}`}).join("\n")}function i(e,t,n,r){const a=r||o,i=e.createShader(n);e.shaderSource(i,t),e.compileShader(i);const c=e.getShaderParameter(i,e.COMPILE_STATUS);if(!c){const n=e.getShaderInfoLog(i);return a(`Error compiling shader: ${n}\n${s(t,n)}`),e.deleteShader(i),null}return i}function c(e,t,n,r,a){const i=a||o,c=e.createProgram();t.forEach((function(t){e.attachShader(c,t)})),n&&n.forEach((function(t,n){e.bindAttribLocation(c,r?r[n]:n,t)})),e.linkProgram(c);const l=e.getProgramParameter(c,e.LINK_STATUS);if(!l){const n=e.getProgramInfoLog(c);return i(`Error in program linking: ${n}\n${t.map(t=>{const n=s(e.getShaderSource(t));e.getShaderParameter(t,e.SHADER_TYPE);return n}).join("\n")}`),e.deleteProgram(c),null}return c}function l(e,t,n,r){let o,a="";const s=document.getElementById(t);if(!s)throw"*** Error: unknown script element"+t;if(a=s.text,!n)if("x-shader/x-vertex"===s.type)o=e.VERTEX_SHADER;else if("x-shader/x-fragment"===s.type)o=e.FRAGMENT_SHADER;else if(o!==e.VERTEX_SHADER&&o!==e.FRAGMENT_SHADER)throw"*** Error: unknown shader type";return i(e,a,n||o,r)}const u=["VERTEX_SHADER","FRAGMENT_SHADER"];function g(e,t,n,r,o){const a=[];for(let s=0;s<t.length;++s)a.push(l(e,t[s],e[u[s]],o));return c(e,a,n,r,o)}function p(e,t,n,r,o){const a=[];for(let s=0;s<t.length;++s)a.push(i(e,t[s],e[u[s]],o));return c(e,a,n,r,o)}function _(e,t){t=t||1;const n=e.clientWidth*t|0,r=e.clientHeight*t|0;return(e.width!==n||e.height!==r)&&(e.width=n,e.height=r,!0)}e.exports={createProgram:c,createProgramFromScripts:g,createProgramFromSources:p,resizeCanvasToDisplaySize:_}}});
//# sourceMappingURL=0.00dc7c7d.worker.js.map