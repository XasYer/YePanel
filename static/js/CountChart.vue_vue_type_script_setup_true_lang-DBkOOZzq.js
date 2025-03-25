import{d as n,aj as s,c as p,r as l,bj as c,H as d,g as m,i as y,n as f}from"./index-CpafBiW4.js";const g=n({__name:"CountChart",props:{sent:{type:Array,default:()=>[]},recv:{type:Array,default:()=>[]},plugin:{type:Array,default:()=>[]},time:{type:Array}},setup(a){const e=a,{isDark:r}=s(),i=p(()=>r.value?"dark":"light"),t=l(),{setOptions:o}=c(t,{theme:i});return d(()=>e,async()=>{await f(),o({container:".bar-card",color:["#41b6ff","#e85f33"],tooltip:{trigger:"axis",axisPointer:{type:"none"}},grid:{top:"20px",left:"50px",right:"80px"},legend:{data:["接收消息","发送消息","插件调用"],textStyle:{color:"#606266",fontSize:"0.875rem"},bottom:0},xAxis:[{type:"category",data:e.time,axisLabel:{fontSize:"0.875rem"},axisPointer:{type:"shadow"}}],yAxis:[{type:"value",axisLabel:{fontSize:"0.875rem"},splitLine:{show:!1}},{type:"value",position:"right",alignTicks:!0,axisLabel:{fontSize:"0.875rem"},splitLine:{show:!1}}],series:[{name:"接收消息",type:"bar",barWidth:10,itemStyle:{color:"#41b6ff",borderRadius:[10,10,0,0]},data:e.recv,markPoint:{data:[{type:"average",name:"平均值"}]}},{name:"发送消息",type:"bar",barWidth:10,itemStyle:{color:"#e86033ce",borderRadius:[10,10,0,0]},data:e.sent,markPoint:{data:[{type:"average",name:"平均值"}]}},{name:"插件调用",type:"line",yAxisIndex:1,itemStyle:{color:"#8B864E"},data:e.plugin,markPoint:{data:[{type:"average",name:"平均值"}]}}]})},{deep:!0,immediate:!0}),(u,x)=>(y(),m("div",{ref_key:"chartRef",ref:t,style:{width:"100%",height:"290px"}},null,512))}});export{g as _};
