/* ==========================================================================
   MITHUN & ANN MARIYA WEDDING INVITATION - LOGIC & ANIMATION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Element References
  const posterImg = document.getElementById('doorPoster');
  const video = document.getElementById('doorVideo');
  const videoSource = document.getElementById('videoSource');
  const staticCanvas = document.getElementById('staticFrameCanvas');
  const canvasCtx = staticCanvas.getContext('2d');
  
  const tapOverlay = document.getElementById('tapOverlay');
  const invitationOverlay = document.getElementById('invitationOverlay');
  
  // Controls & Modals
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIconOn = document.getElementById('audioIconOn');
  const audioIconOff = document.getElementById('audioIconOff');
  const replayBtn = document.getElementById('replayBtn');
  
  // Location Map Modal
  const mapModal = document.getElementById('mapModal');
  const openMapBtn = document.getElementById('openMapBtn');
  const closeMapModal = document.getElementById('closeMapModal');
  const addToCalendarBtn = document.getElementById('addToCalendarBtn');

  // Application State
  const defaultYoutubeUrl = 'https://youtu.be/bXa-wbiXiOw?si=BkU1fQEBroNPAun5';
  let isAudioMuted = false;
  let isPlaying = false;
  let hasOpened = false;
  let audioCtx = null;

  // --- Audio Context Helper ---
  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // --- 3D Depth Floating Sky Lanterns Engine ---
  function initFloatingLanterns() {
    const container = document.getElementById('lanternsContainer');
    if (!container) return;

    container.innerHTML = '';
    const lanternCount = 20;
    const depthTiers = ['depth-far', 'depth-far', 'depth-mid', 'depth-mid', 'depth-near'];

    for (let i = 0; i < lanternCount; i++) {
      const lantern = document.createElement('div');
      const depthClass = depthTiers[Math.floor(Math.random() * depthTiers.length)];
      lantern.className = `lantern-item ${depthClass}`;

      const leftPos = (Math.random() * 90 + 5).toFixed(1);
      const duration = (Math.random() * 12 + 14).toFixed(1);
      const delay = (Math.random() * 18).toFixed(1);
      const swayX = (Math.random() * 22 + 8).toFixed(0);
      const rotDeg = (Math.random() * 6 - 3).toFixed(1);

      lantern.style.left = `${leftPos}%`;
      lantern.style.animationDuration = `${duration}s`;
      lantern.style.animationDelay = `${delay}s`;
      lantern.style.setProperty('--sway-x', `${swayX}px`);
      lantern.style.setProperty('--rot-deg', `${rotDeg}deg`);

      lantern.innerHTML = `
        <div class="lantern-paper">
          <div class="lantern-core-flame"></div>
        </div>
        <div class="lantern-tassel"></div>
      `;

      container.appendChild(lantern);
    }
  }

  // Initialize floating lanterns
  initFloatingLanterns();

  // --- Capture Final Video Frame onto Canvas for 100% Static Hold ---
  function freezeFinalFrame() {
    if (video.videoWidth && video.videoHeight) {
      staticCanvas.width = video.videoWidth;
      staticCanvas.height = video.videoHeight;
      canvasCtx.drawImage(video, 0, 0, staticCanvas.width, staticCanvas.height);
      
      staticCanvas.classList.add('active');
      video.pause();
    }
  }

  // --- Helper: Reveal Invitation Content ---
  function revealInvitationContent() {
    freezeFinalFrame();
    hasOpened = true;
    isPlaying = false;

    // Reveal invitation text overlay smoothly
    invitationOverlay.classList.remove('hidden');
    void invitationOverlay.offsetWidth;
    invitationOverlay.classList.add('revealed');

    // Trigger celebratory gold confetti
    setTimeout(() => {
      triggerConfetti();
    }, 400);
  }

  // --- Gold Confetti Particle Celebration Engine ---
  const confettiCanvas = document.getElementById('confettiCanvas');
  let confettiCtx = null;
  let confettiParticles = [];
  let confettiAnimationId = null;

  function triggerConfetti() {
    if (!confettiCanvas) return;
    confettiCtx = confettiCanvas.getContext('2d');
    
    const container = document.getElementById('invitationOverlay');
    confettiCanvas.width = container ? container.offsetWidth : window.innerWidth;
    confettiCanvas.height = container ? container.offsetHeight : window.innerHeight;
    
    const colors = ['#FFF4D0', '#E5C158', '#D4A338', '#FFFFFF', '#F5D77F'];
    confettiParticles = [];
    
    for (let i = 0; i < 60; i++) {
      confettiParticles.push({
        x: confettiCanvas.width / 2 + (Math.random() * 60 - 30),
        y: confettiCanvas.height * 0.3,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() * -8) - 3,
        size: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 6,
        opacity: 1
      });
    }
    
    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    animateConfetti();
  }

  function animateConfetti() {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    let activeParticles = 0;
    
    confettiParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.009;
      
      if (p.opacity > 0) {
        activeParticles++;
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);
        confettiCtx.globalAlpha = Math.max(0, p.opacity);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        confettiCtx.restore();
      }
    });
    
    if (activeParticles > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // --- Live Countdown Timer Engine (Friday, October 23, 2026 11:00 AM IST) ---
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');
  
  const targetWeddingDate = new Date('October 23, 2026 11:00:00').getTime();

  function updateCountdown() {
    if (!cdDays || !cdHours || !cdMins || !cdSecs) return;
    
    const now = new Date().getTime();
    const distance = targetWeddingDate - now;
    
    if (distance < 0) {
      cdDays.innerText = '00';
      cdHours.innerText = '00';
      cdMins.innerText = '00';
      cdSecs.innerText = '00';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    cdDays.innerText = days < 10 ? '0' + days : days;
    cdHours.innerText = hours < 10 ? '0' + hours : hours;
    cdMins.innerText = minutes < 10 ? '0' + minutes : minutes;
    cdSecs.innerText = seconds < 10 ? '0' + seconds : seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --- Door Opening Handler ---
  function openDoorInvitation() {
    if (isPlaying || hasOpened) return;
    
    isPlaying = true;
    initAudioContext();

    // Trigger YouTube background music
    playYouTubeBackgroundMusic(defaultYoutubeUrl, true);

    // 1. Hide tap callout overlay
    tapOverlay.classList.add('fade-out');
    
    // 2. Hide poster image & clear static canvas
    posterImg.classList.add('fade-out');
    staticCanvas.classList.remove('active');
    
    // 3. Reset video playback to 0 and play continuous video
    video.currentTime = 0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Video playing smoothly
      }).catch(err => {
        console.warn('Video playback notice:', err);
        revealInvitationContent();
      });
    }
  }

  // Forward desktop wheel scrolling to content-scrollable container once revealed
  const contentScrollable = document.getElementById('contentScrollable');
  window.addEventListener('wheel', (e) => {
    if (hasOpened && contentScrollable) {
      contentScrollable.scrollTop += e.deltaY;
    }
  }, { passive: true });

  // --- Video Event Listeners ---
  video.addEventListener('timeupdate', () => {
    // Reveal floating sky lanterns at 5.5s
    if (video.currentTime >= 5.5) {
      const lanternsContainer = document.getElementById('lanternsContainer');
      if (lanternsContainer) lanternsContainer.classList.add('revealed');
    }

    // Trigger invitation overlay reveal
    if (!hasOpened && (video.currentTime >= 5.8 || video.ended)) {
      revealInvitationContent();
    }
  });

  video.addEventListener('ended', () => {
    freezeFinalFrame();
    if (!hasOpened) {
      revealInvitationContent();
    }
  });

  // --- Reset & Replay ---
  function resetDoorState() {
    isPlaying = false;
    hasOpened = false;
    
    video.pause();
    video.currentTime = 0;
    
    staticCanvas.classList.remove('active');
    invitationOverlay.classList.remove('revealed');
    
    const lanternsContainer = document.getElementById('lanternsContainer');
    if (lanternsContainer) lanternsContainer.classList.remove('revealed');

    setTimeout(() => {
      invitationOverlay.classList.add('hidden');
      posterImg.classList.remove('fade-out');
      tapOverlay.classList.remove('fade-out');
    }, 400);
  }

  // Event Listeners for Tap Overlay & Replay
  tapOverlay.addEventListener('click', openDoorInvitation);
  replayBtn.addEventListener('click', resetDoorState);

  // --- YouTube Background Music Player Engine ---
  let ytPlayerIframe = null;

  function extractYouTubeId(url) {
    if (!url) return '';
    url = url.trim();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      return match[2];
    }
    if (url.length === 11) return url;
    return '';
  }

  function playYouTubeBackgroundMusic(url, autoPlay = true) {
    const videoId = extractYouTubeId(url);
    if (!videoId) return;

    const container = document.getElementById('youtubePlayerContainer');
    if (!container) return;

    if (ytPlayerIframe) {
      toggleYouTubeAudioMute(isAudioMuted);
      return;
    }

    const muteParam = isAudioMuted ? 1 : 0;
    const playParam = autoPlay ? 1 : 0;
    container.innerHTML = `<iframe id="ytIframe" width="200" height="200" 
      src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${playParam}&loop=1&playlist=${videoId}&controls=0&mute=${muteParam}" 
      frameborder="0" allow="autoplay"></iframe>`;

    ytPlayerIframe = document.getElementById('ytIframe');
  }

  function toggleYouTubeAudioMute(isMuted) {
    if (!ytPlayerIframe || !ytPlayerIframe.contentWindow) return;
    const command = isMuted ? 'mute' : 'unMute';
    try {
      ytPlayerIframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: command,
        args: []
      }), '*');
    } catch (e) {
      console.warn('YouTube audio postMessage notice:', e);
    }
  }

  // --- Audio Mute Toggle ---
  audioToggleBtn.addEventListener('click', () => {
    isAudioMuted = !isAudioMuted;
    video.muted = isAudioMuted;
    
    toggleYouTubeAudioMute(isAudioMuted);

    if (isAudioMuted) {
      audioIconOn.classList.add('hidden');
      audioIconOff.classList.remove('hidden');
    } else {
      audioIconOn.classList.remove('hidden');
      audioIconOff.classList.add('hidden');
      initAudioContext();
    }
  });

  // --- Map Modal Controls ---
  openMapBtn.addEventListener('click', () => mapModal.classList.remove('hidden'));
  closeMapModal.addEventListener('click', () => mapModal.classList.add('hidden'));

  // Close modals when clicking backdrop
  mapModal.addEventListener('click', (e) => {
    if (e.target === mapModal) {
      mapModal.classList.add('hidden');
    }
  });

  // --- Add to Google Calendar ---
  addToCalendarBtn.addEventListener('click', () => {
    const title = encodeURIComponent("Wedding of Mithun & Ann Mariya");
    const details = encodeURIComponent("Together with their families, Mithun & Ann Mariya request the honor of your presence at the celebration of their marriage.");
    const loc = encodeURIComponent("Sub Registrar Office, Kazhakkoottam, Thiruvananthapuram");

    // October 23, 2026, 11:00 AM IST (05:30 UTC) to 2:00 PM IST (08:30 UTC)
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${loc}&dates=20261023T053000Z/20261023T083000Z`;

    window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
  });

  // Service Worker for 0ms Repeat-Visit Loading
  if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
});
