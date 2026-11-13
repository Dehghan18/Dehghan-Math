/* آکادمی ریاضی دهقان — امتیاز مستقل هر درس با Firebase */
(()=>{
 const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
 const lessons={'symmetry.html':['symmetry','مرکز تقارن'],'quadrilaterals.html':['quadrilaterals','چهارضلعی‌ها']};
 if(!lessons[page])return;
 const [lesson,title]=lessons[page];
 const section=document.createElement('section');section.className='lesson-rating';section.setAttribute('aria-label','امتیازدهی به درس '+title);
 section.innerHTML=`<div class="rating-shell"><div class="rating-head"><span class="rating-icon">🏅</span><div><h2>به درس «${title}» امتیاز بده!</h2><p>نظرت کمک می‌کنه درس‌های بعدی بهتر و جذاب‌تر بشن 💜</p></div></div><div class="rating-overview"><strong id="rating-average">—</strong><span class="rating-gold">★★★★★</span><small id="rating-count">در حال آماده‌سازی…</small></div><p class="rating-instruction">ابتدا امتیاز را انتخاب کن؛ سپس دکمه ثبت نهایی را بزن.</p><div class="rating-buttons" role="group" aria-label="انتخاب امتیاز از یک تا پنج"><button type="button" data-score="1" aria-label="۱ ستاره">☆</button><button type="button" data-score="2" aria-label="۲ ستاره">☆</button><button type="button" data-score="3" aria-label="۳ ستاره">☆</button><button type="button" data-score="4" aria-label="۴ ستاره">☆</button><button type="button" data-score="5" aria-label="۵ ستاره">☆</button></div><div class="rating-scale"><span>۱ ستاره · ضعیف</span><span>۵ ستاره · عالی</span></div><button type="button" class="rating-submit" disabled>ثبت نهایی امتیاز</button><p id="rating-status" class="rating-status" role="status" aria-live="polite">در حال اتصال به سیستم امتیازدهی…</p><small class="rating-footnote">امتیازدهی اختیاری است و به نمره درسی ارتباطی ندارد. برای هر حساب ناشناس یک رأی ثبت می‌شود.</small></div>`;
 const anchor=document.querySelector('.engagement');if(anchor)anchor.before(section);else (document.querySelector('footer')||document.body).before(section);
 const status=section.querySelector('#rating-status'),avg=section.querySelector('#rating-average'),count=section.querySelector('#rating-count'),buttons=[...section.querySelectorAll('[data-score]')],submit=section.querySelector('.rating-submit');
 const setStatus=(message)=>{status.textContent=message};
 const paint=(n)=>buttons.forEach(b=>{const active=Number(b.dataset.score)<=n;b.textContent=active?'★':'☆';b.classList.toggle('selected',active)});
 const config=window.DEHGHAN_FIREBASE_CONFIG;
 if(!config||!config.apiKey||!config.projectId||config.apiKey==='YOUR_API_KEY'){
   setStatus('امتیازدهی هنوز فعال نشده؛ ابتدا Firebase را طبق راهنمای همراه فایل‌ها تنظیم کنید.');count.textContent='در انتظار فعال‌سازی';buttons.forEach(b=>b.disabled=true);submit.disabled=true;return;
 }
 (async()=>{
   try{
     const appMod=await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js');
     const authMod=await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js');
     const dbMod=await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js');
     const app=appMod.initializeApp(config,'dehghan-ratings');const auth=authMod.getAuth(app),db=dbMod.getFirestore(app);
     const col=dbMod.collection(db,'lessonRatings',lesson,'votes');
     async function refresh(){const snapshot=await dbMod.getDocs(col);let total=0;let n=0;snapshot.forEach(d=>{const score=d.data().score;if(Number.isInteger(score)&&score>=1&&score<=5){total+=score;n++}});avg.textContent=n?(total/n).toLocaleString('fa-IR',{maximumFractionDigits:1}):'—';count.textContent=n?`${n.toLocaleString('fa-IR')} رأی ثبت‌شده`:'هنوز رأیی ثبت نشده';}
     await refresh();
     const user=auth.currentUser|| (await authMod.signInAnonymously(auth)).user;
     const myVote=dbMod.doc(col,user.uid);const existing=await dbMod.getDoc(myVote);
     if(existing.exists()){paint(existing.data().score);setStatus('ممنون از رأی تو! امتیازت قبلاً ثبت شده 🌟');buttons.forEach(b=>b.disabled=true);submit.disabled=true;return;}
     setStatus('از ۱ تا ۵ ستاره انتخاب کن.');
     let selected=0;
     buttons.forEach(b=>b.addEventListener('click',()=>{
       selected=Number(b.dataset.score);paint(selected);submit.disabled=false;
       setStatus(`امتیاز انتخابی: ${selected.toLocaleString('fa-IR')} از ۵ — برای ذخیره، ثبت نهایی را بزن.`);
     }));
     submit.addEventListener('click',async()=>{
       if(!selected)return;
       const score=selected;buttons.forEach(x=>x.disabled=true);submit.disabled=true;setStatus('در حال ثبت رأی…');
       try{await dbMod.setDoc(myVote,{score,createdAt:dbMod.serverTimestamp()});setStatus('رأی تو با موفقیت ثبت شد. سپاس! 🎉');submit.textContent='امتیاز ثبت شد';await refresh();}
       catch(err){buttons.forEach(x=>x.disabled=false);submit.disabled=false;setStatus('ثبت رأی انجام نشد. دوباره تلاش کن.');console.error('Rating save failed',err)}
     });
   }catch(err){setStatus('سامانه امتیازدهی فعلاً در دسترس نیست. لطفاً بعداً تلاش کن.');count.textContent='اتصال برقرار نشد';buttons.forEach(b=>b.disabled=true);submit.disabled=true;console.error('Ratings unavailable',err)}
 })();
})();
