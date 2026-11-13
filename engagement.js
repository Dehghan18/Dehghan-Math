/* آکادمی ریاضی دهقان — آمار بازدید تقریبی و ستاره‌های واقعی گیت‌هاب */
(()=>{
 const repo='Dehghan18/Dehghan-Math';
 const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
 const pages={'index.html':'صفحه اصلی','symmetry.html':'مرکز تقارن','quadrilaterals.html':'چهارضلعی‌ها'};
 const page=pages[file]||'این صفحه';
 const host=document.createElement('section');host.className='engagement';host.setAttribute('aria-label','بازدید و حمایت از آکادمی');
 const inner=document.createElement('div');inner.className='engagement-inner';
 inner.innerHTML=`<h2 class="engagement-title">🌟 با حمایت تو، ریاضی جذاب‌تر می‌شه!</h2><p class="engagement-desc">اگر از آموزش‌های آکادمی ریاضی دهقان خوشت اومده، با ستاره دادن به پروژه در GitHub از تولید درس‌های جدید حمایت کن 💜</p><div class="engagement-stats"><div class="engagement-stat"><span aria-hidden="true">👀</span><div><small>بازدیدهای ثبت‌شده ${page}</small><span id="academy-visits">در حال دریافت…</span></div></div><div class="engagement-stat"><span aria-hidden="true">⭐</span><div><small>ستاره‌های واقعی GitHub</small><strong id="academy-stars">…</strong></div></div></div><a class="engagement-btn" href="https://github.com/${repo}" target="_blank" rel="noopener noreferrer" aria-label="رفتن به مخزن آکادمی برای ثبت ستاره در گیت‌هاب">⭐ حمایت از آکادمی در GitHub</a><small class="engagement-note">برای ثبت ستاره GitHub باید وارد حساب GitHub خودت بشی. بازدیدهای نمایش‌داده‌شده تقریبی‌اند و ممکنه شامل بازکردن مجدد صفحه هم باشند. حمایت کاملاً اختیاریه.</small>`;
 host.append(inner);
 const mount=document.querySelector('footer');if(mount)mount.before(host);else document.body.append(host);
 const visits=inner.querySelector('#academy-visits');
 const badge=document.createElement('img');badge.alt='نشان شمارنده بازدیدهای تقریبی';badge.loading='lazy';badge.referrerPolicy='no-referrer';
 const path=encodeURIComponent('dehghan18.github.io/Dehghan-Math/'+file);
 badge.src='https://api.visitorbadge.io/api/visitors?path='+path+'&label=بازدید&labelColor=%23eee7ff&countColor=%237455e7';
 badge.onerror=()=>{visits.textContent='فعلاً در دسترس نیست';};
 visits.replaceChildren(badge);
 fetch('https://api.github.com/repos/'+repo,{headers:{Accept:'application/vnd.github+json'}}).then(r=>{if(!r.ok)throw Error('unavailable');return r.json()}).then(d=>{inner.querySelector('#academy-stars').textContent=Number(d.stargazers_count).toLocaleString('fa-IR')}).catch(()=>{inner.querySelector('#academy-stars').textContent='مشاهده در GitHub'});
})();
