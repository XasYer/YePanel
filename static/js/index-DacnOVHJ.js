import{S as f}from"./index-glDPGLTR.js";import"./index-CpafBiW4.js";var r="><+-.,[]".split("");const o={name:"brainfuck",startState:function(){return{commentLine:!1,left:0,right:0,commentLoop:!1}},token:function(i,n){if(i.eatSpace())return null;i.sol()&&(n.commentLine=!1);var e=i.next().toString();if(r.indexOf(e)!==-1){if(n.commentLine===!0)return i.eol()&&(n.commentLine=!1),"comment";if(e==="]"||e==="[")return e==="["?n.left++:n.right++,"bracket";if(e==="+"||e==="-")return"keyword";if(e==="<"||e===">")return"atom";if(e==="."||e===",")return"def"}else return n.commentLine=!0,i.eol()&&(n.commentLine=!1),"comment";i.eol()&&(n.commentLine=!1)}},m={language:()=>f.define(o),ext:"bf"};export{m as default};
