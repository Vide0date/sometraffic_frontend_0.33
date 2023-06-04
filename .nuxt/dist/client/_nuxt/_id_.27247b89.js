import{q as ut,k as K,l as J,r as x,a as Q,x as H,o as f,e as h,j as m,f as y,u as o,K as mt,i as t,t as v,P as q,Q as N,m as _,T as pt,R as W,L as _t,M as gt,w as F,b as ft,S as ht,C as vt,D as r,E as k,U as T,V as M,W as G,X as S,Y as yt,Z as bt,F as D,$ as xt}from"./entry.be28d2ff.js";import{_ as wt,a as kt,b as It,c as $t,d as jt}from"./TasksHistory.f798cd33.js";import{u as I}from"./fetch.69c6b441.js";import{m as X}from"./index.0b142de3.js";import{D as Ct}from"./index.7a5694ca.js";import{_ as At}from"./loading.083cf0d7.js";const R=V=>(_t("data-v-85683d57"),V=V(),gt(),V),Tt=R(()=>t("div",{class:"text"}," Are you sure? ",-1)),Mt={class:"flex justify-between"},St={class:"font-bold py-4 capitalize"},Vt=R(()=>t("img",{style:{width:"20px","margin-top":"20px"},src:wt,class:"information-items"},null,-1)),Lt={class:"overflow-x-auto"},Ut={class:"w-full whitespace-nowrap"},zt=R(()=>t("thead",{class:"bg-black/60"},[t("tr",null,[t("th",{class:"text-left py-3 px-2"},"Info ID"),t("th",{class:"text-left py-3 px-2"},"Item ID"),t("th",{class:"text-left py-3 px-2"},"Information"),t("th",{class:"text-left py-3 px-2"},"Category"),t("th",{class:"text-left py-3 px-2"},"Posts/Month"),t("th",{class:"text-left py-3 px-2"},"Date/Time"),t("th",{class:"text-left py-3 px-2"},"Actions")])],-1)),Pt={class:"border-b border-gray-700",key:"clickdata.id"},Bt={class:"py-3 px-2"},Dt={class:"py-3 px-2"},Rt={class:"py-3 px-2 tooltip"},Et={class:"py-3 px-2 capitalize"},Ht={class:"py-3 px-2 capitalize"},qt={class:"py-3 px-2 capitalize"},Nt={class:"py-3 px-2"},Wt={class:"inline-flex items-center space-x-3"},Yt=R(()=>t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-5 h-5"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"})],-1)),Ot=["onClick"],Ft=R(()=>t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"})],-1)),Gt=[Ft],Kt={name:"InformationItems",props:["limit","itemid"]},Jt=Object.assign(Kt,{props:{limit:Number,itemid:Number},setup(V){const b=V,$=K("$awn"),{id:L}=J().params,g=x(!1),j=x([]),z=x(0),P=Q(),C=(d,c)=>{const p=new Date(d);return X(p).format(c)},w=async()=>{const{limit:d,itemid:c}=pt(b),{data:p}=await I(`${P.API_BASE_URL}information-items/allByItemId?limit=${d.value}&itemid=${c.value}`,"$bD1cKDODKc");j.value=p.value.data,z.value=p.value.count};H(w);const A=async()=>{const d=localStorage.getItem("sometraffic_delete_info"),{data:c,error:p}=await I(`${P.API_BASE_URL}information-items/delete/${d}`,{method:"GET",params:{id:d}},"$WlP2Xv7PrS");c.value&&(g.value=!1,await $.success(c.value.message)),p.value&&(g.value=!1,await $.alert(p.value.statusMessage)),localStorage.removeItem("sometraffic_delete_info"),await w()},U=async d=>{g.value=!0,localStorage.setItem("sometraffic_delete_info",d)};return(d,c)=>{const p=W;return f(),h("div",null,[m(o(Ct),{title:"You can NOT undo this action",modalClass:"confirm-modal",visible:o(g),"onUpdate:visible":c[0]||(c[0]=l=>mt(g)?g.value=l:null),cancelButton:{text:"Cancel"},okButton:{text:"Okay",onclick:()=>A()}},{default:y(()=>[Tt]),_:1},8,["visible","okButton"]),t("div",Mt,[t("h1",St," Information Items ("+v(o(z))+") ",1),m(p,{to:`/information-items?id=${o(L)}`},{default:y(()=>[Vt]),_:1},8,["to"])]),t("div",Lt,[t("table",Ut,[zt,t("tbody",null,[(f(!0),h(q,null,N(o(j),l=>(f(),h("tr",Pt,[t("td",Bt,[m(p,{to:`/information-items/${l.item_id}`,title:"Edit",class:"hover:text-white"},{default:y(()=>[_(v(l==null?void 0:l.item_id),1)]),_:2},1032,["to"])]),t("td",Dt,[m(p,{to:`/category-items/${l==null?void 0:l.Category_Item.unique_identifier}`,title:"Edit",class:"hover:text-white"},{default:y(()=>[_(v(l==null?void 0:l.Category_Item.unique_identifier),1)]),_:2},1032,["to"])]),t("td",Rt,v(l.information.length>90?l.information.slice(0,90)+"...":l.information),1),t("td",Et,v(l==null?void 0:l.Category_Item.category),1),t("td",Ht,v(l==null?void 0:l.posts_per_month),1),t("td",qt,v(C(l==null?void 0:l.timestamp,"YYYY-MM-DD H:m")),1),t("td",Nt,[t("div",Wt,[m(p,{to:`/information-items/${l.item_id}`,title:"Edit",class:"hover:text-white"},{default:y(()=>[Yt]),_:2},1032,["to"]),t("span",{onClick:e=>U(l.id),title:"Delete",class:"hover:text-white"},Gt,8,Ot)])])]))),128))])])])])}}}),Qt=ut(Jt,[["__scopeId","data-v-85683d57"]]);const Xt={id:"last-tracking-url"},Zt={class:"flex justify-between"},te=t("h1",{class:"font-bold py-4 capitalize"},"Update Category Item",-1),ee={class:"bg-[#bcbcbc] inline-flex justify-center rounded-md border px-4 py-2 mt-4 mr-2 text-black"},oe={class:"bg-[#bcbcbc] inline-flex justify-center rounded-md border px-4 py-2 mt-4 text-black"},se=["onSubmit"],ie={class:"overflow-hidden shadow sm:rounded-md"},ae={class:"px-4 py-5 sm:p-6"},re={class:"col-span-12"},le={class:"grid grid-cols-12"},ne=t("div",{class:"col-span-3 flex items-center text-sm font-medium text-gray-700"}," Created ",-1),de={class:"col-span-3"},ce=["value"],ue={class:"col-span-12"},me={class:"grid grid-cols-12"},pe=t("div",{class:"col-span-3 flex items-center text-sm font-medium text-gray-700"}," Item title ",-1),_e={class:"col-span-9"},ge={class:"col-span-12 pt-4"},fe={class:"grid grid-cols-12"},he={class:"col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"},ve={class:"basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3"},ye=t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"})],-1),be=[ye],xe=["href"],we=t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"})],-1),ke=[we],Ie={class:"col-span-9"},$e={xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6 ml-2 text-gray-800",style:{display:"inline-block"}},je=t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"},null,-1),Ce=[je],Ae={src:At,class:"loading"},Te={class:"col-span-12 py-2"},Me={class:"grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4"},Se={class:"col-span-3 flex items-center text-sm font-medium text-gray-700"},Ve={xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6 ml-2 text-gray-800",style:{display:"inline-block"}},Le=t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"},null,-1),Ue=[Le],ze={class:"col-span-9"},Pe=t("option",{value:"facebook"},"Facebook",-1),Be=t("option",{value:"linkedin"},"LinkedIn",-1),De=t("option",{value:"prospect"},"Prospect",-1),Re=t("option",{value:"anything"},"Anything",-1),Ee=[Pe,Be,De,Re],He={class:"col-span-12 sm:col-span-12 mt-2"},qe={class:"grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4"},Ne={class:"col-span-12 sm:col-span-12"},We=t("label",{for:"information",class:"block text-sm font-medium text-gray-700"},"Information",-1),Ye={class:"col-span-12 mt-2"},Oe={class:"flex items-center mb-2"},Fe=t("label",{for:"default-radio-1",class:"ml-2 text-sm font-medium text-gray-700"},"New found group, no strategy yet.",-1),Ge={class:"flex items-center"},Ke=t("label",{for:"default-radio-2",class:"ml-2 text-sm font-medium text-gray-700"},"This group is inactive, no actions needed.",-1),Je={class:"flex flex-row py-2 mt-4"},Qe={class:"basis-1/4 flex items-center text-sm font-medium text-gray-700"},Xe={xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6 ml-2 text-gray-800",style:{display:"inline-block"}},Ze=t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"},null,-1),to=[Ze],eo={class:"basis-3/4"},oo={id:"form-project-selector",class:"relative text-sm"},so={class:"font-medium",type:"button"},io=t("svg",{xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",version:"1.1",id:"Capa_1",x:"0px",y:"0px",width:"24px",height:"14px",viewBox:"0 0 960 560","enable-background":"new 0 0 960 560","xml:space":"preserve"},[t("g",{id:"Rounded_Rectangle_33_copy_4_1_"},[t("path",{d:"M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937   c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937   c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z"})])],-1),ao=[io],ro={class:"absolute overflow-y-auto max-h-96 w-3/5 top-12 z-10 flex flex-col bg-[#bcbcbc] rounded-md text-black"},lo=["onClick"],no={type:"button"},co=t("hr",null,null,-1),uo={class:"flex flex-row py-2 mt-4"},mo={class:"basis-1/4 flex items-center text-sm font-medium text-gray-700"},po={xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6 ml-2 text-gray-800",style:{display:"inline-block"}},_o=t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"},null,-1),go=[_o],fo={class:"basis-3/4"},ho={id:"group-selector",class:"relative text-sm"},vo={class:"font-medium",type:"button"},yo=t("svg",{xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",version:"1.1",id:"Capa_1",x:"0px",y:"0px",width:"24px",height:"14px",viewBox:"0 0 960 560","enable-background":"new 0 0 960 560","xml:space":"preserve"},[t("g",{id:"Rounded_Rectangle_33_copy_4_1_"},[t("path",{d:"M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937   c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937   c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z"})])],-1),bo=[yo],xo={class:"absolute overflow-y-auto max-h-96 top-12 z-10 w-3/5 flex flex-col bg-[#bcbcbc] rounded-md text-black"},wo=["onClick"],ko={type:"button"},Io=t("hr",null,null,-1),$o={class:"flex flex-row py-2"},jo={class:"basis-1/4 flex items-center text-sm font-medium text-gray-700"},Co={xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6 ml-2 text-gray-800",style:{display:"inline-block"}},Ao=t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"},null,-1),To=[Ao],Mo={class:"basis-1/3"},So={class:"items-center w-full text-sm font-medium text-gray-900 sm:flex"},Vo={class:"w-full"},Lo={class:"flex items-center pl-3"},Uo=t("label",{for:"horizontal-list-radio-id",class:"w-full py-3 ml-2 text-sm font-medium text-gray-900"},"Low",-1),zo={class:"w-full"},Po={class:"flex items-center pl-3"},Bo=t("label",{for:"horizontal-list-radio-id",class:"w-full py-3 ml-2 text-sm font-medium text-gray-900"},"Medium",-1),Do={class:"w-full"},Ro={class:"flex items-center pl-3"},Eo=t("label",{for:"horizontal-list-radio-license",class:"w-full py-3 ml-2 text-sm font-medium text-gray-900"},"High ",-1),Ho={class:"flex flex-row py-2"},qo=t("div",{class:"basis-1/4 flex items-center text-sm font-medium text-gray-700"}," Visibility * ",-1),No={class:"basis-1/4"},Wo={class:"items-center w-full text-sm font-medium text-gray-900 sm:flex"},Yo={class:"w-full"},Oo={class:"flex items-center pl-3"},Fo=t("label",{for:"horizontal-list-radio-license",class:"w-full py-3 ml-2 text-sm font-medium text-gray-900"},"Private ",-1),Go={class:"w-full"},Ko={class:"flex items-center pl-3"},Jo=t("label",{for:"horizontal-list-radio-id",class:"w-full py-3 ml-2 text-sm font-medium text-gray-900"},"Public",-1),Qo={class:"grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4 py-4"},Xo={class:"col-span-12"},Zo={class:"grid grid-cols-12"},ts=t("div",{class:"col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"}," URL 2 information ",-1),es={class:"col-span-9 px-1.5"},os={class:"col-span-12"},ss={class:"grid grid-cols-12"},is={class:"col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"},as={class:"basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3"},rs=t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"})],-1),ls=[rs],ns=["href"],ds=t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"})],-1),cs=[ds],us={class:"col-span-9 px-1.5"},ms=t("div",{class:"col-span-12"},[t("p",{class:"text-sm font-medium text-gray-700 pt-2"}," Automatic scheduling: ")],-1),ps={class:"col-span-12"},_s={class:"grid grid-cols-12"},gs=t("div",{class:"col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"}," Planning frequency ",-1),fs={class:"col-span-5 px-1.5"},hs=xt('<option disabled> Every 4, 6, 8 hours, 2 days, week, month... </option><option value="4">4 hours</option><option value="6">6 hours</option><option value="8">8 hours</option><option value="12">12 hours</option><option value="24">Daily</option><option value="48">2 days</option><option value="72">3 days</option><option value="120">5 days</option><option value="168">Weekly</option><option value="336">Bi weekly</option><option value="720">Monthly</option><option value="1440">Bi Monthly</option>',13),vs=[hs],ys={class:"col-span-12"},bs={class:"grid grid-cols-12"},xs=t("div",{class:"col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"}," Automatic status ",-1),ws={class:"col-span-3 px-1.5"},ks={class:"flex items-center relative w-max cursor-pointer select-none"},Is=t("span",{class:"absolute font-medium text-xs uppercase right-1 text-white"}," OFF ",-1),$s=t("span",{class:"absolute font-medium text-xs uppercase right-8 text-white"}," ON ",-1),js=t("span",{class:"w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200"},null,-1),Cs={class:"flex flex-row mt-4"},As={class:"basis-1/3 px-1.5"},Ts=["disabled"],Ms={class:"basis-1/3 px-1.5"},Ss=["disabled"],Vs={class:"basis-1/3 px-1.5"},Ls={class:"flex flex-row"},Us=t("div",{class:"basis-1/4 flex items-center text-sm font-medium text-gray-700"}," Item ID ",-1),zs={class:"basis-3/4"},Ps=["disabled"],Bs=t("div",{class:"px-4 py-3 text-right sm:px-6 w-full sm:w-full"},[t("button",{type:"submit",class:"bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"}," Submit ")],-1),Ds={id:"tasks_list",class:"shadow sm:rounded-md"},Rs={class:"px-4 py-5 sm:p-6"},Es=t("h1",{class:"font-bold py-4 capitalize"},"Tasks",-1),Hs={class:"text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"},qs={class:"flex flex-wrap -mb-px"},Ns={class:"mr-2"},Ws={class:"mr-2"},Ys={class:"mr-2"},Os={class:"mr-2"},Fs={class:"mt-4"},Gs={id:"information_items",class:"shadow sm:rounded-md my-4"},Ks={class:"px-4 py-5 sm:p-6"},Js={data(){return{tab:1}},methods:{activeTabOne(){this.tab=1},activeTabTwo(){this.tab=2},activeTabThree(){this.tab=3},activeTabFour(){this.tab=4}}},ii=Object.assign(Js,{__name:"[id]",async setup(V){let b,$;const L=K("$awn"),g=Q(),{id:j}=([b,$]=F(()=>J().params),b=await b,$(),b);let z=new Date().toLocaleTimeString();localStorage.getItem("user");let P=parseInt(localStorage.getItem("activeProject"));const C=x([]),w=x([]),A=x(""),U=x(!1),d=x(!1),c=x(!1),p=a=>{c.value=!1,e.group=a},l=async a=>{d.value=!1,e.project=a,await O()};setInterval(()=>{z=new Date().toLocaleTimeString()},10);const e=ft({id:"",username:"",timestamp:z,item_id:"",information:"",category:"",item_title:"",group:"",priority:"",visibility:null,url_1_link:"",url_2_txt:"",url_2_link:"",plan_frequency:"",automatic_status:null,createdAt:"",project:P||null}),{data:u}=([b,$]=F(()=>I(`${g.API_BASE_URL}category-items/identifier/${j}`,{key:j},"$S9TS9Shr5R")),b=await b,$(),b);u.value&&(e.id=u.value.id,e.username=u.value.username,e.timestamp=new Date(u.value.timestamp).toLocaleTimeString(),e.item_id=u.value.unique_identifier,e.information=u.value.information,e.category=u.value.category,e.item_title=u.value.item_title,e.group=u.value.cat_group,e.priority=u.value.priority,e.visibility=u.value.visibility,e.url_1_link=u.value.url_1_link,e.url_2_txt=u.value.url_2_txt,e.url_2_link=u.value.url_2_link,e.plan_frequency=u.value.plan_frequency,e.automatic_status=u.value.automatic_status,e.createdAt=u.value.createdAt);const Z=(a,s)=>{const n=new Date(a);return X(n).format(s)},tt=async()=>{const a={id:e.id,username:e.username,timestamp:new Date,item_title:e.item_title,unique_identifier:e.item_id,information:e.information,category:e.category,priority:e.priority,cat_group:e.group,visibility:e.visibility,url_1_txt:e.url_1_txt,url_1_link:e.url_1_link,url_2_txt:e.url_2_txt,url_2_link:e.url_2_link,plan_frequency:e.plan_frequency,automatic_status:e.automatic_status},{data:s,error:n}=await I(`${g.API_BASE_URL}category-items/update/${j}`,{method:"PUT",body:a},"$VtRYEvyhMG");s.value&&(console.log("data value",s.value.message),await L.success(s.value.message),D("/category-items")),n.value&&await L.alert(n.value.statusMessage)};function et(a){return!!new RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$","i").test(a)}const ot=async a=>{U.value=!0,et(a)&&L.asyncBlock(I(`${g.API_BASE_URL}category-items/all/?url=${a}&accountId=${localStorage.getItem("activeAccount")}`,"$ZiR48IHfAs"),s=>{U.value=!1,s.data&&s.data.value.length?s.data.value[0].unique_identifier===j?A.value="valid":A.value="invalid":A.value="valid"})},st=()=>{U.value=!0},Y=async a=>{var s=document.getElementById(a);s.select(),s.setSelectionRange(0,99999),navigator.clipboard.writeText(s.value),await L.success(s.value+" copied to clipboard!")},O=async()=>{if(console.log("set groups"),localStorage.getItem("activeProject")){parseInt(localStorage.getItem("activeProject"));const{data:a}=await I(`${g.API_BASE_URL}groups/all?ProjectId=${e.project}`,"$JPjr0oF3Lr");w.value=a.value}else{let a=0;const s=setInterval(async()=>{if(localStorage.getItem("activeProject")){clearInterval(s),parseInt(localStorage.getItem("activeProject"));const{data:n}=await I(`${g.API_BASE_URL}groups/all?ProjectId=${e.project}`,"$mWPeobaeQo");w.value=n.value}else a+=1,a/10>5&&clearInterval(s)},100)}},it=x(localStorage.getItem("activeAccount"));return H(async()=>{const{data:a}=await I(`${g.API_BASE_URL}projects/all?AccountId=${it.value}`,"$0vJJWtjAth");C.value=a.value}),H(O),ht(()=>{document.addEventListener("click",function(a){let s=document.getElementById("form-project-selector"),n=a.target;do{if(n==s)return;n=n.parentNode}while(n);d.value=!1}),document.addEventListener("click",function(a){let s=document.getElementById("group-selector"),n=a.target;do{if(n==s)return;n=n.parentNode}while(n);c.value=!1})}),(a,s)=>{const n=W,E=W,at=kt,rt=It,lt=$t,nt=jt,dt=Qt,B=bt("tooltip");return f(),h("div",null,[t("div",Xt,[t("div",Zt,[te,t("span",null,[t("button",ee,[m(n,{to:{path:"/information-items/add",query:{id:o(e).id}}},{default:y(()=>[_("Add Information")]),_:1},8,["to"])]),t("button",oe,[m(n,{to:{path:"/tasks/add",query:{id:o(e).id,priority:o(e).priority}}},{default:y(()=>[_("Add Task")]),_:1},8,["to"])])])]),t("form",{onSubmit:vt(tt,["prevent"])},[t("div",ie,[t("div",ae,[t("div",re,[t("div",le,[ne,t("div",de,[t("input",{type:"text",value:Z(o(e).createdAt,"YYYY-MM-DD HH:mm"),class:"bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",disabled:""},null,8,ce)])])]),t("div",ue,[t("div",me,[pe,t("div",_e,[r(t("input",{placeholder:"Need to enter the title or subject (obligatory)",type:"text","onUpdate:modelValue":s[0]||(s[0]=i=>o(e).item_title=i),id:"item_title",class:"bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",required:""},null,512),[[k,o(e).item_title]])])])]),t("div",ge,[t("div",fe,[t("div",he,[_(" Item Url "),t("div",ve,[t("button",{type:"button",onClick:s[1]||(s[1]=i=>Y("url_1_link")),title:"Copy Command To Clipboard"},be),t("a",{href:o(e).url_1_link,target:"_blank",rel:"noopener noreferrer",title:"Open To New Tap",class:"pl-2"},ke,8,xe)])]),t("div",Ie,[r(t("input",{class:T(["outline-none",o(A)==="valid"?"bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm input-w-loading valid":o(A)==="invalid"?"bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm input-w-loading invalid":"bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm input-w-loading"]),type:"text",id:"url_1_link","onUpdate:modelValue":s[2]||(s[2]=i=>o(e).url_1_link=i),onChange:s[3]||(s[3]=i=>ot(o(e).url_1_link)),onKeypress:s[4]||(s[4]=i=>st(o(e).url_1_link))},null,34),[[k,o(e).url_1_link]]),r((f(),h("svg",$e,Ce)),[[B,{content:"<div>When you type or paste a URL here, after you leave the input field (item URL) the database will check if the URL already exists and make it red. Otherwise it will become green. <br />If you paste a new URL and leave, the system will show again that it is checking if it exists and become either green or red again.</div>",html:!0},void 0,{right:!0}]]),r(t("img",Ae,null,512),[[M,o(U)===!0]])])])]),t("div",Te,[t("div",Me,[t("div",Se,[_(" Category * "),r((f(),h("svg",Ve,Ue)),[[B,{content:"<div>Obligatory, here you have to select what social media platform you are using. If you would like to track traffic from one that is not listed, <br />you can select Anything and put for example Instragram in the title.</div>",html:!0},void 0,{right:!0}]])]),t("div",ze,[r(t("select",{"onUpdate:modelValue":s[5]||(s[5]=i=>o(e).category=i),id:"category",class:"bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",required:""},Ee,512),[[G,o(e).category]])])])]),t("div",He,[t("div",qe,[t("div",Ne,[We,r(t("textarea",{"onUpdate:modelValue":s[6]||(s[6]=i=>o(e).information=i),rows:"6",id:"information",class:"bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",placeholder:"(free text field, 1000 characters max, about 30 sentenses max) what is the goal of this item or project"},null,512),[[k,o(e).information]])])])]),t("div",Ye,[t("div",Oe,[r(t("input",{"onUpdate:modelValue":s[7]||(s[7]=i=>o(e).information=i),id:"default-radio-1",type:"radio",value:"New found group, no strategy yet.",name:"default-radio",class:"w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"},null,512),[[S,o(e).information]]),Fe]),t("div",Ge,[r(t("input",{"onUpdate:modelValue":s[8]||(s[8]=i=>o(e).information=i),id:"default-radio-2",type:"radio",value:"This group is inactive, no actions needed.",name:"default-radio",class:"w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"},null,512),[[S,o(e).information]]),Ke])]),t("div",null,[t("div",Je,[t("div",Qe,[_(" Project "),r((f(),h("svg",Xe,to)),[[B,{content:`<div>You should try to create some projects to organise the Items in. When you get clicks, you can see how many clicks there were from specific projects created by you.<br />
            Example for remote working projects: Freelancers, Work from Home, Digital Nomad. You will learn over time what projects give you the most clicks per post. <br />
            We advise to use 4-6 projects per project.</div>`,html:!0},void 0,{right:!0}]])]),t("div",eo,[t("div",oo,[t("div",{onClick:s[9]||(s[9]=i=>d.value=!o(d)),class:"rounded-md cursor-pointer relative flex bg-[#bcbcbc] p-3 w-3/5 text-black"},[t("button",so,v(o(C).length&&o(C).find(i=>i.id===o(e).project)?o(C).find(i=>i.id===o(e).project).name:"Select project"),1),t("span",{class:T([{"rotate-180":o(d)},"absolute right-3 top-1/2 -translate-y-1"])},ao,2)]),r(t("div",ro,[(f(!0),h(q,null,N(o(C),i=>(f(),h("div",{onClick:ct=>l(i.id),class:"font-medium hover:bg-slate-300 transition-colors py-4 cursor-pointer flex flex-col gap-y-2",key:i.id},[t("button",no,v(i.name),1)],8,lo))),128)),co,t("button",{type:"button",class:"font-medium text-center cursor-pointer py-4 hover:bg-slate-300",onClick:s[10]||(s[10]=i=>{("navigateTo"in a?a.navigateTo:o(D))("/user-projects/add"),d.value=!1})},"+ Add a project"),t("button",{type:"button",class:"font-medium text-center cursor-pointer py-4 hover:bg-slate-300",onClick:s[11]||(s[11]=i=>{("navigateTo"in a?a.navigateTo:o(D))("/user-projects"),d.value=!1})},"View projects list")],512),[[M,o(d)]])])])]),t("div",uo,[t("div",mo,[_(" Group * "),r((f(),h("svg",po,go)),[[B,{content:`<div>You should try to create some groups to organise the Items in. When you get clicks, you can see how many clicks there were from specific groups created by you.<br />
                          Example for remote working groups: Freelancers, Work from Home, Digital Nomad. You will learn over time what groups give you the most clicks per post. <br />
                          We advise to use 4-6 groups per project.</div>`,html:!0},void 0,{right:!0}]])]),t("div",fo,[t("div",ho,[t("div",{onClick:s[12]||(s[12]=i=>c.value=!o(c)),class:"rounded-md cursor-pointer relative flex bg-[#bcbcbc] p-3 w-3/5 text-black"},[t("button",vo,v(o(w).length&&o(w).find(i=>i.id===o(e).group)?o(w).find(i=>i.id===o(e).group).name:"Select Group"),1),t("span",{class:T([{"rotate-180":o(c)},"absolute right-3 top-1/2 -translate-y-1"])},bo,2)]),r(t("div",xo,[(f(!0),h(q,null,N(o(w),i=>(f(),h("div",{onClick:ct=>p(i.id),class:"font-medium hover:bg-slate-300 transition-colors py-4 flex cursor-pointer flex-col gap-y-2",key:i.id},[t("button",ko,v(i.name),1)],8,wo))),128)),Io,t("button",{type:"button",class:"font-medium text-center cursor-pointer py-4 hover:bg-slate-300",onClick:s[13]||(s[13]=i=>{("navigateTo"in a?a.navigateTo:o(D))("/user-groups/add"),c.value=!1})},"+ Add a group"),t("button",{type:"button",class:"font-medium text-center cursor-pointer py-4 hover:bg-slate-300",onClick:s[14]||(s[14]=i=>{("navigateTo"in a?a.navigateTo:o(D))("/user-groups"),c.value=!1})},"View groups list")],512),[[M,o(c)]])])])]),t("div",$o,[t("div",jo,[_(" Priority * "),r((f(),h("svg",Co,To)),[[B,{content:"<div>Here you can select what the priority for this item will be. Inactive ones found groups are usually Low priority. <br />Normal groups are Medium and only groups with a lot of potential to get clicks are High. When unsure, you can select medium.</div>",html:!0},void 0,{right:!0}]])]),t("div",Mo,[t("ul",So,[t("li",Vo,[t("div",Lo,[r(t("input",{"onUpdate:modelValue":s[15]||(s[15]=i=>o(e).priority=i),id:"horizontal-list-radio-id",type:"radio",value:"3",name:"priority",class:"w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"},null,512),[[S,o(e).priority]]),Uo])]),t("li",zo,[t("div",Po,[r(t("input",{"onUpdate:modelValue":s[16]||(s[16]=i=>o(e).priority=i),id:"horizontal-list-radio-id",type:"radio",value:"2",name:"priority",class:"w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"},null,512),[[S,o(e).priority]]),Bo])]),t("li",Do,[t("div",Ro,[r(t("input",{"onUpdate:modelValue":s[17]||(s[17]=i=>o(e).priority=i),id:"horizontal-list-radio-license",type:"radio",value:"1",name:"priority",class:"w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"},null,512),[[S,o(e).priority]]),Eo])])])])]),t("div",Ho,[qo,t("div",No,[t("ul",Wo,[t("li",Yo,[t("div",Oo,[r(t("input",{"onUpdate:modelValue":s[18]||(s[18]=i=>o(e).visibility=i),id:"horizontal-list-radio-license",type:"radio",value:"private",name:"list-radio",class:"w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"},null,512),[[S,o(e).visibility]]),Fo])]),t("li",Go,[t("div",Ko,[r(t("input",{"onUpdate:modelValue":s[19]||(s[19]=i=>o(e).visibility=i),id:"horizontal-list-radio-id",type:"radio",value:"public",name:"list-radio",class:"w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"},null,512),[[S,o(e).visibility]]),Jo])])])])])]),t("div",Qo,[t("div",Xo,[t("div",Zo,[ts,t("div",es,[r(t("input",{type:"text","onUpdate:modelValue":s[20]||(s[20]=i=>o(e).url_2_txt=i),id:"url_2_txt",class:"bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"},null,512),[[k,o(e).url_2_txt]])])])]),t("div",os,[t("div",ss,[t("div",is,[_(" URL 2 link "),t("div",as,[t("button",{type:"button",onClick:s[21]||(s[21]=i=>Y("url_2_link")),title:"Copy Command To Clipboard"},ls),t("a",{href:o(e).url_2_link,target:"_blank",rel:"noopener noreferrer",title:"Open To New Tab",class:"pl-2"},cs,8,ns)])]),t("div",us,[r(t("input",{type:"text","onUpdate:modelValue":s[22]||(s[22]=i=>o(e).url_2_link=i),id:"url_2_link",class:"bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"},null,512),[[k,o(e).url_2_link]])])])]),ms,t("div",ps,[t("div",_s,[gs,t("div",fs,[r(t("select",{"onUpdate:modelValue":s[23]||(s[23]=i=>o(e).plan_frequency=i),id:"plan_frequency",class:"bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"},vs,512),[[G,o(e).plan_frequency]])])])])]),t("div",ys,[t("div",bs,[xs,t("div",ws,[t("label",ks,[r(t("input",{"onUpdate:modelValue":s[24]||(s[24]=i=>o(e).automatic_status=i),id:"automatic_status",type:"checkbox","true-value":"on","false-value":"off",class:"appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-red-500"},null,512),[[yt,o(e).automatic_status]]),Is,$s,js])])])]),t("div",Cs,[t("div",As,[r(t("input",{type:"text","onUpdate:modelValue":s[25]||(s[25]=i=>o(e).username=i),disabled:o(e).username,id:"username",class:"bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",required:""},null,8,Ts),[[k,o(e).username]])]),t("div",Ms,[r(t("input",{type:"text","onUpdate:modelValue":s[26]||(s[26]=i=>o(e).timestamp=i),disabled:o(e).timestamp,id:"timestamp",class:"bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",required:""},null,8,Ss),[[k,o(e).timestamp]])]),t("div",Vs,[t("div",Ls,[Us,t("div",zs,[r(t("input",{type:"text","onUpdate:modelValue":s[27]||(s[27]=i=>o(e).item_id=i),disabled:o(e).item_id,id:"item_id",class:"bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",required:""},null,8,Ps),[[k,o(e).item_id]])])])])])]),Bs])],40,se),t("div",Ds,[t("div",Rs,[Es,t("div",Hs,[t("ul",qs,[t("li",Ns,[m(E,{to:"#",onClick:a.activeTabOne,class:T(a.tab===1?"inline-block p-4 text-white border-b-2 border-white rounded-t-lg active dark:text-white dark:border-white":"inline-block p-4 border-b-2 border-transparent rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300")},{default:y(()=>[_(" All ")]),_:1},8,["onClick","class"])]),t("li",Ws,[m(E,{to:"#",onClick:a.activeTabTwo,class:T(a.tab===2?"inline-block p-4 text-white border-b-2 border-white rounded-t-lg active dark:text-white dark:border-white":"inline-block p-4 border-b-2 border-transparent rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300")},{default:y(()=>[_(" Unscheduled ")]),_:1},8,["onClick","class"])]),t("li",Ys,[m(E,{to:"#",onClick:a.activeTabThree,class:T(a.tab===3?"inline-block p-4 text-white border-b-2 border-white rounded-t-lg active dark:text-white dark:border-white":"inline-block p-4 border-b-2 border-transparent rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300")},{default:y(()=>[_(" Planned ")]),_:1},8,["onClick","class"])]),t("li",Os,[m(E,{to:"#",onClick:a.activeTabFour,class:T(a.tab===4?"inline-block p-4 text-white border-b-2 border-white rounded-t-lg active dark:text-white dark:border-white":"inline-block p-4 border-b-2 border-transparent rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300")},{default:y(()=>[_(" History ")]),_:1},8,["onClick","class"])])])]),t("div",Fs,[r(t("div",null,[m(at,{limit:5,showSearch:!1,itemid:o(e).id},null,8,["itemid"])],512),[[M,a.tab===1]]),r(t("div",null,[m(rt,{limit:5,showSearch:!1,itemid:o(e).id},null,8,["itemid"])],512),[[M,a.tab===2]]),r(t("div",null,[m(lt,{limit:5,showSearch:!1,itemid:o(e).id},null,8,["itemid"])],512),[[M,a.tab===3]]),r(t("div",null,[m(nt,{limit:5,showSearch:!1,itemid:o(e).id},null,8,["itemid"])],512),[[M,a.tab===4]])])])]),t("div",Gs,[t("div",Ks,[m(dt,{limit:5,itemid:o(e).id},null,8,["itemid"])])])])])}}});export{ii as default};
