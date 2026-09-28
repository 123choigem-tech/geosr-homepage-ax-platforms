/* 50 seconds of media at 2x speed: a 25-second loop, independent of scrolling. */
(() => {
 'use strict';
 const root=document.querySelector('.autoplay-story .earth-pin');
 if(!root)return;
 const world=root.querySelector('.journey-world');
 const poster=world.querySelector('.earth-poster');
 world.replaceChildren(poster);
 const video=document.createElement('video');
 video.className='hero-continuous-video';
 video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;
 video.defaultPlaybackRate=2;video.playbackRate=2;
 video.setAttribute('aria-hidden','true');video.setAttribute('tabindex','-1');
 video.disablePictureInPicture=true;video.preload='auto';
 world.append(video);
 const toggle=document.querySelector('#hero-play');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let wanted=!reduced.matches&&!navigator.connection?.saveData;
 let objectURL='',loading=null,chapter=-1,pendingTime=null,failed=false;
 const tier=innerWidth<700?960:1696;
 const sources=[];
 if(video.canPlayType('video/mp4; codecs="avc1.640028"'))sources.push('mp4');
 if(video.canPlayType('video/webm; codecs="vp9"'))sources.push('webm');
 function paint(){
  const time=Number.isFinite(video.currentTime)?video.currentTime:0;
  const next=Math.min(4,Math.floor(time/10));
  root.dataset.scene=String(next);root.dataset.progress=String(time/50);
  root.style.setProperty('--satellite-opacity',next<2?'1':'0');
  if(next!==chapter){
   chapter=next;
   root.querySelectorAll('.story-panel').forEach((panel,i)=>{
    panel.classList.toggle('is-current',i===chapter);
    panel.setAttribute('aria-hidden',String(i!==chapter));panel.inert=i!==chapter;
   });
  }
  root.querySelectorAll('#story-track button').forEach((button,i)=>{
   button.classList.toggle('active',i===chapter);
   button.setAttribute('aria-pressed',String(i===chapter));
   button.style.setProperty('--chapter-fill',Math.max(0,Math.min(100,(time-i*10)*10))+'%');
  });
  root.querySelector('#scene-counter').textContent=String(chapter+1).padStart(2,'0')+' / 05';
  const ko=document.documentElement.lang==='ko';
  toggle.textContent=wanted&&!video.paused?'Ⅱ':'▶';
  toggle.setAttribute('aria-label',failed?(ko?'영상 다시 재생':'Retry introduction video'):(wanted&&!video.paused?(ko?'영상 일시정지':'Pause introduction video'):(ko?'영상 재생':'Play introduction video')));
  toggle.title=toggle.getAttribute('aria-label');
 }
 async function play(){
  if(!wanted||document.hidden)return;
  video.playbackRate=2;
  try{await video.play()}catch{wanted=false}
  paint();
 }
 function load(){
  if(loading)return loading;
  loading=(async()=>{
   root.dataset.videoState='loading';failed=false;
   // A Blob makes chapter seeking reliable on the existing no-Range preview server.
   for(const ext of sources){
    try{
     const path=`assets/journey-autoplay-20260915/journey-${tier}.${ext}`;
     const response=await fetch(path);if(!response.ok)throw new Error('Video unavailable');
     const blob=await response.blob();
     if(objectURL)URL.revokeObjectURL(objectURL);
     objectURL=URL.createObjectURL(blob);
     await new Promise((resolve,reject)=>{
      const ready=()=>{cleanup();resolve()};const error=()=>{cleanup();reject(new Error('Decode failed'))};
      function cleanup(){video.removeEventListener('loadeddata',ready);video.removeEventListener('error',error)}
      video.addEventListener('loadeddata',ready);video.addEventListener('error',error);
      video.src=objectURL;video.dataset.source=path;video.load();
     });
     root.dataset.videoState='ready';world.classList.add('has-video');
     if(pendingTime!==null){video.currentTime=pendingTime;pendingTime=null}
     await play();return;
    }catch{/* Keep the poster while trying the alternate supported codec. */}
   }
   failed=true;wanted=false;root.dataset.videoState='fallback';paint();
  })().finally(()=>{loading=null});return loading;
 }
 toggle.addEventListener('click',()=>{
  wanted=video.paused||failed;
  if(!wanted)video.pause();else if(video.readyState>=2&&!failed)play();else load();paint();
 });
 root.querySelector('#story-track').addEventListener('click',e=>{
  const button=e.target.closest('button[data-step]');if(!button)return;
  const time=Number(button.dataset.step)*10;
  if(video.readyState>=2){video.currentTime=time;paint()}else{pendingTime=time;wanted=true;load()}
 });
 ['timeupdate','seeked','play','pause','loadedmetadata'].forEach(name=>video.addEventListener(name,paint));
 // Frame-driven chapter/progress updates when supported, timeupdate as fallback.
 let framePending=false;
 function frame(){
  if(framePending||video.paused||!video.requestVideoFrameCallback)return;
  framePending=true;video.requestVideoFrameCallback(()=>{framePending=false;paint();frame()});
 }
 video.addEventListener('play',frame);
 document.addEventListener('portal:copy-ready',()=>{chapter=-1;paint()});
 document.addEventListener('portal:language',paint);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else if(wanted)play()});
 reduced.addEventListener('change',()=>{if(reduced.matches){wanted=false;video.pause();paint()}});
 addEventListener('pagehide',e=>{if(!e.persisted&&objectURL)URL.revokeObjectURL(objectURL)});
 paint();if(wanted)load();
})();
