import{_ as k}from"./nuxt-link.a4d01235.js";import{r as f,q as g,b as n,h as t,i,e as r,u as c,s as y,F as b,v as B,j as C,o as d,t as u,m as A}from"./entry.4d41dba5.js";import{u as v}from"./fetch.013f5933.js";import{D as L}from"./index.ae89bd94.js";const N={id:"last-users"},E=t("div",{class:"text"},"Are you sure?",-1),S={class:"flex justify-between"},$=t("h1",{class:"font-bold py-4 uppercase"},"Users",-1),j={class:"pt-3 pr-4"},D=t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M12 4.5v15m7.5-7.5h-15"})],-1),M={class:"overflow-x-auto"},U={class:"w-full whitespace-nowrap"},I=t("thead",{class:"bg-black/60"},[t("tr",null,[t("th",{class:"text-left py-3 px-2 rounded-l-lg"},"Name"),t("th",{class:"text-left py-3 px-2"},"Email"),t("th",{class:"text-left py-3 px-2"},"User Type"),t("th",{class:"text-left py-3 px-2 rounded-r-lg"},"Actions")])],-1),T={class:"border-b border-gray-700",key:"user.id"},F={class:"py-3 px-2 font-bold"},R={class:"py-3 px-2"},V={class:"py-3 px-2"},H={class:"py-3 px-2"},O={class:"inline-flex items-center space-x-3"},P=t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-5 h-5"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"})],-1),q=["onClick"],z=t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"})],-1),G=[z],Z={__name:"index",setup(K){const _=C("$awn"),o=f(!1),p=f([]),h=A(),m=async()=>{const{data:e}=await v(`${h.API_BASE_URL}users/all`,"$kpCV9lTCCa");p.value=e.value},w=async()=>{const e=localStorage.getItem("sometraffic_delete_user"),{data:a,error:l}=await v(`${h.API_BASE_URL}users/delete/${e}`,{method:"GET",params:{id:e}},"$EKkNpDwF5x");a.value&&(o.value=!1,await _.success(a.value.message)),l.value&&(o.value=!1,await _.alert(l.value.statusMessage)),localStorage.removeItem("sometraffic_delete_user"),await m()},x=async e=>{o.value=!0,localStorage.setItem("sometraffic_delete_user",e)};return g(m),(e,a)=>{const l=k;return d(),n("div",null,[t("div",N,[i(c(L),{title:"You can NOT undo this action",modalClass:"confirm-modal",visible:c(o),"onUpdate:visible":a[0]||(a[0]=s=>y(o)?o.value=s:null),cancelButton:{text:"Cancel"},okButton:{text:"Okay",onclick:()=>w()}},{default:r(()=>[E]),_:1},8,["visible","okButton"]),t("div",S,[$,t("h1",j,[i(l,{to:"users/add"},{default:r(()=>[D]),_:1})])]),t("div",M,[t("table",U,[I,t("tbody",null,[(d(!0),n(b,null,B(c(p),s=>(d(),n("tr",T,[t("td",F,u(s.userName),1),t("td",R,u(s.email),1),t("td",V,u(s.userType),1),t("td",H,[t("div",O,[i(l,{to:`/users/${s.id}`,title:"Edit",class:"hover:text-white"},{default:r(()=>[P]),_:2},1032,["to"]),t("span",{onClick:W=>x(s.id),title:"Delete",class:"hover:text-white"},G,8,q)])])]))),128))])])])])])}}};export{Z as default};
