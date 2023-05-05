import{j as p,r as _,a as g,o as n,b as d,h as e,u as l,t as x,f as w,B as m,C as h,A as f,L as y,m as k,i as $,K as S}from"./entry.4d41dba5.js";import{u as B}from"./fetch.013f5933.js";const C={class:"flex justify-center w-full items-center"},L={key:0,class:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full mb-6",role:"alert"},M=e("strong",{class:"font-bold"},"Oops, try again! ",-1),N={class:"block sm:inline"},V=e("span",{class:"absolute top-0 bottom-0 right-0 px-4 py-3"},[e("svg",{class:"fill-current h-6 w-6 text-red-500",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20"},[e("title",null,"Close"),e("path",{d:"M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"})])],-1),j={class:"flex justify-center w-full items-center"},E={class:"w-96 flex flex-col items-center"},T=e("h1",{class:"text-center text-2xl font-bold text-gray-600 mb-4"}," Member's Login ",-1),A={class:"w-full mb-4"},P={class:"w-full mb-4"},F={class:"w-full"},I=["onClick","disabled"],O={__name:"Login",setup(v){p("$swal"),p("$awn");const c=k(),a=_(null),i=_(null),t=g({email:"",password:""}),b=async()=>{let r={email:t.email,password:t.password};const{data:s,error:o}=await B(`${c.API_BASE_URL}auth/signin`,{key:r.email,method:"POST",body:r},"$ABNRyb1YFZ");if(s.value&&(a.value=!1,localStorage.setItem("user",JSON.stringify(s.value)),localStorage.setItem("authToken",s.value.accessToken),y("/dashboard")),o.value){a.value=!0;let u=o.value.statusCode;i.value=u==404?"You didn't have any account":u==401?"Email or Password incorrect!":o.value.statusMessage,console.log("response error",o.value.statusMessage)}};return(r,s)=>(n(),d("div",null,[e("div",C,[l(a)?(n(),d("div",L,[M,e("span",N,x(l(i)),1),V])):w("",!0)]),e("form",{onSubmit:s[2]||(s[2]=f(()=>{},["prevent"]))},[e("div",j,[e("div",E,[T,e("div",A,[m(e("input",{type:"email","onUpdate:modelValue":s[0]||(s[0]=o=>l(t).email=o),id:"email",class:"text-black w-full py-4 px-8 bg-slate-200 placeholder:font-semibold rounded hover:ring-1 focus:text-black outline-blue-500",placeholder:"Your Email",required:""},null,512),[[h,l(t).email]])]),e("div",P,[m(e("input",{type:"password","onUpdate:modelValue":s[1]||(s[1]=o=>l(t).password=o),id:"password",class:"text-black w-full py-4 px-8 bg-slate-200 placeholder:font-semibold rounded hover:ring-1 focus:text-black outline-blue-500",placeholder:"Password",required:""},null,512),[[h,l(t).password]])]),e("div",F,[e("button",{onClick:f(b,["prevent"]),disabled:l(t).password==""&&l(t).email=="",class:"py-4 bg-blue-400 w-full rounded text-blue-50 font-bold hover:bg-blue-700"}," Sign in ",8,I)])])])],32)]))}},R={class:"w-screen h-screen relative rounded-xl overflow-auto p-8"},U={class:"space-y-8"},Y={class:"relative text-sm font-medium leading-6"},q={class:"relative rounded-lg"},D={class:"static p-4 h-32 flex flex-col justify-between"},z={class:"flex gap-4"},J={class:"absolute top-0 right-0 bg-white shadow-lg rounded-lg p-4 text-white border-solid border-gray-600 border-2"},K=S('<div class="rounded-lg p-4 w-screen"><div class="pl-48 pt-48"><h2 class="text-4xl">Sometraffic.com</h2><h2 class="text-4xl">Social media traffic</h2><br><h2 class="text-4xl">Schedule and track your</h2><h2 class="text-4xl">organic social media posts</h2></div></div>',1),H={__name:"index",setup(v){return(c,a)=>{const i=O;return n(),d("div",null,[e("div",R,[e("div",U,[e("div",null,[e("div",Y,[e("div",q,[e("div",D,[e("div",z,[e("div",J,[e("div",null,[$(i)])]),K])])])])])])])])}}};export{H as default};
