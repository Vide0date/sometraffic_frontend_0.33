import{a as B,w as f,r,b as j,e as y,i as e,D as n,E as c,u as s,h as q,C as T,k as D,l as k,o as b,F as U,a0 as S}from"./entry.93ad8c8d.js";import{u as x}from"./fetch.192030a7.js";import{m as V}from"./index.8a36781b.js";const C={id:"last-tracking-url"},E=["onSubmit"],I=e("div",{class:"flex justify-between"},[e("h1",{class:"font-bold py-4 capitalize"},"Edit a project"),e("button",{type:"submit",class:"bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent pt-4 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"}," Edit project ")],-1),$={class:"overflow-hidden shadow sm:rounded-md"},L={class:"px-4 py-5 sm:p-6"},N={class:"col-span-12"},R={class:"grid grid-cols-12"},M=e("div",{class:"col-span-1 flex items-center text-sm font-medium text-gray-700"}," ID ",-1),P={class:"col-span-5 pr-4"},Y=["disabled"],F=e("div",{class:"col-span-1 flex items-center text-sm font-medium text-gray-700"}," Created at ",-1),O={class:"col-span-5 pl-4"},z=["value"],H={class:"flex flex-row mt-4"},J={class:"basis-1/2 pr-1.5"},Q={class:"col-span-12"},W={class:"grid grid-cols-12"},G=e("div",{class:"col-span-3 flex items-center text-sm font-medium text-gray-700"}," Updated at ",-1),K={class:"col-span-9"},X=["disabled"],Z={class:"basis-1/2 pl-1.5"},ee={class:"col-span-12"},te={class:"grid grid-cols-12"},se=e("div",{class:"col-span-3 flex items-center text-sm font-medium text-gray-700"}," Created By ",-1),de={class:"col-span-9"},ae=["disabled"],ie={class:"col-span-12 mt-4"},oe={class:"grid grid-cols-12"},re=e("div",{class:"col-span-3 flex items-center text-sm font-medium text-gray-700"}," Project name * ",-1),ne={class:"col-span-3"},ce={key:0,class:"col-span-6 pl-4"},le={class:"col-span-12"},ue={class:"grid grid-cols-12"},me=e("div",{class:"col-span-3 flex items-center text-sm font-medium text-gray-700"}," Account ",-1),_e={class:"col-span-9"},pe=["value","disabled"],ge={class:"col-span-12 sm:col-span-12 mt-4"},fe={class:"grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4"},ye={class:"col-span-12 sm:col-span-12"},be=e("label",{for:"description",class:"block text-sm font-medium text-gray-700"},"Description",-1),xe={data(){return{tab:1}},methods:{activeTabOne(){this.tab=1},activeTabTwo(){this.tab=2},activeTabThree(){this.tab=3},activeTabFour(){this.tab=4}}},qe=Object.assign(xe,{__name:"[id]",emits:["projectsChanged"],async setup(he,{emit:ve}){let i,l;const _=D("$awn"),p=B(),{id:m}=([i,l]=f(()=>k().params),i=await i,l(),i);let g=r(new Date().toLocaleTimeString()),h=localStorage.getItem("user");const v=r(localStorage.getItem("activeAccount"));r([]),r(""),r(!1),setInterval(()=>{g.value=new Date().toLocaleTimeString()},10);const t=j({createdBy:"",createdAt:"",timestamp:g,unique_identifier:"",description:"",name:"",id:""}),{data:o}=([i,l]=f(()=>x(`${p.API_BASE_URL}projects/identifier/${m}`,{key:m},"$NLv8nVzATR")),i=await i,l(),i);o.value&&(t.id=o.value.id,t.name=o.value.name,t.createdBy=o.value.createdBy,t.unique_identifier=o.value.unique_identifier,t.description=o.value.description,t.createdAt=o.value.createdAt);const w=(u,d)=>{const a=new Date(u);return V(a).format(d)},A=async()=>{const u={AccountId:v.value,id:t.id,name:t.name,unique_identifier:t.unique_identifier,description:t.description,createdBy:t.createdBy},{data:d,error:a}=await x(`${p.API_BASE_URL}projects/update/${m}`,{method:"PUT",body:u},"$kQEDeYUFLT");d.value&&(await _.success(d.value.message),U("/projects").then(()=>{S().go("/projects")})),a.value&&await _.alert(a.value.statusMessage)};return(u,d)=>(b(),y("div",C,[e("form",{onSubmit:T(A,["prevent"])},[I,e("div",$,[e("div",L,[e("div",N,[e("div",R,[M,e("div",P,[n(e("input",{type:"text","onUpdate:modelValue":d[0]||(d[0]=a=>s(t).unique_identifier=a),disabled:s(t).unique_identifier,id:"item_id",class:"bg-[#dddddd] disabled:bg-gray-300 disabled:text-gray-500 h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",required:""},null,8,Y),[[c,s(t).unique_identifier]])]),F,e("div",O,[e("input",{type:"text",value:w(s(t).createdAt,"YYYY-MM-DD HH:mm"),disabled:"",id:"timestamp",class:"bg-[#dddddd] disabled:bg-gray-300 disabled:text-gray-500 h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",required:""},null,8,z)])])]),e("div",H,[e("div",J,[e("div",Q,[e("div",W,[G,e("div",K,[n(e("input",{type:"text","onUpdate:modelValue":d[1]||(d[1]=a=>s(t).timestamp=a),disabled:s(t).timestamp,id:"timestamp",class:"disabled:bg-gray-300 disabled:text-gray-500 bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",required:""},null,8,X),[[c,s(t).timestamp]])])])])]),e("div",Z,[e("div",ee,[e("div",te,[se,e("div",de,[n(e("input",{type:"text","onUpdate:modelValue":d[2]||(d[2]=a=>s(t).createdBy=a),disabled:s(t).createdBy,id:"username",class:"bg-[#dddddd] disabled:bg-gray-300 disabled:text-gray-500 h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",required:""},null,8,ae),[[c,s(t).createdBy]])])])])])]),e("div",ie,[e("div",oe,[re,e("div",ne,[n(e("input",{placeholder:"Need to enter account name (obligatory)",type:"text","onUpdate:modelValue":d[3]||(d[3]=a=>s(t).name=a),id:"name",class:"bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",required:""},null,512),[[c,s(t).name]])]),JSON.parse(s(h)).userType=="Administrator"?(b(),y("div",ce,[e("div",le,[e("div",ue,[me,e("div",_e,[e("input",{type:"text",value:s(t).createdBy,disabled:s(t).createdBy,id:"username",class:"bg-[#dddddd] disabled:bg-gray-300 disabled:text-gray-500 h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",required:""},null,8,pe)])])])])):q("",!0)])]),e("div",ge,[e("div",fe,[e("div",ye,[be,n(e("textarea",{"onUpdate:modelValue":d[4]||(d[4]=a=>s(t).description=a),rows:"6",id:"description",class:"bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",placeholder:"(free text field, 1000 characters max, about 30 sentenses max) what is the goal of this item or project"},null,512),[[c,s(t).description]])])])])])])],40,E)]))}});export{qe as default};
