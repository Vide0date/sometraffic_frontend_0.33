import{q as F,a as H,l as K,r as _,b as N,w as Y,x as J,e as I,j as B,f as A,u as c,K as Q,i as t,t as C,D as W,E as X,O as Z,P as ee,Q as te,k as se,o as $,F as ae,m as oe,L as ne,M as le,R as ie}from"./entry.c7e0c2b6.js";import{u as j}from"./fetch.a7510bac.js";import{D as ce}from"./index.11b61e0a.js";const v=k=>(ne("data-v-a2329cde"),k=k(),le(),k),re={id:"users_groups"},de={class:"text"},ue={class:"flex justify-between"},_e={class:"font-bold py-4 capitalize"},ve={class:"flex items-start"},pe={class:"flex border-2 rounded"},he={class:"relative"},me=v(()=>t("svg",{color:"black",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M6 18L18 6M6 6l12 12"})],-1)),fe=[me],xe=v(()=>t("svg",{class:"w-6 h-6 text-slate-50",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},[t("path",{d:"M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"})],-1)),ge=[xe],we=v(()=>t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M12 4.5v15m7.5-7.5h-15"})],-1)),ye=[we],Ce={class:"overflow-hidden shadow sm:rounded-md"},ke={class:"px-4 py-5 sm:p-6"},be={class:"grid grid-cols-12"},Le={class:"col-span-12"},Se={class:"overflow-x-auto"},De={class:"w-full whitespace-nowrap"},Ie=v(()=>t("thead",{class:"bg-black/60"},[t("tr",null,[t("th",{class:"text-left py-3 px-2 rounded-l-lg"},"ID"),t("th",{class:"text-left py-3 px-2"},"Name"),t("th",{class:"text-left py-3 px-2"},"Description"),t("th",{class:"text-left py-3 px-2 rounded-r-lg"},"Actions")])],-1)),Be={class:"py-3 px-2"},Ae={class:"py-3 px-2"},$e={class:"py-3 px-2"},je={class:"py-3 px-2"},Me={class:"inline-flex items-center space-x-3"},Ee=v(()=>t("span",{title:"Edit",class:"hover:text-white"},[t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-5 h-5"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"})])],-1)),Re=["onClick"],Te=v(()=>t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"})],-1)),qe=[Te],Ne={__name:"index",async setup(k){let b,M;const S=H(),E=se("$awn"),{id:D}=K().query,d=_(!1),l=_([]),p=_(0),r=_([]),o=N({vaClDa:""}),P=()=>{o.vaClDa="",r.value=l.value,p.value=l.value.length},U=()=>{var a;r.value=(a=l==null?void 0:l._value)==null?void 0:a.filter(e=>{var n,s,i,u,h,m,f,x,g,w,y;return((i=e.createdBy.toLowerCase())==null?void 0:i.includes((s=(n=o.vaClDa)==null?void 0:n.toString())==null?void 0:s.toLowerCase()))||((u=e==null?void 0:e.unique_identifier)==null?void 0:u.includes(o.vaClDa))||((f=e==null?void 0:e.name)==null?void 0:f.toLowerCase().includes((m=(h=o.vaClDa)==null?void 0:h.toString())==null?void 0:m.toLowerCase()))||((y=(x=e==null?void 0:e.description)==null?void 0:x.toLowerCase())==null?void 0:y.includes((w=(g=o.vaClDa)==null?void 0:g.toString())==null?void 0:w.toLowerCase()))}),p.value=r.value.length},O=()=>{var a;r.value=(a=l==null?void 0:l._value)==null?void 0:a.filter(e=>{var n,s,i,u,h,m,f,x,g,w,y;return((i=e.createdBy.toLowerCase())==null?void 0:i.includes((s=(n=o.vaClDa)==null?void 0:n.toString())==null?void 0:s.toLowerCase()))||((u=e==null?void 0:e.unique_identifier)==null?void 0:u.includes(o.vaClDa))||((f=e==null?void 0:e.name)==null?void 0:f.toLowerCase().includes((m=(h=o.vaClDa)==null?void 0:h.toString())==null?void 0:m.toLowerCase()))||((y=(x=e==null?void 0:e.description)==null?void 0:x.toLowerCase())==null?void 0:y.includes((w=(g=o.vaClDa)==null?void 0:g.toString())==null?void 0:w.toLowerCase()))}),p.value=r.value.length},V=JSON.parse(localStorage.getItem("user")),R=_(0),T=_(""),L=N({id:"",user_id:"",name:"",description:""});if(D){const{data:a}=([b,M]=Y(()=>j(`${S.API_BASE_URL}groups/${D}`,{key:D},"$oAw4SAftOf")),b=await b,M(),b);L.id=a.value.id,L.user_id=V.userId,L.name=a.value.name,L.description=a.value.description}const q=async()=>{var e;R.value=parseInt(localStorage.getItem("activeProject"));const{data:a}=await j(`${S.API_BASE_URL}groups/all?ProjectId=${R.value}`,"$h6hmIRjp3D");r.value=a.value,l.value=a.value,p.value=(e=a.value)==null?void 0:e.length},z=async(a,e)=>{d.value=!0,localStorage.setItem("sometraffic_delete_group",a),localStorage.setItem("sometraffic_delete_group_name",e),T.value=e},G=async()=>{const a=localStorage.getItem("sometraffic_delete_group"),{data:e,error:n}=await j(`${S.API_BASE_URL}groups/delete/${a}`,{method:"GET",params:{id:a}},"$Gvnm0xgY9a");e.value&&(d.value=!1,await E.success(e.value.message)),n.value&&(d.value=!1,await E.alert(n.value.statusMessage)),localStorage.removeItem("sometraffic_delete_group"),await q()};return J(q),(a,e)=>{const n=ie;return $(),I("div",re,[B(c(ce),{title:"You can NOT undo this action",modalClass:"confirm-modal",visible:c(d),"onUpdate:visible":e[0]||(e[0]=s=>Q(d)?d.value=s:null),cancelButton:{text:"Cancel"},okButton:{text:"Okay",onclick:()=>G()}},{default:A(()=>[t("div",de,"Are you sure you want to delete "+C(c(T))+"?",1)]),_:1},8,["visible","okButton"]),t("div",ue,[t("h1",_e," Groups list ("+C(c(p))+") ",1),t("div",ve,[t("div",pe,[t("div",he,[W(t("input",{type:"text","onUpdate:modelValue":e[1]||(e[1]=s=>c(o).vaClDa=s),class:"px-4 py-2 w-80 border-inherit bg-inherit pr-9 focus:outline-none focus:ring focus:border-blue-600 search",placeholder:"Search...",onKeyup:e[2]||(e[2]=Z(s=>O(),["enter"]))},null,544),[[X,c(o).vaClDa]]),t("button",{class:"absolute inset-y-0 right-0 px-2",onClick:e[3]||(e[3]=s=>P())},fe)]),t("button",{class:"flex items-center justify-center px-4 border-l bg-blue-700",onClick:e[4]||(e[4]=s=>U())},ge),t("button",{class:"flex items-center justify-center px-4 border-l border-grey-600 bg-grey-700",onClick:e[5]||(e[5]=s=>("navigateTo"in a?a.navigateTo:c(ae))("/user-groups/add"))},ye)])])]),t("div",Ce,[t("div",ke,[t("div",be,[t("div",Le,[t("div",Se,[t("table",De,[Ie,t("tbody",null,[($(!0),I(ee,null,te(c(r),s=>{var i;return $(),I("tr",{class:"border-b border-gray-700",key:s.id},[t("td",Be,[B(n,{to:`/user-groups/${s.unique_identifier}`,title:"Edit",class:"hover:text-white"},{default:A(()=>[oe(C(s==null?void 0:s.unique_identifier),1)]),_:2},1032,["to"])]),t("td",Ae,C(s.name),1),t("td",$e,C(((i=s.description)==null?void 0:i.length)>100?s.description.slice(0,100)+"...":s.description),1),t("td",je,[t("div",Me,[B(n,{to:`/user-groups/${s.unique_identifier}`,title:"Edit"},{default:A(()=>[Ee]),_:2},1032,["to"]),t("span",{onClick:u=>z(s.id,s.name),title:"Delete",class:"hover:text-white"},qe,8,Re)])])])}),128))])])])])])])])])}}},Ve=F(Ne,[["__scopeId","data-v-a2329cde"]]);export{Ve as default};