import{d as I,e as s,ay as P,$ as S,aY as E,A as o,V as R,D as z,i,u,P as e,y as n,b as F,w as t,aO as L,t as O,C as T,aK as v,B as r,x as m,c as $,F as j,q}from"./index-C1DCms5E.js";import{_ as A}from"./plusForm.vue_vue_type_style_index_0_lang-BP8pDfpM.js";import"./index-BOPFo7cB.js";const H={class:"flex"},M=I({name:"plugin-setting",__name:"index",setup(K){const _=s(!0),x=P(),g=S().path.split("/")[1],l=x.guoba[g].pluginInfo,d=s();return s(null),s(null),s(null),E((C,f,k)=>!1),(C,f)=>{const k=o("el-image"),h=o("el-link"),p=o("el-descriptions-item"),y=o("el-button"),b=o("el-descriptions"),w=o("el-card"),B=o("el-affix"),D=o("el-col"),N=o("el-row"),V=R("loading");return z((i(),u(N,{justify:"center"},{default:e(()=>[n(D,{lg:14,xs:24},{default:e(()=>[n(B,{offset:-80},{default:e(()=>[n(w,{class:"flex"},{default:e(()=>[n(b,{column:1},{title:e(()=>[F("div",H,[t(l).iconPath?(i(),u(k,{key:0,src:t(l).iconPath,width:64,style:{width:"64px"},"hide-on-click-modal":"","close-on-press-escape":"","preview-src-list":[t(l).iconPath]},null,8,["src","preview-src-list"])):t(l).icon?(i(),u(t(L),{key:1,icon:t(l).icon,width:64,style:O({color:t(l).iconColor})},null,8,["icon","style"])):T("",!0),n(h,{underline:!1,href:t(l).link,target:"_blank",class:"ml-3"},{default:e(()=>[n(t(v),{tag:"b",size:"large"},{default:e(()=>[r(m(t(l).title),1)]),_:1})]),_:1},8,["href"])])]),default:e(()=>[n(p,{label:"作者:"},{default:e(()=>[(i(!0),$(j,null,q(t(l).author,(a,c)=>(i(),u(h,{key:a,underline:!1,href:t(l).authorLink[c],target:"_blank",class:"mr-3 mb-1"},{default:e(()=>[r(m(a),1)]),_:2},1032,["href"]))),128))]),_:1}),n(p,{label:"描述:"},{default:e(()=>[n(t(v),null,{default:e(()=>[r(m(t(l).description),1)]),_:1})]),_:1}),n(p,null,{default:e(()=>{var a,c;return[n(y,{onClick:(a=d.value)==null?void 0:a.getData},{default:e(()=>[r("重置")]),_:1},8,["onClick"]),n(y,{type:"primary",onClick:(c=d.value)==null?void 0:c.submit},{default:e(()=>[r("保存")]),_:1},8,["onClick"])]}),_:1})]),_:1})]),_:1})]),_:1}),n(A,{ref_key:"formRef",ref:d,loading:_.value,"onUpdate:loading":f[0]||(f[0]=a=>_.value=a),"plugin-name":t(g)},null,8,["loading","plugin-name"])]),_:1})]),_:1})),[[V,_.value]])}}});export{M as default};