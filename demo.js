import {initHero} from './hero-sequence.js';
const page = document.body.dataset.demoPage;
document.querySelector('#year').textContent=new Date().getFullYear();
const menu=document.querySelector('.menu-toggle'); menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));document.querySelector('#navigation').classList.toggle('open',!expanded)});
document.querySelectorAll('[data-dialog]').forEach(b=>b.addEventListener('click',()=>document.querySelector('#privacy').showModal()));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');document.querySelector('#navigation').classList.remove('open')}});
document.querySelector('.dialog-close').addEventListener('click',()=>document.querySelector('#privacy').close());
if(page==='home')initHero(document.querySelector('.hero'));

if (page === 'contact') {
  const form = document.querySelector('#contact-form');
  form.addEventListener('submit', event => event.preventDefault());
  document.querySelector('#simulate-inquiry').addEventListener('click', () => {
    const acknowledgment = form.querySelector('input[type="checkbox"]');
    if (!acknowledgment.reportValidity()) return;
    const status = document.querySelector('#form-status');
    status.className = 'success';
    status.textContent = 'Demo complete. No information was sent or saved.';
  });
}
