(() => {
 'use strict';
 const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
 const page=document.body.dataset.page||'home';
 const params=new URLSearchParams(location.search);
 let lang=params.get('lang')==='ko'?'ko':'en'; // No local/session storage.
 const text=(ko,en,tag='span',attrs='')=>`<${tag} data-ko="${ko}" data-en="${en}" ${attrs}>${lang==='ko'?ko:en}</${tag}>`;
 const external='target="_blank" rel="noopener"';
 const home=page==='home';
 const homeLink=id=>id==='organization'?'organization.html':home?'#'+id:'index.html#'+id;
 q('#site-header').innerHTML=`<a class="brand" data-local href="${homeLink('home')}" aria-label="GeoSR home"><img src="assets/logo-geosr-en-20260921.png" alt="GeoSystem Research Corporation"></a>
 <nav id="primary-nav" aria-label="Main"><a data-local data-section="home" href="${homeLink('home')}">Technology</a><a data-local data-page-link="organization" href="${homeLink('organization')}">Organization</a><a data-local data-section="platforms" href="${homeLink('platforms')}">AX Platform</a>
 <details class="resource-menu"><summary>Resources <span aria-hidden="true">⌄</span></summary><div class="resource-panel"><a data-local data-page-link="research" ${home?'data-section="research"':''} href="${home?'#research':'research.html'}"><b>Research</b>${text('논문·연구실적','Publications & research')}</a><a data-local data-page-link="careers" href="careers.html"><b>Careers</b>${text('채용 분야·지원 안내','Careers & applications')}</a></div></details>
 <a class="nav-contact" data-local data-page-link="contact" ${home?'data-section="contact"':''} href="${home?'#contact':'contact.html'}">Contact Us ↗</a><a class="nav-geodap" href="https://www.geo-dap.com/" target="_blank" rel="noopener noreferrer">GeoDAP ↗</a></nav><div class="site-actions"><button id="language" aria-label="Switch language"></button><button class="nav-toggle" aria-controls="primary-nav" aria-expanded="false">Menu <span aria-hidden="true">+</span></button></div>`;
 const footer=q('#site-footer');
 if(footer)footer.innerHTML=`<div class="footer-utility"><a data-local href="contact.html"><b>Contact Us <span>↗</span></b>${text('사업·기술 문의','Business & technical enquiries')}</a><a data-local href="careers.html"><b>Careers <span>↗</span></b>${text('채용 안내','Careers & applications')}</a><a data-local href="research.html"><b>Research <span>↗</span></b>${text('논문·연구실적','Publications & research')}</a><a href="https://www.geo-dap.com/" ${external}><b>GeoDAP <span>↗</span></b>${text('데이터 서비스','Data services')}</a></div><div class="compact-footer"><a class="footer-logo" data-local href="index.html">GeoSR</a>${text('주식회사 지오시스템리서치','Geosystem Research Corporation')}<a href="mailto:admin@geosr.com">admin@geosr.com</a><small>© 2026 GeoSR · DESIGN PREVIEW / 18101</small></div>`;

 const content=window.companyContent;
 const org=q('#organization-map');
 if(org&&content){
  org.innerHTML=`<svg class="org-connections" aria-hidden="true"></svg><div class="org-leadership"><div class="org-ceo"><span class="org-ceo-caption">GEOSR</span>${text('대표이사','CEO','strong')}</div><div class="org-support">${content.support.map((s,i)=>`<div class="support-unit support-${i}">${text(s.ko,s.en,'strong')}${text(s.roleKo,s.roleEn)}</div>`).join('')}</div></div>
  <div class="org-divisions">${content.divisions.map((d,i)=>`<section class="org-division division-${d.id}" data-branch="${d.id}" aria-labelledby="division-${d.id}"><div class="division-title"><div class="division-label"><span class="division-number">0${i+1}</span>${text(d.units.length+'개 부서',d.units.length+' DEPARTMENTS','span','class="division-count"')}</div>${text(d.ko,d.en,'h3',`id="division-${d.id}"`)}</div><div class="department-list">${d.units.map(id=>{const u=content.departments.find(u=>u.id===id);return `<button type="button" class="department-card" data-dept="${u.id}">${text(u.ko,u.en,'strong')}${text(u.roleKo,u.roleEn,'span','class="department-role"')}<span class="department-more">${text('업무 보기','View work')}<i aria-hidden="true">↗</i></span></button>`}).join('')}</div></section>`).join('')}</div>`;
 }
 function updateLinks(){
  qa('a[data-local]').forEach(a=>{const u=new URL(a.getAttribute('href'),location.href);if(lang==='ko')u.searchParams.set('lang','ko');else u.searchParams.delete('lang');a.href=u.href});
 }
 function render(){
  document.documentElement.lang=lang;
  const logo=q('#site-header .brand img');
  logo.src=`assets/logo-geosr-${lang}-20260921.png`;
  logo.alt=lang==='ko'?'주식회사 지오시스템리서치':'GeoSystem Research Corporation';
  qa('[data-ko]').forEach(el=>el.innerHTML=el.dataset[lang]);
  qa('a[data-href-ko][data-href-en]').forEach(a=>a.href=lang==='ko'?a.dataset.hrefKo:a.dataset.hrefEn);
  q('#language').innerHTML=lang==='en'?'KOR <span>↔</span> <b>ENG</b>':'<b>KOR</b> <span>↔</span> ENG';
  q('#language').setAttribute('aria-label',lang==='en'?'한국어로 전환':'Switch to English');
  qa('[data-page-link]').forEach(a=>{if(a.dataset.pageLink===page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  if(page==='research'||page==='careers')q('.resource-menu').classList.add('current');
  updateLinks();
 }
 window.companySite={get lang(){return lang}};
 q('#language').onclick=()=>{
  lang=lang==='en'?'ko':'en';const u=new URL(location.href);if(lang==='ko')u.searchParams.set('lang','ko');else u.searchParams.delete('lang');history.replaceState(null,'',u);render();document.dispatchEvent(new CustomEvent('portal:language',{detail:lang}));
 };
 const toggle=q('.nav-toggle');
 const closeNav=()=>{q('#site-header').classList.remove('nav-open');toggle.setAttribute('aria-expanded','false');toggle.innerHTML='Menu <span aria-hidden="true">+</span>'};
 toggle.onclick=()=>{const open=q('#site-header').classList.toggle('nav-open');toggle.setAttribute('aria-expanded',String(open));toggle.innerHTML=open?'Close <span aria-hidden="true">−</span>':'Menu <span aria-hidden="true">+</span>'};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const menu=q('.resource-menu');if(menu.open){menu.open=false;menu.querySelector('summary').focus()}else if(toggle.getAttribute('aria-expanded')==='true'){closeNav();toggle.focus()}}});
 document.addEventListener('click',e=>{const menu=q('.resource-menu');if(!menu.contains(e.target))menu.open=false;else if(e.target.closest('a'))menu.open=false;if(!q('#site-header').contains(e.target)||e.target.closest('#primary-nav a'))closeNav()});
 // Research is again available on the main page; Careers remains standalone.
 if(home&&location.hash==='#careers')location.replace('careers.html'+(lang==='ko'?'?lang=ko':''));
 render();
})();
