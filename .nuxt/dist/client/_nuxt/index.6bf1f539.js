import{r as Ve,b as Ie,a as Ke,x as Qe,e as _,i as s,D as qe,E as Ge,u as p,P as Je,Q as Oe,k as We,o as C,j as Ye,f as ze,m as Pe,t as i,R as Xe}from"./entry.d9f4c351.js";import{u as Ze}from"./fetch.ce00ecd5.js";import{m as ke}from"./index.3c16275b.js";const we={id:"click_data",class:"shadow sm:rounded-md"},et={class:"flex justify-between"},tt=s("h1",{class:"font-bold py-4 uppercase"},"Click list",-1),st={class:"flex items-start"},nt={class:"flex border-2 rounded border-blue-600"},ot={class:"relative"},lt=s("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6"},[s("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M6 18L18 6M6 6l12 12"})],-1),it=[lt],at=s("svg",{class:"w-6 h-6 text-slate-50",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},[s("path",{d:"M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"})],-1),rt=[at],ut=s("div",{class:"flex items-center justify-center"},null,-1),dt={class:"overflow-x-auto"},_t={class:"w-full whitespace-nowrap"},pt=s("thead",{class:"bg-black/60"},[s("tr",null,[s("th",{class:"text-left py-3 px-2"},"Tracking URL"),s("th",{class:"text-left py-3 px-2"},"Task ID"),s("th",{class:"text-left py-3 px-2"},"Device"),s("th",{class:"text-left py-3 px-2"},"Date / Time"),s("th",{class:"text-left py-3 px-2"},"Country"),s("th",{class:"text-left py-3 px-2"},"City"),s("th",{class:"text-left py-3 px-2"},"Referrer")])],-1),Ct={class:"border-b border-gray-700",key:"clickdata.id"},vt={class:"py-3 px-2"},ct={class:"py-3 px-2"},gt={class:"py-3 px-2"},ht={class:"py-3 px-2"},xt={class:"py-3 px-2"},ft={class:"py-3 px-2"},mt={class:"py-3 px-2"},Mt={__name:"index",setup(Dt){We("$awn");const a=Ve([]),d=Ve([]),n=Ie({vaClDa:""}),Ae=Ke(),Fe=()=>{n.vaClDa="",d.value=a.value},He=()=>{var o;d.value=(o=a==null?void 0:a._value)==null?void 0:o.filter(e=>{var l,t,r,u,c,g,h,x,f,m,D,y,L,S,b,M,R,B,j,E,N,T,$,U,V,Y,z,P,A,F,H,I,K,Q,q,G,J,O,W,X,Z,k,w,ee,te,se,ne,oe,le,ie,ae,re,ue,de,_e,pe,Ce,ve,ce,ge,he,xe,fe,me,De,ye,Le,Se,be,Me,Re,Be,je,Ee,Ne,Te,$e,Ue;return((l=e==null?void 0:e.task_id)==null?void 0:l.includes(n.vaClDa))||((c=(u=(r=(t=e.Redirect)==null?void 0:t.tracking_url)==null?void 0:r.toString())==null?void 0:u.toLowerCase())==null?void 0:c.includes(n.vaClDa))||((g=e.ip_address)==null?void 0:g.includes(n.vaClDa))||((h=e.screen_resolution)==null?void 0:h.includes(n.vaClDa))||((x=e.network_speed)==null?void 0:x.includes(n.vaClDa))||((f=e.latitude)==null?void 0:f.includes(n.vaClDa))||((m=e.longtitude)==null?void 0:m.includes(n.vaClDa))||((D=e.zipcode)==null?void 0:D.includes(n.vaClDa))||((y=e.timestamp)==null?void 0:y.includes(n.vaClDa))||((L=v(e==null?void 0:e.timestamp,"H:m"))==null?void 0:L.includes(n.vaClDa))||((B=(b=(S=e==null?void 0:e.device)==null?void 0:S.toString())==null?void 0:b.toLowerCase())==null?void 0:B.includes((R=(M=n.vaClDa)==null?void 0:M.toString())==null?void 0:R.toLowerCase()))||(($=(E=(j=e==null?void 0:e.referrer_url)==null?void 0:j.toString())==null?void 0:E.toLowerCase())==null?void 0:$.includes((T=(N=n.vaClDa)==null?void 0:N.toString())==null?void 0:T.toLowerCase()))||((P=(V=(U=e==null?void 0:e.country)==null?void 0:U.toString())==null?void 0:V.toLowerCase())==null?void 0:P.includes((z=(Y=n.vaClDa)==null?void 0:Y.toString())==null?void 0:z.toLowerCase()))||((K=(F=(A=e==null?void 0:e.country_code)==null?void 0:A.toString())==null?void 0:F.toLowerCase())==null?void 0:K.includes((I=(H=n.vaClDa)==null?void 0:H.toString())==null?void 0:I.toLowerCase()))||((O=(q=(Q=e==null?void 0:e.region)==null?void 0:Q.toString())==null?void 0:q.toLowerCase())==null?void 0:O.includes((J=(G=n.vaClDa)==null?void 0:G.toString())==null?void 0:J.toLowerCase()))||((w=(X=(W=e==null?void 0:e.region_name)==null?void 0:W.toString())==null?void 0:X.toLowerCase())==null?void 0:w.includes((k=(Z=n.vaClDa)==null?void 0:Z.toString())==null?void 0:k.toLowerCase()))||((oe=(te=(ee=e==null?void 0:e.operating_system)==null?void 0:ee.toString())==null?void 0:te.toLowerCase())==null?void 0:oe.includes((ne=(se=n.vaClDa)==null?void 0:se.toString())==null?void 0:ne.toLowerCase()))||((ue=(ie=(le=e==null?void 0:e.browser)==null?void 0:le.toString())==null?void 0:ie.toLowerCase())==null?void 0:ue.includes((re=(ae=n.vaClDa)==null?void 0:ae.toString())==null?void 0:re.toLowerCase()))||((ve=(_e=(de=e==null?void 0:e.browser_language)==null?void 0:de.toString())==null?void 0:_e.toLowerCase())==null?void 0:ve.includes((Ce=(pe=n.vaClDa)==null?void 0:pe.toString())==null?void 0:Ce.toLowerCase()))||((fe=(ge=(ce=e==null?void 0:e.ip_lookup_status)==null?void 0:ce.toString())==null?void 0:ge.toLowerCase())==null?void 0:fe.includes((xe=(he=n.vaClDa)==null?void 0:he.toString())==null?void 0:xe.toLowerCase()))||((Se=(De=(me=e==null?void 0:e.isp)==null?void 0:me.toString())==null?void 0:De.toLowerCase())==null?void 0:Se.includes((Le=(ye=n.vaClDa)==null?void 0:ye.toString())==null?void 0:Le.toLowerCase()))||((je=(Me=(be=e==null?void 0:e.connection_type)==null?void 0:be.toString())==null?void 0:Me.toLowerCase())==null?void 0:je.includes((Be=(Re=n.vaClDa)==null?void 0:Re.toString())==null?void 0:Be.toLowerCase()))||((Ue=(Ne=(Ee=e==null?void 0:e.city)==null?void 0:Ee.toString())==null?void 0:Ne.toLowerCase())==null?void 0:Ue.includes(($e=(Te=n.vaClDa)==null?void 0:Te.toString())==null?void 0:$e.toLowerCase()))})},v=(o,e)=>{const l=new Date(o);return ke(l).format(e)};return Qe(async()=>{const{data:o}=await Ze(`${Ae.API_BASE_URL}clickdata/all`,"$PQmKnKUN7L");a.value=o.value,d.value=o.value}),(o,e)=>{const l=Xe;return C(),_("div",null,[s("div",we,[s("div",et,[tt,s("div",st,[s("div",nt,[s("div",ot,[qe(s("input",{type:"text","onUpdate:modelValue":e[0]||(e[0]=t=>p(n).vaClDa=t),class:"px-4 py-2 w-80 border-inherit bg-inherit pr-9 focus:outline-none focus:ring focus:border-blue-600",placeholder:"Search..."},null,512),[[Ge,p(n).vaClDa]]),s("button",{class:"absolute inset-y-0 right-0 px-2",onClick:e[1]||(e[1]=t=>Fe())},it)]),s("button",{class:"flex items-center justify-center px-4 border-l bg-blue-700",onClick:e[2]||(e[2]=t=>He())},rt)])])]),ut,s("div",dt,[s("table",_t,[pt,s("tbody",null,[(C(!0),_(Je,null,Oe(p(d),t=>{var r;return C(),_("tr",Ct,[s("td",vt,[Ye(l,{to:`/tracking-url/${(r=t==null?void 0:t.Redirect)==null?void 0:r.id}`,title:"Edit",class:"hover:text-white"},{default:ze(()=>{var u;return[Pe(i((u=t==null?void 0:t.Redirect)==null?void 0:u.tracking_url.slice(-7)),1)]}),_:2},1032,["to"])]),s("td",ct,[Ye(l,{to:`/click-list/detail/${t==null?void 0:t.task_id}`,title:"Edit",class:"hover:text-white"},{default:ze(()=>[Pe(i(t==null?void 0:t.task_id),1)]),_:2},1032,["to"])]),s("td",gt,i(t==null?void 0:t.device),1),s("td",ht,i(v(t==null?void 0:t.timestamp,"YYYY-MM-DD H:m")),1),s("td",xt,i(t==null?void 0:t.country),1),s("td",ft,i(t==null?void 0:t.city),1),s("td",mt,i(t==null?void 0:t.referrer_url),1)])}),128))])])])])])}}};export{Mt as default};