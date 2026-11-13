// پس از ساخت فرم در Formspree، شناسه فرم را در این آدرس جایگزین کنید.
// آدرس ایمیل مدرس را در فایل‌های عمومی سایت قرار ندهید.
const FORM_ENDPOINT = 'https://formspree.io/f/maeoqerb';
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('status');
const button = document.getElementById('send');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  statusEl.textContent = '';
  statusEl.className = 'status';
  if (!form.reportValidity()) return;
  if (form.elements._gotcha.value) return;
  if (FORM_ENDPOINT.includes('maeoqerb')) {
    statusEl.textContent = 'فرم هنوز به سرویس ارسال پیام متصل نشده است. مدیر سایت باید شناسه Formspree را تنظیم کند.';
    statusEl.classList.add('error');
    return;
  }
  button.disabled = true;
  button.textContent = 'در حال ارسال...';
  try {
    const data = new FormData(form);
    const response = await fetch(FORM_ENDPOINT, {method:'POST',body:data,headers:{'Accept':'application/json'}});
    if (!response.ok) throw new Error('ارسال ناموفق');
    form.reset();
    statusEl.textContent = 'پیامت با موفقیت ارسال شد. سپاس از همراهی تو! 🌷';
    statusEl.classList.add('success');
  } catch (err) {
    statusEl.textContent = 'ارسال پیام انجام نشد. لطفاً اتصال اینترنت را بررسی کن و دوباره تلاش کن.';
    statusEl.classList.add('error');
  } finally {
    button.disabled = false;
    button.textContent = '📨 ارسال پیام به مدرس';
  }
});
