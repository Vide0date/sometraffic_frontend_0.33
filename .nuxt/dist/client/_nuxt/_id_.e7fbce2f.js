import{H as B,T,M as b}from"./components.3dbf36d4.js";import{_ as q}from"./Loader.7a217341.js";import{l as E,a0 as j,a as A,r as C,b as F,w as N,e as h,u as o,c as P,f as y,h as v,i as s,j as n,O as V,o as c,m as H,t as L}from"./entry.839ca326.js";import{u as M}from"./fetch.867b3728.js";import"./composables.ca50aa59.js";const D={class:"w-screen h-screen rounded-xl p-8 flex justify-center m-auto"},O={class:"space-y-8 flex justify-center m-auto object-center"},U={key:0,class:"inline-flex tracking"},K={__name:"[id]",async setup($){let l,i;const r=E();j();const u=A(),_=r.params,x=r.query,e=C([]),k=F({redirect_flaq:!1}),p=u.BASE_URL+r.fullPath,d=p.split("?")[0];return console.log("Full Path: ",p),_.id&&_.id.length===7&&(x.fbclid?console.log("Save it."):(console.log("Redirect it or show preview or do nothing."),[l,i]=N(()=>M(`${u.API_BASE_URL}trackingurl/get-meta`,{method:"POST",body:{tracking_url:d}},"$Yr6aDRXGgk").then(t=>{t.data.value&&(e.value=t.data.value),t.error.value&&console.log("Error no result",t.error)}).catch(t=>{console.log("Error useFetch: ",t)})),await l,i()),console.log("Redirect: ",e)),(t,G)=>{var f;const w=T,a=b,R=B,S=q;return c(),h(V,null,[((f=o(e))==null?void 0:f.length)>0?(c(),P(R,{key:0},{default:y(()=>{var m;return[n(w,null,{default:y(()=>{var g;return[H("Some Traffic | "+L((g=o(e)[0])==null?void 0:g.seo_title),1)]}),_:1}),n(a,{property:"og:title",content:(m=o(e)[0])==null?void 0:m.seo_title},null,8,["content"]),n(a,{property:"og:description",content:o(e)[0].seo_description},null,8,["content"]),n(a,{property:"og:image",content:o(e)[0].seo_image_url},null,8,["content"]),n(a,{property:"og:url",content:o(d)},null,8,["content"]),n(a,{property:"og:type",content:"Some traffic web app"})]}),_:1})):v("",!0),s("div",null,[s("div",D,[s("div",O,[o(k).redirect_flaq==!0?(c(),h("span",U,[n(S)])):v("",!0)])])])],64)}}};export{K as default};