import{q as g,o as m,e as f,t as p,a as D,r as T,b as I,x as N,Z as C,j as o,f as s,u as c,C as L,i as e,a2 as $,k as B,T as j,G as Y,m as A,H as E,I as M}from"./entry.2fd7c06b.js";import{D as R}from"./index.97ab7f9a.js";import{m as U}from"./index.fea725fe.js";const H={data(){return{time:new Date().toLocaleTimeString()}},mounted(){setInterval(()=>{this.time=new Date().toLocaleTimeString()},1e3)}};function O(d,u,x,n,l,v){return m(),f("div",null,p(l.time),1)}const V=g(H,[["render",O]]);const t=d=>(E("data-v-5abcf466"),d=d(),M(),d),q={class:"antialiased bg-[#848484] w-full min-h-screen text-slate-300 relative py-4"},G=t(()=>e("div",{class:"text"},"Are you sure?",-1)),J={class:"bg-[#848484] grid grid-cols-12 mx-auto gap-2 sm:gap-4 md:gap-6 lg:gap-10 xl:gap-14 max-w-12xl my-10 px-2"},W={id:"menu",class:"border border-white border-solid bg-white/10 col-span-3 rounded-lg p-4"},F={class:"font-bold text-lg lg:text-3xl bg-gradient-to-br from-black via-black/50 to-transparent bg-clip-text text-transparent"},P=t(()=>e("span",{class:"text-black"},".",-1)),Z=t(()=>e("p",{class:"text-slate-600 text-sm mb-2"},"Welcome back,",-1)),z={class:"text-white-600 text-md mb-2"},K=t(()=>e("div",null,[e("img",{class:"rounded-full w-10 h-10 relative object-cover",src:"https://img.freepik.com/free-photo/no-problem-concept-bearded-man-makes-okay-gesture-has-everything-control-all-fine-gesture-wears-spectacles-jumper-poses-against-pink-wall-says-i-got-this-guarantees-something_273609-42817.jpg?w=1800&t=st=1669749937~exp=1669750537~hmac=4c5ab249387d44d91df18065e1e33956daab805bee4638c7fdbf83c73d62f125",alt:""})],-1)),Q={class:"font-medium group-hover:text-black leading-4"},X={class:"flex justify-between py-1"},ee={class:"text-xs text-slate-600"},te=t(()=>e("hr",{class:"my-2 border-slate-700"},null,-1)),oe={id:"menu",class:"flex flex-col space-y-2 my-5"},se=t(()=>e("div",{class:"flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"},[e("div",null,[e("p",{class:"font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"}," Dashboard ")])],-1)),ae=t(()=>e("div",{class:"flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"},[e("div",null,[e("p",{class:"font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"}," Category Items ")])],-1)),re=t(()=>e("div",{class:"flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"},[e("div",null,[e("p",{class:"font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"}," Information Items ")])],-1)),le=t(()=>e("div",{class:"flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"},[e("div",null,[e("p",{class:"font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"}," Tasks ")])],-1)),de=t(()=>e("div",{class:"flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"},[e("div",null,[e("p",{class:"font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"}," Users ")])],-1)),ne=t(()=>e("div",{class:"flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"},[e("div",null,[e("p",{class:"font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"}," Emails ")])],-1)),ie=t(()=>e("div",{class:"flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"},[e("div",null,[e("p",{class:"font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"}," Tracking URL ")])],-1)),ce=t(()=>e("div",{class:"flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"},[e("div",null,[e("p",{class:"font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"}," Click List ")])],-1)),pe=t(()=>e("div",{class:"flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"},[e("div",null,[e("p",{class:"font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"}," Groups ")])],-1)),ue=t(()=>e("div",{class:"flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"},[e("div",null,[e("p",{class:"font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"}," Logout ")])],-1)),xe=[ue],he=t(()=>e("p",{class:"text-sm text-center text-black-600"}," v0.3.2 | © 2023 Sometraffic ",-1)),be={id:"content",class:"border border-white border-solid bg-white/10 col-span-9 rounded-lg p-6"},ge={__name:"default",setup(d){const u=B("$awn"),x=D(),n=T(!1),l=I({userName:"",userType:"",currentTime:""}),_=`sometraffic-${U(new Date).format("YYYY-MM-DD-HH_mm")}`,h=async()=>{if(typeof window<"u"&&l!=null){let r=localStorage.getItem("user");l.userName=JSON.parse(r).userName,l.userType=JSON.parse(r).userType}};N(h),C(h);const w=()=>{const r=document.createElement("a");r.href=`${x.API_BASE_URL}files/sometraffic.sql`,r.download=_,r.target="_blank",r.click()},y=async()=>{localStorage.clear(),j("/"),await u.success("You Logout From System!")},k=async()=>{n.value=!0};return(r,i)=>{const a=Y,S=V;return m(),f("div",q,[o(c(R),{title:"You can login again later",modalClass:"confirm-modal",visible:c(n),"onUpdate:visible":i[0]||(i[0]=b=>L(n)?n.value=b:null),cancelButton:{text:"Cancel"},okButton:{text:"Okay",onclick:()=>y()}},{default:s(()=>[G]),_:1},8,["visible","okButton"]),e("div",J,[e("div",W,[e("h1",F,[o(a,{to:"/dashboard"},{default:s(()=>[A("Dashboard")]),_:1}),P]),Z,e("h2",z,[o(S)]),e("div",null,[o(a,{to:"/dashboard",class:"flex flex-col space-y-2 md:space-y-0 md:flex-row mb-5 items-center md:space-x-2 hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid group transition duration-150 ease-linear rounded-lg group w-full py-3 px-2"},{default:s(()=>[K,e("div",null,[e("p",Q,p(c(l).userName),1),e("span",X,[e("span",ee,p(c(l).userType),1)])])]),_:1}),e("span",{class:"download-db hover:text-gray-700",onClick:i[1]||(i[1]=b=>w())},"Download Database")]),te,e("div",oe,[o(a,{class:"hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",to:"/dashboard"},{default:s(()=>[se]),_:1}),o(a,{class:"hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",to:"/category-items"},{default:s(()=>[ae]),_:1}),o(a,{class:"hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",to:"/information-items"},{default:s(()=>[re]),_:1}),o(a,{class:"hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",to:"/tasks"},{default:s(()=>[le]),_:1}),o(a,{class:"hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",to:"/users"},{default:s(()=>[de]),_:1}),o(a,{class:"hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",to:"/emails"},{default:s(()=>[ne]),_:1}),o(a,{class:"hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",to:"/tracking-url"},{default:s(()=>[ie]),_:1}),o(a,{class:"hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",to:"/click-list"},{default:s(()=>[ce]),_:1}),o(a,{class:"hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",to:"/user-groups"},{default:s(()=>[pe]),_:1}),e("a",{href:"#",onClick:k,class:"hover:bg-white/10 hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",role:"menuitem",tabindex:"-1",id:"user-menu-item-2"},xe)]),he]),e("div",be,[$(r.$slots,"default",{},void 0,!0)])])])}}},_e=g(ge,[["__scopeId","data-v-5abcf466"]]);export{_e as default};