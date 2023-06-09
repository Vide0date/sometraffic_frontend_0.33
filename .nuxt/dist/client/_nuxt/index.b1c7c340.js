import{q as Ie,l as be,r as W,b as je,a as Ae,x as Be,e as k,i as t,j as Q,f as J,u as v,K as Me,t as u,D as $e,E as Pe,O as qe,P as Ee,Q as ze,k as Re,o as w,m as ge,L as Te,M as Ne,R as Ue}from"./entry.031f21e0.js";import{u as ee}from"./fetch.e82de631.js";import{m as Ve}from"./index.ae3c2480.js";import{D as Ye}from"./index.7b446c5f.js";const c=O=>(Te("data-v-c592f6f9"),O=O(),Ne(),O),Ge={id:"information_items",class:"shadow sm:rounded-md"},He=c(()=>t("div",{class:"text"},"Are you sure?",-1)),Fe={class:"flex justify-between"},Ke={class:"font-bold py-4 capitalize"},Oe={class:"flex items-start"},We={class:"flex border-2 rounded"},Qe={class:"relative"},Je=c(()=>t("svg",{color:"black",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M6 18L18 6M6 6l12 12"})],-1)),Xe=[Je],Ze=c(()=>t("svg",{class:"w-6 h-6 text-slate-50",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},[t("path",{d:"M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"})],-1)),ke=[Ze],we=c(()=>t("div",{class:"flex items-center justify-center"},null,-1)),et={class:"overflow-x-auto"},tt={class:"w-full whitespace-nowrap"},st=c(()=>t("thead",{class:"bg-black/60"},[t("tr",null,[t("th",{class:"text-left py-3 px-2"},"Info ID"),t("th",{class:"text-left py-3 px-2"},"Item ID"),t("th",{class:"text-left py-3 px-2"},"Information"),t("th",{class:"text-left py-3 px-2"},"Category"),t("th",{class:"text-left py-3 px-2"},"Posts/Month"),t("th",{class:"text-left py-3 px-2"},"Date/Time"),t("th",{class:"text-left py-3 px-2 rounded-r-lg"},"Actions")])],-1)),at={class:"py-3 px-2"},nt={class:"py-3 px-2"},ot={class:"py-3 px-2 tooltip"},lt={class:"py-3 px-2 capitalize"},it={class:"py-3 px-2 capitalize"},ut={class:"py-3 px-2 capitalize"},ct={class:"py-3 px-2"},rt={class:"inline-flex items-center space-x-3"},dt=c(()=>t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-5 h-5"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"})],-1)),_t=["onClick"],vt=c(()=>t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"})],-1)),mt=[vt],pt={__name:"index",setup(O){const te=Re("$awn"),{id:X}=be().query,r=W(!1),l=W([]),i=W([]),d=W(0),a=je({vaClDa:X!==""?X:""}),Z=Ae(),xe=()=>{a.vaClDa="",i.value=l.value,d.value=l.value.length},se=()=>{var n;i.value=(n=l==null?void 0:l._value)==null?void 0:n.filter(e=>{var o,s,_,m,p,f,C,h,g,x,L,y,D,S,I,b,j,A,B,M,$,P,q,E,z,R,T,N,U,V,Y,G,H,F,K;return((_=e.username.toLowerCase())==null?void 0:_.includes((s=(o=a.vaClDa)==null?void 0:o.toString())==null?void 0:s.toLowerCase()))||((m=e==null?void 0:e.item_id)==null?void 0:m.includes(a.vaClDa))||((p=e==null?void 0:e.Category_Item.unique_identifier)==null?void 0:p.includes(a.vaClDa))||((h=e==null?void 0:e.timestamp)==null?void 0:h.toLowerCase().includes((C=(f=a.vaClDa)==null?void 0:f.toString())==null?void 0:C.toLowerCase()))||((L=e==null?void 0:e.information)==null?void 0:L.toLowerCase().includes((x=(g=a.vaClDa)==null?void 0:g.toString())==null?void 0:x.toLowerCase()))||((I=(y=e==null?void 0:e.url_1_txt)==null?void 0:y.toLowerCase())==null?void 0:I.includes((S=(D=a.vaClDa)==null?void 0:D.toString())==null?void 0:S.toLowerCase()))||((B=(b=e==null?void 0:e.url_1_link)==null?void 0:b.toLowerCase())==null?void 0:B.includes((A=(j=a.vaClDa)==null?void 0:j.toString())==null?void 0:A.toLowerCase()))||((q=(M=e==null?void 0:e.url_2_txt)==null?void 0:M.toLowerCase())==null?void 0:q.includes((P=($=a.vaClDa)==null?void 0:$.toString())==null?void 0:P.toLowerCase()))||((T=(E=e==null?void 0:e.url_2_link)==null?void 0:E.toLowerCase())==null?void 0:T.includes((R=(z=a.vaClDa)==null?void 0:z.toString())==null?void 0:R.toLowerCase()))||((U=(N=e==null?void 0:e.posts_per_month)==null?void 0:N.toString())==null?void 0:U.includes(a.vaClDa))||((Y=(V=e==null?void 0:e.posts_today)==null?void 0:V.toString())==null?void 0:Y.includes(a.vaClDa))||((H=(G=e==null?void 0:e.members_total)==null?void 0:G.toString())==null?void 0:H.includes(a.vaClDa))||((K=(F=e==null?void 0:e.members_new)==null?void 0:F.toString())==null?void 0:K.includes(a.vaClDa))}),d.value=i.value.length},Le=()=>{var n;i.value=(n=l==null?void 0:l._value)==null?void 0:n.filter(e=>{var o,s,_,m,p,f,C,h,g,x,L,y,D,S,I,b,j,A,B,M,$,P,q,E,z,R,T,N,U,V,Y,G,H,F,K,ne,oe,le,ie,ue,ce,re,de,_e,ve,me,pe,fe,Ce,he;return((_=e.username.toLowerCase())==null?void 0:_.includes((s=(o=a.vaClDa)==null?void 0:o.toString())==null?void 0:s.toLowerCase()))||((m=e==null?void 0:e.unique_identifier)==null?void 0:m.includes(a.vaClDa))||((p=e==null?void 0:e.Category_Item.unique_identifier)==null?void 0:p.includes(a.vaClDa))||((h=e==null?void 0:e.item_title)==null?void 0:h.toLowerCase().includes((C=(f=a.vaClDa)==null?void 0:f.toString())==null?void 0:C.toLowerCase()))||((y=(g=e==null?void 0:e.category)==null?void 0:g.toLowerCase())==null?void 0:y.includes((L=(x=a.vaClDa)==null?void 0:x.toString())==null?void 0:L.toLowerCase()))||((b=(D=e==null?void 0:e.cat_group)==null?void 0:D.toLowerCase())==null?void 0:b.includes((I=(S=a.vaClDa)==null?void 0:S.toString())==null?void 0:I.toLowerCase()))||((M=(j=e==null?void 0:e.priority)==null?void 0:j.toLowerCase())==null?void 0:M.includes((B=(A=a.vaClDa)==null?void 0:A.toString())==null?void 0:B.toLowerCase()))||((E=($=e==null?void 0:e.information)==null?void 0:$.toLowerCase())==null?void 0:E.includes((q=(P=a.vaClDa)==null?void 0:P.toString())==null?void 0:q.toLowerCase()))||((N=(z=e==null?void 0:e.visibility)==null?void 0:z.toLowerCase())==null?void 0:N.includes((T=(R=a.vaClDa)==null?void 0:R.toString())==null?void 0:T.toLowerCase()))||((G=(U=e==null?void 0:e.automatic_status)==null?void 0:U.toLowerCase())==null?void 0:G.includes((Y=(V=a.vaClDa)==null?void 0:V.toString())==null?void 0:Y.toLowerCase()))||((ne=(H=e==null?void 0:e.url_1_txt)==null?void 0:H.toLowerCase())==null?void 0:ne.includes((K=(F=a.vaClDa)==null?void 0:F.toString())==null?void 0:K.toLowerCase()))||((ue=(oe=e==null?void 0:e.url_1_link)==null?void 0:oe.toLowerCase())==null?void 0:ue.includes((ie=(le=a.vaClDa)==null?void 0:le.toString())==null?void 0:ie.toLowerCase()))||((_e=(ce=e==null?void 0:e.url_2_txt)==null?void 0:ce.toLowerCase())==null?void 0:_e.includes((de=(re=a.vaClDa)==null?void 0:re.toString())==null?void 0:de.toLowerCase()))||((fe=(ve=e==null?void 0:e.url_2_link)==null?void 0:ve.toLowerCase())==null?void 0:fe.includes((pe=(me=a.vaClDa)==null?void 0:me.toString())==null?void 0:pe.toLowerCase()))||((he=(Ce=e==null?void 0:e.plan_frequency)==null?void 0:Ce.toString())==null?void 0:he.includes(a.vaClDa))}),d.value=i.value.length},ye=(n,e)=>{const o=new Date(n);return Ve(o).format(e)},ae=async()=>{if(localStorage.getItem("activeProject")){const{data:n}=await ee(`${Z.API_BASE_URL}information-items/all?projectId=${localStorage.getItem("activeProject")}`,"$asSLG4l8GT");l.value=n.value.data,i.value=n.value.data,d.value=n.value.count}else{let n=0;const e=setInterval(async()=>{if(localStorage.getItem("activeProject")){clearInterval(e);const{data:o}=await ee(`${Z.API_BASE_URL}information-items/all?projectId=${localStorage.getItem("activeProject")}`,"$W3zfG6LLas");l.value=o.value.data,i.value=o.value.data,d.value=o.value.count}else n+=1,n/10>5&&clearInterval(e)},100)}X&&se()},De=async()=>{const n=localStorage.getItem("sometraffic_delete_info"),{data:e,error:o}=await ee(`${Z.API_BASE_URL}information-items/delete/${n}`,{method:"GET",params:{id:n}},"$jLb6AstxRq");e.value&&(r.value=!1,await te.success(e.value.message)),o.value&&(r.value=!1,await te.alert(o.value.statusMessage)),localStorage.removeItem("sometraffic_delete_info"),await ae()},Se=async n=>{r.value=!0,localStorage.setItem("sometraffic_delete_info",n)};return Be(ae),(n,e)=>{const o=Ue;return w(),k("div",null,[t("div",Ge,[Q(v(Ye),{title:"You can NOT undo this action",modalClass:"confirm-modal",visible:v(r),"onUpdate:visible":e[0]||(e[0]=s=>Me(r)?r.value=s:null),cancelButton:{text:"Cancel"},okButton:{text:"Okay",onclick:()=>De()}},{default:J(()=>[He]),_:1},8,["visible","okButton"]),t("div",Fe,[t("h1",Ke," Information Items list ("+u(v(d))+") ",1),t("div",Oe,[t("div",We,[t("div",Qe,[$e(t("input",{type:"text","onUpdate:modelValue":e[1]||(e[1]=s=>v(a).vaClDa=s),class:"px-4 py-2 w-80 border-inherit bg-inherit pr-9 focus:outline-none focus:ring focus:border-blue-600 search",placeholder:"Search...",onKeyup:e[2]||(e[2]=qe(s=>Le(),["enter"]))},null,544),[[Pe,v(a).vaClDa]]),t("button",{class:"absolute inset-y-0 right-0 px-2",onClick:e[3]||(e[3]=s=>xe())},Xe)]),t("button",{class:"flex items-center justify-center px-4 border-l bg-blue-700",onClick:e[4]||(e[4]=s=>se())},ke)])])]),we,t("div",et,[t("table",tt,[st,t("tbody",null,[(w(!0),k(Ee,null,ze(v(i),s=>(w(),k("tr",{class:"border-b border-gray-700",key:s.id},[t("td",at,[Q(o,{to:`/information-items/${s.item_id}`,title:"Edit",class:"hover:text-white"},{default:J(()=>[ge(u(s==null?void 0:s.item_id),1)]),_:2},1032,["to"])]),t("td",nt,[Q(o,{to:`/category-items/${s==null?void 0:s.Category_Item.unique_identifier}`,title:"Edit",class:"hover:text-white"},{default:J(()=>[ge(u(s==null?void 0:s.Category_Item.unique_identifier),1)]),_:2},1032,["to"])]),t("td",ot,u(s.information.length>90?s.information.slice(0,90)+"...":s.information),1),t("td",lt,u(s==null?void 0:s.Category_Item.category),1),t("td",it,u(s==null?void 0:s.posts_per_month),1),t("td",ut,u(ye(s==null?void 0:s.timestamp,"YYYY-MM-DD H:m")),1),t("td",ct,[t("div",rt,[Q(o,{to:`/information-items/${s.item_id}`,title:"Edit",class:"hover:text-white"},{default:J(()=>[dt]),_:2},1032,["to"]),t("span",{onClick:_=>Se(s.id),title:"Delete",class:"hover:text-white"},mt,8,_t)])])]))),128))])])])])])}}},xt=Ie(pt,[["__scopeId","data-v-c592f6f9"]]);export{xt as default};