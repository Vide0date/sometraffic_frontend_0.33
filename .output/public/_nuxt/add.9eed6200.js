import{q as y,a as b,r as g,b as w,x as k,e as B,i as e,j as S,f as q,u as o,J as U,C as _,D as n,E as r,k as C,o as A,K as I,L,F as D}from"./entry.839ca326.js";import{u as f}from"./fetch.867b3728.js";import{D as T}from"./index.d7166f5d.js";const i=c=>(I("data-v-8b663852"),c=c(),L(),c),R={id:"last-tracking-url"},V=i(()=>e("div",{class:"text"}," This item already exists in the database. Are you sure that you want to create it double? ",-1)),N=["onSubmit"],j=i(()=>e("div",{class:"flex justify-between"},[e("h1",{class:"font-bold py-4 capitalize"},"Create a new account"),e("button",{type:"submit",class:"bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent pt-4 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"}," Create Account ")],-1)),M={class:"overflow-hidden shadow sm:rounded-md"},$={class:"px-4 py-5 sm:p-6"},E={class:"col-span-12"},O={class:"grid grid-cols-12"},P=i(()=>e("div",{class:"col-span-3 flex items-center text-sm font-medium text-gray-700"}," Item ID ",-1)),F={class:"col-span-3"},J=["disabled"],z={class:"flex flex-row mt-4"},K={class:"basis-1/2 pr-1.5"},Q={class:"col-span-12"},W={class:"grid grid-cols-12"},G=i(()=>e("div",{class:"col-span-3 flex items-center text-sm font-medium text-gray-700"}," Created ",-1)),H={class:"col-span-9"},X=["disabled"],Y={class:"basis-1/2 pl-1.5"},Z={class:"col-span-12"},ee={class:"grid grid-cols-12"},te=i(()=>e("div",{class:"col-span-3 flex items-center text-sm font-medium text-gray-700"}," Created By ",-1)),se={class:"col-span-9"},oe=["disabled"],de={class:"col-span-12 mt-4"},ae={class:"grid grid-cols-12"},ie=i(()=>e("div",{class:"col-span-3 flex items-center text-sm font-medium text-gray-700"}," Account name * ",-1)),ne={class:"col-span-9"},re={class:"col-span-12 sm:col-span-12 mt-4"},ce={class:"grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4"},le={class:"col-span-12 sm:col-span-12"},ue=i(()=>e("label",{for:"description",class:"block text-sm font-medium text-gray-700"},"Description",-1)),me={__name:"add",setup(c){const l=C("$awn"),m=b(),u=g(!1);let v=localStorage.getItem("user"),p=new Date().toLocaleTimeString();const h=g("");setInterval(()=>{p=new Date().toLocaleTimeString()},10);const s=w({createdBy:JSON.parse(v).userName,timestamp:p,unique_identifier:"",description:"",name:""}),x=async()=>{const a={createdBy:s.createdBy,name:s.name,unique_identifier:s.unique_identifier,description:s.description};await f(`${m.API_BASE_URL}accounts/create`,{method:"POST",body:a},"$LQkoovyvUf").then(t=>{t.data.value&&(l.success(t.data.value.message),h.value="",D("/accounts")),t.error.value&&(console.log("error value1",t.error.value.data.message),l.alert(error))}).catch(t=>{console.log("error value",t),l.alert("Unable to create account.")})};return k(async()=>{const{data:a,error:t}=await f(`${m.API_BASE_URL}accounts/gettrackingurl`,"$DiLCLMneO5");a.value&&(s.unique_identifier=a.value.newTrackingURl),t.value&&await l.alert(t.value.statusMessage)}),(a,t)=>(A(),B("div",{onClick:t[6]||(t[6]=_((...d)=>a.doSomething&&a.doSomething(...d),["shift"]))},[e("div",R,[S(o(T),{title:"Are you sure?",modalClass:"confirm-modal",visible:o(u),"onUpdate:visible":t[0]||(t[0]=d=>U(u)?u.value=d:null),cancelButton:{text:"Cancel"},okButton:{text:"Okay",onclick:()=>a.handleSave()}},{default:q(()=>[V]),_:1},8,["visible","okButton"]),e("form",{onSubmit:_(x,["prevent"])},[j,e("div",M,[e("div",$,[e("div",E,[e("div",O,[P,e("div",F,[n(e("input",{type:"text","onUpdate:modelValue":t[1]||(t[1]=d=>o(s).unique_identifier=d),disabled:o(s).unique_identifier,id:"unique_identifier",class:"bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",required:""},null,8,J),[[r,o(s).unique_identifier]])])])]),e("div",z,[e("div",K,[e("div",Q,[e("div",W,[G,e("div",H,[n(e("input",{type:"text","onUpdate:modelValue":t[2]||(t[2]=d=>o(s).timestamp=d),disabled:o(s).timestamp,id:"timestamp",class:"bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",required:""},null,8,X),[[r,o(s).timestamp]])])])])]),e("div",Y,[e("div",Z,[e("div",ee,[te,e("div",se,[n(e("input",{type:"text","onUpdate:modelValue":t[3]||(t[3]=d=>o(s).createdBy=d),disabled:o(s).createdBy,id:"username",class:"bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",required:""},null,8,oe),[[r,o(s).createdBy]])])])])])]),e("div",de,[e("div",ae,[ie,e("div",ne,[n(e("input",{placeholder:"Need to enter account name (obligatory)",type:"text","onUpdate:modelValue":t[4]||(t[4]=d=>o(s).name=d),id:"name",class:"bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",required:""},null,512),[[r,o(s).name]])])])]),e("div",re,[e("div",ce,[e("div",le,[ue,n(e("textarea",{"onUpdate:modelValue":t[5]||(t[5]=d=>o(s).description=d),rows:"6",id:"description",class:"bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm",placeholder:"(free text field, 1000 characters max, about 30 sentenses max) what is the goal of this item or project"},null,512),[[r,o(s).description]])])])])])])],40,N)])]))}},ve=y(me,[["__scopeId","data-v-8b663852"]]);export{ve as default};
