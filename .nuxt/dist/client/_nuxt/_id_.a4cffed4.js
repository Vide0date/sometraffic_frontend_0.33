import{H as M,T,M as j}from"./components.e36d576a.js";import{_ as q}from"./Loader.2bedd978.js";import{l as C,a0 as F,a as H,r as x,b as L,w as N,S as D,e as b,u as a,c as V,f as S,h as P,i as g,j as s,P as $,o as f,m as I,t as U}from"./entry.add87038.js";import{a as O,u as R}from"./fetch.5fca7f49.js";import"./composables.1109ec18.js";const W={class:"w-screen h-screen rounded-xl p-8 flex justify-center m-auto"},z={class:"space-y-8 flex justify-center m-auto object-center"},G={key:0,class:"inline-flex tracking"},ee={__name:"[id]",async setup(X){let m,h;const l=C();F();const i=H(),u=l.params,A=l.query,n=x([]),t=x(""),B=L({redirect_flaq:!1}),v=i.BASE_URL+l.fullPath,d=v.split("?")[0];return console.log("Full Path: ",v),u.id&&u.id.length===7&&(A.fbclid?console.log("Save it."):(console.log("Redirect it or show preview or do nothing."),[m,h]=N(()=>R(`${i.API_BASE_URL}trackingurl/get-meta`,{method:"POST",body:{tracking_url:d}},"$Yr6aDRXGgk").then(e=>{e.data.value&&(n.value=e.data.value,t.value=e.data.value[0].destination_url,(!t.value.includes("http")||!t.value.includes("https"))&&(t.value="https://"+t.value)),e.error.value&&console.log("Error no result",e.error)}).catch(e=>{console.log("Error useFetch: ",e)})),await m,h()),console.log("Redirect: ",n)),D(async()=>{const e=screen.width,p=screen.height;console.log("screenHeight",p),console.log("screenWidth",e);let c="";if(navigator.connection){const r=navigator.connection.downlink;c=r+" Mbps",console.log("Internet speed is "+r+" Mbps")}else console.log("navigator.connection is not available");await O("mountains",()=>_),await R(`${i.API_BASE_URL}trackingurl/redirect`,{method:"POST",body:{id:u.id,tracking_url:d,screen_resolution:e+"x"+p,network_speed:c,referrer_url:document.referrer}},"$PNCP5poDuj").catch(o=>{console.log("Error useFetch: ",o)}),console.log("destination",t.value),t.value!==""?window.location.assign(t.value):console.log("empty url")}),(e,p)=>{var y;const c=T,o=j,r=M,E=q;return f(),b($,null,[((y=a(n))==null?void 0:y.length)>0?(f(),V(r,{key:0},{default:S(()=>{var w;return[s(c,null,{default:S(()=>{var k;return[I("Some Traffic | "+U((k=a(n)[0])==null?void 0:k.seo_title),1)]}),_:1}),s(o,{property:"og:title",content:(w=a(n)[0])==null?void 0:w.seo_title},null,8,["content"]),s(o,{property:"og:description",content:a(n)[0].seo_description},null,8,["content"]),s(o,{property:"og:image",content:a(n)[0].seo_image_url},null,8,["content"]),s(o,{property:"og:url",content:a(d)},null,8,["content"]),s(o,{property:"og:type",content:"Some traffic web app"})]}),_:1})):P("",!0),g("div",null,[g("div",W,[g("div",z,[a(B).redirect_flaq==!0?(f(),b("span",G,[s(E)])):P("",!0)])])])],64)}}};export{ee as default};