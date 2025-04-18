// Global var to track what's playing
let currentTrack = null;

// Let's go when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Grab all tracks
  document.querySelectorAll('.track').forEach((track, i) => {
    // Give it an ID if missing
    if (!track.id) track.id = `track-${i+1}`;
    
    // Add the fancy waveform
    makeWaveform(track);
    
    const playBtn = track.querySelector('.play-btn');
    if (playBtn) {
      playBtn.onclick = function() { 
        playTrack(track); 
      };
    }
    
    // Let users click the waveform to skip
    const waveform = track.querySelector('.waveform-container');
    if (waveform) {
      waveform.onclick = function(e) { 
        seekAudio(track, e); 
      };
    }

    const favBtn = track.querySelector('.action-btn[title="Add to favourites"]');
    if (favBtn) {
      favBtn.onclick = function() { 
        toggleFav(favBtn, track); 
      };
    }
    
    const playlistBtn = track.querySelector('.action-btn[title="Add to playlist"]');
    if (playlistBtn) {
      playlistBtn.onclick = function() { 
        addToPlaylist(playlistBtn, track); 
      };
    }
    
    const shareBtn = track.querySelector('.action-btn[title="Share"]');
    if (shareBtn) {
      shareBtn.onclick = function() { 
        shareTrack(track); 
      };
    }
  });
});

// Creates audio visual
function makeWaveform(track) {
  const container = document.createElement('div');
  container.className = 'waveform-container';
  
  // Make the visual bars
  const waveform = document.createElement('div');
  waveform.className = 'static-waveform';
  
  // Lots of random-height bars for a pseudo-waveform
  // Not real data but looks good enough!
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
  
  // Add the time tracker parts
  container.appendChild(waveform);
  
  // Progress 
  const overlay = document.createElement('div');
  overlay.className = 'progress-overlay';
  container.appendChild(overlay);
  
  const handle = document.createElement('div');
  handle.className = 'progress-handle';
  container.appendChild(handle);
  
  // Show time elapsed/total
  const time = document.createElement('div');
  time.className = 'time-display';
  time.innerHTML = '<span class="current-time">0:00</span><span class="duration">0:00</span>';
  container.appendChild(time);
  

  const controls = track.querySelector('.track-controls');
  if (controls) {
    controls.before(container);
  } else {
    track.appendChild(container);
  }
}

// Play/pause toggle
function playTrack(track) {
  const src = track.getAttribute('data-src');
  const btn = track.querySelector('.play-btn');
  
  // Only one track at a time 
  if (currentTrack && currentTrack.id !== track.id) {
    resetButton(document.getElementById(currentTrack.id));
    currentTrack.pause();
  }
  
  let audio = track.querySelector('audio');
  if (!audio) {
    audio = document.createElement('audio');
    audio.src = src;
    audio.id = track.id;
    
    audio.ontimeupdate = function() { 
      updateProgress(track); 
    };
    audio.onloadedmetadata = function() { 
      updateDuration(track); 
    };
    audio.onended = function() { 
      resetButton(track); 
    };
    audio.onwaiting = function() { 
      track.classList.add('loading'); 
    };
    audio.oncanplaythrough = function() { 
      track.classList.remove('loading'); 
    };
    
    track.appendChild(audio);
  }
  
  // Toggle play state
  if (audio.paused) {
    // Show loading indicator
    track.classList.add('loading');
    
    currentTrack = audio;
    audio.play()
      .then(function() {
        track.classList.remove('loading');
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor"/></svg>';
      })
      .catch(function(err) {
        // Might happen a bit too often
        console.error('Play error:', err);
        track.classList.remove('loading');
        alert('Could not play audio file');
      });
  } else {
    audio.pause();
    resetButton(track);
  }
}

function resetButton(track) {
  const btn = track.querySelector('.play-btn');
  if (btn) {
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 5V19L19 12L8 5Z" fill="currentColor"/></svg>';
  }
}

// Move progress bar as song plays
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

// Set total duration when we know it
function updateDuration(track) {
  const audio = track.querySelector('audio');
  const duration = track.querySelector('.duration');
  
  if (audio && duration && !isNaN(audio.duration)) {
    duration.textContent = formatTime(audio.duration);
  }
}

// Jump to timestamp when clicking waveform
function seekAudio(track, event) {
  const audio = track.querySelector('audio');
  const waveform = track.querySelector('.waveform-container');
  
  if (audio && waveform) {
    // Figure out where they clicked
    const rect = waveform.getBoundingClientRect();
    const clickPos = (event.clientX - rect.left) / rect.width;
    
    // Jump to that spot
    audio.currentTime = clickPos * audio.duration;
    updateProgress(track);
  }
}

// Make MM:SS format from seconds
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  
  // Pad seconds with leading zero if needed
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

// Heart button toggle
function toggleFav(btn, track) {
  const title = track.querySelector('.track-details h3').textContent;
  
  // Toggle state
  if (btn.classList.contains('active')) {
    // Unfavorite
    btn.classList.remove('active');
    btn.querySelector('path').setAttribute('fill', 'currentColor');
    alert(`Removed "${title}" from favorites`);
  } else {
    // Favorite
    btn.classList.add('active');
    btn.querySelector('path').setAttribute('fill', '#FF9D35');
    alert(`Added "${title}" to favorites`);
  }
}

// Add to playlist button
function addToPlaylist(btn, track) {
  const title = track.querySelector('.track-details h3').textContent;
  
  // Visual feedback
  btn.classList.add('active');
  btn.querySelector('path').setAttribute('fill', '#FF9D35');
  
  // Reset after a sec
  setTimeout(function() {
    btn.classList.remove('active');
    btn.querySelector('path').setAttribute('fill', 'currentColor');
  }, 1000);
  
  // Would connect to backend in real app
  alert(`Added "${title}" to your playlist`);
}

// Share button
function shareTrack(track) {
  const title = track.querySelector('.track-details h3').textContent;
  
  // In a real app, this would copy a valid link to clipboard, but the link can not be used in this case
  alert(`Share link copied: "${title}" by Chopin`);
}