import{d as s,aj as n,c,r as p,bj as d,H as l,g as m,i as y,n as f}from"./index-CpafBiW4.js";const b=s({__name:"ChartBar",props:{sent:{type:Array,default:()=>[]},recv:{type:Array,default:()=>[]},time:{type:Array,default:()=>[]}},setup(a){const e=a,{isDark:r}=n(),o=c(()=>r.value?"dark":"light"),t=p(),{setOptions:i}=d(t,{theme:o});return l(()=>e,async()=>{await f(),i({container:".bar-card",color:["#41b6ff","#e85f33"],tooltip:{trigger:"axis",axisPointer:{type:"none"}},grid:{top:"20px",left:"50px",right:"80px"},legend:{data:["接收消息","发送消息"],textStyle:{color:"#606266",fontSize:"0.875rem"},bottom:0},xAxis:[{type:"category",data:e.time,axisLabel:{fontSize:"0.875rem"},axisPointer:{type:"shadow"}}],yAxis:[{type:"value",axisLabel:{fontSize:"0.875rem"},splitLine:{show:!1}}],series:[{name:"接收消息",type:"bar",barWidth:10,itemStyle:{color:"#41b6ff",borderRadius:[10,10,0,0]},data:e.recv,markPoint:{data:[{type:"average",name:"平均值"}]}},{name:"发送消息",type:"bar",barWidth:10,itemStyle:{color:"#e86033ce",borderRadius:[10,10,0,0]},data:e.sent,markPoint:{data:[{type:"average",name:"平均值"}]}}]})},{deep:!0,immediate:!0}),(x,h)=>(y(),m("div",{ref_key:"chartRef",ref:t,style:{width:"100%",height:"365px"}},null,512))}});export{b as _};
