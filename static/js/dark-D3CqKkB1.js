import{ag as P,f,b9 as se,a9 as V,m as U,Q as h,a3 as p,p as g,U as ue,s as q,e as H,ba as le,a0 as z,bb as Q,bc as ie,d as C,k as T,bd as ce,be as D,aZ as de,aX as fe,aO as me,$ as he,J as ge,bf as pe,bg as ve,N as Te,a4 as be,ad as ye,R as j,aD as S,a8 as $e,bh as Ce,i as J,c as X,b as B}from"./index-C1DCms5E.js";function Se(){const{$storage:t,$config:e}=P(),o=()=>{se().multiTagsCache&&(!t.tags||t.tags.length===0)&&(t.tags=V),t.layout||(t.layout={layout:(e==null?void 0:e.Layout)??"vertical",theme:(e==null?void 0:e.Theme)??"light",darkMode:(e==null?void 0:e.DarkMode)??!1,sidebarStatus:(e==null?void 0:e.SidebarStatus)??!0,epThemeColor:(e==null?void 0:e.EpThemeColor)??"#409EFF",themeColor:(e==null?void 0:e.Theme)??"light",overallStyle:(e==null?void 0:e.OverallStyle)??"light"}),t.configure||(t.configure={grey:(e==null?void 0:e.Grey)??!1,weak:(e==null?void 0:e.Weak)??!1,hideTabs:(e==null?void 0:e.HideTabs)??!1,hideFooter:e.HideFooter??!0,showLogo:(e==null?void 0:e.ShowLogo)??!0,showModel:(e==null?void 0:e.ShowModel)??"smart",multiTagsCache:(e==null?void 0:e.MultiTagsCache)??!1,stretch:(e==null?void 0:e.Stretch)??!1})},n=f(()=>t==null?void 0:t.layout.layout),r=f(()=>t.layout);return{layout:n,layoutTheme:r,initStorage:o}}const ke=U({id:"pure-app",state:()=>{var t,e;return{sidebar:{opened:((t=h().getItem(`${p()}layout`))==null?void 0:t.sidebarStatus)??g().SidebarStatus,withoutAnimation:!1,isClickCollapse:!1},layout:((e=h().getItem(`${p()}layout`))==null?void 0:e.layout)??g().Layout,device:ue()?"mobile":"desktop",viewportSize:{width:document.documentElement.clientWidth,height:document.documentElement.clientHeight}}},getters:{getSidebarStatus(t){return t.sidebar.opened},getDevice(t){return t.device},getViewportWidth(t){return t.viewportSize.width},getViewportHeight(t){return t.viewportSize.height}},actions:{TOGGLE_SIDEBAR(t,e){const o=h().getItem(`${p()}layout`);t&&e?(this.sidebar.withoutAnimation=!0,this.sidebar.opened=!0,o.sidebarStatus=!0):!t&&e?(this.sidebar.withoutAnimation=!0,this.sidebar.opened=!1,o.sidebarStatus=!1):!t&&!e&&(this.sidebar.withoutAnimation=!1,this.sidebar.opened=!this.sidebar.opened,this.sidebar.isClickCollapse=!this.sidebar.opened,o.sidebarStatus=this.sidebar.opened),h().setItem(`${p()}layout`,o)},async toggleSideBar(t,e){await this.TOGGLE_SIDEBAR(t,e)},toggleDevice(t){this.device=t},setLayout(t){this.layout=t},setViewportSize(t){this.viewportSize=t},setSortSwap(t){this.sortSwap=t}}});function Z(){return ke(q)}const Me=U({id:"pure-epTheme",state:()=>{var t,e;return{epThemeColor:((t=h().getItem(`${p()}layout`))==null?void 0:t.epThemeColor)??g().EpThemeColor,epTheme:((e=h().getItem(`${p()}layout`))==null?void 0:e.theme)??g().Theme}},getters:{getEpThemeColor(t){return t.epThemeColor},fill(t){return t.epTheme==="light"?"#409eff":"#fff"}},actions:{setEpThemeColor(t){const e=h().getItem(`${p()}layout`);this.epTheme=e==null?void 0:e.theme,this.epThemeColor=t,e&&(e.epThemeColor=t,h().setItem(`${p()}layout`,e))}}});function N(){return Me(q)}const _={outputDir:"",defaultScopeName:"",includeStyleWithColors:[],extract:!0,themeLinkTagId:"theme-link-tag",themeLinkTagInjectTo:"head",removeCssScopeName:!1,customThemeCssFileName:null,arbitraryMode:!1,defaultPrimaryColor:"",customThemeOutputPath:"/home/runner/work/YePanel/YePanel/node_modules/.pnpm/@pureadmin+theme@3.2.0/node_modules/@pureadmin/theme/setCustomTheme.js",styleTagId:"custom-theme-tagid",InjectDefaultStyleTagToHtml:!0,hueDiffControls:{low:0,high:0},multipleScopeVars:[{scopeName:"layout-theme-light",varsContent:`
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
      `}]},we="/YePanel/",Be="assets",K=t=>{let e=t.replace("#","").match(/../g);for(let o=0;o<3;o++)e[o]=parseInt(e[o],16);return e},ee=(t,e,o)=>{let n=[t.toString(16),e.toString(16),o.toString(16)];for(let r=0;r<3;r++)n[r].length==1&&(n[r]=`0${n[r]}`);return`#${n.join("")}`},xe=(t,e)=>{let o=K(t);for(let n=0;n<3;n++)o[n]=Math.floor(o[n]*(1-e));return ee(o[0],o[1],o[2])},Ie=(t,e)=>{let o=K(t);for(let n=0;n<3;n++)o[n]=Math.floor((255-o[n])*e+o[n]);return ee(o[0],o[1],o[2])},F=t=>`(^${t}\\s+|\\s+${t}\\s+|\\s+${t}$|^${t}$)`,G=({scopeName:t,multipleScopeVars:e})=>{const o=Array.isArray(e)&&e.length?e:_.multipleScopeVars;let n=document.documentElement.className;new RegExp(F(t)).test(n)||(o.forEach(r=>{n=n.replace(new RegExp(F(r.scopeName),"g"),` ${t} `)}),document.documentElement.className=n.replace(/(^\s+|\s+$)/g,""))},W=({id:t,href:e})=>{const o=document.createElement("link");return o.rel="stylesheet",o.href=e,o.id=t,o},Ae=t=>{const e={scopeName:"theme-default",customLinkHref:l=>l,...t},o=e.themeLinkTagId||_.themeLinkTagId;let n=document.getElementById(o);const r=e.customLinkHref(`${we.replace(/\/$/,"")}${`/${Be}/${e.scopeName}.css`.replace(/\/+(?=\/)/g,"")}`);if(n){n.id=`${o}_old`;const l=W({id:o,href:r});n.nextSibling?n.parentNode.insertBefore(l,n.nextSibling):n.parentNode.appendChild(l),l.onload=()=>{setTimeout(()=>{n.parentNode.removeChild(n),n=null},60),G(e)};return}n=W({id:o,href:r}),G(e),document[(e.themeLinkTagInjectTo||_.themeLinkTagInjectTo).replace("-prepend","")].appendChild(n)};function Ye(){var v,w;const{layoutTheme:t,layout:e}=Se(),o=H([{color:"#ffffff",themeColor:"light"},{color:"#1b2a47",themeColor:"default"},{color:"#722ed1",themeColor:"saucePurple"},{color:"#eb2f96",themeColor:"pink"},{color:"#f5222d",themeColor:"dusk"},{color:"#fa541c",themeColor:"volcano"},{color:"#13c2c2",themeColor:"mingQing"},{color:"#52c41a",themeColor:"auroraGreen"}]),{$storage:n}=P(),r=H((v=n==null?void 0:n.layout)==null?void 0:v.darkMode),l=H((w=n==null?void 0:n.layout)==null?void 0:w.overallStyle),x=document.documentElement;function k(s,u,c){const m=c||document.body;let{className:i}=m;i=i.replace(u,"").trim(),m.className=s?`${i} ${u}`:i}function b(s=g().Theme??"light",u=!0){var m,i;t.value.theme=s,Ae({scopeName:`layout-theme-${s}`});const c=n.layout.themeColor;if(n.layout={layout:e.value,theme:s,darkMode:r.value,sidebarStatus:(m=n.layout)==null?void 0:m.sidebarStatus,epThemeColor:(i=n.layout)==null?void 0:i.epThemeColor,themeColor:u?s:c,overallStyle:l.value},s==="default"||s==="light")y(g().EpThemeColor);else{const L=o.value.find(E=>E.themeColor===s);y(L.color)}}function M(s,u,c){document.documentElement.style.setProperty(`--el-color-primary-${s}-${u}`,r.value?xe(c,u/10):Ie(c,u/10))}const y=s=>{N().setEpThemeColor(s),document.documentElement.style.setProperty("--el-color-primary",s);for(let u=1;u<=2;u++)M("dark",u,s);for(let u=1;u<=9;u++)M("light",u,s)};function I(s){l.value=s,N().epTheme==="light"&&r.value?b("default",!1):b(N().epTheme,!1),r.value?document.documentElement.classList.add("dark"):(n.layout.themeColor==="light"&&b("light",!1),document.documentElement.classList.remove("dark"))}function A(){le(),h().clear();const{Grey:s,Weak:u,MultiTagsCache:c,EpThemeColor:m,Layout:i}=g();Z().setLayout(i),y(m),z().multiTagsCacheChange(c),k(s,"html-grey",document.querySelector("html")),k(u,"html-weakness",document.querySelector("html")),Q.push("/login"),z().handleTags("equal",[...V]),ie()}return{body:x,dataTheme:r,overallStyle:l,layoutTheme:t,themeColors:o,onReset:A,toggleClass:k,dataThemeChange:I,setEpThemeColor:y,setLayoutThemeColor:b}}function Ve(t,e){const o=/^IF-/;if(o.test(t)){const n=t.split(o)[1],r=n.slice(0,n.indexOf(" ")==-1?n.length:n.indexOf(" ")),l=n.slice(n.indexOf(" ")+1,n.length);return C({name:"FontIcon",render(){return T(ce,{icon:r,iconType:l,...e})}})}else{if(typeof t=="function"||typeof(t==null?void 0:t.render)=="function")return e?T(t,{...e}):t;if(typeof t=="object")return C({name:"OfflineIcon",render(){return T(D,{icon:t,...e})}});if(t.startsWith("http"))return C({name:"OnlineIcon",render(){return T("img",{src:t,style:"width: 18px"})}});if(t.startsWith("data:image"))return C({name:"OnlineIcon",render(){return T("img",{src:t,style:"width: 18px"})}});if(t.startsWith("api:")){const n=de().replace(/\/$/,"")+t.replace("api:","")+`?accessToken=${fe().accessToken}`;return C({name:"OnlineIcon",render(){return T("img",{src:n,style:"width: 18px"})}})}else return C({name:"Icon",render(){const n=t&&t.includes(":")?me:D;return T(n,{icon:t,...e})}})}}function Le(t){return{all:t=t||new Map,on:function(e,o){var n=t.get(e);n?n.push(o):t.set(e,[o])},off:function(e,o){var n=t.get(e);n&&(o?n.splice(n.indexOf(o)>>>0,1):t.set(e,[]))},emit:function(e,o){var n=t.get(e);n&&n.slice().map(function(r){r(o)}),(n=t.get("*"))&&n.slice().map(function(r){r(e,o)})}}}const Y=Le(),Ee="/YePanel/static/jpg/user-CdYrfT03.jpg",He="The current routing configuration is incorrect, please check the configuration";function Ue(){var O;const t=he(),e=Z(),o=ge().options.routes,{isFullscreen:n,toggle:r}=pe(),{wholeMenus:l}=ve(Te()),x=((O=g())==null?void 0:O.TooltipEffect)??"light",k=f(()=>({width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",overflow:"hidden"})),b=f(()=>{var a,d;return j((a=S())==null?void 0:a.avatar)?Ee:(d=S())==null?void 0:d.avatar}),M=f(()=>{var a,d,$;return j((a=S())==null?void 0:a.nickname)?(d=S())==null?void 0:d.username:($=S())==null?void 0:$.nickname}),y=f(()=>M.value?{marginRight:"10px"}:""),I=f(()=>!e.getSidebarStatus),A=f(()=>e.getDevice),{$storage:v,$config:w}=P(),s=f(()=>{var a;return(a=v==null?void 0:v.layout)==null?void 0:a.layout}),u=f(()=>w.Title);function c(a){const d=g().Title;d?document.title=`${a.title} | ${d}`:document.title=a.title}function m(){S().logOut()}function i(){var a;Q.push((a=$e())==null?void 0:a.path)}function L(){Y.emit("openPanel")}function E(){e.toggleSideBar()}function te(a){a==null||a.handleResize()}function ne(a){var R;if(!a.children)return console.error(He);const d=/^http(s?):\/\//,$=(R=a.children[0])==null?void 0:R.path;return d.test($)?a.path+"/"+$:$}function oe(a){l.value.length===0||ae(a)||Y.emit("changLayoutRoute",a)}function ae(a){return Ce.includes(a)}function re(){return new URL("/YePanel/logo.jpg",import.meta.url).href}return{route:t,title:u,device:A,layout:s,logout:m,routers:o,$storage:v,isFullscreen:n,Fullscreen:be,ExitFullscreen:ye,toggle:r,backTopMenu:i,onPanel:L,getDivStyle:k,changeTitle:c,toggleSideBar:E,menuSelect:oe,handleResize:te,resolvePath:ne,getLogo:re,isCollapse:I,pureApp:e,username:M,userAvatar:b,avatarsStyle:y,tooltipEffect:x}}const Ne={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},_e=B("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),Pe=B("path",{d:"M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12M11 1h2v3h-2zm0 19h2v3h-2zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414zm2.121-14.85 1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414zM23 11v2h-3v-2zM4 11v2H1v-2z"},null,-1),Oe=[_e,Pe];function Re(t,e){return J(),X("svg",Ne,[...Oe])}const qe={render:Re},ze={xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24"},De=B("path",{fill:"none",d:"M0 0h24v24H0z"},null,-1),je=B("path",{d:"M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22 6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981"},null,-1),Fe=[De,je];function Ge(t,e){return J(),X("svg",ze,[...Fe])}const Qe={render:Ge};export{Ve as a,Ue as b,Ye as c,Z as d,Y as e,qe as f,Qe as g,Se as h,Ae as t,N as u};
