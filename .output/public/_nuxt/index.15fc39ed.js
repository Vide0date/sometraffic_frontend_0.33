import{q as be,l as Ie,r as W,b as Be,a as Me,x as Ae,e as Z,i as t,j as J,f as Q,u as r,C as $e,t as u,K as je,L as qe,U as ze,F as Ee,D as Te,k as Ne,o as k,m as he,H as Ge,I as He,G as Re}from"./entry.f74c2745.js";import{u as ge}from"./fetch.e03870c9.js";import{m as Ue}from"./index.6351cf08.js";import{D as Ve}from"./index.65d38652.js";const _=O=>(Ge("data-v-93928ea1"),O=O(),He(),O),Ye={id:"information_items",class:"shadow sm:rounded-md"},Fe=_(()=>t("div",{class:"text"},"Are you sure?",-1)),Ke={class:"flex justify-between"},Pe={class:"font-bold py-4 capitalize"},Oe={class:"flex items-start"},We={class:"flex border-2 rounded"},Je={class:"relative"},Qe=_(()=>t("svg",{color:"black",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M6 18L18 6M6 6l12 12"})],-1)),Xe=[Qe],Ze=_(()=>t("svg",{class:"w-6 h-6 text-slate-50",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},[t("path",{d:"M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"})],-1)),ke=[Ze],we=_(()=>t("div",{class:"flex items-center justify-center"},null,-1)),et={class:"overflow-x-auto"},tt={class:"w-full whitespace-nowrap"},st=_(()=>t("thead",{class:"bg-black/60"},[t("tr",null,[t("th",{class:"text-left py-3 px-2"},"Info ID"),t("th",{class:"text-left py-3 px-2"},"Item ID"),t("th",{class:"text-left py-3 px-2"},"Information"),t("th",{class:"text-left py-3 px-2"},"Category"),t("th",{class:"text-left py-3 px-2"},"Posts/Month"),t("th",{class:"text-left py-3 px-2"},"Date/Time"),t("th",{class:"text-left py-3 px-2 rounded-r-lg"},"Actions")])],-1)),at={class:"border-b border-gray-700",key:"clickdata.id"},nt={class:"py-3 px-2"},ot={class:"py-3 px-2"},it={class:"py-3 px-2 tooltip"},lt={class:"py-3 px-2 capitalize"},ut={class:"py-3 px-2 capitalize"},_t={class:"py-3 px-2 capitalize"},dt={class:"py-3 px-2"},ct={class:"inline-flex items-center space-x-3"},rt=_(()=>t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-5 h-5"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"})],-1)),vt=["onClick"],mt=_(()=>t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"})],-1)),pt=[mt],Ct={__name:"index",setup(O){const w=Ne("$awn"),{id:X}=Ie().query,d=W(!1),i=W([]),l=W([]),v=W(0),a=Be({vaClDa:X!==""?X:""}),ee=Me(),xe=()=>{a.vaClDa="",l.value=i.value,v.value=i.value.length},te=()=>{var n;l.value=(n=i==null?void 0:i._value)==null?void 0:n.filter(e=>{var o,s,c,m,p,C,f,h,g,x,L,y,D,S,b,I,B,M,A,$,j,q,z,E,T,N,G,H,R,U,V,Y,F,K,P;return((c=e.username.toLowerCase())==null?void 0:c.includes((s=(o=a.vaClDa)==null?void 0:o.toString())==null?void 0:s.toLowerCase()))||((m=e==null?void 0:e.item_id)==null?void 0:m.includes(a.vaClDa))||((p=e==null?void 0:e.Category_Item.unique_identifier)==null?void 0:p.includes(a.vaClDa))||((h=e==null?void 0:e.timestamp)==null?void 0:h.toLowerCase().includes((f=(C=a.vaClDa)==null?void 0:C.toString())==null?void 0:f.toLowerCase()))||((L=e==null?void 0:e.information)==null?void 0:L.toLowerCase().includes((x=(g=a.vaClDa)==null?void 0:g.toString())==null?void 0:x.toLowerCase()))||((b=(y=e==null?void 0:e.url_1_txt)==null?void 0:y.toLowerCase())==null?void 0:b.includes((S=(D=a.vaClDa)==null?void 0:D.toString())==null?void 0:S.toLowerCase()))||((A=(I=e==null?void 0:e.url_1_link)==null?void 0:I.toLowerCase())==null?void 0:A.includes((M=(B=a.vaClDa)==null?void 0:B.toString())==null?void 0:M.toLowerCase()))||((z=($=e==null?void 0:e.url_2_txt)==null?void 0:$.toLowerCase())==null?void 0:z.includes((q=(j=a.vaClDa)==null?void 0:j.toString())==null?void 0:q.toLowerCase()))||((G=(E=e==null?void 0:e.url_2_link)==null?void 0:E.toLowerCase())==null?void 0:G.includes((N=(T=a.vaClDa)==null?void 0:T.toString())==null?void 0:N.toLowerCase()))||((R=(H=e==null?void 0:e.posts_per_month)==null?void 0:H.toString())==null?void 0:R.includes(a.vaClDa))||((V=(U=e==null?void 0:e.posts_today)==null?void 0:U.toString())==null?void 0:V.includes(a.vaClDa))||((F=(Y=e==null?void 0:e.members_total)==null?void 0:Y.toString())==null?void 0:F.includes(a.vaClDa))||((P=(K=e==null?void 0:e.members_new)==null?void 0:K.toString())==null?void 0:P.includes(a.vaClDa))}),v.value=l.value.length},Le=()=>{var n;l.value=(n=i==null?void 0:i._value)==null?void 0:n.filter(e=>{var o,s,c,m,p,C,f,h,g,x,L,y,D,S,b,I,B,M,A,$,j,q,z,E,T,N,G,H,R,U,V,Y,F,K,P,ae,ne,oe,ie,le,ue,_e,de,ce,re,ve,me,pe,Ce,fe;return((c=e.username.toLowerCase())==null?void 0:c.includes((s=(o=a.vaClDa)==null?void 0:o.toString())==null?void 0:s.toLowerCase()))||((m=e==null?void 0:e.unique_identifier)==null?void 0:m.includes(a.vaClDa))||((p=e==null?void 0:e.Category_Item.unique_identifier)==null?void 0:p.includes(a.vaClDa))||((h=e==null?void 0:e.item_title)==null?void 0:h.toLowerCase().includes((f=(C=a.vaClDa)==null?void 0:C.toString())==null?void 0:f.toLowerCase()))||((y=(g=e==null?void 0:e.category)==null?void 0:g.toLowerCase())==null?void 0:y.includes((L=(x=a.vaClDa)==null?void 0:x.toString())==null?void 0:L.toLowerCase()))||((I=(D=e==null?void 0:e.cat_group)==null?void 0:D.toLowerCase())==null?void 0:I.includes((b=(S=a.vaClDa)==null?void 0:S.toString())==null?void 0:b.toLowerCase()))||(($=(B=e==null?void 0:e.priority)==null?void 0:B.toLowerCase())==null?void 0:$.includes((A=(M=a.vaClDa)==null?void 0:M.toString())==null?void 0:A.toLowerCase()))||((E=(j=e==null?void 0:e.information)==null?void 0:j.toLowerCase())==null?void 0:E.includes((z=(q=a.vaClDa)==null?void 0:q.toString())==null?void 0:z.toLowerCase()))||((H=(T=e==null?void 0:e.visibility)==null?void 0:T.toLowerCase())==null?void 0:H.includes((G=(N=a.vaClDa)==null?void 0:N.toString())==null?void 0:G.toLowerCase()))||((Y=(R=e==null?void 0:e.automatic_status)==null?void 0:R.toLowerCase())==null?void 0:Y.includes((V=(U=a.vaClDa)==null?void 0:U.toString())==null?void 0:V.toLowerCase()))||((ae=(F=e==null?void 0:e.url_1_txt)==null?void 0:F.toLowerCase())==null?void 0:ae.includes((P=(K=a.vaClDa)==null?void 0:K.toString())==null?void 0:P.toLowerCase()))||((le=(ne=e==null?void 0:e.url_1_link)==null?void 0:ne.toLowerCase())==null?void 0:le.includes((ie=(oe=a.vaClDa)==null?void 0:oe.toString())==null?void 0:ie.toLowerCase()))||((ce=(ue=e==null?void 0:e.url_2_txt)==null?void 0:ue.toLowerCase())==null?void 0:ce.includes((de=(_e=a.vaClDa)==null?void 0:_e.toString())==null?void 0:de.toLowerCase()))||((pe=(re=e==null?void 0:e.url_2_link)==null?void 0:re.toLowerCase())==null?void 0:pe.includes((me=(ve=a.vaClDa)==null?void 0:ve.toString())==null?void 0:me.toLowerCase()))||((fe=(Ce=e==null?void 0:e.plan_frequency)==null?void 0:Ce.toString())==null?void 0:fe.includes(a.vaClDa))}),v.value=l.value.length},ye=(n,e)=>{const o=new Date(n);return Ue(o).format(e)},se=async()=>{const{data:n}=await ge(`${ee.API_BASE_URL}information-items/all`,"$W3zfG6LLas");i.value=n.value.data,l.value=n.value.data,v.value=n.value.count,X&&te()},De=async()=>{const n=localStorage.getItem("sometraffic_delete_info"),{data:e,error:o}=await ge(`${ee.API_BASE_URL}information-items/delete/${n}`,{method:"GET",params:{id:n}},"$asSLG4l8GT");e.value&&(d.value=!1,await w.success(e.value.message)),o.value&&(d.value=!1,await w.alert(o.value.statusMessage)),localStorage.removeItem("sometraffic_delete_info"),await se()},Se=async n=>{d.value=!0,localStorage.setItem("sometraffic_delete_info",n)};return Ae(se),(n,e)=>{const o=Re;return k(),Z("div",null,[t("div",Ye,[J(r(Ve),{title:"You can NOT undo this action",modalClass:"confirm-modal",visible:r(d),"onUpdate:visible":e[0]||(e[0]=s=>$e(d)?d.value=s:null),cancelButton:{text:"Cancel"},okButton:{text:"Okay",onclick:()=>De()}},{default:Q(()=>[Fe]),_:1},8,["visible","okButton"]),t("div",Ke,[t("h1",Pe," Information Items list ("+u(r(v))+") ",1),t("div",Oe,[t("div",We,[t("div",Je,[je(t("input",{type:"text","onUpdate:modelValue":e[1]||(e[1]=s=>r(a).vaClDa=s),class:"px-4 py-2 w-80 border-inherit bg-inherit pr-9 focus:outline-none focus:ring focus:border-blue-600 search",placeholder:"Search...",onKeyup:e[2]||(e[2]=ze(s=>Le(),["enter"]))},null,544),[[qe,r(a).vaClDa]]),t("button",{class:"absolute inset-y-0 right-0 px-2",onClick:e[3]||(e[3]=s=>xe())},Xe)]),t("button",{class:"flex items-center justify-center px-4 border-l bg-blue-700",onClick:e[4]||(e[4]=s=>te())},ke)])])]),we,t("div",et,[t("table",tt,[st,t("tbody",null,[(k(!0),Z(Ee,null,Te(r(l),s=>(k(),Z("tr",at,[t("td",nt,[J(o,{to:`/information-items/${s.item_id}`,title:"Edit",class:"hover:text-white"},{default:Q(()=>[he(u(s==null?void 0:s.item_id),1)]),_:2},1032,["to"])]),t("td",ot,[J(o,{to:`/category-items/${s==null?void 0:s.Category_Item.unique_identifier}`,title:"Edit",class:"hover:text-white"},{default:Q(()=>[he(u(s==null?void 0:s.Category_Item.unique_identifier),1)]),_:2},1032,["to"])]),t("td",it,u(s.information.length>90?s.information.slice(0,90)+"...":s.information),1),t("td",lt,u(s==null?void 0:s.Category_Item.category),1),t("td",ut,u(s==null?void 0:s.posts_per_month),1),t("td",_t,u(ye(s==null?void 0:s.timestamp,"YYYY-MM-DD H:m")),1),t("td",dt,[t("div",ct,[J(o,{to:`/information-items/${s.item_id}`,title:"Edit",class:"hover:text-white"},{default:Q(()=>[rt]),_:2},1032,["to"]),t("span",{onClick:c=>Se(s.id),title:"Delete",class:"hover:text-white"},pt,8,vt)])])]))),128))])])])])])}}},Lt=be(Ct,[["__scopeId","data-v-93928ea1"]]);export{Lt as default};
