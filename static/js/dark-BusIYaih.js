import{ag as R,c as f,ba as se,a9 as Y,m as U,s as q,Q as h,p as g,a3 as p,U as ue,r as H,bb as le,a0 as O,bc as Q,bd as ie,d as C,h as b,be as ce,bf as j,a_ as de,aY as fe,aR as me,J as he,bg as ge,bh as pe,P as ve,ad as be,a4 as Te,$ as ye,a8 as $e,aE as S,bi as Ce,R as F,g as J,i as K,j as B}from"./index-CpafBiW4.js";function Se(){const{$storage:t,$config:e}=R(),o=()=>{se().multiTagsCache&&(!t.tags||t.tags.length===0)&&(t.tags=Y),t.layout||(t.layout={layout:(e==null?void 0:e.Layout)??"vertical",theme:(e==null?void 0:e.Theme)??"light",darkMode:(e==null?void 0:e.DarkMode)??!1,sidebarStatus:(e==null?void 0:e.SidebarStatus)??!0,epThemeColor:(e==null?void 0:e.EpThemeColor)??"#409EFF",themeColor:(e==null?void 0:e.Theme)??"light",overallStyle:(e==null?void 0:e.OverallStyle)??"light"}),t.configure||(t.configure={grey:(e==null?void 0:e.Grey)??!1,weak:(e==null?void 0:e.Weak)??!1,hideTabs:(e==null?void 0:e.HideTabs)??!1,hideFooter:e.HideFooter??!0,showLogo:(e==null?void 0:e.ShowLogo)??!0,showModel:(e==null?void 0:e.ShowModel)??"smart",multiTagsCache:(e==null?void 0:e.MultiTagsCache)??!1,stretch:(e==null?void 0:e.Stretch)??!1})},n=f(()=>t==null?void 0:t.layout.layout),r=f(()=>t.layout);return{layout:n,layoutTheme:r,initStorage:o}}const ke=U({id:"pure-app",state:()=>{var t,e;return{sidebar:{opened:((t=h().getItem(`${p()}layout`))==null?void 0:t.sidebarStatus)??g().SidebarStatus,withoutAnimation:!1,isClickCollapse:!1},layout:((e=h().getItem(`${p()}layout`))==null?void 0:e.layout)??g().Layout,device:ue()?"mobile":"desktop",viewportSize:{width:document.documentElement.clientWidth,height:document.documentElement.clientHeight}}},getters:{getSidebarStatus(t){return t.sidebar.opened},getDevice(t){return t.device},getViewportWidth(t){return t.viewportSize.width},getViewportHeight(t){return t.viewportSize.height}},actions:{TOGGLE_SIDEBAR(t,e){const o=h().getItem(`${p()}layout`);t&&e?(this.sidebar.withoutAnimation=!0,this.sidebar.opened=!0,o.sidebarStatus=!0):!t&&e?(this.sidebar.withoutAnimation=!0,this.sidebar.opened=!1,o.sidebarStatus=!1):!t&&!e&&(this.sidebar.withoutAnimation=!1,this.sidebar.opened=!this.sidebar.opened,this.sidebar.isClickCollapse=!this.sidebar.opened,o.sidebarStatus=this.sidebar.opened),h().setItem(`${p()}layout`,o)},async toggleSideBar(t,e){await this.TOGGLE_SIDEBAR(t,e)},toggleDevice(t){this.device=t},setLayout(t){this.layout=t},setViewportSize(t){this.viewportSize=t},setSortSwap(t){this.sortSwap=t}}});function X(){return ke(q)}const Me=U({id:"pure-epTheme",state:()=>{var t,e;return{epThemeColor:((t=h().getItem(`${p()}layout`))==null?void 0:t.epThemeColor)??g().EpThemeColor,epTheme:((e=h().getItem(`${p()}layout`))==null?void 0:e.theme)??g().Theme}},getters:{getEpThemeColor(t){return t.epThemeColor},fill(t){return t.epTheme==="light"?"#409eff":"#fff"}},actions:{setEpThemeColor(t){const e=h().getItem(`${p()}layout`);this.epTheme=e==null?void 0:e.theme,this.epThemeColor=t,e&&(e.epThemeColor=t,h().setItem(`${p()}layout`,e))}}});function _(){return Me(q)}const N={themeLinkTagId:"theme-link-tag",themeLinkTagInjectTo:"head",multipleScopeVars:[{scopeName:"layout-theme-light",varsContent:`
        $subMenuActiveText: #000000d9 !default;
        $menuBg: #fff !default;
        $menuHover: #f6f6f6 !default;
        $subMenuBg: #fff !default;
        $subMenuActiveBg: #e0ebf6 !default;
        $menuText: rgb(0 0 0 / 60%) !default;
        $sidebarLogo: #fff !default;
        $menuTitleHover: #000 !default;
        $menuActiveBefore: #4091f7 !default;
      `},{scopeName:"layout-theme-default",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #001529 !default;
        $menuHover: rgb(64 145 247 / 15%) !default;
        $subMenuBg: #0f0303 !default;
        $subMenuActiveBg: #4091f7 !default;
        $menuText: rgb(254 254 254 / 65%) !default;
        $sidebarLogo: #002140 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #4091f7 !default;
      `},{scopeName:"layout-theme-saucePurple",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #130824 !default;
        $menuHover: rgb(105 58 201 / 15%) !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #693ac9 !default;
        $menuText: #7a80b4 !default;
        $sidebarLogo: #1f0c38 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #693ac9 !default;
      `},{scopeName:"layout-theme-pink",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #28081a !default;
        $menuHover: rgb(216 68 147 / 15%) !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #d84493 !default;
        $menuText: #7a80b4 !default;
        $sidebarLogo: #3f0d29 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #d84493 !default;
      `},{scopeName:"layout-theme-dusk",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #2a0608 !default;
        $menuHover: rgb(225 60 57 / 15%) !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #e13c39 !default;
        $menuText: rgb(254 254 254 / 65.1%) !default;
        $sidebarLogo: #42090c !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #e13c39 !default;
      `},{scopeName:"layout-theme-volcano",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #2b0e05 !default;
        $menuHover: rgb(232 95 51 / 15%) !default;
        $subMenuBg: #0f0603 !default;
        $subMenuActiveBg: #e85f33 !default;
        $menuText: rgb(254 254 254 / 65%) !default;
        $sidebarLogo: #441708 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #e85f33 !default;
      `},{scopeName:"layout-theme-mingQing",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #032121 !default;
        $menuHover: rgb(89 191 193 / 15%) !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #59bfc1 !default;
        $menuText: #7a80b4 !default;
        $sidebarLogo: #053434 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #59bfc1 !default;
      `},{scopeName:"layout-theme-auroraGreen",varsContent:`
        $subMenuActiveText: #fff !default;
        $menuBg: #0b1e15 !default;
        $menuHover: rgb(96 172 128 / 15%) !default;
        $subMenuBg: #000 !default;
        $subMenuActiveBg: #60ac80 !default;
        $menuText: #7a80b4 !default;
        $sidebarLogo: #112f21 !default;
        $menuTitleHover: #fff !default;
        $menuActiveBefore: #60ac80 !default;
      `}]},we="/YePanel/",Be="assets",Z=t=>{let e=t.replace("#","").match(/../g);for(let o=0;o<3;o++)e[o]=parseInt(e[o],16);return e},ee=(t,e,o)=>{let n=[t.toString(16),e.toString(16),o.toString(16)];for(let r=0;r<3;r++)n[r].length==1&&(n[r]=`0${n[r]}`);return`#${n.join("")}`},xe=(t,e)=>{let o=Z(t);for(let n=0;n<3;n++)o[n]=Math.floor(o[n]*(1-e));return ee(o[0],o[1],o[2])},Ae=(t,e)=>{let o=Z(t);for(let n=0;n<3;n++)o[n]=Math.floor((255-o[n])*e+o[n]);return ee(o[0],o[1],o[2])},D=t=>`(^${t}\\s+|\\s+${t}\\s+|\\s+${t}$|^${t}$)`,G=({scopeName:t,multipleScopeVars:e})=>{const o=Array.isArray(e)&&e.length?e:N.multipleScopeVars;let n=document.documentElement.className;new RegExp(D(t)).test(n)||(o.forEach(r=>{n=n.replace(new RegExp(D(r.scopeName),"g"),` ${t} `)}),document.documentElement.className=n.replace(/(^\s+|\s+$)/g,""))},W=({id:t,href:e})=>{const o=document.createElement("link");return o.rel="stylesheet",o.href=e,o.id=t,o},Ie=t=>{const e={scopeName:"theme-default",customLinkHref:l=>l,...t},o=e.themeLinkTagId||N.themeLinkTagId;let n=document.getElementById(o);const r=e.customLinkHref(`${we.replace(/\/$/,"")}${`/${Be}/${e.scopeName}.css`.replace(/\/+(?=\/)/g,"")}`);if(n){n.id=`${o}_old`;const l=W({id:o,href:r});n.nextSibling?n.parentNode.insertBefore(l,n.nextSibling):n.parentNode.appendChild(l),l.onload=()=>{setTimeout(()=>{n.parentNode.removeChild(n),n=null},60),G(e)};return}n=W({id:o,href:r}),G(e),document[(e.themeLinkTagInjectTo||N.themeLinkTagInjectTo).replace("-prepend","")].appendChild(n)};function Ve(){var v,w;const{layoutTheme:t,layout:e}=Se(),o=H([{color:"#ffffff",themeColor:"light"},{color:"#1b2a47",themeColor:"default"},{color:"#722ed1",themeColor:"saucePurple"},{color:"#eb2f96",themeColor:"pink"},{color:"#f5222d",themeColor:"dusk"},{color:"#fa541c",themeColor:"volcano"},{color:"#13c2c2",themeColor:"mingQing"},{color:"#52c41a",themeColor:"auroraGreen"}]),{$storage:n}=R(),r=H((v=n==null?void 0:n.layout)==null?void 0:v.darkMode),l=H((w=n==null?void 0:n.layout)==null?void 0:w.overallStyle),x=document.documentElement;function k(s,u,c){const m=c||document.body;let{className:i}=m;i=i.replace(u,"").trim(),m.className=s?`${i} ${u}`:i}function T(s=g().Theme??"light",u=!0){var m,i;t.value.theme=s,Ie({scopeName:`layout-theme-${s}`});const c=n.layout.themeColor;if(n.layout={layout:e.value,theme:s,darkMode:r.value,sidebarStatus:(m=n.layout)==null?void 0:m.sidebarStatus,epThemeColor:(i=n.layout)==null?void 0:i.epThemeColor,themeColor:u?s:c,overallStyle:l.value},s==="default"||s==="light")y(g().EpThemeColor);else{const L=o.value.find(E=>E.themeColor===s);y(L.color)}}function M(s,u,c){document.documentElement.style.setProperty(`--el-color-primary-${s}-${u}`,r.value?xe(c,u/10):Ae(c,u/10))}const y=s=>{_().setEpThemeColor(s),document.documentElement.style.setProperty("--el-color-primary",s);for(let u=1;u<=2;u++)M("dark",u,s);for(let u=1;u<=9;u++)M("light",u,s)};function A(s){l.value=s,_().epTheme==="light"&&r.value?T("default",!1):T(_().epTheme,!1),r.value?document.documentElement.classList.add("dark"):(n.layout.themeColor==="light"&&T("light",!1),document.documentElement.classList.remove("dark"))}function I(){le(),h().clear();const{Grey:s,Weak:u,MultiTagsCache:c,EpThemeColor:m,Layout:i}=g();X().setLayout(i),y(m),O().multiTagsCacheChange(c),k(s,"html-grey",document.querySelector("html")),k(u,"html-weakness",document.querySelector("html")),Q.push("/login"),O().handleTags("equal",[...Y]),ie()}return{body:x,dataTheme:r,overallStyle:l,layoutTheme:t,themeColors:o,onReset:I,toggleClass:k,dataThemeChange:A,setEpThemeColor:y,setLayoutThemeColor:T}}function Ye(t,e){const o=/^IF-/;if(o.test(t)){const n=t.split(o)[1],r=n.slice(0,n.indexOf(" ")==-1?n.length:n.indexOf(" ")),l=n.slice(n.indexOf(" ")+1,n.length);return C({name:"FontIcon",render(){return b(ce,{icon:r,iconType:l,...e})}})}else{if(typeof t=="function"||typeof(t==null?void 0:t.render)=="function")return e?b(t,{...e}):t;if(typeof t=="object")return C({name:"OfflineIcon",render(){return b(j,{icon:t,...e})}});if(t.startsWith("http"))return C({name:"OnlineIcon",render(){return b("img",{src:t,style:"width: 18px"})}});if(t.startsWith("data:image"))return C({name:"OnlineIcon",render(){return b("img",{src:t,style:"width: 18px"})}});if(t.startsWith("api:")){const n=de().replace(/\/$/,"")+t.replace("api:","")+`?accessToken=${fe().accessToken}`;return C({name:"OnlineIcon",render(){return b("img",{src:n,style:"width: 18px"})}})}else return C({name:"Icon",render(){const n=t&&t.includes(":")?me:j;return b(n,{icon:t,...e})}})}}function Le(t){return{all:t=t||new Map,on:function(e,o){var n=t.get(e);n?n.push(o):t.set(e,[o])},off:function(e,o){var n=t.get(e);n&&(o?n.splice(n.indexOf(o)>>>0,1):t.set(e,[]))},emit:function(e,o){var n=t.get(e);n&&n.slice().map(function(r){r(o)}),(n=t.get("*"))&&n.slice().map(function(r){r(e,o)})}}}const V=Le(),Ee="/YePanel/static/jpg/user-CdYrfT03.jpg",He="The current routing configuration is incorrect, please check the configuration";function Ue(){var P;const t=ye(),e=X(),o=he().options.routes,{isFullscreen:n,toggle:r}=ge(),{wholeMenus:l}=pe(ve()),x=((P=g())==null?void 0:P.TooltipEffect)??"light",k=f(()=>({width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",overflow:"hidden"})),T=f(()=>{var a,d;return F((a=S())==null?void 0:a.avatar)?Ee:(d=S())==null?void 0:d.avatar}),M=f(()=>{var a,d,$;return F((a=S())==null?void 0:a.nickname)?(d=S())==null?void 0:d.username:($=S())==null?void 0:$.nickname}),y=f(()=>M.value?{marginRight:"10px"}:""),A=f(()=>!e.getSidebarStatus),I=f(()=>e.getDevice),{$storage:v,$config:w}=R(),s=f(()=>{var a;return(a=v==null?void 0:v.layout)==null?void 0:a.layout}),u=f(()=>w.Title);function c(a){const d=g().Title;d?document.title=`${a.title} | ${d}`:document.title=a.title}function m(){S().logOut()}function i(){var a;Q.push((a=$e())==null?void 0:a.path)}function L(){V.emit("openPanel")}function E(){e.toggleSideBar()}function te(a){a==null||a.handleResize()}function ne(a){var z;if(!a.children)return console.error(He);const d=/^http(s?):\/\//,$=(z=a.children[0])==null?void 0:z.path;return d.test($)?a.path+"/"+$:$}function oe(a){l.value.length===0||ae(a)||V.emit("changLayoutRoute",a)}function ae(a){return Ce.includes(a)}function re(){return new URL("/YePanel/logo.jpg",import.meta.url).href}return{route:t,title:u,device:I,layout:s,logout:m,routers:o,$storage:v,isFullscreen:n,Fullscreen:Te,ExitFullscreen:be,toggle:r,backTopMenu:i,onPanel:L,getDivStyle:k,changeTitle:c,toggleSideBar:E,menuSelect:oe,handleResize:te,resolvePath:ne,getLogo:re,isCollapse:A,pureApp:e,username:M,userAvatar:T,avatarsStyle:y,tooltipEffect:x}}const _e={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},Ne=B("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),Re=B("path",{d:"M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12M11 1h2v3h-2zm0 19h2v3h-2zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414zm2.121-14.85 1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414zM23 11v2h-3v-2zM4 11v2H1v-2z"},null,-1),Pe=[Ne,Re];function ze(t,e){return K(),J("svg",_e,[...Pe])}const qe={render:ze},Oe={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},je=B("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),Fe=B("path",{d:"M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981"},null,-1),De=[je,Fe];function Ge(t,e){return K(),J("svg",Oe,[...De])}const Qe={render:Ge};export{_ as a,Ue as b,Ve as c,X as d,V as e,qe as f,Qe as g,Se as h,Ie as t,Ye as u};
