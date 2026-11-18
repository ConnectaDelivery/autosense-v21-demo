import {es} from './translations.js';
export const LANGUAGE_KEY='autosense-language';
export const normalize=value=>value.replace(/\s+/g,' ').trim();
let current='en';
export const language=()=>current;
export function t(value,params={},locale=current){const key=normalize(value);let text=locale==='es'?(es[key]??key):key;for(const [k,v] of Object.entries(params))text=text.replaceAll(`{${k}}`,String(v));return text}
const originals=new WeakMap();
const attributes=['aria-label','placeholder','title','alt'];
export function translateDOM(root=document){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
 while((node=walker.nextNode())){
  if(node.parentElement?.closest('script,style,[data-language],noscript'))continue;
  if(!normalize(node.nodeValue))continue;
  if(!originals.has(node))originals.set(node,node.nodeValue);
  const original=originals.get(node);const translated=t(original);
  node.nodeValue=original.match(/^\s*/)[0]+translated+original.match(/\s*$/)[0];
 }
 root.querySelectorAll('*').forEach(el=>{
  for(const attr of attributes){if(!el.hasAttribute(attr))continue;let saved=originals.get(el);if(!saved){saved={};originals.set(el,saved)}if(!(attr in saved))saved[attr]=el.getAttribute(attr);el.setAttribute(attr,t(saved[attr]));}
 });
 document.documentElement.lang=current;
 document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===current)));
 const page=document.body.dataset.page||document.body.dataset.demoPage||'home';
 const meta={home:['Autosense International — A clearer road ahead','Explore Autosense ignition interlock equipment and service information. Request a conversation about your next step in California.'],services:['Products & Services — Autosense International','Explore Alco-Sense equipment, service inquiries and official California ignition interlock resources.'],contact:['Contact & Appointments — Autosense International','Send a general service or appointment inquiry to Autosense International. No sensitive documents required.']}[page];
 document.title=t(meta[0]);for(const [selector,value]of [['meta[name="description"]',meta[1]],['meta[property="og:title"]',meta[0]],['meta[property="og:description"]',meta[1]]])document.querySelector(selector)?.setAttribute('content',t(value));
 document.querySelectorAll('meta[property="og:locale"]').forEach(el=>el.remove());const tag=document.createElement('meta');tag.setAttribute('property','og:locale');tag.content=current==='es'?'es_US':'en_US';document.head.append(tag);
}
export function setLanguage(locale){current=locale==='es'?'es':'en';try{localStorage.setItem(LANGUAGE_KEY,current)}catch{}translateDOM();document.dispatchEvent(new CustomEvent('autosense:language'));}
export function initI18n(){try{current=localStorage.getItem(LANGUAGE_KEY)==='es'?'es':'en'}catch{}translateDOM();document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.language)));}
export function localizeError(message){return message.split(/(?<=\.)\s+/).map(part=>t(part)).join(' ')}
export function installValidation(form){
 function validate(input){input.setCustomValidity('');let msg='';const v=input.validity;
 if(v.valueMissing)msg=input.type==='checkbox'?'Please acknowledge the privacy and prototype notice.':'Complete this field.';
 else if(input.type==='email'&&v.typeMismatch)msg='Enter a valid email address.';
 else if(input.name==='name'&&input.value&&(input.value.trim().length<2||input.value.length>80))msg='Enter a name between 2 and 80 characters.';
 else if(input.name==='message'&&input.value&&(input.value.trim().length<10||input.value.length>1500))msg='Enter a general message between 10 and 1500 characters.';
 else if(input.name==='phone'&&input.value&&!/^[+()\d\s.\-x]{5,30}$/i.test(input.value))msg='Check the phone number or leave it blank.';
 if(msg)input.setCustomValidity(t(msg));
 }
 const fields=[...form.querySelectorAll('input,textarea,select')];fields.forEach(f=>{f.addEventListener('input',()=>validate(f));f.addEventListener('invalid',()=>validate(f))});document.addEventListener('autosense:language',()=>fields.forEach(validate));
}
