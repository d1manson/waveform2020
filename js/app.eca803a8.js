(function(e){function t(t){for(var n,r,a=t[0],i=t[1],d=t[2],p=0,m=[];p<a.length;p++)r=a[p],Object.prototype.hasOwnProperty.call(s,r)&&s[r]&&m.push(s[r][0]),s[r]=0;for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n]);l&&l(t);while(m.length)m.shift()();return o.push.apply(o,d||[]),c()}function c(){for(var e,t=0;t<o.length;t++){for(var c=o[t],n=!0,a=1;a<c.length;a++){var i=c[a];0!==s[i]&&(n=!1)}n&&(o.splice(t--,1),e=r(r.s=c[0]))}return e}var n={},s={app:0},o=[];function r(t){if(n[t])return n[t].exports;var c=n[t]={i:t,l:!1,exports:{}};return e[t].call(c.exports,c,c.exports,r),c.l=!0,c.exports}r.m=e,r.c=n,r.d=function(e,t,c){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:c})},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var c=Object.create(null);if(r.r(c),Object.defineProperty(c,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(c,n,function(t){return e[t]}.bind(null,n));return c},r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="";var a=this["webpackJsonp"]=this["webpackJsonp"]||[],i=a.push.bind(a);a.push=t,a=a.slice();for(var d=0;d<a.length;d++)t(a[d]);var l=i;o.push([0,"chunk-vendors"]),c()})({0:function(e,t,c){e.exports=c("56d7")},"01ac":function(e,t,c){"use strict";c("9ecc")},"0aa8":function(e,t,c){"use strict";var n=c("3d15");t["a"]=e=>{const t={};return e.setTriggerFunction(n["a"]((e,c)=>{const n=t[e];n&&n.forEach(e=>e(c))})),{data:()=>({worker:e,$_boundWorkerEventHandlers:null}),mounted(){if(this.$options.workerEvents){this.$_boundWorkerEventHandlers={};for(const[e,c]of Object.entries(this.$options.workerEvents)){const n=c.bind(this);this.$_boundWorkerEventHandlers[e]=n,t[e]=t[e]||[],t[e].push(n)}}},unmounted(){if(this.$options.workerEvents)for(const[e,c]of Object.entries(this.$_boundWorkerEventHandlers))t[e]=t[e].filter(e=>e!==c)}}}},"0ee0":function(e,t,c){"use strict";c("f84d")},"17d1":function(e,t,c){"use strict";c("a526")},"3dfd":function(e,t,c){"use strict";var n=c("7a23");const s=Object(n["withScopeId"])("data-v-9e7ba8aa");Object(n["pushScopeId"])("data-v-9e7ba8aa");const o={class:"main"},r=Object(n["createTextVNode"])(" TODO: plot pos data here "),a=Object(n["createTextVNode"])(" TODO: plot clusters here ");Object(n["popScopeId"])();const i=s((e,t,c,i,d,l)=>{const p=Object(n["resolveComponent"])("file-explorer"),m=Object(n["resolveComponent"])("pane"),u=Object(n["resolveComponent"])("splitpanes"),b=Object(n["resolveComponent"])("tile-wall"),h=Object(n["resolveComponent"])("file-drop");return Object(n["openBlock"])(),Object(n["createBlock"])("div",o,[Object(n["createVNode"])(u,{vertical:"",class:"default-theme"},{default:s(()=>[Object(n["createVNode"])(m,{size:"30"},{default:s(()=>[Object(n["createVNode"])(u,{horizontal:"",class:"default-theme"},{default:s(()=>[Object(n["createVNode"])(m,{size:"30"},{default:s(()=>[Object(n["createVNode"])(p)]),_:1}),Object(n["createVNode"])(m,{size:"35"},{default:s(()=>[r]),_:1}),Object(n["createVNode"])(m,{size:"35"},{default:s(()=>[a]),_:1})]),_:1})]),_:1}),Object(n["createVNode"])(m,{size:"70"},{default:s(()=>[Object(n["createVNode"])(b)]),_:1})]),_:1}),Object(n["createVNode"])(h)])}),d=Object(n["withScopeId"])("data-v-723f44f5");Object(n["pushScopeId"])("data-v-723f44f5");const l={key:0,class:"wrapper"},p=Object(n["createVNode"])("div",{class:"background"},[Object(n["createVNode"])("div",{class:"border"})],-1),m=Object(n["createVNode"])("div",{class:"inner-wrapper"},[Object(n["createVNode"])("div",{class:"inner"},[Object(n["createTextVNode"])(" Supported file types: "),Object(n["createVNode"])("ul",null,[Object(n["createVNode"])("li",null,[Object(n["createVNode"])("strong",null,"Axona"),Object(n["createTextVNode"])(" .set, .pos, .cut, and numbered tet files ")])])])],-1);Object(n["popScopeId"])();const u=d((e,t,c,s,o,r)=>e.dragging?(Object(n["openBlock"])(),Object(n["createBlock"])("div",l,[p,m])):Object(n["createCommentVNode"])("",!0));var b={name:"FileDrop",props:{},data:()=>({dragging:!1}),mounted(){window.fd=this,window.document.addEventListener("dragover",this.onDragOver.bind(this)),window.document.addEventListener("drop",this.onDrop.bind(this))},methods:{async onDrop(e){e.preventDefault();const t=e.dataTransfer.items?[...e.dataTransfer.items].filter(e=>"file"===e.kind).map(e=>e.getAsFile()):e.dataTransfer.files;this.dragging=!1,this.worker.addFiles(t)},onDragOver(e){e.preventDefault(),this.dragging=!0,clearTimeout(this._timer),this._timer=setTimeout(()=>this.dragging=!1,500)}}};c("dac0");b.render=u,b.__scopeId="data-v-723f44f5";var h=b;const f=Object(n["withScopeId"])("data-v-3432d3a0");Object(n["pushScopeId"])("data-v-3432d3a0");const O={class:"file-explorer"},j={class:"experiment-list"},v={class:"experiment-top"},w={class:"experiment-bottom"},N={class:"state-info"},g={key:1,class:"empty"},k=Object(n["createVNode"])("h4",null,"File Explorer",-1),x=Object(n["createTextVNode"])(" After dragging files onto the page, they will be listed here. ");Object(n["popScopeId"])();const y=f((e,t,c,s,o,r)=>{const a=Object(n["resolveComponent"])("global-events");return Object(n["openBlock"])(),Object(n["createBlock"])("div",O,[Object(n["createVNode"])(a,{onKeyup:[t[1]||(t[1]=Object(n["withKeys"])(t=>r.switchTo(e.selectedExperimentName,1),["1"])),t[2]||(t[2]=Object(n["withKeys"])(t=>r.switchTo(e.selectedExperimentName,2),["2"])),t[3]||(t[3]=Object(n["withKeys"])(t=>r.switchTo(e.selectedExperimentName,3),["3"])),t[4]||(t[4]=Object(n["withKeys"])(t=>r.switchTo(e.selectedExperimentName,4),["4"])),t[5]||(t[5]=Object(n["withKeys"])(t=>r.switchTo(e.selectedExperimentName,5),["5"])),t[6]||(t[6]=Object(n["withKeys"])(t=>r.switchTo(e.selectedExperimentName,6),["6"])),t[7]||(t[7]=Object(n["withKeys"])(t=>r.switchTo(e.selectedExperimentName,7),["7"])),t[8]||(t[8]=Object(n["withKeys"])(t=>r.switchTo(e.selectedExperimentName,8),["8"])),t[9]||(t[9]=Object(n["withKeys"])(t=>r.switchTo(e.selectedExperimentName,9),["9"])),t[10]||(t[10]=Object(n["withKeys"])(t=>r.switchTo(e.selectedExperimentName,e.selectedTetNum+1),["right"])),t[11]||(t[11]=Object(n["withKeys"])(t=>r.switchTo(e.selectedExperimentName,e.selectedTetNum-1),["left"])),t[12]||(t[12]=Object(n["withKeys"])(t=>r.switchTo(r.getExperimentNameRelative(e.selectedExperimentName,-1)),["up"])),t[13]||(t[13]=Object(n["withKeys"])(t=>r.switchTo(r.getExperimentNameRelative(e.selectedExperimentName,1)),["down"]))]}),e.experiments.length?(Object(n["openBlock"])(),Object(n["createBlock"])(n["Fragment"],{key:0},[Object(n["createVNode"])("div",j,[(Object(n["openBlock"])(!0),Object(n["createBlock"])(n["Fragment"],null,Object(n["renderList"])(e.experiments,t=>(Object(n["openBlock"])(),Object(n["createBlock"])("div",{key:t.name,class:["experiment",{selected:t.name===e.selectedExperimentName}],onClick:e=>r.switchTo(t.name)},[Object(n["createVNode"])("div",v,[Object(n["createVNode"])("div",{class:["experiment-name",{selected:t.name===e.selectedExperimentName}]}," trial '"+Object(n["toDisplayString"])(t.name)+"' ",3),t.set_file?(Object(n["openBlock"])(),Object(n["createBlock"])("div",{key:0,class:["file set-file",{selected:t.name===e.selectedExperimentName}],title:t.set_file.name},Object(n["toDisplayString"])(t.set_file.short),11,["title"])):Object(n["createCommentVNode"])("",!0),t.pos_file?(Object(n["openBlock"])(),Object(n["createBlock"])("div",{key:1,class:["file pos-file",{selected:t.name===e.selectedExperimentName}],title:t.pos_file.name},Object(n["toDisplayString"])(t.pos_file.short),11,["title"])):Object(n["createCommentVNode"])("",!0)]),Object(n["createVNode"])("div",w,[(Object(n["openBlock"])(!0),Object(n["createBlock"])(n["Fragment"],null,Object(n["renderList"])(t.tetrodes.filter(e=>!!e),c=>(Object(n["openBlock"])(),Object(n["createBlock"])("div",{key:c.num,class:"tet-file-group",onClick:Object(n["withModifiers"])(e=>r.switchTo(t.name,c.num),["stop"])},[c.tet_file?(Object(n["openBlock"])(),Object(n["createBlock"])("div",{key:0,class:["file tet-file",{small:e.selectedTetNum!==c.num,selected:e.selectedTetNum===c.num&&e.selectedExperimentName===t.name}],title:c.tet_file.name},Object(n["toDisplayString"])(c.tet_file.short),11,["title"])):Object(n["createCommentVNode"])("",!0),(Object(n["openBlock"])(!0),Object(n["createBlock"])(n["Fragment"],null,Object(n["renderList"])(c.cut_files,s=>(Object(n["openBlock"])(),Object(n["createBlock"])("div",{class:["file cut-file",{small:e.selectedTetNum!==c.num,selected:e.selectedCutName&&e.selectedCutName===s.name}],key:s.name,title:s.name,onClick:Object(n["withModifiers"])(e=>r.switchTo(t.name,c.num,s.name),["stop"])},Object(n["toDisplayString"])(s.short),11,["title","onClick"]))),128))],8,["onClick"]))),128))])],10,["onClick"]))),128))]),Object(n["createVNode"])("div",N," Selected trial '"+Object(n["toDisplayString"])(e.selectedExperimentName)+"', "+Object(n["toDisplayString"])(e.selectedTetNum?"tetrode #"+e.selectedTetNum:"but no tetrode selected")+". ",1)],64)):(Object(n["openBlock"])(),Object(n["createBlock"])("div",g,[k,x]))])});var T=c("7e10"),_={name:"FileExplorer",props:{},components:{GlobalEvents:T["a"]},workerEvents:{"update:organised-files"(e){this.experiments=e}},data:()=>({experiments:[],selectedExperimentName:null,selectedTetNum:null,selectedCutName:null}),mounted(){window.fe=this},methods:{switchTo(e,t,c){if(this.selectedExperimentName=e,this.selectedTetNum=Math.max(1,t)||this.selectedTetNum,this.selectedCutName=c,!this.selectedCutName){const t=this.experiments.find(t=>t.name===e),c=t&&t.tetrodes[this.selectedTetNum];c&&(this.selectedCutName=c.cut_files[0]&&c.cut_files[0].name)}this.worker.render({experiment_name:this.selectedExperimentName,tet_num:this.selectedTetNum,cut_file_name:this.selectedCutName})},getExperimentNameRelative(e,t){const c=this.experiments.findIndex(t=>t.name==e),n=this.experiments[c+t];return n&&n.name||e}},watch:{experiments(){if(this.experiments.length&&!this.selectedExperimentName){const e=this.experiments[0].tetrodes.find(e=>!!e);this.switchTo(this.experiments[0].name,e&&e.num)}}}};c("bdc7");_.render=y,_.__scopeId="data-v-3432d3a0";var E=_,C=c("512e");c("c1ea");const B=Object(n["withScopeId"])("data-v-ad27dc64");Object(n["pushScopeId"])("data-v-ad27dc64");const V={class:"tile-wall"},S=Object(n["createVNode"])("br",null,null,-1),I={ref:"offCanvas",width:"1024",height:"512",style:{position:"absolute",bottom:"0px",right:"0px",opacity:"0.4",border:"1px solid red",width:"512px",height:"256px"}};Object(n["popScopeId"])();const D=B((e,t,c,s,o,r)=>{const a=Object(n["resolveComponent"])("addressable-canvas");return Object(n["openBlock"])(),Object(n["createBlock"])("div",V,[(Object(n["openBlock"])(!0),Object(n["createBlock"])(n["Fragment"],null,Object(n["renderList"])(e.cutGroupCounts,(e,t)=>(Object(n["openBlock"])(),Object(n["createBlock"])("div",{class:"cut-group",key:t},[Object(n["createTextVNode"])(" #"+Object(n["toDisplayString"])(t)+" | n="+Object(n["toDisplayString"])(e)+" ",1),S,Object(n["createVNode"])(a,{width:400,height:128,style:{border:"1px solid #0f0"},id:"waves-"+t,onNew:e=>r.sendCanvasToWorker("waves",t,e)},null,8,["id","onNew"])]))),128)),Object(n["createVNode"])("canvas",I,null,512)])});var F=c("3d15");const K=Object(n["withScopeId"])("data-v-292d1fd0");Object(n["pushScopeId"])("data-v-292d1fd0");const $={class:"canv-wrapper"};Object(n["popScopeId"])();const P=K((e,t,c,s,o,r)=>(Object(n["openBlock"])(),Object(n["createBlock"])("div",$))),W=new Map;var A={name:"AddressableCanvas",emits:["new"],props:{id:{required:!0,type:String},width:{default:64,type:Number},height:{default:64,type:Number}},mounted(){this.$el.appendChild(this.upsertCanvasById(this.id))},methods:{upsertCanvasById(e){let t=W.get(e);if(t){if(t.width!==this.width||t.height!==this.height)throw new Error("AddressableCanvas: changing width/height isn't permitted, but see note at top of component")}else t=document.createElement("canvas"),t.width=this.width,t.height=this.height,this.$emit("new",t),W.set(e,t);return t}},watch:{id(e,t){this.$el.replaceChild(this.upsertCanvasById(e),this.upsertCanvasById(t))}}};c("01ac");A.render=P,A.__scopeId="data-v-292d1fd0";var M=A,z={name:"TileWall",props:{},components:{AddressableCanvas:M},data:()=>({cutGroupCounts:[]}),workerEvents:{"update:cut-counts"(e){this.cutGroupCounts=e},"offscreen-page-rendered"(e){this.$refs.offCanvas.getContext("bitmaprenderer").transferFromImageBitmap(e)}},mounted(){},methods:{sendCanvasToWorker(e,t,c){c=c.transferControlToOffscreen(),this.worker.addCanvasById(e,t,F["b"](c,[c]))}}};c("17d1");z.render=D,z.__scopeId="data-v-ad27dc64";var L=z,G={name:"App",components:{FileDrop:h,FileExplorer:E,Splitpanes:C["Splitpanes"],Pane:C["Pane"],TileWall:L}};c("0ee0");G.render=i,G.__scopeId="data-v-9e7ba8aa";t["a"]=G},"56d7":function(e,t,c){"use strict";c.r(t),function(e){var t=c("7a23"),n=c("3dfd"),s=c("3d15"),o=c("0aa8");const r=s["c"](new Worker(e,void 0)),a=Object(t["createApp"])(n["a"]);a.mixin(Object(o["a"])(r)),a.mount("#app")}.call(this,c("9616"))},9616:function(e,t,c){e.exports=c.p+"js/0.66cdbc72.worker.js"},"9ecc":function(e,t,c){},a09e:function(e,t,c){},a526:function(e,t,c){},af4d:function(e,t,c){},bdc7:function(e,t,c){"use strict";c("af4d")},dac0:function(e,t,c){"use strict";c("a09e")},f84d:function(e,t,c){}});
//# sourceMappingURL=app.eca803a8.js.map