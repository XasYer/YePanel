import{d as b,aY as x,e as l,aZ as C,c as w,y as n,P as r,A as i,i as u,w as v,u as p,a_ as E,v as S,a$ as T,l as B,b0 as P,b1 as N,aG as U,aS as D,b2 as V,aP as q}from"./index-xwgbA_G8.js";import{i as I,p as $}from"./vue3-sfc-loader.esm-Bk5jwoMO.js";import{o as z,T as A}from"./index-BBIzkHyc.js";import{v as F}from"./index-h__02IWa.js";import{E as L}from"./index-1tmnVUg0.js";import"./sortable.esm-CVf2VYf1.js";import"./index-BFWiQxps.js";import"./index-BaLIZ0BP.js";import"./index-DPyuJ96m.js";const M=b({name:"vue",__name:"index",setup(O){const h=(a,e,t,o)=>T.request(a,e,t,o);x().accessToken;const c=l(`<template>
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

<\/script>`),d=l(),s=l(""),m=l(!0),y=[F(),z],f=()=>{m.value=!0,s.value="",B(()=>{I("edit.vue",{getFile:()=>c.value,moduleCache:{vue:P,"plus-pro-components":$,"element-plus":L,echarts:N,"@message":U,"@addDialog":D,"@pureadmin/utils":V,iconify:q},addStyle(e){let t=document.getElementById("dev-vue-styles");if(t)t.textContent=e;else{t=Object.assign(document.createElement("style"),{id:"dev-vue-styles",textContent:e});const o=document.head.getElementsByTagName("style")[0]||null;document.head.insertBefore(t,o)}}}).then(e=>{d.value=e,m.value=!1}).catch(e=>{s.value=e.toString()})})};return C((a,e,t)=>(e.$options.__name==="edit"&&(s.value=a.toString()),!1)),(a,e)=>{const t=i("el-card"),o=i("el-col"),g=i("el-result"),_=i("el-row");return u(),w("div",null,[n(_,{gutter:24},{default:r(()=>[n(o,{xl:12,xs:24,lg:24},{default:r(()=>[n(t,{class:"h-[80vh]"},{default:r(()=>[n(v(A),{modelValue:c.value,"onUpdate:modelValue":e[0]||(e[0]=k=>c.value=k),placeholder:"please input your code...",style:{height:"75vh",fontSize:"16px"},autofocus:!0,"indent-with-tab":!0,"tab-size":2,extensions:y,onReady:f,onChange:f},null,8,["modelValue"])]),_:1})]),_:1}),n(o,{xl:12,xs:24,lg:24},{default:r(()=>[s.value?(u(),p(g,{key:0,icon:"error",style:{height:"70vh"},title:"加载错误","sub-title":s.value},null,8,["sub-title"])):m.value?(u(),p(g,{key:1,style:{height:"70vh"},icon:"info",title:"加载中"})):(u(),p(S(d.value),{key:2,request:h,baseUrl:v(E)(),pluginName:"Dev"},null,8,["baseUrl"]))]),_:1})]),_:1})])}}});export{M as default};
