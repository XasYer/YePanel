import{d,aj as m,c as p,r as b,bj as g,H as y,g as _,i as k,n as v}from"./index-CpafBiW4.js";const D=d({__name:"ChartPie",props:{chartData:{type:Array,required:!0}},setup(i){const a=i,{isDark:c}=m();let l=p(()=>c.value?"dark":"default");const n=b(),{setOptions:f}=g(n,{theme:l});return y(()=>a.chartData,async()=>{await v(),f({tooltip:{trigger:"item",position:function(e,s,t,o,u){const r=e[0],h=u.viewSize[0];return r<h/2?[r+20,e[1]]:t instanceof HTMLDivElement?[r-t.offsetWidth-20,e[1]]:[r-100,e[1]]},formatter:"{b}<br/>{c}次 ({d}%)"},series:[{name:"调用统计",type:"pie",roseType:"area",radius:["20%","70%"],avoidLabelOverlap:!1,itemStyle:{borderRadius:10,borderColor:"#fff",borderWidth:2},data:a.chartData,label:{formatter:function(e){if(/^(.+)\((.+)\)$/.test(e.name)){const[,t,o]=e.name.match(/^(.+)\((.+)\)$/);return`${t}
${o}`}else return e.name}},labelLine:{length:5,length2:5,minTurnAngle:30,smooth:!0}}]})}),(e,s)=>(k(),_("div",{ref_key:"chartRef",ref:n,style:{width:"100%",height:"370px"}},null,512))}});export{D as default};
