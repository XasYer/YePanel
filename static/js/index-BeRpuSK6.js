import{f as ge,h as ye,i as Ce,j as ke,k as xe}from"./database-LwlVviPM.js";import{d as we,r as n,H as A,D as Ve,V as De,i as u,u as i,M as a,v as o,j as x,A as s,C as p,g as I,q,F as R,x as U,aU as Se,aB as $e,B as Z,aI as V,aJ as ee,y as le,aR as P,h as ae,_ as Ie}from"./index-CpafBiW4.js";import{_ as qe}from"./add.vue_vue_type_script_setup_true_lang-D9pfeYNh.js";import{_ as Re}from"./sql.vue_vue_type_script_setup_true_lang-ZBClxfcW.js";import"./index-DtyQLxZ-.js";import"./index-glDPGLTR.js";import"./index-BkB1o4-I.js";const Ue={class:"flex-c"},ze={class:"flex-c"},Be={class:"flex-c"},Te={class:"flex"},Ae={class:"flex"},je={class:"mr-[10px]"},Fe=we({name:"sqlite",__name:"index",setup(Le){const z=n(!0),r=n(""),E=n([]),b=n(""),W=n([]),H=n([]),J=n(0),j=n(),K=n(!1),M=n(!0),te=t=>{y.value=t?f.value:[],M.value=!1},f=n([]),y=n([]),D=n([]),oe=t=>{y.value.sort((e,d)=>f.value.indexOf(e)-f.value.indexOf(d))},G=(t,e)=>{e?D.value=D.value.filter(d=>d!==t):D.value.push(t)},g=n(""),S=n(),ne=()=>{!S.value.length&&g.value?V("请选择搜索列",{type:"error",customClass:"el"}):(C.value=1,L.value=!L.value)},B=n(),F=n(!1),Q=(t,e)=>{F.value=!1;const d=t==="新增数据"?"add":"edit";ee({width:window.innerWidth<992?"90%":"50%",title:t,contentRenderer:()=>ae(qe,{ref:B}),top:"10vh",draggable:!0,props:{data:{columns:f.value,tableInfo:j.value,value:e||f.value.reduce((m,_)=>(m[_]="",m),{}),type:d}},closeCallBack:({options:m,args:_})=>{if((_==null?void 0:_.command)==="sure"){const h=B.value.getData();for(const c in h)h[c]||delete h[c];ke(r.value,b.value,h).then(c=>{c.success?V("操作成功~ Ciallo～(∠・ω< )⌒☆",{type:"success",customClass:"el"}):V(`操作失败: ${c.message}`,{type:"error",customClass:"el"}),T()})}},beforeSure(m,{options:_,index:h}){B.value.getRef().validate(O=>{if(O){const $=B.value.getData();for(const N in $)if($[N]){m();return}if(F.value){m();return}V("真的什么都不填吗?",{type:"warning",customClass:"el"}),F.value=!0}})}})},ue=t=>{ye(r.value,b.value,t).then(e=>{e.success?V("删除成功~ Ciallo～(∠・ω< )⌒☆",{type:"success",customClass:"el"}):V(`删除失败: ${e.message}`,{type:"error",customClass:"el"}),T()})},se=()=>{ee({width:window.innerWidth<992?"90%":"50%",title:`自定义sql语句 table: ${b.value}`,contentRenderer:()=>ae(Re),top:"3vh",props:{path:r.value},draggable:!0,hideFooter:!0,closeCallBack:()=>k.value=!k.value})},C=n(1),w=n(20),re=t=>{w.value=t},ce=t=>{C.value=t};ge().then(t=>{E.value=t.data,w.value?r.value=t.data[0]:z.value=!1});const L=n(!1),k=n(!1);A(r,()=>{xe(r.value).then(t=>{b.value=t.data[0],W.value=t.data,k.value=!k.value,g.value=""})}),A([b,k],([t],[e])=>{t!==e&&(C.value=1),g.value="",T()}),A([w,C,L],()=>{T()}),A(f,t=>y.value=t.filter(e=>!["createdAt","updatedAt"].includes(e)));const T=()=>{z.value=!0;let t="";g.value&&(S.value.forEach(e=>{t+=`${e} LIKE '%${g.value}%' OR `}),t=t.slice(0,-4)),Ce(r.value,b.value,C.value,w.value,t).then(e=>{f.value=[],z.value=!1,H.value=e.data,j.value=e.tableInfo,J.value=e.total,f.value=Object.keys(e.tableInfo),g.value||(S.value=[f.value[0]])})};return(t,e)=>{const d=s("el-text"),m=s("el-option"),_=s("el-select"),h=s("el-col"),c=s("el-button"),O=s("el-input"),$=s("el-checkbox"),N=s("el-checkbox-group"),ie=s("el-scrollbar"),de=s("el-popover"),ve=s("el-row"),X=s("el-table-column"),Y=s("el-link"),pe=s("el-popconfirm"),fe=s("el-table"),me=s("el-pagination"),_e=s("el-card"),he=De("loading");return Ve((u(),i(_e,null,{default:a(()=>[o(ve,{gutter:20},{default:a(()=>[o(h,{xs:24,lg:6},{default:a(()=>[x("div",Ue,[o(d,{tag:"b",class:"w-[60px]"},{default:a(()=>[p("数据源:")]),_:1}),o(_,{modelValue:r.value,"onUpdate:modelValue":e[0]||(e[0]=l=>r.value=l)},{default:a(()=>[(u(!0),I(R,null,q(E.value,l=>(u(),i(m,{key:l,label:l,value:l},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])]),_:1}),o(h,{xs:24,lg:3},{default:a(()=>[x("div",ze,[o(d,{tag:"b",class:"w-[50px]"},{default:a(()=>[p("表名:")]),_:1}),o(_,{modelValue:b.value,"onUpdate:modelValue":e[1]||(e[1]=l=>b.value=l)},{default:a(()=>[(u(!0),I(R,null,q(W.value,l=>(u(),i(m,{key:l,label:l,value:l},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])]),_:1}),o(h,{xs:24,lg:6},{default:a(()=>[x("div",Be,[o(d,{tag:"b",class:"w-[50px]"},{default:a(()=>[p("搜索:")]),_:1}),o(O,{modelValue:g.value,"onUpdate:modelValue":e[3]||(e[3]=l=>g.value=l),placeholder:"支持模糊搜索"},{prepend:a(()=>[o(_,{modelValue:S.value,"onUpdate:modelValue":e[2]||(e[2]=l=>S.value=l),placeholder:"搜索列",style:{width:"100px"},multiple:"","collapse-tags":"",clearable:""},{default:a(()=>[(u(!0),I(R,null,q(y.value,l=>(u(),i(m,{key:l,label:l,value:l},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),append:a(()=>[o(c,{icon:U(Se),disabled:!r.value,onClick:ne},null,8,["icon","disabled"])]),_:1},8,["modelValue"])])]),_:1}),o(h,{xs:24,lg:1},{default:a(()=>[x("div",Te,[o(c,{type:"primary",disabled:!r.value,onClick:e[4]||(e[4]=l=>k.value=!k.value)},{default:a(()=>[p("重置")]),_:1},8,["disabled"]),o(c,{type:"success",disabled:!r.value,onClick:e[5]||(e[5]=l=>Q("新增数据"))},{default:a(()=>[p("新增")]),_:1},8,["disabled"]),o(c,{type:"primary",disabled:!r.value,onClick:se},{default:a(()=>[p("sql")]),_:1},8,["disabled"]),o(de,{placement:"bottom",title:"展示列",width:150,trigger:"click"},{reference:a(()=>[o(c,{type:"primary",icon:U($e)},null,8,["icon"])]),default:a(()=>[o(ie,{height:"300px"},{default:a(()=>[o($,{modelValue:K.value,"onUpdate:modelValue":e[6]||(e[6]=l=>K.value=l),indeterminate:M.value,onChange:te},{default:a(()=>[p(" Check all ")]),_:1},8,["modelValue","indeterminate"]),o(N,{modelValue:y.value,"onUpdate:modelValue":e[7]||(e[7]=l=>y.value=l),class:"flex flex-col",onChange:oe},{default:a(()=>[(u(!0),I(R,null,q(f.value,l=>(u(),i($,{key:l,label:l,value:l},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1})]),_:1})])]),_:1})]),_:1}),x("div",null,[o(fe,{ref:"tableRef",data:H.value,height:"65vh",border:"",stripe:"",class:"mb-[20px]"},{default:a(()=>[(u(!0),I(R,null,q(y.value,l=>(u(),i(X,{key:l,prop:l,label:l,"show-overflow-tooltip":{effect:"light"}},{header:a(v=>[x("div",Ae,[j.value[v.column.label].pk?(u(),i(U(P),{key:0,icon:"mdi:primary-key",width:24,height:24,class:"mr-[10px]"})):Z("",!0),x("span",je,le(v.column.label),1),D.value.includes(v.column.label)?(u(),i(U(P),{key:1,icon:"mdi:eye",width:20,height:20,class:"cursor-pointer",onClick:be=>G(v.column.label,!0)},null,8,["onClick"])):(u(),i(U(P),{key:2,icon:"mdi:eye-off",width:20,height:20,class:"cursor-pointer",onClick:be=>G(v.column.label,!1)},null,8,["onClick"]))])]),default:a(v=>[D.value.includes(v.column.label)?(u(),i(d,{key:0},{default:a(()=>[p(" *** ")]),_:1})):(u(),i(d,{key:1},{default:a(()=>[p(le(v.row[v.column.label]),1)]),_:2},1024))]),_:2},1032,["prop","label"]))),128)),r.value?(u(),i(X,{key:0,fixed:"right",label:"操作",width:"120px"},{default:a(l=>[o(Y,{underline:!1,type:"primary",onClick:v=>Q("修改数据",l.row)},{default:a(()=>[p(" 编辑 ")]),_:2},1032,["onClick"]),o(pe,{title:"确认删除吗？",onConfirm:v=>ue(l.row)},{reference:a(()=>[o(Y,{underline:!1,type:"danger"},{default:a(()=>[p("删除")]),_:1})]),_:2},1032,["onConfirm"])]),_:1})):Z("",!0)]),_:1},8,["data"]),o(me,{"current-page":C.value,"onUpdate:currentPage":e[8]||(e[8]=l=>C.value=l),"page-size":w.value,"onUpdate:pageSize":e[9]||(e[9]=l=>w.value=l),"page-sizes":[5,10,20,50,100],layout:"total, sizes, prev, pager, next, jumper",total:J.value,class:"flex flex-wrap justify-start",onSizeChange:re,onCurrentChange:ce},null,8,["current-page","page-size","total"])])]),_:1})),[[he,z.value]])}}}),Ke=Ie(Fe,[["__scopeId","data-v-69282291"]]);export{Ke as default};
