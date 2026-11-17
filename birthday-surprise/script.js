// Personalise this one line with her name if you'd like.
const birthdayGirl = 'my sweetest girl.';
document.getElementById('birthdayName').textContent = birthdayGirl;
const countdownTarget = () => {
  const now = new Date();
  let year = now.getFullYear();
  let target = new Date(year, 11, 2, 0, 0, 0); // December is month 11.
  if (now >= target) target = new Date(year + 1, 11, 2, 0, 0, 0);
  return target;
};
const target = countdownTarget();
document.getElementById('birthdayYear').textContent = target.getFullYear();
function updateCountdown(){
  const diff = Math.max(0, target.getTime() - Date.now());
  const units = {days:86400000,hours:3600000,minutes:60000,seconds:1000};
  let rest = diff;
  for (const [id,size] of Object.entries(units)) {
    const value = Math.floor(rest / size);
    rest %= size;
    document.getElementById(id).textContent = String(value).padStart(2,'0');
  }
}
updateCountdown(); setInterval(updateCountdown,1000);

const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('mainNav');
menuToggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.textContent=open?'×':'☰';});
document.querySelectorAll('.nav-link').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.textContent='☰';}));

const candles = [...document.querySelectorAll('.candle')];
const blowBtn = document.getElementById('blowBtn');
const micBtn = document.getElementById('micBtn');
const cutBtn = document.getElementById('cutBtn');
const cakeStatus = document.getElementById('cakeStatus');
const wishReveal = document.getElementById('wishReveal');
const cakeGraphic = document.getElementById('cakeGraphic');
let microphoneStream = null;
function celebrate(){
  candles.forEach(c=>c.classList.add('out'));
  blowBtn.disabled = true; blowBtn.style.opacity = '.55';
  cutBtn.disabled = false;
  cakeStatus.textContent = 'Wish made! All your candles are glowing in our hearts now. ♡';
  wishReveal.hidden = false;
  burstConfetti();
  if(microphoneStream){microphoneStream.getTracks().forEach(t=>t.stop());microphoneStream=null;micBtn.textContent='Use microphone ♫';}
}
candles.forEach(candle=>candle.addEventListener('click',()=>{candle.classList.add('out');if(candles.every(c=>c.classList.contains('out')))celebrate();else cakeStatus.textContent='One less candle! Tap the rest, birthday girl. ♡';}));
blowBtn.addEventListener('click',celebrate);
function burstConfetti(){
  const layer=document.getElementById('confettiLayer');
  const colors=['#A88462','#D8A79A','#F0D9C2','#fff4e7','#8D5B46'];
  for(let i=0;i<90;i++){const piece=document.createElement('i');piece.className='confetti';piece.style.setProperty('--x',Math.random()*100+'%');piece.style.setProperty('--c',colors[i%colors.length]);piece.style.setProperty('--t',(2.5+Math.random()*2.5)+'s');piece.style.setProperty('--r',Math.random()*180+'deg');layer.appendChild(piece);setTimeout(()=>piece.remove(),5200);}
}
async function listenForBlow(){
  if(!navigator.mediaDevices?.getUserMedia){cakeStatus.textContent='Microphone is not available here. You can tap the candles instead!';return;}
  try{
    microphoneStream=await navigator.mediaDevices.getUserMedia({audio:true});
    const AudioCtx=window.AudioContext||window.webkitAudioContext;const context=new AudioCtx();
    const source=context.createMediaStreamSource(microphoneStream);const analyser=context.createAnalyser();analyser.fftSize=512;source.connect(analyser);
    const data=new Uint8Array(analyser.frequencyBinCount);micBtn.textContent='Listening… blow now!';cakeStatus.textContent='I’m listening… give the candles a gentle blow!';
    let loudFrames=0;const started=Date.now();
    const check=()=>{if(!microphoneStream)return;analyser.getByteTimeDomainData(data);let sum=0;for(const n of data){const v=(n-128)/128;sum+=v*v;}const volume=Math.sqrt(sum/data.length);
      if(volume>.12)loudFrames++;else loudFrames=0;
      if(loudFrames>=3){celebrate();context.close();return;}
      if(Date.now()-started>15000){microphoneStream.getTracks().forEach(t=>t.stop());microphoneStream=null;context.close();micBtn.textContent='Try microphone again ♫';cakeStatus.textContent='No blow detected — tap the candles whenever you’re ready!';return;}
      requestAnimationFrame(check);
    };check();
  }catch(error){cakeStatus.textContent='Microphone permission was not given. No worries — tap “Blow out the candles”!';micBtn.textContent='Use microphone ♫';}
}
micBtn.addEventListener('click',listenForBlow);
function cutCake(){cakeGraphic.classList.add('cut');cakeStatus.textContent='A slice of sweetness, just for you. Happy 20th! ♡';burstConfetti();cutBtn.disabled=true;}
cutBtn.addEventListener('click',cutCake);
document.getElementById('sliceBtn').addEventListener('click',()=>{cutCake();document.getElementById('cake').scrollIntoView({behavior:'smooth',block:'center'});});
