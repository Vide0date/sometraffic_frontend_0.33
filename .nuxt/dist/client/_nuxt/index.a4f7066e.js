import{a as y,r as _,R as k,e as l,i as t,D as w,S as A,u as f,J as D,O as S,P as R,j as r,f as i,k as $,T as B,Q as E,o as d,t as I,m as u}from"./entry.839ca326.js";import{u as N}from"./fetch.867b3728.js";import{m as C}from"./index.99c68bd5.js";const M={class:"flex flex-col"},L=t("div",{class:"flex mb-4"},[t("h1",{class:"font-bold"},"Admin settings")],-1),P=t("hr",null,null,-1),T={class:"flex flex-col mt-4 p-8 gap-y-4"},V=t("label",{for:"download"},"Backup database",-1),Y=t("hr",{class:"border-gray-300"},null,-1),j=t("label",null,"Account",-1),U=t("hr",{class:"border-gray-300"},null,-1),F={class:"flex mb-8"},H=t("label",{for:"account",class:"mr-8 text-center self-center"},"Select account to use",-1),O=["value"],q=t("label",null,"Emails",-1),J=t("hr",{class:"border-gray-300"},null,-1),Z={__name:"index",setup(Q){const m=y(),g=`sometraffic-${C(new Date).format("YYYY-MM-DD-HH_mm")}`,b=$("$awn"),n=_([]),c=_(localStorage.getItem("activeAccount")),p=async()=>{const{data:e}=await N(`${m.API_BASE_URL}accounts/all`,"$TR2d2LceNf");n.value=e.value},v=()=>{const e=document.createElement("a");e.href=`${m.API_BASE_URL}files/sometraffic.sql`,e.download=g,e.target="_blank",e.click()},h=e=>{const a=e.target.value,s=e.target.selectedOptions[0].innerText,o=n.value.find(x=>x.id===parseInt(a));localStorage.removeItem("activeProject"),localStorage.setItem("activeAccount",o.id),b.success(`Active account changed to ${s}`),B().go()};return k(p),(e,a)=>{const s=E;return d(),l("div",M,[L,P,t("div",T,[V,Y,t("button",{name:"download",class:"mb-8 text-black cursor-pointer w-fit px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-600 transition",onClick:a[0]||(a[0]=o=>v())},"Download Database"),j,U,t("div",F,[H,w(t("select",{onChange:h,name:"account",id:"","onUpdate:modelValue":a[1]||(a[1]=o=>D(c)?c.value=o:null),class:"rounded-md px-4 text-black"},[(d(!0),l(S,null,R(f(n),o=>(d(),l("option",{key:o.id,value:o.id},I(o.name),9,O))),128))],544),[[A,f(c)]]),r(s,{to:"accounts/",class:"ml-28 text-black cursor-pointer w-fit px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-600 transition"},{default:i(()=>[u("Manange accounts")]),_:1}),r(s,{to:"accounts/add",class:"ml-28 text-black cursor-pointer w-fit px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-600 transition"},{default:i(()=>[u("Create new account")]),_:1})]),q,J,r(s,{to:"emails",class:"text-black cursor-pointer w-fit px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-600 transition"},{default:i(()=>[u("Emails settings")]),_:1})])])}}};export{Z as default};
