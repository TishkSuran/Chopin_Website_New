let currentTrack = null;

// Set everything up when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Find all tracks and set them up
  document.querySelectorAll('.track').forEach((track, i) => {
    if (!track.id) track.id = `track-${i+1}`;
    
    makeWaveform(track);
    
    // Add click handlers
    if (track.querySelector('.play-btn')) {
      track.querySelector('.play-btn').onclick = () => playTrack(track);
    }
    
    if (track.querySelector('.waveform-container')) {
      track.querySelector('.waveform-container').onclick = (e) => seekAudio(track, e);
    }
    
    // Add handlers for the action buttons
    const fav = track.querySelector('.action-btn[title="Add to favourites"]');
    if (fav) fav.onclick = () => toggleFav(fav, track);
    
    const playlist = track.querySelector('.action-btn[title="Add to playlist"]');
    if (playlist) playlist.onclick = () => addToPlaylist(playlist, track);
    
    const share = track.querySelector('.action-btn[title="Share"]');
    if (share) share.onclick = () => shareTrack(track);
  });
});

function makeWaveform(track) {
  const container = document.createElement('div');
  container.className = 'waveform-container';
  
  // Create waveform with random heights
  const waveform = document.createElement('div');
  waveform.className = 'static-waveform';
  
  // Add 150 bars with random heights
  for (let i = 0; i < 150; i++) {
    const wrapper = document.createElement('div');
    wrapper.className = 'bar-wrapper';
    
    const upper = document.createElement('div');
    upper.className = 'waveform-bar upper-bar';
    upper.style.height = `${Math.random() * 25 + 5}px`;
    
    const lower = document.createElement('div');
    lower.className = 'waveform-bar lower-bar';
    lower.style.height = `${Math.random() * 25 + 5}px`;
    
    wrapper.appendChild(upper);
    wrapper.appendChild(lower);
    waveform.appendChild(wrapper);
  }
  
  // Add progress bar parts
  container.appendChild(waveform);
  container.appendChild(document.createElement('div')).className = 'progress-overlay';
  container.appendChild(document.createElement('div')).className = 'progress-handle';
  
  // Add time display
  const time = document.createElement('div');
  time.className = 'time-display';
  time.innerHTML = '<span class="current-time">0:00</span><span class="duration">0:00</span>';
  container.appendChild(time);
  
  // Add to track
  const controls = track.querySelector('.track-controls');
  if (controls) controls.before(container);
  else track.appendChild(container);
}

// Handle play/pause
function playTrack(track) {
  const src = track.getAttribute('data-src');
  const btn = track.querySelector('.play-btn');
  
  // Stop other playing tracks
  if (currentTrack && currentTrack.id !== track.id) {
    resetButton(document.getElementById(currentTrack.id));
    currentTrack.pause();
  }
  
  // Get or create audio element
  let audio = track.querySelector('audio');
  if (!audio) {
    audio = document.createElement('audio');
    audio.src = src;
    audio.id = track.id;
    
    // Add event listeners
    audio.ontimeupdate = () => updateProgress(track);
    audio.onloadedmetadata = () => updateDuration(track);
    audio.onended = () => resetButton(track);
    audio.onwaiting = () => track.classList.add('loading');
    audio.oncanplaythrough = () => track.classList.remove('loading');
    
    track.appendChild(audio);
  }
  
  // Play or pause
  if (audio.paused) {
    track.classList.add('loading');
    
    currentTrack = audio;
    audio.play()
      .then(() => {
        track.classList.remove('loading');
        // Change to pause icon
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor"/></svg>';
      })
      .catch(err => {
        console.error('Play error:', err);
        track.classList.remove('loading');
        alert('Could not play audio file');
      });
  } else {
    audio.pause();
    resetButton(track);
  }
}

// Reset play button to play icon
function resetButton(track) {
  const btn = track.querySelector('.play-btn');
  if (btn) {
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 5V19L19 12L8 5Z" fill="currentColor"/></svg>';
  }
}

// Update progress bar during playback
function updateProgress(track) {
  const audio = track.querySelector('audio');
  const progress = track.querySelector('.progress-overlay');
  const handle = track.querySelector('.progress-handle');
  const time = track.querySelector('.current-time');
  
  if (audio && progress && handle && time) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${percent}%`;
    handle.style.left = `${percent}%`;
    time.textContent = formatTime(audio.currentTime);
  }
}

// Update duration when metadata loads
function updateDuration(track) {
  const audio = track.querySelector('audio');
  const duration = track.querySelector('.duration');
  
  if (audio && duration && !isNaN(audio.duration)) {
    duration.textContent = formatTime(audio.duration);
  }
}

// Skip to position when clicking waveform
function seekAudio(track, event) {
  const audio = track.querySelector('audio');
  const waveform = track.querySelector('.waveform-container');
  
  if (audio && waveform) {
    const rect = waveform.getBoundingClientRect();
    const clickPos = (event.clientX - rect.left) / rect.width;
    audio.currentTime = clickPos * audio.duration;
    updateProgress(track);
  }
}

// Format seconds to MM:SS
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

// Toggle favorite state
function toggleFav(btn, track) {
  const title = track.querySelector('.track-details h3').textContent;
  
  if (btn.classList.contains('active')) {
    btn.classList.remove('active');
    btn.querySelector('path').setAttribute('fill', 'currentColor');
    alert(`Removed "${title}" from favorites`);
  } else {
    btn.classList.add('active');
    btn.querySelector('path').setAttribute('fill', '#FF9D35');
    alert(`Added "${title}" to favorites`);
  }
}

// Add to playlist
function addToPlaylist(btn, track) {
  const title = track.querySelector('.track-details h3').textContent;
  btn.classList.add('active');
  btn.querySelector('path').setAttribute('fill', '#FF9D35');
  
  setTimeout(() => {
    btn.classList.remove('active');
    btn.querySelector('path').setAttribute('fill', 'currentColor');
  }, 1000);
  
  alert(`Added "${title}" to your playlist`);
}

// Share track
function shareTrack(track) {
  const title = track.querySelector('.track-details h3').textContent;
  alert(`Share link copied: "${title}" by Chopin`);
}