import{r as x,b as y,a as b,x as L,e as r,i as t,j as d,f as u,u as s,C as T,K as U,L as R,F as A,D as B,k as C,o as _,t as c,m as D,G as N}from"./entry.cb126563.js";import{u as g}from"./fetch.b186b791.js";import{D as S}from"./index.1185e7c9.js";const $={id:"tracking_url",class:"shadow sm:rounded-md"},j=t("div",{class:"text"},"Are you sure?",-1),I={class:"flex justify-between"},E=t("h1",{class:"font-bold py-4 uppercase"},"Traking URL list",-1),M={class:"flex flex-row justify-between basis-1/2"},V={class:"basis-4/5"},F={class:"overflow-x-auto"},G={class:"w-full whitespace-nowrap"},H=t("thead",{class:"bg-black/60"},[t("tr",null,[t("th",{class:"text-left py-3 px-2 rounded-l-lg"},"ID"),t("th",{class:"text-left py-3 px-2"},"Tracking URL"),t("th",{class:"text-left py-3 px-2"},"Destination"),t("th",{class:"text-left py-3 px-2"},"Task ID"),t("th",{class:"text-left py-3 px-2 rounded-r-lg"},"Actions")])],-1),P={class:"border-b border-gray-700",key:"tracking_url.id"},J={class:"py-3 px-2 font-bold"},O={class:"py-3 px-2"},z={class:"py-3 px-2"},K={className:"ml-1 inline-block w-[350px]"},Q={className:"font-semibold truncate block"},W={class:"py-3 px-2"},Y={class:"py-3 px-2"},q={class:"inline-flex items-center space-x-3"},X=t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-5 h-5"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"})],-1),Z=["onClick"],tt=t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"})],-1),et=[tt],it={__name:"index",setup(st){const h=C("$awn"),l=x(!1),p=x([]),n=y({vaTrURL:"",vaClDa:""}),m=b(),f=async()=>{const{data:a}=await g(`${m.API_BASE_URL}trackingurl/all`,"$euGJb2CQ1i");p.value=a.value},k=async()=>{const a=localStorage.getItem("sometraffic_delete_trackingurl"),{data:o,error:i}=await g(`${m.API_BASE_URL}trackingurl/delete/${a}`,{method:"GET",params:{id:a}},"$LyJUAF4jPT");o.value&&(l.value=!1,await h.success(o.value.message)),i.value&&(l.value=!1,await h.alert(i.value.statusMessage)),localStorage.removeItem("sometraffic_delete_trackingurl"),await f()},w=async a=>{l.value=!0,localStorage.setItem("sometraffic_delete_trackingurl",a)};return L(f),(a,o)=>{var v;const i=N;return _(),r("div",null,[t("div",$,[d(s(S),{title:"You can NOT undo this action",modalClass:"confirm-modal",visible:s(l),"onUpdate:visible":o[0]||(o[0]=e=>T(l)?l.value=e:null),cancelButton:{text:"Cancel"},okButton:{text:"Okay",onclick:()=>k()}},{default:u(()=>[j]),_:1},8,["visible","okButton"]),t("div",I,[E,t("div",M,[t("div",V,[U(t("input",{type:"text","onUpdate:modelValue":o[1]||(o[1]=e=>s(n).vaTrURL=e),id:"search",class:"bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",placeholder:"Search"},null,512),[[R,s(n).vaTrURL]])])])]),t("div",F,[t("table",G,[H,t("tbody",null,[(_(!0),r(A,null,B((v=s(p))==null?void 0:v.filter(e=>e.tracking_url.includes(s(n).vaTrURL)||e.destination_url.includes(s(n).vaTrURL)||e.task_id.includes(s(n).vaTrURL)),e=>(_(),r("tr",P,[t("td",J,c(e.id),1),t("td",O,[d(i,{to:`/tracking-url/${e.id}`,title:"Edit",class:"hover:text-white"},{default:u(()=>[D(c(e.tracking_url),1)]),_:2},1032,["to"])]),t("td",z,[t("div",K,[t("span",Q,c(e.destination_url)+" ",1)])]),t("td",W,c(e.task_id),1),t("td",Y,[t("div",q,[d(i,{to:`/tracking-url/${e.id}`,title:"Edit",class:"hover:text-white"},{default:u(()=>[X]),_:2},1032,["to"]),t("span",{onClick:at=>w(e.id),title:"Delete",class:"hover:text-white"},et,8,Z)])])]))),128))])])])])])}}};export{it as default};
