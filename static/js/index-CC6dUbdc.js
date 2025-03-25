import{d as V,r as l,o as k,ao as N,u as O,i as A,M as m,v as r,j as E,A as i,C as I,b3 as J,x as K,aF as T}from"./index-CpafBiW4.js";import{_ as B,T as D}from"./vue-web-terminal-uwcx1Pu6.js";const L={class:"h-[70vh]"},R=V({name:"terminal",__name:"index",setup(U){const b=[{type:"normal",content:"Terminal Initializing ..."}],d=l(15),C=t=>d.value=t,n=l(),f=l(""),x=l(!1),a=l(null),u=l(),_=l(),M=(t,o,v,h,y)=>{if(o==="Ciallo～(∠・ω< )⌒☆"&&!x.value)n.value.pushMessage({type:"normal",content:"Authentication in progress..."}),a.value=T("terminal",{onmessage:s=>{try{const e=JSON.parse(s.data);e.type==="output"?n.value.pushMessage({type:"normal",content:e.content}):e.type==="error"?n.value.pushMessage({type:"normal",content:e.content,class:"error",tag:"error"}):e.type==="directory"?f.value=e.content:e.type==="close"&&u.value.finish()}catch(e){n.value.pushMessage({type:"table",content:e,class:"error",tag:"error"}),u.value.finish();return}},onopen:()=>{x.value=!0,n.value.pushMessage({type:"normal",content:"Authentication successful.",class:"success"}),n.value.pushMessage({type:"normal",content:"tip: 不可以实现SSH客户端, 不能处理tsab、vim等带有其他键盘、鼠标、窗口行为的 ANSI 控制码的指令",class:"info"}),v(),_.value=setInterval(()=>{a.value.send(JSON.stringify({time:Math.floor(Date.now()/1e3),action:"ping"}))},3e4)},onerror:s=>{n.value.pushMessage({type:"table",content:s,class:"error",tag:"error"}),u.value.finish(),a.value=null},onclose:s=>{var e,c;clearInterval(_.value),_.value=null,(e=n.value)==null||e.pushMessage({type:"normal",content:"终端已关闭！",class:"error",tag:"error"}),(c=u.value)==null||c.finish(),a.value=null}});else{const e=o.split(" ").slice(1),c={action:"execute",command:t,args:e,workingDirectory:f.value};a.value.readyState===1?(a.value.send(JSON.stringify(c)),u.value=new D,v(u.value)):h("终端连接异常！")}},w=t=>{t.ctrlKey&&t.keyCode===67&&(t.preventDefault(),a.value&&a.value.send(JSON.stringify({action:"terminate"})))},p=l(""),S=t=>{p.value&&(n.value.execute(p.value),p.value="")};return k(()=>{n.value.execute("Ciallo～(∠・ω< )⌒☆"),window.addEventListener("keydown",w)}),N(()=>{a.value&&a.value.close(),window.removeEventListener("keydown",w)}),(t,o)=>{const v=i("el-text"),h=i("el-input-number"),y=i("el-col"),s=i("el-input"),e=i("el-row"),c=i("el-card");return A(),O(c,null,{default:m(()=>[r(e,null,{default:m(()=>[r(y,{xs:24,md:6,lg:5,xl:3,class:"mb-[10px]"},{default:m(()=>[r(v,null,{default:m(()=>[I("行高")]),_:1}),r(h,{modelValue:d.value,"onUpdate:modelValue":o[0]||(o[0]=g=>d.value=g),class:"ml-[10px]",min:1,max:100,onChange:C},null,8,["modelValue"])]),_:1}),r(y,{xs:24,md:18,lg:19,xl:21,class:"mb-[10px]"},{default:m(()=>[r(s,{modelValue:p.value,"onUpdate:modelValue":o[1]||(o[1]=g=>p.value=g),placeholder:"若终端输入有异常可在此输入命令",onKeydown:J(S,["enter"])},null,8,["modelValue"])]),_:1})]),_:1}),E("div",L,[r(K(B),{ref_key:"terminalRef",ref:n,name:"terminal",context:f.value,"init-log":b,"show-header":!1,"line-space":d.value,"enable-default-command":!1,onExecCmd:M},null,8,["context","line-space"])])]),_:1})}}});export{R as default};
