import{d as h,u as i,i as c,A as s,M as e,v as a,x as r,aR as d,C as o,g as f,q as C,F as g,y as u,_ as x}from"./index-CpafBiW4.js";const k=h({__name:"menu",props:{isCollapse:{type:Boolean},userList:{},handleSelectMenu:{type:Function},addUser:{type:Function},addCustomUser:{type:Function},height:{}},setup(y){return(t,v)=>{const l=s("el-menu-item"),p=s("el-avatar"),_=s("el-scrollbar"),m=s("el-menu");return c(),i(m,{collapse:t.isCollapse,"default-active":"Alice",onSelect:t.handleSelectMenu},{default:e(()=>[a(l,{onClick:t.addUser},{title:e(()=>[o("添加用户")]),default:e(()=>[a(r(d),{icon:"gridicons:add",heigth:40,width:40,class:"mx-[5px]"})]),_:1},8,["onClick"]),a(l,{onClick:t.addCustomUser},{title:e(()=>[o("添加自定义用户")]),default:e(()=>[a(r(d),{icon:"gridicons:add",heigth:40,width:40,class:"mx-[5px]"})]),_:1},8,["onClick"]),a(_,{height:`${t.height}px`},{default:e(()=>[(c(!0),f(g,null,C(t.userList,n=>(c(),i(l,{key:n.userId,index:n.userId},{title:e(()=>[o(u(n.name),1)]),default:e(()=>[a(p,{size:40,class:"mx-[5px]",src:n.avatar},{default:e(()=>[o(u(n.name.slice(0,1)),1)]),_:2},1032,["src"])]),_:2},1032,["index"]))),128))]),_:1},8,["height"])]),_:1},8,["collapse","onSelect"])}}}),I=x(k,[["__scopeId","data-v-6a416eef"]]);export{I as default};
