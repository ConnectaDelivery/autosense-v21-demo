import {initHero} from './hero-sequence.js?v=24';
import {initI18n,t,installValidation} from './i18n.js';
const page=document.body.dataset.demoPage;
initI18n();
document.querySelector('#year').textContent=new Date().getFullYear();
const menu=document.querySelector('.menu-toggle');
menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));document.querySelector('#navigation').classList.toggle('open',!expanded)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');document.querySelector('#navigation').classList.remove('open')}});
document.querySelectorAll('[data-dialog]').forEach(b=>b.addEventListener('click',()=>document.querySelector('#privacy').showModal()));
document.querySelector('.dialog-close').addEventListener('click',()=>document.querySelector('#privacy').close());
if(page==='home')initHero(document.querySelector('.hero'));
if(page==='contact'){
 const form=document.querySelector('#contact-form'),status=document.querySelector('#form-status');let completed=false;
 installValidation(form);
 form.addEventListener('submit',e=>e.preventDefault());
 document.querySelector('#simulate-inquiry').addEventListener('click',()=>{
  if(!form.querySelector('input[type=checkbox]').reportValidity())return;
  completed=true;status.className='success';status.textContent=t('Demo complete. No information was sent or saved.');
 });
 document.addEventListener('autosense:language',()=>{if(completed)status.textContent=t('Demo complete. No information was sent or saved.')});
}
