let currentAudio = null;

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.track').forEach((track, index) => {
    if (!track.id) {
      track.id = `track-${index + 1}`;
    }
    
    createStaticWaveform(track);
    
    const playBtn = track.querySelector('.play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', function() {
        togglePlay(track);
      });
    }
    
    const waveform = track.querySelector('.waveform-container');
    if (waveform) {
      waveform.addEventListener('click', function(event) {
        seekAudio(track, event);
      });
    }
  });

  const tracks = document.querySelectorAll('.track');

  tracks.forEach(track => {
    const favoriteBtn = track.querySelector('.action-btn[title="Add to favourites"]');
    const playlistBtn = track.querySelector('.action-btn[title="Add to playlist"]');
    const shareBtn = track.querySelector('.action-btn[title="Share"]');
    
    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', () => toggleFavorite(favoriteBtn, track));
    }
    
    if (playlistBtn) {
      playlistBtn.addEventListener('click', () => addToPlaylist(playlistBtn, track));
    }
    
    if (shareBtn) {
      shareBtn.addEventListener('click', () => shareTrack(track));
    }
  });
});

function createStaticWaveform(track) {
  const waveformContainer = document.createElement('div');
  waveformContainer.className = 'waveform-container';
  
  const waveform = document.createElement('div');
  waveform.className = 'static-waveform';
  
  const barCount = 150;
  for (let i = 0; i < barCount; i++) {
    const upperBar = document.createElement('div');
    upperBar.className = 'waveform-bar upper-bar';
    const upperHeight = Math.random() * 25 + 5;
    upperBar.style.height = `${upperHeight}px`;
    
    const lowerBar = document.createElement('div');
    lowerBar.className = 'waveform-bar lower-bar';
    const lowerHeight = Math.random() * 25 + 5;
    lowerBar.style.height = `${lowerHeight}px`;
    
    const barWrapper = document.createElement('div');
    barWrapper.className = 'bar-wrapper';
    barWrapper.appendChild(upperBar);
    barWrapper.appendChild(lowerBar);
    
    waveform.appendChild(barWrapper);
  }
  
  const progressOverlay = document.createElement('div');
  progressOverlay.className = 'progress-overlay';
  
  const progressHandle = document.createElement('div');
  progressHandle.className = 'progress-handle';
  
  const timeDisplay = document.createElement('div');
  timeDisplay.className = 'time-display';
  timeDisplay.innerHTML = `
    <span class="current-time">0:00</span>
    <span class="duration">0:00</span>
  `;
  
  waveformContainer.appendChild(waveform);
  waveformContainer.appendChild(progressOverlay);
  waveformContainer.appendChild(progressHandle);
  waveformContainer.appendChild(timeDisplay);
  
  const trackInfo = track.querySelector('.track-info');
  const trackControls = track.querySelector('.track-controls');
  
  if (trackControls) {
    trackControls.before(waveformContainer);
  } else if (trackInfo) {
    trackInfo.after(waveformContainer);
  } else {
    track.appendChild(waveformContainer);
  }
}

