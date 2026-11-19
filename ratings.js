/* آکادمی ریاضی دهقان — امتیازدهی مستقل Cloudflare Workers + D1 */
(()=>{
 'use strict';
 const page=(location.pathname.split('/').pop()||'').toLowerCase();
 const lessons={'symmetry.html':['symmetry','مرکز تقارن'],'quadrilaterals.html':['quadrilaterals','چهارضلعی‌ها']};
 if(!lessons[page])return;
 const [lesson,title]=lessons[page];
 const API='https://dehghan-math-ratings-api.dehghansakineh.workers.dev/api/ratings';
 const section=document.createElement('section');section.className='lesson-rating';section.setAttribute('aria-label','امتیازدهی به درس '+title);
 section.innerHTML=`<div class="rating-shell"><div class="rating-head"><span class="rating-icon">🏅</span><div><h2>به درس «${title}» امتیاز بده!</h2><p>نظرت کمک می‌کنه درس‌های بعدی بهتر و جذاب‌تر بشن 💜</p></div></div><div class="rating-overview"><strong id="rating-average">—</strong><span class="rating-gold">★★★★★</span><small id="rating-count">در حال دریافت امتیازها…</small></div><p class="rating-instruction">ابتدا امتیاز را انتخاب کن؛ سپس دکمه ثبت نهایی را بزن.</p><div class="rating-buttons" role="group" aria-label="انتخاب امتیاز از یک تا پنج"><button type="button" data-score="1" aria-label="۱ ستاره">☆</button><button type="button" data-score="2" aria-label="۲ ستاره">☆</button><button type="button" data-score="3" aria-label="۳ ستاره">☆</button><button type="button" data-score="4" aria-label="۴ ستاره">☆</button><button type="button" data-score="5" aria-label="۵ ستاره">☆</button></div><div class="rating-scale"><span>۱ ستاره · ضعیف</span><span>۵ ستاره · عالی</span></div><button type="button" class="rating-submit" disabled>ثبت نهایی امتیاز</button><p id="rating-status" class="rating-status" role="status" aria-live="polite">در حال اتصال به سیستم امتیازدهی…</p><small class="rating-footnote">امتیازدهی اختیاری است و به نمره درسی ارتباطی ندارد. هر مرورگر برای هر درس یک رأی می‌تواند ثبت کند.</small></div>`;
 const anchor=document.querySelector('.engagement');if(anchor)anchor.before(section);else (document.querySelector('footer')||document.body).before(section);
 const status=section.querySelector('#rating-status'),avg=section.querySelector('#rating-average'),count=section.querySelector('#rating-count'),buttons=[...section.querySelectorAll('[data-score]')],submit=section.querySelector('.rating-submit');
 const fa=n=>Number(n).toLocaleString('fa-IR',{maximumFractionDigits:1});
 const votedKey='dehghan-rated-'+lesson;
 let selected=0,busy=false,alreadyVoted=false;
 const setStatus=s=>{status.textContent=s};
 const paint=()=>{buttons.forEach(b=>{const on=Number(b.dataset.score)<=selected;b.textContent=on?'★':'☆';b.classList.toggle('selected',on);b.disabled=busy||alreadyVoted;b.setAttribute('aria-pressed',String(Number(b.dataset.score)===selected))});submit.disabled=busy||alreadyVoted||!selected};
 function voter(){const key='dehghan-rating-voter-id';let id=localStorage.getItem(key);if(!id||!/^[a-f0-9]{32}$/.test(id)){const bytes=new Uint8Array(16);crypto.getRandomValues(bytes);id=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');localStorage.setItem(key,id)}return id;}
 function display(data){if(typeof data.count!=='number'||typeof data.average!=='number')throw Error('Invalid response');avg.textContent=data.count?fa(data.average):'—';count.textContent=data.count?`${fa(data.count)} رأی ثبت‌شده`:'هنوز رأیی ثبت نشده';}
 async function refresh(){try{const res=await fetch(API+'?lesson='+encodeURIComponent(lesson),{cache:'no-store'});if(!res.ok)throw Error('Failed');display(await res.json());return true}catch(e){avg.textContent='—';count.textContent='اتصال برقرار نشد';setStatus('دریافت امتیازها ممکن نشد. اتصال اینترنت را بررسی و صفحه را تازه‌سازی کن.');return false}}
 buttons.forEach(b=>b.addEventListener('click',()=>{if(busy||alreadyVoted)return;selected=Number(b.dataset.score);paint();setStatus(`امتیاز انتخابی: ${fa(selected)} از ۵ — برای ذخیره، ثبت نهایی را بزن.`)}));
 try{alreadyVoted=localStorage.getItem(votedKey)==='1';if(alreadyVoted)setStatus('ممنون! رأی شما قبلاً برای این درس ثبت شده است. 🌟');else setStatus('از ۱ تا ۵ ستاره انتخاب کن.')}catch(e){setStatus('مرورگر اجازه ذخیره شناسه را نمی‌دهد؛ ثبت رأی ممکن است با مشکل روبه‌رو شود.')}
 submit.addEventListener('click',async()=>{
  if(!selected||busy||alreadyVoted)return;
  busy=true;paint();setStatus('در حال ثبت رأی…');
  try{
   const res=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lesson,voterId:voter(),score:selected})});
   const data=await res.json();
   if(res.status===409&&data.code==='ALREADY_VOTED'){
    alreadyVoted=true;try{localStorage.setItem(votedKey,'1')}catch(e){}
    setStatus('با این مرورگر قبلاً به این درس امتیاز داده شده است.');await refresh();return;
   }
   if(!res.ok||!data.ok)throw Error('Vote failed');
   alreadyVoted=true;try{localStorage.setItem(votedKey,'1')}catch(e){}
   display(data);setStatus('🎉 رأی تو با موفقیت ثبت شد. سپاسگزاریم!');submit.textContent='امتیاز ثبت شد';
  }catch(e){setStatus('ثبت رأی انجام نشد؛ لطفاً دوباره تلاش کن.')}finally{busy=false;paint()}
 });
 paint();refresh();
})();
