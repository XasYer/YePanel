import{d as J,e as o,aD as ge,H as be,o as _e,aE as ye,h as ke,u as S,P as s,t as ae,w as _,k as y,aF as K,aG as xe,aH as we,aI as te,aJ as Ie,aK as G,aL as le,A as h,i as d,y as t,aM as se,C as $,aN as ne,c as L,q as oe,F as re,B as U,x as B,b as Q,v as Se,aO as Me,D as Ce,E as Le,l as Te,aP as Ve,_ as Ee}from"./index-C1DCms5E.js";import ie from"./menu-CoWIv_VA.js";import{P as Ne}from"./index-BOPFo7cB.js";const We={key:0,class:"flex mb-[10px]"},$e={class:"ml-[20px]"},De={class:"flex items-center"},He={key:1,class:"flex-c"},Ue={key:1,class:"flex-c w-full h-[90%]"},Be=J({name:"sandbox",__name:"index",setup(Ae){const A=o(null),f=ge(),M=o(window.innerWidth<992),R=o(window.innerWidth<768),X=o(window.innerHeight),D=o(X.value*.8),O=o(),Y=()=>{M.value=window.innerWidth<992,R.value=window.innerWidth<768},P=o(!1),ue=["Ben","Chris","David","Emma","Frank","Grace","Henry","Isabel","Jack","Kevin","Lucy","Michael","Nancy","Olivia","Paul","Quinn","Ryan","Sarah","Tom","Ursula","Victor","William","Xavier","Yvonne","Zoe"],x=o("private"),r=o("Alice"),q=o([{name:"Alice",selfId:f.uin,userId:"Alice"}]);be([x,r],()=>{V()});const ce=(e,a)=>{if(e==="selectUser")return P.value=!0,!1},Z=()=>{const e=ue.shift();if(!e){K("没有更多用户了",{type:"warning",customClass:"el"});return}q.value.push({name:e,selfId:f.uin,userId:e}),T.value[e]="user",m.value.private[e]=[]},j=o(0),T=o({Alice:"master"}),ee=e=>{r.value=e,E.value={sendType:j.value,permission:T.value[e]||"user"}},m=o({private:{Alice:[]},group:[]}),z=o(null),k=o(""),de=e=>{if(e.key==="Enter")if(e.preventDefault(),E.value.sendType===1&&e.ctrlKey||E.value.sendType===0&&!e.ctrlKey){if(!k.value.trim())return;F(k.value,!0)}else{const a=e.target,n=a.selectionStart,u=a.selectionEnd;k.value=k.value.substring(0,n)+`
`+k.value.substring(u),a.setSelectionRange(n,n)}},F=(e,a=!0)=>{const n=Ve("sandbox.");if(W.value.send(JSON.stringify({type:"message",uin:f.uin,userId:r.value,groupId:x.value==="group"?"sandbox.group":void 0,content:e,msgId:n,permission:T.value[r.value]})),a){const u=x.value==="private"?m.value.private[r.value]:m.value.group,c=e.replace(/\n|\r/g,"<br>").replace(/\s|\t/g,"&nbsp;");u.push({name:r.value,msgId:n,rawMessage:e,message:J({render(){return y("div",{class:"message",innerHTML:c,style:{maxWidth:`${O.value}px`}})}})}),k.value="",V()}},pe=e=>{e.rawMessage&&F(e.rawMessage,!0)},V=()=>{Te(()=>{const e=z.value.wrapRef.scrollHeight;z.value.setScrollTop(e)})},E=o({sendType:j.value,permission:"master"}),ve=[{label:"用户权限",prop:"permission",valueType:"radio",fieldProps:{onChange:e=>{T.value[r.value]=e}},options:[{label:"群主",value:"owner"},{label:"管理员",value:"admin"},{label:"普通用户",value:"user"},{label:"主人",value:"master"}]},{label:"发送方式",prop:"sendType",valueType:"radio",options:[{label:"enter",value:0},{label:"ctrl+enter",value:1}]}],N=o(!0),W=o(null);_e(()=>{window.addEventListener("resize",Y),O.value=(A.value.$el.clientWidth-140-(M.value?60:200))*(M.value?1.1:.8),W.value=ye("sandbox",{onopen(e){W.value.send(JSON.stringify({type:"create",uin:f.uin,nickname:f.nickname,avatar:f.avatar})),N.value=!1},onmessage(e){const a=JSON.parse(e.data),{type:n,id:u,content:c,msgId:w}=a,l=me(c,n==="friend"?"private":"group",u);if(l.length===0)return;const I={name:f.nickname,avatar:f.avatar,msgId:w,bot:!0,message:J({render(){return y("div",{class:"message",style:{maxWidth:`${O.value}px`}},l)}})};switch(n){case"friend":m.value.private[u].push(I);break;case"group":m.value.group.push(I);break}(n==="group"||u===r.value)&&V()},onclose(){N.value||(K("连接已关闭",{type:"error",customClass:"el"}),N.value=!0)}})}),ke(()=>{var e,a;window.removeEventListener("resize",Y),N.value=!0,(a=(e=W.value).close)==null||a.call(e)});const fe=e=>{const a=e.bot?f.uin:e.name,n=r.value;(x.value==="private"?m.value.private[r.value]:m.value.group).push({poke:{operatorId:n,targetId:e.name}}),W.value.send(JSON.stringify({type:"poke",uin:f.uin,groupId:x.value==="group"?"sandbox.group":void 0,userId:r.value,operatorId:n,targetId:a,permission:T.value[r.value]})),V()},me=(e,a,n)=>{const u=a==="private"?m.value.private[n]:m.value.group,c=[],w=[];for(const l of e)switch(l.type){case"poke":return u.push({poke:{operatorId:f.nickname,targetId:l.qq}}),V(),[];case"at":c.push(y(le,{type:"primary",underline:!1},`@${l.qq}`));break;case"reply":const I=u.find(b=>b.msgId===l.id);I&&c.push(y(I.message,{className:"bg-[#f2f2f2] rounded-lg px-2 h-[24px] overflow-hidden"}));break;case"text":c.push(y(G,{innerHTML:l.text.replace(/\n|\r/g,"<br>").replace(/\s|\t/g,"&nbsp;"),tag:"b"}));break;case"image":if(l.file.startsWith("http")){const b=Date.now();l.file=l.file.includes("?")?l.file+`&t=${b}`:l.file+`?t=${b}`}c.push(y(Ie,{src:l.file,fit:"contain",previewSrcList:[l.file],style:"height: 400px"}));break;case"button":const g=[];for(const b of l.data){let H=Math.max(1,Math.min(5,b.length));for(const p of b){M.value&&g.length>=5&&(K(`手机端宽度限制,已将第${g.length+1}行中大于5个的按钮换到下一行`,{type:"warning",customClass:"el"}),H=Math.max(1,Math.min(5,b.length%5)),w.push(y("div",{class:"flex"},[...g])),g.length=0);const C={plain:!0,type:"primary"};switch(Number(p.style)){case 0:case 2:C.type="default";break;case 3:C.type="danger";break;case 4:C.plain=!1;break}g.push(y(te,{style:`width: ${100/H}%;`,class:"mb-2 truncate text-ellipsis",icon:p.link?xe:void 0,...C,onClick:()=>{p.callback?F(p.callback,!1):p.input?k.value=p.input:p.link&&we(p.link)}},p.text))}g.length&&w.push(y("div",{class:"flex"},[...g])),g.length=0}break;default:c.push(y("div",{innerHTML:"[暂不支持本消息类型]"}))}return w.length&&c.push(...w),c};return(e,a)=>{const n=h("el-result"),u=h("el-aside"),c=h("el-avatar"),w=h("el-popover"),l=h("el-tab-pane"),I=h("el-tabs"),g=h("el-main"),b=h("el-input"),H=h("el-footer"),p=h("el-container"),C=h("el-drawer");return N.value?(d(),S(_(se),{key:0,ref_key:"cardRef",ref:A,class:"flex-c",style:ae({height:`${D.value}px`})},{default:s(()=>[t(n,{icon:"info",title:"加载中..."})]),_:1},8,["style"])):(d(),S(_(se),{key:1,ref_key:"cardRef",ref:A,class:"p-0","body-style":"padding: 0;",style:ae({height:`${D.value}px`})},{default:s(()=>[t(p,null,{default:s(()=>[R.value?$("",!0):(d(),S(u,{key:0,width:M.value?"60px":"200px"},{default:s(()=>[t(ie,{"is-collapse":M.value,addUser:Z,userList:q.value,handleSelectMenu:ee,height:D.value-70},null,8,["is-collapse","userList","height"])]),_:1},8,["width"])),t(p,null,{default:s(()=>[t(g,null,{default:s(()=>[r.value?(d(),S(I,{key:0,modelValue:x.value,"onUpdate:modelValue":a[1]||(a[1]=i=>x.value=i),"before-leave":ce},{default:s(()=>[t(_(ne),{ref_key:"messageScrollbarRef",ref:z,height:`${D.value-180}px`},{default:s(()=>[(d(),L(re,null,oe([{name:"private",label:"私聊"},{name:"group",label:"群聊"}],i=>t(l,{key:i.name,label:i.label,name:i.name},{default:s(()=>[(d(!0),L(re,null,oe(i.name==="private"?m.value[i.name][r.value]:m.value[i.name],v=>(d(),L("div",{key:v.msgId},[v.message?(d(),L("div",We,[t(w,{trigger:"click"},{reference:s(()=>[t(c,{src:v.avatar,size:40,class:"mt-[5px]"},{default:s(()=>[U(B(v.name.slice(0,1)),1)]),_:2},1032,["src"])]),default:s(()=>[t(_(le),{underline:!1,class:"w-full",onClick:he=>fe(v)},{default:s(()=>[U(" 戳一戳 ")]),_:2},1032,["onClick"])]),_:2},1024),Q("div",$e,[Q("div",null,[t(_(G),{tag:"b"},{default:s(()=>[U(B(v.name),1)]),_:2},1024)]),Q("div",De,[(d(),S(Se(v.message))),v.bot?$("",!0):(d(),S(_(te),{key:0,circle:"",type:"info",class:"ml-[10px]",onClick:he=>pe(v)},{default:s(()=>[t(_(Me),{icon:"mdi:plus-one",width:23,height:24})]),_:2},1032,["onClick"]))])])])):$("",!0),v.poke?(d(),L("div",He,[t(_(G),{class:"text-center"},{default:s(()=>[U(B(v.poke.operatorId)+" 戳了戳 "+B(v.poke.targetId),1)]),_:2},1024)])):$("",!0)]))),128))]),_:2},1032,["label","name"])),64)),t(l,{label:"设置",name:"setting"},{default:s(()=>[t(_(Ne),{modelValue:E.value,"onUpdate:modelValue":a[0]||(a[0]=i=>E.value=i),columns:ve,"inline-message":"","label-position":"right",class:"mt-5",labelWidth:"100px","col-props":{span:13,lg:13,sm:24,xs:24},hasFooter:!1},null,8,["modelValue"])]),_:1}),R.value?(d(),S(l,{key:0,label:"切换用户",name:"selectUser"})):$("",!0)]),_:1},8,["height"])]),_:1},8,["modelValue"])):(d(),L("div",Ue,[t(n,{icon:"warning",title:"请选择用户","sub-title":"请在左侧选择用户"})]))]),_:1}),Ce(t(H,{height:"80px",class:"flex w-full items-center"},{default:s(()=>[t(_(ne),{style:{width:"100%"}},{default:s(()=>[t(b,{modelValue:k.value,"onUpdate:modelValue":a[2]||(a[2]=i=>k.value=i),type:"textarea",placeholder:"请输入消息内容",rows:3,resize:"none",onKeydown:de},null,8,["modelValue"])]),_:1})]),_:1},512),[[Le,x.value!=="setting"&&r.value]])]),_:1})]),_:1}),t(C,{modelValue:P.value,"onUpdate:modelValue":a[3]||(a[3]=i=>P.value=i),"with-header":!1,direction:"ltr",size:200},{default:s(()=>[t(ie,{"is-collapse":!1,addUser:Z,userList:q.value,handleSelectMenu:ee,height:X.value},null,8,["userList","height"])]),_:1},8,["modelValue"])]),_:1},8,["style"]))}}}),qe=Ee(Be,[["__scopeId","data-v-ecf60c7d"]]);export{qe as default};