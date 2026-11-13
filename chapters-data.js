/* آکادمی ریاضی دهقان: فهرست درس‌ها از lessons.json */
(async()=>{
 const match=location.pathname.match(/chapter-(\d\d)\.html$/);
 const id=match?Number(match[1]):null;
 const host=document.getElementById('chapter-lessons');
 try{
  const res=await fetch('./lessons.json',{cache:'no-cache'});
  if(!res.ok)throw Error('دریافت فهرست درس‌ها ناموفق بود');
  const data=await res.json();
  if(!Array.isArray(data.chapters))throw Error('ساختار فهرست درس‌ها نادرست است');
  const chapter=data.chapters.find(c=>c.id===id);
  if(host){
   host.replaceChildren();
   const lessons=chapter?.lessons||[];
   if(!lessons.length){host.classList.add('empty');host.classList.remove('cards');const p=document.createElement('p');p.textContent='آموزش‌های تعاملی این فصل به‌زودی اضافه می‌شوند. 🌷';host.append(p)}
   for(const lesson of lessons){
    const card=document.createElement('article');card.className='card lesson-card';
    if(lesson.image){const img=document.createElement('img');img.className='lesson-cover';img.src=lesson.image;img.alt='تصویر درس '+lesson.title;img.loading='lazy';card.append(img)}
    const h=document.createElement('h2');h.textContent=lesson.title;card.append(h);
    const p=document.createElement('p');p.textContent=lesson.description||'';card.append(p);
    const a=document.createElement('a');a.className='go';a.textContent='ورود به آموزش ←';
    if(typeof lesson.url==='string' && /^lessons\/chapter-\d\d\/[\w-]+\.html$/.test(lesson.url)){a.href=lesson.url}else{a.removeAttribute('href');a.textContent='آدرس درس نامعتبر است'}
    card.append(a);host.append(card)
   }
   const info=document.querySelector('.hero p:last-child');if(info)info.textContent=lessons.length?`${lessons.length.toLocaleString('fa-IR')} آموزش تعاملی آماده یادگیری است.`:'آموزش‌های تعاملی این فصل به‌زودی منتشر می‌شوند.';
  }
  document.querySelectorAll('.chapter-card').forEach(card=>{
   const m=card.getAttribute('href')?.match(/chapter-(\d\d)\.html/);if(!m)return;
   const ch=data.chapters.find(c=>c.id===Number(m[1]));if(!ch)return;
   const count=ch.lessons?.length||0;
   const status=card.querySelector('.chapter-status');if(status)status.textContent=count?`${count.toLocaleString('fa-IR')} آموزش فعال`:'به‌زودی';
   card.classList.toggle('active',count>0);card.classList.toggle('upcoming',count===0);
  });
 }catch(e){if(host)host.textContent='بارگذاری درس‌ها ممکن نشد. لطفاً صفحه را دوباره باز کنید.';console.error(e)}
})();