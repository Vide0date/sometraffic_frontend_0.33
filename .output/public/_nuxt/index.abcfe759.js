import{a as m,r as n,x as u,S as _,e as f,i as e,j as b,f as g,k as p,R as h,o as x,m as w}from"./entry.4ef7376d.js";import{u as k}from"./fetch.cdc7faf8.js";import{m as v}from"./index.eadb1fdf.js";const y={class:"flex flex-col"},E=e("div",{class:"flex mb-4"},[e("h1",{class:"font-bold"},"Admin settings")],-1),A=e("hr",null,null,-1),B={class:"flex flex-col mt-4 p-8 gap-y-4"},D=e("label",{for:"download"},"Backup database",-1),$=e("hr",{class:"border-gray-300"},null,-1),L=e("label",null,"Emails",-1),N=e("hr",{class:"border-gray-300"},null,-1),V={__name:"index",setup(R){const s=m(),c=`sometraffic-${v(new Date).format("YYYY-MM-DD-HH_mm")}`;p("$awn");const l=n([]);n(localStorage.getItem("activeAccount"));const r=n(!1),d=async()=>{const{data:t}=await k(`${s.API_BASE_URL}accounts/all`,"$TR2d2LceNf");l.value=t.value},i=()=>{const t=document.createElement("a");t.href=`${s.API_BASE_URL}files/sometraffic.sql`,t.download=c,t.target="_blank",t.click()};return u(d),_(()=>{document.addEventListener("click",function(t){let a=document.getElementById("account-selector"),o=t.target;do{if(o==a)return;o=o.parentNode}while(o);r.value=!1})}),(t,a)=>{const o=h;return x(),f("div",y,[E,A,e("div",B,[D,$,e("button",{name:"download",class:"mb-8 text-black cursor-pointer w-fit px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-600 transition",onClick:a[0]||(a[0]=M=>i())},"Download Database"),L,N,b(o,{to:"emails",class:"text-black cursor-pointer w-fit px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-600 transition"},{default:g(()=>[w("Emails settings")]),_:1})])])}}};export{V as default};
