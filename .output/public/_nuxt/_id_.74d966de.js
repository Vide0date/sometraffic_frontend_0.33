import{H as M,T,M as N}from"./components.5c508d7f.js";import{_ as j}from"./Loader.a176fb7b.js";import{l as q,a0 as C,a as F,r as b,b as H,w as L,S as D,e as x,u as a,c as V,f as S,h as P,i as g,j as s,P as $,o as f,m as I,t as U}from"./entry.031f21e0.js";import{a as W,u as R}from"./fetch.e82de631.js";import"./composables.da23196e.js";const O={class:"w-screen h-screen rounded-xl p-8 flex justify-center m-auto"},z={class:"space-y-8 flex justify-center m-auto object-center"},G={key:0,class:"inline-flex tracking"},ee={__name:"[id]",async setup(X){let m,h;const l=q();C();const i=F(),u=l.params,A=l.query,n=b([]),r=b(""),B=H({redirect_flaq:!1}),v=i.BASE_URL+l.fullPath,d=v.split("?")[0];return console.log("Full Path: ",v),u.id&&u.id.length===7&&(A.fbclid?console.log("Save it."):(console.log("Redirect it or show preview or do nothing."),[m,h]=L(()=>R(`${i.API_BASE_URL}trackingurl/get-meta`,{method:"POST",body:{tracking_url:d}},"$Yr6aDRXGgk").then(o=>{o.data.value&&(console.log("get-meta result",o.data.value),n.value=o.data.value,r.value=o.data.value[0].destination_url,(!r.value.includes("http")||!r.value.includes("https"))&&(r.value="https://"+r.value)),o.error.value&&console.log("Error no result",o.error)}).catch(o=>{console.log("Error useFetch: ",o)})),await m,h()),console.log("Redirect: ",n)),D(async()=>{const o=screen.width,p=screen.height;console.log("screenHeight",p),console.log("screenWidth",o);let c="";if(navigator.connection){const t=navigator.connection.downlink;c=t+" Mbps",console.log("Internet speed is "+t+" Mbps")}else console.log("navigator.connection is not available");await W("mountains",()=>_),await R(`${i.API_BASE_URL}trackingurl/redirect`,{method:"POST",body:{id:u.id,tracking_url:d,screen_resolution:o+"x"+p,network_speed:c,referrer_url:document.referrer}},"$PNCP5poDuj").then(e=>{if(e.data.value){console.log("redirect data",e.data.value);let t=e.data.value.destination_url;console.log("destination before manipulation",t),(!t.includes("http")||!t.includes("http"))&&(t="https://"+t),console.log("destination after manipulation",t),t!==""?window.location.assign(t):console.log("empty destination")}e.error.value&&(console.log("error value1",e.error.value.data.message),AWN.alert(error))}).catch(e=>{console.log("Error useFetch: ",e)}),console.log("destination",r.value)}),(o,p)=>{var y;const c=T,e=N,t=M,E=j;return f(),x($,null,[((y=a(n))==null?void 0:y.length)>0?(f(),V(t,{key:0},{default:S(()=>{var w;return[s(c,null,{default:S(()=>{var k;return[I("Some Traffic | "+U((k=a(n)[0])==null?void 0:k.seo_title),1)]}),_:1}),s(e,{property:"og:title",content:(w=a(n)[0])==null?void 0:w.seo_title},null,8,["content"]),s(e,{property:"og:description",content:a(n)[0].seo_description},null,8,["content"]),s(e,{property:"og:image",content:a(n)[0].seo_image_url},null,8,["content"]),s(e,{property:"og:url",content:a(d)},null,8,["content"]),s(e,{property:"og:type",content:"Some traffic web app"})]}),_:1})):P("",!0),g("div",null,[g("div",O,[g("div",z,[a(B).redirect_flaq==!0?(f(),x("span",G,[s(E)])):P("",!0)])])])],64)}}};export{ee as default};