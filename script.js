const socket = io();
const loginBox=document.getElementById('loginBox');const chatBox=document.getElementById('chatBox');
const loginBtn=document.getElementById('loginBtn');const usernameEl=document.getElementById('username');
const passwordEl=document.getElementById('password');const loginMsg=document.getElementById('loginMsg');
const messagesEl=document.getElementById('messages');const messageInput=document.getElementById('messageInput');
const sendBtn=document.getElementById('sendBtn');const logoutBtn=document.getElementById('logout');
function addSystem(t){const d=document.createElement('div');d.className='system';d.textContent=t;messagesEl.appendChild(d);messagesEl.scrollTop=messagesEl.scrollHeight;}
function addMessage(u,t,me){const d=document.createElement('div');d.className='message '+(me?'me':'other');d.innerHTML=`<strong>${u}</strong><div>${t}</div>`;messagesEl.appendChild(d);messagesEl.scrollTop=messagesEl.scrollHeight;}
loginBtn.addEventListener('click',()=>{loginMsg.textContent='';socket.emit('login',{username:usernameEl.value,password:passwordEl.value});});
socket.on('login-result',r=>{if(r.success){loginBox.classList.add('hidden');chatBox.classList.remove('hidden');addSystem(`${r.username} olarak giriş yapıldı.`);}else loginMsg.textContent=r.message||'Hata';});
socket.on('system-message',t=>addSystem(t));socket.on('chat-message',p=>{addMessage(p.username,p.text,p.username===usernameEl.value);});
sendBtn.addEventListener('click',()=>{const t=messageInput.value.trim();if(!t)return;socket.emit('send-message',t);messageInput.value='';});
messageInput.addEventListener('keydown',e=>{if(e.key==='Enter')sendBtn.click();});
logoutBtn.addEventListener('click',()=>location.reload());
