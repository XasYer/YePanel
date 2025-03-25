import{d as b,aY as x,r as l,aZ as C,g as w,i as r,v as a,M as i,A as u,x as v,u as c,a_ as E,w as S,n as T,aR as B,a$ as N,aJ as U,aI as D,b0 as P,b1 as V,b2 as I}from"./index-CpafBiW4.js";import{i as q,p as R}from"./vue3-sfc-loader.esm-PKBrW54u.js";import{o as $,T as z}from"./index-glDPGLTR.js";import{v as A}from"./index-oNmlPV8k.js";import{E as F}from"./index-DtyQLxZ-.js";import"./sortable.esm-C0-Qcoum.js";import"./index-Do4h9ug4.js";import"./index-DlJgwpvx.js";import"./index-Cw40qwX8.js";const K=b({name:"vue",__name:"index",setup(L){const h=(n,e,t,o)=>I.request(n,e,t,o);x().accessToken;const m=l(`<template>
  <el-card> Ciallo～(∠・ω< )⌒☆ </el-card>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { ElCard } from "element-plus";
import * as echarts from "echarts";
// https://icon-sets.iconify.design/
// 使用: <iconify icon="mdi:home" :width="24" :height="24" />
import iconify from "iconify"
// https://pure-admin-utils.netlify.app/
import * as utils from "@pureadmin/utils"
// https://plus-pro-components.com/
import * as PlusProComponents from 'plus-pro-components'
// Too more please pr or issue...

const props = defineProps({
  // method, url, param, axiosConfig
  // 如果需要访问其他api, 可以设置param.baseURL
  request: Function,
  // 登录时填写的url
  baseUrl: String,
  // 插件名 如果有的话
  pluginName: String,
  /// 登录后获得的token, 可用于ws鉴权 new WebSocket(url, accessToken)
  accessToken: String,
})

<\/script>`),d=l(),s=l(""),p=l(!0),_=[A(),$],f=()=>{p.value=!0,s.value="",T(()=>{q("edit.vue",{getFile:()=>m.value,moduleCache:{vue:V,"plus-pro-components":R,"element-plus":F,echarts:P,"@message":D,"@addDialog":U,"@pureadmin/utils":N,iconify:B},addStyle(e){let t=document.getElementById("dev-vue-styles");if(t)t.textContent=e;else{t=Object.assign(document.createElement("style"),{id:"dev-vue-styles",textContent:e});const o=document.head.getElementsByTagName("style")[0]||null;document.head.insertBefore(t,o)}}}).then(e=>{d.value=e,p.value=!1}).catch(e=>{s.value=e.toString()})})};return C((n,e,t)=>(e.$options.__name==="edit"&&(s.value=n.toString()),!1)),(n,e)=>{const t=u("el-card"),o=u("el-col"),g=u("el-result"),y=u("el-row");return r(),w("div",null,[a(y,{gutter:24},{default:i(()=>[a(o,{xl:12,xs:24,lg:24},{default:i(()=>[a(t,{class:"h-[80vh]"},{default:i(()=>[a(v(z),{modelValue:m.value,"onUpdate:modelValue":e[0]||(e[0]=k=>m.value=k),placeholder:"please input your code...",style:{height:"75vh",fontSize:"16px"},autofocus:!0,"indent-with-tab":!0,"tab-size":2,extensions:_,onReady:f,onChange:f},null,8,["modelValue"])]),_:1})]),_:1}),a(o,{xl:12,xs:24,lg:24},{default:i(()=>[s.value?(r(),c(g,{key:0,icon:"error",style:{height:"70vh"},title:"加载错误","sub-title":s.value},null,8,["sub-title"])):p.value?(r(),c(g,{key:1,style:{height:"70vh"},icon:"info",title:"加载中"})):(r(),c(S(d.value),{key:2,request:h,baseUrl:v(E)(),pluginName:"Dev"},null,8,["baseUrl"]))]),_:1})]),_:1})])}}});export{K as default};
