import{H as T,T as A,M as j}from"./components.8282578c.js";import{_ as q}from"./Loader.7c3cf814.js";import{l as C,a0 as F,a as N,r as k,b as L,w,S as M,e as v,u as o,c as V,f as x,h as S,i as _,j as n,P as $,o as d,m as D,t as H}from"./entry.19973437.js";import{u as P}from"./fetch.61eb7f6b.js";import"./composables.7931ce6f.js";const U={class:"w-screen h-screen rounded-xl p-8 flex justify-center m-auto"},I={class:"space-y-8 flex justify-center m-auto object-center"},O={key:0,class:"inline-flex tracking"},W={__name:"[id]",async setup(G){let a,s;const c=C();F();const l=N(),i=c.params,p=c.query,t=k([]),f=k(""),R=L({redirect_flaq:!1}),m=l.BASE_URL+c.fullPath,u=m.split("?")[0];return console.log("Full Path: ",m),i.id&&i.id.length===7&&(p.fbclid?console.log("Save it."):(console.log("Redirect it or show preview or do nothing."),[a,s]=w(()=>P(`${l.API_BASE_URL}trackingurl/get-meta`,{method:"POST",body:{tracking_url:u}},"$Yr6aDRXGgk").then(e=>{e.data.value&&(t.value=e.data.value,f.value=e.data.value[0].destination_url),e.error.value&&console.log("Error no result",e.error)}).catch(e=>{console.log("Error useFetch: ",e)})),await a,s()),console.log("Redirect: ",t)),[a,s]=w(()=>P(`${l.API_BASE_URL}trackingurl/redirect`,{method:"POST",body:{id:i.id,tracking_url:u,screen_resolution:"unknownxunknown",network_speed:"",referrer_url:p.fbclid?"https://facebook.com":""}},"$PNCP5poDuj").then(e=>{}).catch(e=>{console.log("Error useFetch: ",e)})),await a,s(),M(()=>{window.location.assign(f.value)}),(e,X)=>{var g;const b=A,r=j,B=T,E=q;return d(),v($,null,[((g=o(t))==null?void 0:g.length)>0?(d(),V(B,{key:0},{default:x(()=>{var h;return[n(b,null,{default:x(()=>{var y;return[D("Some Traffic | "+H((y=o(t)[0])==null?void 0:y.seo_title),1)]}),_:1}),n(r,{property:"og:title",content:(h=o(t)[0])==null?void 0:h.seo_title},null,8,["content"]),n(r,{property:"og:description",content:o(t)[0].seo_description},null,8,["content"]),n(r,{property:"og:image",content:o(t)[0].seo_image_url},null,8,["content"]),n(r,{property:"og:url",content:o(u)},null,8,["content"]),n(r,{property:"og:type",content:"Some traffic web app"})]}),_:1})):S("",!0),_("div",null,[_("div",U,[_("div",I,[o(R).redirect_flaq==!0?(d(),v("span",O,[n(E)])):S("",!0)])])])],64)}}};export{W as default};
