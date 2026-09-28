(() => {
 'use strict';
 let lang=window.companySite?.lang||'en', queued=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const q=s=>document.querySelector(s), qa=s=>Array.from(document.querySelectorAll(s));
 const pair=(ko,en)=>({ko,en}), tr=x=>x[lang], num=n=>String(n).padStart(2,'0');
 const scenes=[
 {tag:'01 / SATELLITE OBSERVATION',title:pair('위성영상 분석과<br><em>원격탐사</em>','Know the Earth<br>Shape the <em>future</em>'),body:pair('위성영상 처리·AI 기반 객체 탐지<br>지표와 해양환경 변화 모니터링','<span class="lead-sentence">Satellite image processing and change monitoring</span><span class="lead-sentence">Field surveys and AI-based object detection</span>'),detail:'SATELLITE IMAGERY · REMOTE SENSING · CHANGE DETECTION'},
 {tag:'02 / LAND & COAST',title:pair('연안 조사와<br><em>공간정보 구축</em>','Coastal surveys &amp;<br><em>spatial mapping</em>'),body:pair('항공영상·측량자료를 활용한 연안 조사<br>해안선 변화 분석과 공간자료 구축','Aerial imagery and coastal surveys<br>Shoreline monitoring and spatial data processing'),detail:'SURVEY · SPATIAL · COASTAL ENVIRONMENT'},
 {tag:'03 / OCEAN OBSERVATION',title:pair('해양·수환경<br><em>현장 관측</em>','Ocean &amp; river<br><em>observations</em>'),body:pair('조석·해류·파랑 관측과 수질·퇴적물 조사<br>현장자료 수집·처리와 품질관리','Tide, current, wave and water-quality surveys<br>Field data collection and quality control'),detail:'FIELD SURVEYS · OCEAN OBSERVATION · ENVIRONMENT'},
 {tag:'04 / BELOW THE SURFACE',title:pair('해저지형 측량과<br><em>지층 탐사</em>','Seabed mapping &amp;<br><em>sub-bottom surveys</em>'),body:pair('멀티빔·음향센서를 활용한 해저 조사<br>수심·지층 분석과 정밀 공간자료 구축','Multibeam and acoustic seabed surveys<br>Bathymetric and sub-bottom data analysis'),detail:'PRECISION SURVEY · BATHYMETRY · SPATIAL ANALYSIS'},
 {tag:'05 / MODELS & INTELLIGENCE',title:pair('수치모델·AI 기반<br><em>환경 예측</em>','Numerical models &amp;<br><em>AI forecasting</em>'),body:pair('해수유동·파랑·침수 예측과 모델 검증<br>예측자료 생산과 플랫폼 구축·운영','Ocean, wave and flood forecasting<br>Model validation and platform development'),detail:'NUMERICAL MODELLING · AI PREDICTION · AX PLATFORM'}
 ];
 const films=[
 ['flood3d','Flood 3D',pair('3차원 침수범람 예측','3D Flood Forecasts'),pair('AI 태풍 침수예측과 3차원 침수 시뮬레이션','AI-based typhoon flood prediction and 3D flood simulation'),pair(['침수예측','3차원 시뮬레이션','태풍 영향'],['Flood prediction','3D simulation','Typhoon impacts'])],
 ['satellite','Satellite AI',pair('위성영상 AI 분석','Satellite Image AI Analysis'),pair('위성영상 기반 해양 시설물 탐지와 변화 모니터링','Satellite-based marine facility detection and change monitoring'),pair(['위성영상','AI 시설물 탐지','변화 모니터링'],['Satellite imagery','AI facility detection','Change monitoring'])],
 ['surge','Storm Surge',pair('태풍·폭풍해일 예측','Storm Surge Forecasts'),pair('AI 기반 폭풍해일 예측과 태풍 영향 분석','AI-based storm surge forecasts and typhoon impact analysis'),pair(['AI 예측','태풍 영향','위험정보'],['AI prediction','Typhoon impacts','Risk information'])],
 ['sealevel','Sea Level',pair('극치해면고 예측','Extreme Sea Level Forecasts'),pair('수치모델 기반 극치해면고·폭풍해일고 예측','Numerical forecasts of extreme sea levels and storm surge heights'),pair(['수치모델','ADCIRC','자동예측'],['Numerical modelling','ADCIRC','Automated forecasts'])],
 ['rip','Rip Current',pair('이안류 안전 모니터링','Rip Current Safety Monitoring'),pair('해수욕장 이안류 위험도와 CCTV AI 모니터링','Beach rip-current risk assessment and CCTV-based AI monitoring'),pair(['이안류 위험도','CCTV · AI','위험단계'],['Rip-current risk','CCTV & AI','Risk levels'])],
 ['buoy','Ocean Buoy',pair('해양부이 모니터링','Ocean Buoy Observations'),pair('실시간 해양부이 관측자료·수신 상태·데이터 품질 확인','Real-time buoy observations, reception status and data quality'),pair(['실시간 관측','수신 상태','데이터 품질'],['Live observations','Reception status','Data quality'])],
 ['env','Environment',pair('해양환경 변화 모니터링','Ocean Environment Changes'),pair('위성관측 기반 해양환경 변화 모니터링과 자료 분석','Satellite-based monitoring and analysis of ocean environmental changes'),pair(['위성관측','해양환경','데이터 분석'],['Satellite observation','Ocean environment','Data analysis'])],
 ['news','News AI',pair('자연현상 뉴스 분석','Natural Phenomena News'),pair('자연현상 뉴스 수집과 관련 데이터 연계·AI 분석','Natural-phenomena news collection, related data and AI analysis'),pair(['뉴스 수집','자연현상','AI 분석'],['News collection','Natural phenomena','AI analysis'])],
 [null,'Flood XAI',pair('통합 침수 예측·분석','Integrated Flood XAI'),pair('복합요인 기반 침수위험 예측·분석 플랫폼 개발 중','Multi-factor flood-risk prediction and analysis · In development'),pair(['개발 중','복합침수','XAI · 미래기후'],['In development','Compound flooding','XAI & future climate'])]
 ];
 q('#story-copy').innerHTML=scenes.map((s,i)=>'<article class="story-panel" data-scene="'+i+'"><p class="eyebrow">'+s.tag+'</p><'+(i===0?'h1':'h2')+'></'+(i===0?'h1':'h2')+'><p class="lead"></p><p class="detail">'+s.detail+'</p>'+(i===scenes.length-1?'<a class="story-link" href="organization.html" data-local><b data-ko="조직과 주요 업무 보기" data-en="Explore our organization"></b><span aria-hidden="true">↘</span></a>':'')+'</article>').join('');
 const chapterNames=[['위성 관측','Satellite observation','Imagery · Remote sensing','위성','Satellite'],['연안 관측','Land & coast','Survey · Spatial','연안','Coast'],['해상 조사','Ocean observation','Field · Environment','해상','Ocean'],['해저 탐사','Below the surface','Survey · Bathymetry','해저','Subsea'],['모델·예측','Models & intelligence','Numerical models · AI','예측','Models']];
 q('#story-track').innerHTML=chapterNames.map((c,i)=>'<button aria-label="Technology chapter '+(i+1)+'" aria-pressed="false" data-step="'+i+'"><span class="chapter-num">'+num(i+1)+'</span><span class="chapter-text"><strong class="chapter-long" data-ko="'+c[0]+'" data-en="'+c[1]+'"></strong><strong class="chapter-short" data-ko="'+c[3]+'" data-en="'+c[4]+'"></strong><small>'+c[2]+'</small></span></button>').join('');
 window.portalFilms=films;
 function render(){
 document.documentElement.lang=lang;
 qa('[data-ko]').forEach(el=>el.innerHTML=el.dataset[lang]);
 qa('.story-panel').forEach((el,i)=>{el.querySelector('h1,h2').innerHTML=tr(scenes[i].title);el.querySelector('.lead').innerHTML=tr(scenes[i].body).replace(/<br\s*\/?>/g,'<br> ')});
 qa('#story-track button').forEach((el,i)=>el.setAttribute('aria-label',num(i+1)+' '+chapterNames[i][lang==='ko'?0:1]));
 q('#language').setAttribute('aria-label',lang==='en'?'한국어로 전환':'Switch to English');
 q('#language').innerHTML=lang==='en'?'KOR <span>↔</span> <b>ENG</b>':'<b>KOR</b> <span>↔</span> ENG';
 qa('a[data-local][href^="organization.html"]').forEach(a=>a.href='organization.html'+(lang==='ko'?'?lang=ko':''));
 document.dispatchEvent(new Event('portal:copy-ready'));schedule();
 }
 function update(){
 queued=false;
 let active='home';['home','organization','platforms','research','contact'].forEach(id=>{if(q('#'+id)?.getBoundingClientRect().top<innerHeight*.4)active=id});
 if(scrollY+innerHeight>=document.documentElement.scrollHeight-2)active='contact';
 qa('header nav a[data-section]').forEach(a=>{if(a.dataset.section===active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
 q('.resource-menu').classList.toggle('current',active==='research');
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(update)}}
 document.addEventListener('portal:language',e=>{lang=e.detail;render()});
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
 q('.earth-poster').addEventListener('load',schedule);
 render();
})();
