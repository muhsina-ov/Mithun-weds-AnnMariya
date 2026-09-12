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
  
  // Audio Elements
  const bgMusic = document.getElementById('bgMusic');
  const defaultYoutubeUrl = 'https://youtu.be/bXa-wbiXiOw?si=4VKIwIdMViFVcH-S';
  
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

    // Initialize HTML5 Scratch Canvas once overlay is visible
    setTimeout(() => {
      initScratchCanvas();
    }, 180);
  }

  // --- HTML5 Scratch Card Engine for Date ---
  const scratchCanvas = document.getElementById('scratchCanvas');
  const scratchHint = document.getElementById('scratchHint');
  const quickRevealBtn = document.getElementById('quickRevealBtn');
  let scratchCtx = null;
  let isScratching = false;
  let hasScratchedCleared = false;
  let dragCount = 0;

  function initScratchCanvas() {
    if (!scratchCanvas) return;
    scratchCtx = scratchCanvas.getContext('2d');
    
    const container = document.getElementById('scratchContainer');
    if (!container) return;
    
    scratchCanvas.width = container.offsetWidth || 340;
    scratchCanvas.height = container.offsetHeight || 130;
    
    // Render Metallic Gold Foil Gradient
    const grad = scratchCtx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
    grad.addColorStop(0, '#E5C158');
    grad.addColorStop(0.3, '#FFF4D0');
    grad.addColorStop(0.7, '#D4A338');
    grad.addColorStop(1, '#9E741B');
    
    scratchCtx.fillStyle = grad;
    scratchCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    
    // Add shimmering gold foil texture speckles
    scratchCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 180; i++) {
      const x = Math.random() * scratchCanvas.width;
      const y = Math.random() * scratchCanvas.height;
      const r = Math.random() * 2 + 0.5;
      scratchCtx.beginPath();
      scratchCtx.arc(x, y, r, 0, Math.PI * 2);
      scratchCtx.fill();
    }
    
    // Add prompt text on foil
    scratchCtx.font = '600 13px Cinzel, Georgia, serif';
    scratchCtx.fillStyle = 'rgba(10, 10, 15, 0.82)';
    scratchCtx.textAlign = 'center';
    scratchCtx.fillText('✦ SCRATCH TO UNLOCK DATE ✦', scratchCanvas.width / 2, scratchCanvas.height / 2 + 5);
  }

  function scratchAt(x, y) {
    if (!scratchCtx || hasScratchedCleared) return;
    
    scratchCtx.globalCompositeOperation = 'destination-out';
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, 24, 0, Math.PI * 2);
    scratchCtx.fill();
    
    dragCount++;
    if (dragCount % 8 === 0) {
      checkScratchPercentage();
    }
  }

  function getScratchCoords(e) {
    const rect = scratchCanvas.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;
    
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function checkScratchPercentage() {
    if (hasScratchedCleared || !scratchCtx) return;
    
    const imgData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;
    
    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }
    
    const totalSampled = pixels.length / 16;
    const ratio = transparentCount / totalSampled;
    
    if (ratio > 0.32) {
      revealDateFully();
    }
  }

  function revealDateFully() {
    if (hasScratchedCleared) return;
    hasScratchedCleared = true;
    
    if (scratchCanvas) scratchCanvas.classList.add('fade-out');
    if (scratchHint) scratchHint.style.opacity = '0';
    if (quickRevealBtn) quickRevealBtn.style.display = 'none';
    
    triggerConfetti();
  }

  if (scratchCanvas) {
    scratchCanvas.addEventListener('mousedown', (e) => {
      isScratching = true;
      const coords = getScratchCoords(e);
      scratchAt(coords.x, coords.y);
    });

    scratchCanvas.addEventListener('touchstart', (e) => {
      isScratching = true;
      const coords = getScratchCoords(e);
      scratchAt(coords.x, coords.y);
    }, { passive: true });

    scratchCanvas.addEventListener('mousemove', (e) => {
      if (!isScratching) return;
      const coords = getScratchCoords(e);
      scratchAt(coords.x, coords.y);
    });

    scratchCanvas.addEventListener('touchmove', (e) => {
      if (!isScratching) return;
      e.preventDefault(); // Prevent page scrolling during scratch!
      const coords = getScratchCoords(e);
      scratchAt(coords.x, coords.y);
    }, { passive: false });

    ['mouseup', 'mouseleave', 'touchend'].forEach(evt => {
      scratchCanvas.addEventListener(evt, () => {
        isScratching = false;
      });
    });
  }

  if (quickRevealBtn) {
    quickRevealBtn.addEventListener('click', revealDateFully);
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
    
    for (let i = 0; i < 65; i++) {
      confettiParticles.push({
        x: confettiCanvas.width / 2 + (Math.random() * 80 - 40),
        y: confettiCanvas.height * 0.35,
        vx: (Math.random() - 0.5) * 11,
        vy: (Math.random() * -9) - 4,
        size: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 7,
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

    // 1. Play direct HTML5 background audio (reliable across all mobile browsers)
    if (bgMusic) {
      bgMusic.currentTime = 0;
      bgMusic.muted = isAudioMuted;
      bgMusic.volume = 1.0;
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('HTML5 audio play notice, falling back to YouTube:', err);
          playYouTubeBackgroundMusic(defaultYoutubeUrl, true);
        });
      }
    } else {
      playYouTubeBackgroundMusic(defaultYoutubeUrl, true);
    }

    // 3. Hide tap callout overlay
    tapOverlay.classList.add('fade-out');
    
    // 4. Hide poster image & clear static canvas
    posterImg.classList.add('fade-out');
    staticCanvas.classList.remove('active');
    
    // 5. Reset video playback to 0 and play continuous video
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

    if (bgMusic) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }
    pauseYouTubeBackgroundMusic();
    
    staticCanvas.classList.remove('active');
    invitationOverlay.classList.remove('revealed');
    
    const lanternsContainer = document.getElementById('lanternsContainer');
    if (lanternsContainer) lanternsContainer.classList.remove('revealed');

    // Reset scratch card
    hasScratchedCleared = false;
    if (scratchCanvas) {
      scratchCanvas.classList.remove('fade-out');
    }
    if (scratchHint) {
      scratchHint.style.opacity = '1';
    }
    if (quickRevealBtn) {
      quickRevealBtn.style.display = 'inline-block';
    }

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
    if (!url) return 'bXa-wbiXiOw';
    url = url.trim();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      return match[2];
    }
    if (url.length === 11) return url;
    return 'bXa-wbiXiOw';
  }

  function playYouTubeBackgroundMusic(url = 'bXa-wbiXiOw', autoPlay = true) {
    const videoId = extractYouTubeId(url);
    const container = document.getElementById('youtubePlayerContainer');
    if (!container) return;

    if (!ytPlayerIframe) {
      const muteParam = isAudioMuted ? 1 : 0;
      const playParam = autoPlay ? 1 : 0;
      container.innerHTML = `<iframe id="ytIframe" width="1" height="1" 
        src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${playParam}&loop=1&playlist=${videoId}&controls=0&mute=${muteParam}&playsinline=1" 
        frameborder="0" allow="autoplay; encrypted-media; picture-in-picture"></iframe>`;
      ytPlayerIframe = document.getElementById('ytIframe');
    } else {
      toggleYouTubeAudioMute(isAudioMuted);
    }
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

  function pauseYouTubeBackgroundMusic() {
    if (!ytPlayerIframe || !ytPlayerIframe.contentWindow) return;
    try {
      ytPlayerIframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'pauseVideo',
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

    if (bgMusic) {
      bgMusic.muted = isAudioMuted;
    }
    
    toggleYouTubeAudioMute(isAudioMuted);

    if (isAudioMuted) {
      audioIconOn.classList.add('hidden');
      audioIconOff.classList.remove('hidden');
    } else {
      audioIconOn.classList.remove('hidden');
      audioIconOff.classList.add('hidden');
      initAudioContext();
      if (bgMusic && bgMusic.paused && hasOpened) {
        bgMusic.play().catch(() => {});
      }
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
