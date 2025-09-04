import{B as G,D as Y,i as b,r as E,a as $,x as f,n as q,F as V,o as U,e as X}from"./core-f8568c15.js";import{a_ as a}from"./index-e2bdff38.js";const w={getSpacingStyles(e,t){if(Array.isArray(e))return e[t]?`var(--wui-spacing-${e[t]})`:void 0;if(typeof e=="string")return`var(--wui-spacing-${e})`},getFormattedDate(e){return new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}).format(e)},getHostName(e){try{return new URL(e).hostname}catch{return""}},getTruncateString({string:e,charsStart:t,charsEnd:i,truncate:r}){return e.length<=t+i?e:r==="end"?`${e.substring(0,t)}...`:r==="start"?`...${e.substring(e.length-i)}`:`${e.substring(0,Math.floor(t))}...${e.substring(e.length-Math.floor(i))}`},generateAvatarColors(e){const i=e.toLowerCase().replace(/^0x/iu,"").replace(/[^a-f0-9]/gu,"").substring(0,6).padEnd(6,"0"),r=this.hexToRgb(i),n=getComputedStyle(document.documentElement).getPropertyValue("--w3m-border-radius-master"),s=100-3*Number(n==null?void 0:n.replace("px","")),c=`${s}% ${s}% at 65% 40%`,u=[];for(let p=0;p<5;p+=1){const g=this.tintColor(r,.15*p);u.push(`rgb(${g[0]}, ${g[1]}, ${g[2]})`)}return`
    --local-color-1: ${u[0]};
    --local-color-2: ${u[1]};
    --local-color-3: ${u[2]};
    --local-color-4: ${u[3]};
    --local-color-5: ${u[4]};
    --local-radial-circle: ${c}
   `},hexToRgb(e){const t=parseInt(e,16),i=t>>16&255,r=t>>8&255,n=t&255;return[i,r,n]},tintColor(e,t){const[i,r,n]=e,o=Math.round(i+(255-i)*t),s=Math.round(r+(255-r)*t),c=Math.round(n+(255-n)*t);return[o,s,c]},isNumber(e){return{number:/^[0-9]+$/u}.number.test(e)},getColorTheme(e){var t;return e||(typeof window<"u"&&window.matchMedia?(t=window.matchMedia("(prefers-color-scheme: dark)"))!=null&&t.matches?"dark":"light":"dark")},splitBalance(e){const t=e.split(".");return t.length===2?[t[0],t[1]]:["0","00"]},roundNumber(e,t,i){return e.toString().length>=t?Number(e).toFixed(i):e},formatNumberToLocalString(e,t=2){return e===void 0?"0.00":typeof e=="number"?e.toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t}):parseFloat(e).toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t})}};function K(e,t){const{kind:i,elements:r}=t;return{kind:i,elements:r,finisher(n){customElements.get(e)||customElements.define(e,n)}}}function Z(e,t){return customElements.get(e)||customElements.define(e,t),t}function T(e){return function(i){return typeof i=="function"?Z(e,i):K(e,i)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Q={attribute:!0,type:String,converter:G,reflect:!1,hasChanged:Y},J=(e=Q,t,i)=>{const{kind:r,metadata:n}=i;let o=globalThis.litPropertyMetadata.get(n);if(o===void 0&&globalThis.litPropertyMetadata.set(n,o=new Map),r==="setter"&&((e=Object.create(e)).wrapped=!0),o.set(i.name,e),r==="accessor"){const{name:s}=i;return{set(c){const u=t.get.call(this);t.set.call(this,c),this.requestUpdate(s,u,e)},init(c){return c!==void 0&&this.C(s,void 0,e,c),c}}}if(r==="setter"){const{name:s}=i;return function(c){const u=this[s];t.call(this,c),this.requestUpdate(s,u,e)}}throw Error("Unsupported decorator location: "+r)};function l(e){return(t,i)=>typeof i=="object"?J(e,t,i):((r,n,o)=>{const s=n.hasOwnProperty(o);return n.constructor.createProperty(o,r),s?Object.getOwnPropertyDescriptor(n,o):void 0})(e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Et(e){return l({...e,state:!0,attribute:!1})}const tt=b`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
  }
`;var _=globalThis&&globalThis.__decorate||function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o};let d=class extends ${render(){return this.style.cssText=`
      flex-direction: ${this.flexDirection};
      flex-wrap: ${this.flexWrap};
      flex-basis: ${this.flexBasis};
      flex-grow: ${this.flexGrow};
      flex-shrink: ${this.flexShrink};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};
      padding-top: ${this.padding&&w.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&w.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&w.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&w.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&w.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&w.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&w.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&w.getSpacingStyles(this.margin,3)};
    `,f`<slot></slot>`}};d.styles=[E,tt];_([l()],d.prototype,"flexDirection",void 0);_([l()],d.prototype,"flexWrap",void 0);_([l()],d.prototype,"flexBasis",void 0);_([l()],d.prototype,"flexGrow",void 0);_([l()],d.prototype,"flexShrink",void 0);_([l()],d.prototype,"alignItems",void 0);_([l()],d.prototype,"justifyContent",void 0);_([l()],d.prototype,"columnGap",void 0);_([l()],d.prototype,"rowGap",void 0);_([l()],d.prototype,"gap",void 0);_([l()],d.prototype,"padding",void 0);_([l()],d.prototype,"margin",void 0);d=_([T("wui-flex")],d);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=e=>e??q;/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const et=e=>e===null||typeof e!="object"&&typeof e!="function",it=e=>e.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const W={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},H=e=>(...t)=>({_$litDirective$:e,values:t});let N=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,i,r){this._$Ct=t,this._$AM=i,this._$Ci=r}_$AS(t,i){return this.update(t,i)}update(t,i){return this.render(...i)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const x=(e,t)=>{var r;const i=e._$AN;if(i===void 0)return!1;for(const n of i)(r=n._$AO)==null||r.call(n,t,!1),x(n,t);return!0},I=e=>{let t,i;do{if((t=e._$AM)===void 0)break;i=t._$AN,i.delete(e),e=t}while((i==null?void 0:i.size)===0)},F=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),at(t)}};function ot(e){this._$AN!==void 0?(I(this),this._$AM=e,F(this)):this._$AM=e}function rt(e,t=!1,i=0){const r=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(t)if(Array.isArray(r))for(let o=i;o<r.length;o++)x(r[o],!1),I(r[o]);else r!=null&&(x(r,!1),I(r));else x(this,e)}const at=e=>{e.type==W.CHILD&&(e._$AP??(e._$AP=rt),e._$AQ??(e._$AQ=ot))};class nt extends N{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,r){super._$AT(t,i,r),F(this),this.isConnected=t._$AU}_$AO(t,i=!0){var r,n;t!==this.isConnected&&(this.isConnected=t,t?(r=this.reconnected)==null||r.call(this):(n=this.disconnected)==null||n.call(this)),i&&(x(this,t),I(this))}setValue(t){if(it(this._$Ct))this._$Ct._$AI(t,this);else{const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class st{constructor(t){this.G=t}disconnect(){this.G=void 0}reconnect(t){this.G=t}deref(){return this.G}}class ct{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??(this.Y=new Promise(t=>this.Z=t))}resume(){var t;(t=this.Z)==null||t.call(this),this.Y=this.Z=void 0}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const j=e=>!et(e)&&typeof e.then=="function",B=1073741823;class lt extends nt{constructor(){super(...arguments),this._$Cwt=B,this._$Cbt=[],this._$CK=new st(this),this._$CX=new ct}render(...t){return t.find(i=>!j(i))??V}update(t,i){const r=this._$Cbt;let n=r.length;this._$Cbt=i;const o=this._$CK,s=this._$CX;this.isConnected||this.disconnected();for(let c=0;c<i.length&&!(c>this._$Cwt);c++){const u=i[c];if(!j(u))return this._$Cwt=c,u;c<n&&u===r[c]||(this._$Cwt=B,n=0,Promise.resolve(u).then(async p=>{for(;s.get();)await s.get();const g=o.deref();if(g!==void 0){const D=g._$Cbt.indexOf(u);D>-1&&D<g._$Cwt&&(g._$Cwt=D,g.setValue(p))}}))}return V}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}}const ut=H(lt);class dt{constructor(){this.cache=new Map}set(t,i){this.cache.set(t,i)}get(t){return this.cache.get(t)}has(t){return this.cache.has(t)}delete(t){this.cache.delete(t)}clear(){this.cache.clear()}}const C=new dt,_t=b`
  :host {
    display: flex;
    aspect-ratio: var(--local-aspect-ratio);
    color: var(--local-color);
    width: var(--local-width);
  }

  svg {
    width: inherit;
    height: inherit;
    object-fit: contain;
    object-position: center;
  }

  .fallback {
    width: var(--local-width);
    height: var(--local-height);
  }
`;var P=globalThis&&globalThis.__decorate||function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o};const M={add:async()=>(await a(()=>import("./add-5355a7e5.js"),["assets/add-5355a7e5.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).addSvg,allWallets:async()=>(await a(()=>import("./all-wallets-816746b0.js"),["assets/all-wallets-816746b0.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).allWalletsSvg,arrowBottomCircle:async()=>(await a(()=>import("./arrow-bottom-circle-9158c3ef.js"),["assets/arrow-bottom-circle-9158c3ef.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).arrowBottomCircleSvg,appStore:async()=>(await a(()=>import("./app-store-0cd6be9c.js"),["assets/app-store-0cd6be9c.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).appStoreSvg,apple:async()=>(await a(()=>import("./apple-67b66471.js"),["assets/apple-67b66471.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).appleSvg,arrowBottom:async()=>(await a(()=>import("./arrow-bottom-0da10176.js"),["assets/arrow-bottom-0da10176.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).arrowBottomSvg,arrowLeft:async()=>(await a(()=>import("./arrow-left-8b931e78.js"),["assets/arrow-left-8b931e78.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).arrowLeftSvg,arrowRight:async()=>(await a(()=>import("./arrow-right-8988242b.js"),["assets/arrow-right-8988242b.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).arrowRightSvg,arrowTop:async()=>(await a(()=>import("./arrow-top-941ade5c.js"),["assets/arrow-top-941ade5c.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).arrowTopSvg,bank:async()=>(await a(()=>import("./bank-853315f9.js"),["assets/bank-853315f9.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).bankSvg,browser:async()=>(await a(()=>import("./browser-5afe95be.js"),["assets/browser-5afe95be.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).browserSvg,card:async()=>(await a(()=>import("./card-a54d30b5.js"),["assets/card-a54d30b5.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).cardSvg,checkmark:async()=>(await a(()=>import("./checkmark-08986e41.js"),["assets/checkmark-08986e41.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).checkmarkSvg,checkmarkBold:async()=>(await a(()=>import("./checkmark-bold-cbee20a8.js"),["assets/checkmark-bold-cbee20a8.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).checkmarkBoldSvg,chevronBottom:async()=>(await a(()=>import("./chevron-bottom-7e2e689a.js"),["assets/chevron-bottom-7e2e689a.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).chevronBottomSvg,chevronLeft:async()=>(await a(()=>import("./chevron-left-a2efe330.js"),["assets/chevron-left-a2efe330.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).chevronLeftSvg,chevronRight:async()=>(await a(()=>import("./chevron-right-9a0e9e55.js"),["assets/chevron-right-9a0e9e55.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).chevronRightSvg,chevronTop:async()=>(await a(()=>import("./chevron-top-f35b6b0d.js"),["assets/chevron-top-f35b6b0d.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).chevronTopSvg,chromeStore:async()=>(await a(()=>import("./chrome-store-49d62b35.js"),["assets/chrome-store-49d62b35.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).chromeStoreSvg,clock:async()=>(await a(()=>import("./clock-b91570d2.js"),["assets/clock-b91570d2.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).clockSvg,close:async()=>(await a(()=>import("./close-07665a9f.js"),["assets/close-07665a9f.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).closeSvg,compass:async()=>(await a(()=>import("./compass-1f43dce1.js"),["assets/compass-1f43dce1.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).compassSvg,coinPlaceholder:async()=>(await a(()=>import("./coinPlaceholder-f235c423.js"),["assets/coinPlaceholder-f235c423.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).coinPlaceholderSvg,copy:async()=>(await a(()=>import("./copy-61e9a2ab.js"),["assets/copy-61e9a2ab.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).copySvg,cursor:async()=>(await a(()=>import("./cursor-a7e6e1ad.js"),["assets/cursor-a7e6e1ad.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).cursorSvg,cursorTransparent:async()=>(await a(()=>import("./cursor-transparent-adf3fc27.js"),["assets/cursor-transparent-adf3fc27.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).cursorTransparentSvg,desktop:async()=>(await a(()=>import("./desktop-aaa00eff.js"),["assets/desktop-aaa00eff.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).desktopSvg,disconnect:async()=>(await a(()=>import("./disconnect-d5d0a4fc.js"),["assets/disconnect-d5d0a4fc.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).disconnectSvg,discord:async()=>(await a(()=>import("./discord-4a491c89.js"),["assets/discord-4a491c89.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).discordSvg,etherscan:async()=>(await a(()=>import("./etherscan-5dba0a5f.js"),["assets/etherscan-5dba0a5f.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).etherscanSvg,extension:async()=>(await a(()=>import("./extension-e265acdb.js"),["assets/extension-e265acdb.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).extensionSvg,externalLink:async()=>(await a(()=>import("./external-link-c7a469b7.js"),["assets/external-link-c7a469b7.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).externalLinkSvg,facebook:async()=>(await a(()=>import("./facebook-3ce875ba.js"),["assets/facebook-3ce875ba.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).facebookSvg,farcaster:async()=>(await a(()=>import("./farcaster-d2d02292.js"),["assets/farcaster-d2d02292.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).farcasterSvg,filters:async()=>(await a(()=>import("./filters-881ffd68.js"),["assets/filters-881ffd68.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).filtersSvg,github:async()=>(await a(()=>import("./github-33f437f8.js"),["assets/github-33f437f8.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).githubSvg,google:async()=>(await a(()=>import("./google-af2df5ba.js"),["assets/google-af2df5ba.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).googleSvg,helpCircle:async()=>(await a(()=>import("./help-circle-9520beca.js"),["assets/help-circle-9520beca.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).helpCircleSvg,image:async()=>(await a(()=>import("./image-9292a4eb.js"),["assets/image-9292a4eb.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).imageSvg,id:async()=>(await a(()=>import("./id-9e9e6d03.js"),["assets/id-9e9e6d03.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).idSvg,infoCircle:async()=>(await a(()=>import("./info-circle-f273303e.js"),["assets/info-circle-f273303e.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).infoCircleSvg,lightbulb:async()=>(await a(()=>import("./lightbulb-7a434a43.js"),["assets/lightbulb-7a434a43.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).lightbulbSvg,mail:async()=>(await a(()=>import("./mail-ad8e2b81.js"),["assets/mail-ad8e2b81.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).mailSvg,mobile:async()=>(await a(()=>import("./mobile-9c844242.js"),["assets/mobile-9c844242.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).mobileSvg,more:async()=>(await a(()=>import("./more-11bc5065.js"),["assets/more-11bc5065.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).moreSvg,networkPlaceholder:async()=>(await a(()=>import("./network-placeholder-19d97b3c.js"),["assets/network-placeholder-19d97b3c.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).networkPlaceholderSvg,nftPlaceholder:async()=>(await a(()=>import("./nftPlaceholder-c7678fe5.js"),["assets/nftPlaceholder-c7678fe5.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).nftPlaceholderSvg,off:async()=>(await a(()=>import("./off-bc02870f.js"),["assets/off-bc02870f.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).offSvg,playStore:async()=>(await a(()=>import("./play-store-8126a9a9.js"),["assets/play-store-8126a9a9.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).playStoreSvg,plus:async()=>(await a(()=>import("./plus-836c76c1.js"),["assets/plus-836c76c1.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).plusSvg,qrCode:async()=>(await a(()=>import("./qr-code-3ee06ccd.js"),["assets/qr-code-3ee06ccd.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).qrCodeIcon,recycleHorizontal:async()=>(await a(()=>import("./recycle-horizontal-65ad9b95.js"),["assets/recycle-horizontal-65ad9b95.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).recycleHorizontalSvg,refresh:async()=>(await a(()=>import("./refresh-0e750891.js"),["assets/refresh-0e750891.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).refreshSvg,search:async()=>(await a(()=>import("./search-6f45b9e7.js"),["assets/search-6f45b9e7.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).searchSvg,send:async()=>(await a(()=>import("./send-3d84aae9.js"),["assets/send-3d84aae9.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).sendSvg,swapHorizontal:async()=>(await a(()=>import("./swapHorizontal-e9d7b7e4.js"),["assets/swapHorizontal-e9d7b7e4.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).swapHorizontalSvg,swapHorizontalMedium:async()=>(await a(()=>import("./swapHorizontalMedium-91d8c81e.js"),["assets/swapHorizontalMedium-91d8c81e.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).swapHorizontalMediumSvg,swapHorizontalBold:async()=>(await a(()=>import("./swapHorizontalBold-5afe3696.js"),["assets/swapHorizontalBold-5afe3696.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).swapHorizontalBoldSvg,swapHorizontalRoundedBold:async()=>(await a(()=>import("./swapHorizontalRoundedBold-048e6dce.js"),["assets/swapHorizontalRoundedBold-048e6dce.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).swapHorizontalRoundedBoldSvg,swapVertical:async()=>(await a(()=>import("./swapVertical-33fed4f3.js"),["assets/swapVertical-33fed4f3.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).swapVerticalSvg,telegram:async()=>(await a(()=>import("./telegram-588974a1.js"),["assets/telegram-588974a1.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).telegramSvg,threeDots:async()=>(await a(()=>import("./three-dots-ba5f32b7.js"),["assets/three-dots-ba5f32b7.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).threeDotsSvg,twitch:async()=>(await a(()=>import("./twitch-f2aad52a.js"),["assets/twitch-f2aad52a.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).twitchSvg,twitter:async()=>(await a(()=>import("./x-32620e82.js"),["assets/x-32620e82.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).xSvg,twitterIcon:async()=>(await a(()=>import("./twitterIcon-264db5e9.js"),["assets/twitterIcon-264db5e9.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).twitterIconSvg,verify:async()=>(await a(()=>import("./verify-86067c6f.js"),["assets/verify-86067c6f.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).verifySvg,verifyFilled:async()=>(await a(()=>import("./verify-filled-63980f01.js"),["assets/verify-filled-63980f01.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).verifyFilledSvg,wallet:async()=>(await a(()=>import("./wallet-2b504128.js"),["assets/wallet-2b504128.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).walletSvg,walletConnect:async()=>(await a(()=>import("./walletconnect-cb4f144d.js"),["assets/walletconnect-cb4f144d.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).walletConnectSvg,walletConnectLightBrown:async()=>(await a(()=>import("./walletconnect-cb4f144d.js"),["assets/walletconnect-cb4f144d.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).walletConnectLightBrownSvg,walletConnectBrown:async()=>(await a(()=>import("./walletconnect-cb4f144d.js"),["assets/walletconnect-cb4f144d.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).walletConnectBrownSvg,walletPlaceholder:async()=>(await a(()=>import("./wallet-placeholder-42ca0e8f.js"),["assets/wallet-placeholder-42ca0e8f.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).walletPlaceholderSvg,warningCircle:async()=>(await a(()=>import("./warning-circle-0e9104e5.js"),["assets/warning-circle-0e9104e5.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).warningCircleSvg,x:async()=>(await a(()=>import("./x-32620e82.js"),["assets/x-32620e82.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).xSvg,info:async()=>(await a(()=>import("./info-70fbee34.js"),["assets/info-70fbee34.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).infoSvg,exclamationTriangle:async()=>(await a(()=>import("./exclamation-triangle-54732ba5.js"),["assets/exclamation-triangle-54732ba5.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).exclamationTriangleSvg,reown:async()=>(await a(()=>import("./reown-logo-3be44476.js"),["assets/reown-logo-3be44476.js","assets/core-f8568c15.js","assets/index-e2bdff38.js","assets/index-b514c60c.css"])).reownSvg};async function ht(e){if(C.has(e))return C.get(e);const i=(M[e]??M.copy)();return C.set(e,i),i}let m=class extends ${constructor(){super(...arguments),this.size="md",this.name="copy",this.color="fg-300",this.aspectRatio="1 / 1"}render(){return this.style.cssText=`
      --local-color: ${`var(--wui-color-${this.color});`}
      --local-width: ${`var(--wui-icon-size-${this.size});`}
      --local-aspect-ratio: ${this.aspectRatio}
    `,f`${ut(ht(this.name),f`<div class="fallback"></div>`)}`}};m.styles=[E,U,_t];P([l()],m.prototype,"size",void 0);P([l()],m.prototype,"name",void 0);P([l()],m.prototype,"color",void 0);P([l()],m.prototype,"aspectRatio",void 0);m=P([T("wui-icon")],m);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pt=H(class extends N{constructor(e){var t;if(super(e),e.type!==W.ATTRIBUTE||e.name!=="class"||((t=e.strings)==null?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){var r,n;if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(o=>o!=="")));for(const o in t)t[o]&&!((r=this.nt)!=null&&r.has(o))&&this.st.add(o);return this.render(t)}const i=e.element.classList;for(const o of this.st)o in t||(i.remove(o),this.st.delete(o));for(const o in t){const s=!!t[o];s===this.st.has(o)||(n=this.nt)!=null&&n.has(o)||(s?(i.add(o),this.st.add(o)):(i.remove(o),this.st.delete(o)))}return V}}),gt=b`
  :host {
    display: inline-flex !important;
  }

  slot {
    width: 100%;
    display: inline-block;
    font-style: normal;
    font-family: var(--wui-font-family);
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'case' on;
    line-height: 130%;
    font-weight: var(--wui-font-weight-regular);
    overflow: inherit;
    text-overflow: inherit;
    text-align: var(--local-align);
    color: var(--local-color);
  }

  .wui-line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .wui-line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .wui-font-medium-400 {
    font-size: var(--wui-font-size-medium);
    font-weight: var(--wui-font-weight-light);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-medium-600 {
    font-size: var(--wui-font-size-medium);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-title-600 {
    font-size: var(--wui-font-size-title);
    letter-spacing: var(--wui-letter-spacing-title);
  }

  .wui-font-title-6-600 {
    font-size: var(--wui-font-size-title-6);
    letter-spacing: var(--wui-letter-spacing-title-6);
  }

  .wui-font-mini-700 {
    font-size: var(--wui-font-size-mini);
    letter-spacing: var(--wui-letter-spacing-mini);
    text-transform: uppercase;
  }

  .wui-font-large-500,
  .wui-font-large-600,
  .wui-font-large-700 {
    font-size: var(--wui-font-size-large);
    letter-spacing: var(--wui-letter-spacing-large);
  }

  .wui-font-2xl-500,
  .wui-font-2xl-600,
  .wui-font-2xl-700 {
    font-size: var(--wui-font-size-2xl);
    letter-spacing: var(--wui-letter-spacing-2xl);
  }

  .wui-font-paragraph-400,
  .wui-font-paragraph-500,
  .wui-font-paragraph-600,
  .wui-font-paragraph-700 {
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
  }

  .wui-font-small-400,
  .wui-font-small-500,
  .wui-font-small-600 {
    font-size: var(--wui-font-size-small);
    letter-spacing: var(--wui-letter-spacing-small);
  }

  .wui-font-tiny-400,
  .wui-font-tiny-500,
  .wui-font-tiny-600 {
    font-size: var(--wui-font-size-tiny);
    letter-spacing: var(--wui-letter-spacing-tiny);
  }

  .wui-font-micro-700,
  .wui-font-micro-600 {
    font-size: var(--wui-font-size-micro);
    letter-spacing: var(--wui-letter-spacing-micro);
    text-transform: uppercase;
  }

  .wui-font-tiny-400,
  .wui-font-small-400,
  .wui-font-medium-400,
  .wui-font-paragraph-400 {
    font-weight: var(--wui-font-weight-light);
  }

  .wui-font-large-700,
  .wui-font-paragraph-700,
  .wui-font-micro-700,
  .wui-font-mini-700 {
    font-weight: var(--wui-font-weight-bold);
  }

  .wui-font-medium-600,
  .wui-font-medium-title-600,
  .wui-font-title-6-600,
  .wui-font-large-600,
  .wui-font-paragraph-600,
  .wui-font-small-600,
  .wui-font-tiny-600,
  .wui-font-micro-600 {
    font-weight: var(--wui-font-weight-medium);
  }

  :host([disabled]) {
    opacity: 0.4;
  }
`;var O=globalThis&&globalThis.__decorate||function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o};let y=class extends ${constructor(){super(...arguments),this.variant="paragraph-500",this.color="fg-300",this.align="left",this.lineClamp=void 0}render(){const t={[`wui-font-${this.variant}`]:!0,[`wui-color-${this.color}`]:!0,[`wui-line-clamp-${this.lineClamp}`]:!!this.lineClamp};return this.style.cssText=`
      --local-align: ${this.align};
      --local-color: var(--wui-color-${this.color});
    `,f`<slot class=${pt(t)}></slot>`}};y.styles=[E,gt];O([l()],y.prototype,"variant",void 0);O([l()],y.prototype,"color",void 0);O([l()],y.prototype,"align",void 0);O([l()],y.prototype,"lineClamp",void 0);y=O([T("wui-text")],y);const vt=b`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-color: var(--wui-color-gray-glass-020);
    border-radius: var(--local-border-radius);
    border: var(--local-border);
    box-sizing: content-box;
    width: var(--local-size);
    height: var(--local-size);
    min-height: var(--local-size);
    min-width: var(--local-size);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host {
      background-color: color-mix(in srgb, var(--local-bg-value) var(--local-bg-mix), transparent);
    }
  }
`;var v=globalThis&&globalThis.__decorate||function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o};let h=class extends ${constructor(){super(...arguments),this.size="md",this.backgroundColor="accent-100",this.iconColor="accent-100",this.background="transparent",this.border=!1,this.borderColor="wui-color-bg-125",this.icon="copy"}render(){const t=this.iconSize||this.size,i=this.size==="lg",r=this.size==="xl",n=i?"12%":"16%",o=i?"xxs":r?"s":"3xl",s=this.background==="gray",c=this.background==="opaque",u=this.backgroundColor==="accent-100"&&c||this.backgroundColor==="success-100"&&c||this.backgroundColor==="error-100"&&c||this.backgroundColor==="inverse-100"&&c;let p=`var(--wui-color-${this.backgroundColor})`;return u?p=`var(--wui-icon-box-bg-${this.backgroundColor})`:s&&(p=`var(--wui-color-gray-${this.backgroundColor})`),this.style.cssText=`
       --local-bg-value: ${p};
       --local-bg-mix: ${u||s?"100%":n};
       --local-border-radius: var(--wui-border-radius-${o});
       --local-size: var(--wui-icon-box-size-${this.size});
       --local-border: ${this.borderColor==="wui-color-bg-125"?"2px":"1px"} solid ${this.border?`var(--${this.borderColor})`:"transparent"}
   `,f` <wui-icon color=${this.iconColor} size=${t} name=${this.icon}></wui-icon> `}};h.styles=[E,X,vt];v([l()],h.prototype,"size",void 0);v([l()],h.prototype,"backgroundColor",void 0);v([l()],h.prototype,"iconColor",void 0);v([l()],h.prototype,"iconSize",void 0);v([l()],h.prototype,"background",void 0);v([l({type:Boolean})],h.prototype,"border",void 0);v([l()],h.prototype,"borderColor",void 0);v([l()],h.prototype,"icon",void 0);h=v([T("wui-icon-box")],h);const wt=b`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: inherit;
  }
`;var L=globalThis&&globalThis.__decorate||function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o};let S=class extends ${constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image",this.size=void 0}render(){return this.style.cssText=`
      --local-width: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};
      --local-height: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};
      `,f`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent("onLoadError",{bubbles:!0,composed:!0}))}};S.styles=[E,U,wt];L([l()],S.prototype,"src",void 0);L([l()],S.prototype,"alt",void 0);L([l()],S.prototype,"size",void 0);S=L([T("wui-image")],S);const ft=b`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--wui-spacing-m);
    padding: 0 var(--wui-spacing-3xs) !important;
    border-radius: var(--wui-border-radius-5xs);
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host > wui-text {
    transform: translateY(5%);
  }

  :host([data-variant='main']) {
    background-color: var(--wui-color-accent-glass-015);
    color: var(--wui-color-accent-100);
  }

  :host([data-variant='shade']) {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-200);
  }

  :host([data-variant='success']) {
    background-color: var(--wui-icon-box-bg-success-100);
    color: var(--wui-color-success-100);
  }

  :host([data-variant='error']) {
    background-color: var(--wui-icon-box-bg-error-100);
    color: var(--wui-color-error-100);
  }

  :host([data-size='lg']) {
    padding: 11px 5px !important;
  }

  :host([data-size='lg']) > wui-text {
    transform: translateY(2%);
  }
`;var z=globalThis&&globalThis.__decorate||function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o};let R=class extends ${constructor(){super(...arguments),this.variant="main",this.size="lg"}render(){this.dataset.variant=this.variant,this.dataset.size=this.size;const t=this.size==="md"?"mini-700":"micro-700";return f`
      <wui-text data-variant=${this.variant} variant=${t} color="inherit">
        <slot></slot>
      </wui-text>
    `}};R.styles=[E,ft];z([l()],R.prototype,"variant",void 0);z([l()],R.prototype,"size",void 0);R=z([T("wui-tag")],R);const mt=b`
  :host {
    display: flex;
  }

  :host([data-size='sm']) > svg {
    width: 12px;
    height: 12px;
  }

  :host([data-size='md']) > svg {
    width: 16px;
    height: 16px;
  }

  :host([data-size='lg']) > svg {
    width: 24px;
    height: 24px;
  }

  :host([data-size='xl']) > svg {
    width: 32px;
    height: 32px;
  }

  svg {
    animation: rotate 2s linear infinite;
  }

  circle {
    fill: none;
    stroke: var(--local-color);
    stroke-width: 4px;
    stroke-dasharray: 1, 124;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  :host([data-size='md']) > svg > circle {
    stroke-width: 6px;
  }

  :host([data-size='sm']) > svg > circle {
    stroke-width: 8px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 124;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 90, 124;
      stroke-dashoffset: -35;
    }

    100% {
      stroke-dashoffset: -125;
    }
  }
`;var k=globalThis&&globalThis.__decorate||function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var c=e.length-1;c>=0;c--)(s=e[c])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o};let A=class extends ${constructor(){super(...arguments),this.color="accent-100",this.size="lg"}render(){return this.style.cssText=`--local-color: ${this.color==="inherit"?"inherit":`var(--wui-color-${this.color})`}`,this.dataset.size=this.size,f`<svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>`}};A.styles=[E,mt];k([l()],A.prototype,"color",void 0);k([l()],A.prototype,"size",void 0);A=k([T("wui-loading-spinner")],A);export{w as U,pt as a,T as c,H as e,nt as f,l as n,Tt as o,Et as r};
