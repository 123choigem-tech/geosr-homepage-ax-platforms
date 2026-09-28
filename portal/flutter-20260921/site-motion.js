(() => {
 const header=document.querySelector('#site-header'),hero=document.querySelector('#home');
 const refresh=()=>header.classList.toggle('over-hero',!!hero&&hero.getBoundingClientRect().bottom>90);
 refresh();addEventListener('scroll',refresh,{passive:true});addEventListener('resize',refresh);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const items=[...document.querySelectorAll('.main-research .section-head,.research-grid>* ,.main-contact>*,.fw-team>*')];
 if(!reduced.matches&&'IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target)}})},{threshold:.12});
  items.forEach((el,i)=>{el.classList.add('fw-reveal');el.style.setProperty('--reveal-delay',(i%3)*65+'ms');observer.observe(el)});
 }
})();
