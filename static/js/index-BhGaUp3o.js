import{d as b,aX as x,e as l,aY as C,c as w,y as n,P as r,A as i,i as u,w as v,u as p,aZ as E,v as S,a_ as T,l as B,a$ as N,b0 as P,aF as U,aR as D,b1 as V,aO as q}from"./index-C1DCms5E.js";import{i as F,p as I}from"./vue3-sfc-loader.esm-CxdrzR-e.js";import{o as O,T as R}from"./index-D6_L85rf.js";import{v as $}from"./index-BCwwAbPH.js";import{E as z}from"./index-BOPFo7cB.js";import"./sortable.esm-C0-Qcoum.js";import"./index-PV9s_ZH2.js";import"./index-DVB5ERex.js";import"./index-DaDP_qQn.js";const K=b({name:"vue",__name:"index",setup(A){const h=(a,e,t,o)=>T.request(a,e,t,o);x().accessToken;const c=l(`<template>
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

<\/script>`),d=l(),s=l(""),m=l(!0),y=[$(),O],f=()=>{m.value=!0,s.value="",B(()=>{F("edit.vue",{getFile:()=>c.value,moduleCache:{vue:N,"plus-pro-components":I,"element-plus":z,echarts:P,"@message":U,"@addDialog":D,"@pureadmin/utils":V,iconify:q},addStyle(e){let t=document.getElementById("dev-vue-styles");if(t)t.textContent=e;else{t=Object.assign(document.createElement("style"),{id:"dev-vue-styles",textContent:e});const o=document.head.getElementsByTagName("style")[0]||null;document.head.insertBefore(t,o)}}}).then(e=>{d.value=e,m.value=!1}).catch(e=>{s.value=e.toString()})})};return C((a,e,t)=>(e.$options.__name==="edit"&&(s.value=a.toString()),!1)),(a,e)=>{const t=i("el-card"),o=i("el-col"),g=i("el-result"),_=i("el-row");return u(),w("div",null,[n(_,{gutter:24},{default:r(()=>[n(o,{xl:12,xs:24,lg:24},{default:r(()=>[n(t,{class:"h-[80vh]"},{default:r(()=>[n(v(R),{modelValue:c.value,"onUpdate:modelValue":e[0]||(e[0]=k=>c.value=k),placeholder:"please input your code...",style:{height:"75vh",fontSize:"16px"},autofocus:!0,"indent-with-tab":!0,"tab-size":2,extensions:y,onReady:f,onChange:f},null,8,["modelValue"])]),_:1})]),_:1}),n(o,{xl:12,xs:24,lg:24},{default:r(()=>[s.value?(u(),p(g,{key:0,icon:"error",style:{height:"70vh"},title:"加载错误","sub-title":s.value},null,8,["sub-title"])):m.value?(u(),p(g,{key:1,style:{height:"70vh"},icon:"info",title:"加载中"})):(u(),p(S(d.value),{key:2,request:h,baseUrl:v(E)(),pluginName:"Dev"},null,8,["baseUrl"]))]),_:1})]),_:1})])}}});export{K as default};