function togglePlay(track) {
  const audioSrc = track.getAttribute('data-src');
  const playBtn = track.querySelector('.play-btn');
  
  if (currentAudio && currentAudio.getAttribute('data-track-id') !== track.id) {
    const previousTrack = document.getElementById(currentAudio.getAttribute('data-track-id'));
    if (previousTrack) {
      resetPlayButton(previousTrack);
    }
    currentAudio.pause();
  }
  
  let audio = track.querySelector('audio');
  if (!audio) {
    audio = document.createElement('audio');
    audio.src = audioSrc;
    audio.setAttribute('data-track-id', track.id);
    
    audio.addEventListener('timeupdate', () => updateProgress(track));
    audio.addEventListener('loadedmetadata', () => updateDuration(track));
    audio.addEventListener('ended', () => resetPlayButton(track));
    
    audio.addEventListener('waiting', () => track.classList.add('loading'));
    audio.addEventListener('canplaythrough', () => track.classList.remove('loading'));
    
    track.appendChild(audio);
  }
  
  if (audio.paused) {
    track.classList.add('loading');
    
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
    }
    
    currentAudio = audio;
    
    audio.play()
      .then(() => {
        track.classList.remove('loading');
        
        playBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor"/>
          </svg>
        `;
      })
      .catch(error => {
        console.error('Error playing audio:', error);
        track.classList.remove('loading');
        showNotification('Audio file not found or cannot be played.', 'error');
      });
  } else {
    audio.pause();
    resetPlayButton(track);
  }
}

function resetPlayButton(track) {
  const playBtn = track.querySelector('.play-btn');
  if (playBtn) {
    playBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
      </svg>
    `;
  }
}

function updateProgress(track) {
  const audio = track.querySelector('audio');
  const progressOverlay = track.querySelector('.progress-overlay');
  const progressHandle = track.querySelector('.progress-handle');
  const currentTimeEl = track.querySelector('.current-time');
  
  if (audio && progressOverlay && progressHandle && currentTimeEl) {
    const progress = (audio.currentTime / audio.duration);
    
    progressOverlay.style.width = `${progress * 100}%`;
    progressHandle.style.left = `${progress * 100}%`;
    
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
}

function updateDuration(track) {
  const audio = track.querySelector('audio');
  const durationEl = track.querySelector('.duration');
  
  if (audio && durationEl && !isNaN(audio.duration)) {
    durationEl.textContent = formatTime(audio.duration);
  }
}

function seekAudio(track, event) {
  const audio = track.querySelector('audio');
  const waveformContainer = track.querySelector('.waveform-container');
  
  if (audio && waveformContainer) {
    const rect = waveformContainer.getBoundingClientRect();
    const clickPos = (event.clientX - rect.left) / rect.width;
    
    audio.currentTime = clickPos * audio.duration;
    
    updateProgress(track);
  }
}

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function toggleFavorite(button, track) {
  const trackTitle = track.querySelector('.track-details h3').textContent;
  
  const isFavorited = button.classList.contains('active');
  
  if (isFavorited) {
    button.classList.remove('active');
    button.querySelector('path').setAttribute('fill', 'currentColor');
    showNotification(`Removed "${trackTitle}" from favorites`, 'info');
  } else {
    button.classList.add('active');
    button.querySelector('path').setAttribute('fill', '#FF9D35');
    showNotification(`Added "${trackTitle}" to favorites`, 'success');
    
    button.classList.add('pulse');
    setTimeout(() => {
      button.classList.remove('pulse');
    }, 700);
  }
}

function addToPlaylist(button, track) {
  const trackTitle = track.querySelector('.track-details h3').textContent;
  
  button.classList.add('active');
  button.querySelector('path').setAttribute('fill', '#FF9D35');
  
  setTimeout(() => {
    button.classList.remove('active');
    button.querySelector('path').setAttribute('fill', 'currentColor');
  }, 1000);
  
  showNotification(`Added "${trackTitle}" to your playlist`, 'success');
}

function shareTrack(track) {
  const trackTitle = track.querySelector('.track-details h3').textContent;
  
  const shareBtn = track.querySelector('.action-btn[title="Share"]');
  shareBtn.classList.add('active');
  shareBtn.querySelector('path').setAttribute('fill', '#FF9D35');
  
  setTimeout(() => {
    shareBtn.classList.remove('active');
    shareBtn.querySelector('path').setAttribute('fill', 'currentColor');
  }, 1000);
  
  const shareData = {
    title: 'Chopin Music',
    text: `Check out ${trackTitle} by Frédéric Chopin`,
    url: window.location.href + '#' + track.id
  };
  
  if (navigator.share && navigator.canShare(shareData)) {
    navigator.share(shareData)
      .then(() => console.log('Shared successfully'))
      .catch((error) => {
        console.error('Error sharing:', error);
        showShareFallback(trackTitle);
      });
  } else {
    showShareFallback(trackTitle);
  }
}

function showShareFallback(trackTitle) {
  showNotification(`Share link for "${trackTitle}" copied to clipboard!`, 'success');
}

function showNotification(message, type = 'info') {
  let notificationContainer = document.querySelector('.notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
    
    const style = document.createElement('style');
    style.textContent = `
      .notification-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
      }
      
      .notification {
        background-color: var(--secondary-bg);
        color: var(--text-color);
        border-left: 4px solid var(--accent-color);
        padding: 12px 20px;
        margin-top: 10px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        animation: slideIn 0.3s forwards, fadeOut 0.5s forwards 2.5s;
        max-width: 300px;
      }
      
      .notification.success {
        border-left-color: #4CAF50;
      }
      
      .notification.error {
        border-left-color: #F44336;
      }
      
      .notification.info {
        border-left-color: var(--accent-color);
      }
      
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; transform: translateY(-10px); }
      }
      
      .action-btn.active {
        transform: scale(1.2);
        transition: transform 0.2s ease;
      }
      
      .action-btn.pulse {
        animation: pulse 0.7s ease;
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  notificationContainer.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}