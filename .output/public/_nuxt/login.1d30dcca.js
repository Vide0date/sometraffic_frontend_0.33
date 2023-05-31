import{r as d,b,e as c,i as e,u as l,t as f,h as _,D as u,E as m,C as p,o as g,F as h}from"./entry.5b256fc3.js";import{u as w}from"./fetch.6e23e403.js";const x={class:"flex justify-center w-screen items-center"},y={key:0,class:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-2/6 mb-6",role:"alert"},k=e("strong",{class:"font-bold"},"Oops, try again! ",-1),S={class:"block sm:inline"},M=e("span",{class:"absolute top-0 bottom-0 right-0 px-4 py-3"},[e("svg",{class:"fill-current h-6 w-6 text-red-500",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20"},[e("title",null,"Close"),e("path",{d:"M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"})])],-1),E={class:"flex justify-center h-screen w-screen items-center"},C={class:"w-full md:w-1/2 flex flex-col items-center"},T=e("h1",{class:"text-center text-2xl font-bold text-gray-600 mb-6"},"Member's Login",-1),A={class:"w-3/4 mb-6"},B={class:"w-3/4 mb-6"},I={class:"w-3/4 mt-4"},L=["onClick"],D={__name:"login",setup(N){console.log("login");const r=d(null),n=d(null),t=b({email:"",password:""}),v=async()=>{let a={email:t.email,password:t.password};console.log("login form submited",a);const{data:s,error:o}=await w(`${config.API_BASE_URL}auth/signin`,{key:a.email,method:"POST",body:a},"$MnW08vEsNn");if(s.value&&(r.value=!1,localStorage.setItem("user",JSON.stringify(s.value)),localStorage.setItem("authToken",s.value.accessToken),s.value.userType==="Administrator"?console.log("admin"):(console.log("not admin"),localStorage.setItem("activeAccount",s.value.AccountId)),h("/")),o.value){r.value=!0;let i=o.value.statusCode;n.value=i==404?"You didn't have any account":i==401?"Email or Password incorrect!":o.value.statusMessage,console.log("response error",o.value.statusMessage)}};return(a,s)=>(g(),c("div",null,[e("div",x,[l(r)?(g(),c("div",y,[k,e("span",S,f(l(n)),1),M])):_("",!0)]),e("form",{onSubmit:s[2]||(s[2]=p(()=>{},["prevent"]))},[e("div",E,[e("div",C,[T,e("div",A,[u(e("input",{type:"email","onUpdate:modelValue":s[0]||(s[0]=o=>l(t).email=o),id:"email",class:"w-full py-4 px-8 text-black bg-slate-200 placeholder:font-semibold rounded hover:ring-1 outline-blue-500",placeholder:"Your Email",required:""},null,512),[[m,l(t).email]])]),e("div",B,[u(e("input",{type:"password","onUpdate:modelValue":s[1]||(s[1]=o=>l(t).password=o),id:"password",class:"w-full py-4 px-8 text-black bg-slate-200 placeholder:font-semibold rounded hover:ring-1 outline-blue-500",placeholder:"Password",required:""},null,512),[[m,l(t).password]])]),e("div",I,[e("button",{onClick:p(v,["prevent"]),class:"py-4 bg-blue-400 w-full rounded text-blue-50 font-bold hover:bg-blue-700"}," Sign in",8,L)])])])],32)]))}};export{D as default};