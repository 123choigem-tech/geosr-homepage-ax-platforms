(() => {
 'use strict';
 const map=document.querySelector('.org-v2 #organization-map');
 const content=window.companyContent;
 if(!map||!content)return;
 const section=map.closest('section'),grid=map.querySelector('.org-divisions');
 const svg=map.querySelector('.org-connections');
 const divisions=[...grid.querySelectorAll('.org-division')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const desktop=matchMedia('(min-width: 1101px)');
 const buttons=[...map.querySelectorAll('.department-card')];
 const panels=new Map(),triggers=new Map();
 let selection='',department='',hover='',queued=false,entered=false,updating=false;
 let animations=[],motionFrame=0,version=0;
 const lang=()=>window.companySite?.lang||'en';
 const localized=(ko,en)=>lang()==='ko'?ko:en;
 const divisionData=id=>content.divisions.find(d=>d.id===id);
 const departmentData=id=>content.departments.find(d=>d.id===id);
 function element(tag,ko,en,cls){
  const el=document.createElement(tag);
  el.dataset.ko=ko;el.dataset.en=en;el.textContent=localized(ko,en);
  if(cls)el.className=cls;return el;
 }
 section.classList.add('org-interactive');
 const toolbar=document.createElement('div');toolbar.className='org-toolbar';
 const reset=element('button','전체 조직 보기','View full organization','org-reset');
 reset.type='button';
 const status=document.createElement('p');status.className='org-state';
 status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 toolbar.append(reset,status);map.before(toolbar);
 divisions.forEach(div=>{
  const id=div.dataset.branch,h3=div.querySelector('.division-title h3');
  const trigger=document.createElement('button');
  trigger.className='division-trigger';trigger.type='button';trigger.dataset.division=id;
  trigger.append(element('span',h3.dataset.ko,h3.dataset.en));
  delete h3.dataset.ko;delete h3.dataset.en;
  const icon=document.createElement('span');icon.className='division-toggle-icon';
  icon.setAttribute('aria-hidden','true');icon.textContent='+';
  trigger.append(icon);h3.replaceChildren(trigger);
  div.id='org-group-'+id;
  div.querySelector('.department-list').id='org-departments-'+id;
  trigger.setAttribute('aria-controls','org-departments-'+id);
  triggers.set(id,trigger);
  const panel=document.createElement('div');panel.className='division-details';
  panel.id='org-details-'+id;panel.hidden=true;panel.inert=true;panel.setAttribute('role','region');
  div.append(panel);panels.set(id,panel);
  div.querySelectorAll('.department-card').forEach(b=>{
   b.type='button';b.id='org-dept-'+b.dataset.dept;
   b.removeAttribute('aria-haspopup');
   b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls',panel.id);
  });
 });
 function fillPanel(panel,id){
  const u=departmentData(id);if(!u)return;
  if(panel.dataset.content!==id){
   const inner=document.createElement('div');inner.className='division-details-inner';
   const heading=document.createElement('div');heading.className='detail-heading';
   const title=document.createElement('div');
   title.append(element('p','주요 업무','Department work','eyebrow'),element('h4',u.ko,u.en));
   const close=document.createElement('button');close.type='button';close.className='detail-close';
   close.dataset.closeDepartment=id;close.textContent='×';
   heading.append(title,close);
   const list=document.createElement('ul');
   u.tasksKo.forEach((task,i)=>list.append(element('li',task,u.tasksEn[i])));
   const footer=document.createElement('div');footer.className='detail-footer';
   footer.append(element('p','업무 소개안 · 회사소개서 '+u.pages+'쪽','Work summary proposal · Brochure pages '+u.pages,'source-note'));
   const link=element('a','관련 업무 문의 ↗','Enquire about this work ↗');
   link.dataset.local='';footer.append(link);
   inner.append(heading,list,footer);panel.replaceChildren(inner);panel.dataset.content=id;
  }
  panel.setAttribute('aria-labelledby','org-dept-'+id);
  panel.querySelector('.detail-close').setAttribute('aria-label',localized('상세 업무 접기','Close department details'));
  panel.querySelector('a').href='contact.html'+(lang()==='ko'?'?lang=ko':'');
 }
 function updateControls(){
  map.dataset.view=selection?'focused':'overview';
  map.dataset.division=selection;map.dataset.department=department;
  reset.disabled=!selection;
  const d=divisionData(selection),u=departmentData(department);
  status.textContent=d?(d[lang()]+(u?' / '+u[lang()]:localized(' · 부서를 선택해 업무 보기',' · Select a department'))):localized('부문 선택 → 확대 · 부서 선택 → 업무 보기','Select a division to explore its departments');
  triggers.forEach((b,id)=>{
   const selected=id===selection;
   b.setAttribute('aria-pressed',String(selected));
   b.setAttribute('aria-label',divisionData(id)[lang()]+' · '+localized(selected?'전체 조직 보기':'부문 확대',selected?'Return to full organization':'Explore this division'));
   b.querySelector('.division-toggle-icon').textContent=selected?'−':'+';
  });
  buttons.forEach(b=>{
   const expanded=b.dataset.dept===department;
   b.setAttribute('aria-expanded',String(expanded));
   b.querySelector('.department-more i').textContent=expanded?'−':'→';
  });
 }
 function arrange(){
  const focus=document.activeElement;
  grid.classList.toggle('has-selection',!!selection);
  let order=divisions;
  if(selection){
   const chosen=divisions.find(d=>d.dataset.branch===selection),others=divisions.filter(d=>d!==chosen);
   order=desktop.matches?[others[0],chosen,others[1]]:[chosen,...others];
  }
  // DOM and visual order stay identical for keyboard and screen-reader navigation.
  if(order.some((d,i)=>grid.children[i]!==d))order.forEach(d=>grid.append(d));
  divisions.forEach(d=>{
   d.classList.toggle('is-selected',d.dataset.branch===selection);
   d.classList.toggle('is-context',!!selection&&d.dataset.branch!==selection);
  });
  if(focus instanceof HTMLElement&&map.contains(focus)&&document.activeElement!==focus)focus.focus({preventScroll:true});
 }
 function cancelAnimations(){
  animations.forEach(a=>a.cancel());animations=[];
  if(motionFrame)cancelAnimationFrame(motionFrame);motionFrame=0;
  panels.forEach(p=>p.style.removeProperty('height'));
 }
 function addAnimation(el,frames,options){
  const a=el.animate(frames,options);animations.push(a);
  a.finished.catch(()=>{});return a;
 }
 function watchMotion(){
  if(motionFrame)return;
  const tick=()=>{
   motionFrame=0;draw();
   animations=animations.filter(a=>a.playState==='running'||a.playState==='pending');
   if(animations.length)motionFrame=requestAnimationFrame(tick);
  };
  motionFrame=requestAnimationFrame(tick);
 }
 function change(nextSelection,nextDepartment='',options={}){
  if(nextSelection&&!divisionData(nextSelection))return;
  if(nextDepartment&&!divisionData(nextSelection)?.units.includes(nextDepartment))return;
  if(nextSelection===selection&&nextDepartment===department&&!options.force)return;
  const serial=++version,previousSelection=selection;
  const oldRects=new Map(divisions.map(d=>[d,d.getBoundingClientRect()]));
  const oldHeights=new Map([...panels.values()].map(p=>[p,p.hidden?0:p.getBoundingClientRect().height]));
  const oldGridHeight=grid.getBoundingClientRect().height;
  cancelAnimations();
  updating=true;
  if(!selection&&nextSelection&&desktop.matches)grid.style.setProperty('--org-overview-height',oldGridHeight+'px');
  if(!nextSelection||!desktop.matches||options.resize)grid.style.removeProperty('--org-overview-height');
  selection=nextSelection;department=nextDepartment;
  arrange();updateControls();
  const animate=options.animate!==false&&!reduced.matches;
  const changingDivision=previousSelection!==selection;
  const panelChanges=[];
  panels.forEach((panel,id)=>{
   const open=id===selection&&!!department;
   const oldHeight=oldHeights.get(panel)||0;
   panel.dataset.open=String(open);panel.inert=!open;
   if(open){
    fillPanel(panel,department);panel.hidden=false;
    const target=panel.scrollHeight;
    const from=changingDivision?0:oldHeight;
    if(animate){
     panel.style.height=from+'px';
     panelChanges.push({panel,from,to:target,open:true});
    }
   }else if(animate&&id===selection&&oldHeight){
    panel.hidden=false;panel.style.height=oldHeight+'px';
    panelChanges.push({panel,from:oldHeight,to:0,open:false});
   }else panel.hidden=true;
  });
  // FLIP uses the current visual position, so rapid clicks never restart from stale slots.
  if(animate&&changingDivision){
   divisions.forEach(d=>{
    const before=oldRects.get(d),after=d.getBoundingClientRect();
    if(!after.width||!after.height)return;
    const transform='translate('+(before.left-after.left)+'px,'+(before.top-after.top)+'px) scale('+(before.width/after.width)+','+(before.height/after.height)+')';
    addAnimation(d,[{transform},{transform:'none'}],{duration:560,easing:'cubic-bezier(.22,1,.36,1)'});
   });
  }
  const finished=[];
  panelChanges.forEach(({panel,from,to,open})=>{
   const a=addAnimation(panel,[{height:from+'px'},{height:to+'px'}],{duration:380,delay:changingDivision?180:0,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
   finished.push(a.finished.catch(()=>{}));
   a.finished.then(()=>{
    if(serial!==version)return;
    panel.hidden=!open;panel.style.removeProperty('height');a.cancel();schedule();
   }).catch(()=>{});
   if(open)addAnimation(panel.firstElementChild,[{opacity:.35},{opacity:1}],{duration:300,delay:changingDivision?250:30,easing:'ease-out'});
  });
  updating=false;highlight(selection||hover);schedule();watchMotion();
  const work=[...animations.map(a=>a.finished.catch(()=>{})),...finished];
  Promise.all(work).then(()=>{
   if(serial!==version)return;
   if(options.navigate)ensureVisible(options.anchor||(department?panels.get(selection):selection?divisions.find(d=>d.dataset.branch===selection):map));
  });
 }
 function ensureVisible(el){
  if(!el||document.hidden)return;
  const r=el.getBoundingClientRect(),header=document.querySelector('#site-header').offsetHeight+22;
  // Closing a detail or returning to the overview also restores visible context.
  // preventScroll on focus alone could otherwise leave its button above the viewport.
  if(!department&&r.top<header){
   scrollTo({top:scrollY+r.top-header,behavior:reduced.matches?'instant':'smooth'});return;
  }
  if(!desktop.matches){
   if(r.top<header||r.bottom>innerHeight-25)scrollTo({top:scrollY+r.top-header,behavior:reduced.matches?'instant':'smooth'});
  }else if(r.bottom>innerHeight-25){
   const group=el.closest('.org-division')||el;
   const room=group.getBoundingClientRect().top-header;
   if(room>0)scrollBy({top:Math.min(r.bottom-innerHeight+25,room),behavior:reduced.matches?'instant':'smooth'});
  }
 }
 reset.onclick=()=>change('','',{navigate:true});
 map.addEventListener('click',e=>{
  const close=e.target.closest('[data-close-department]');
  if(close){
   const b=document.getElementById('org-dept-'+department);
   change(selection,'',{navigate:true,anchor:b});b?.focus({preventScroll:true});return;
  }
  const b=e.target.closest('[data-dept]');
  if(b){
   const id=b.dataset.dept,d=content.divisions.find(d=>d.units.includes(id));
   change(d.id,department===id?'':id,{navigate:true,anchor:department===id?b:null});return;
  }
  const trigger=e.target.closest('[data-division]');
  if(trigger){const id=trigger.dataset.division;change(selection===id?'':id,'',{navigate:true,anchor:selection===id?trigger:null});}
 });
 section.addEventListener('keydown',e=>{
  if(e.key!=='Escape'||!selection)return;
  e.preventDefault();
  if(department){
   const b=document.getElementById('org-dept-'+department);change(selection,'',{navigate:true,anchor:b});b?.focus({preventScroll:true});
  }else{
   const b=triggers.get(selection);change('','',{navigate:true,anchor:b});b.focus({preventScroll:true});
  }
 });
 function draw(){
  queued=false;
  const origin=map.getBoundingClientRect();
  svg.setAttribute('viewBox','0 0 '+origin.width+' '+origin.height);
  const rect=el=>{const b=el.getBoundingClientRect();return{x:b.left-origin.left,y:b.top-origin.top,w:b.width,h:b.height,cx:b.left-origin.left+b.width/2,cy:b.top-origin.top+b.height/2};};
  const ceo=rect(map.querySelector('.org-ceo')),support=[...map.querySelectorAll('.support-unit')].map(rect),paths=[];
  if(innerWidth<=650){
   const junction=support[0].y-12,rail=support[0].x-20;
   paths.push({d:'M '+ceo.cx+' '+(ceo.y+ceo.h)+' V '+junction+' H '+rail+' V '+support.at(-1).cy});
   support.forEach(s=>paths.push({d:'M '+rail+' '+s.cy+' H '+s.x}));
  }else{
   const groups=divisions.map(rect),top=Math.min(...groups.map(g=>g.y)),junction=top-18;
   divisions.forEach((d,i)=>{
    const g=groups[i],start='M '+ceo.cx+' '+(ceo.y+ceo.h)+' V '+junction;
    // At tablet width Systems occupies a new row. Route around, not through, the other departments.
    const path=g.y>top+20?start+' H -14 V '+(g.y-20)+' H '+g.cx+' V '+g.y:
     start+' H '+g.cx+' V '+g.y;
    paths.push({branch:d.dataset.branch,d:path});
   });
   support.forEach(s=>{
    const left=s.cx<ceo.cx,x=left?ceo.x:ceo.x+ceo.w,tx=left?s.x+s.w:s.x,mid=(x+tx)/2;
    paths.push({d:'M '+x+' '+ceo.cy+' C '+mid+' '+ceo.cy+', '+mid+' '+s.cy+', '+tx+' '+s.cy});
   });
  }
  while(svg.children.length>paths.length)svg.lastElementChild.remove();
  while(svg.children.length<paths.length)svg.append(document.createElementNS('http://www.w3.org/2000/svg','path'));
  paths.forEach((p,i)=>{const el=svg.children[i];el.setAttribute('d',p.d);el.setAttribute('pathLength','1');if(p.branch)el.dataset.branch=p.branch;else delete el.dataset.branch;});
  highlight(selection||hover||focused());
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(draw)}}
 function highlight(id){
  divisions.forEach(d=>d.classList.toggle('is-focused',d.dataset.branch===id));
  svg.querySelectorAll('[data-branch]').forEach(p=>p.classList.toggle('is-focused',p.dataset.branch===id));
 }
 const focused=()=>map.querySelector('.org-division:focus-within')?.dataset.branch||'';
 map.addEventListener('pointerover',e=>{if(e.pointerType==='mouse'){hover=e.target.closest('.org-division')?.dataset.branch||'';highlight(selection||hover||focused())}});
 map.addEventListener('pointerleave',()=>{hover='';highlight(selection||focused())});
 map.addEventListener('focusin',()=>{if(!updating)highlight(focused()||selection)});
 map.addEventListener('focusout',()=>requestAnimationFrame(()=>highlight(focused()||selection)));
 const observer=new IntersectionObserver(entries=>{
  if(entered||!entries.some(e=>e.isIntersecting))return;
  entered=true;observer.disconnect();draw();
  if(reduced.matches||selection)return;
  svg.querySelectorAll('path').forEach(p=>addAnimation(p,[{strokeDasharray:'1',strokeDashoffset:1},{strokeDasharray:'1',strokeDashoffset:0}],{duration:850,easing:'cubic-bezier(.22,1,.36,1)'}));
  divisions.forEach((d,i)=>addAnimation(d,[{opacity:.55,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:100+i*80,easing:'cubic-bezier(.22,1,.36,1)'}));
  watchMotion();
 },{threshold:.15});
 observer.observe(map);
 new ResizeObserver(schedule).observe(map);
 document.fonts.ready.then(schedule);
 document.addEventListener('portal:language',()=>{change(selection,department,{animate:false,force:true});schedule()});
 let resizeFrame=0;
 addEventListener('resize',()=>{
  if(resizeFrame)cancelAnimationFrame(resizeFrame);
  resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;change(selection,department,{animate:false,force:true,resize:true})});
 });
 reduced.addEventListener('change',()=>change(selection,department,{animate:false,force:true}));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)change(selection,department,{animate:false,force:true})});
 updateControls();schedule();
})();
