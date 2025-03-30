/**
 * Chopin Music Player with Theme-Matching Waveform
 * Features:
 * - Static waveform display that matches website theme
 * - Play/pause functionality
 * - Seeking through tracks
 * - Time display
 */

// Global variable to store the active audio element
let currentAudio = null;

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Set up each track
  document.querySelectorAll('.track').forEach((track, index) => {
    // Assign an ID if it doesn't have one
    if (!track.id) {
      track.id = `track-${index + 1}`;
    }
    
    // Create static waveform
    createStaticWaveform(track);
    
    // Set up play button
    const playBtn = track.querySelector('.play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', function() {
        togglePlay(track);
      });
    }
    
    // Set up waveform seeking
    const waveform = track.querySelector('.waveform-container');
    if (waveform) {
      waveform.addEventListener('click', function(event) {
        seekAudio(track, event);
      });
    }
  });
});

/**
 * Create a static waveform visualization that matches the theme
 * @param {HTMLElement} track - The track element
 */
function createStaticWaveform(track) {
  // Create waveform container
  const waveformContainer = document.createElement('div');
  waveformContainer.className = 'waveform-container';
  
  // Create the static waveform
  const waveform = document.createElement('div');
  waveform.className = 'static-waveform';
  
  // Generate bars for the waveform - more bars for a denser look
  const barCount = 150; // Increased number of bars
  for (let i = 0; i < barCount; i++) {
    // Create upper bar (orange)
    const upperBar = document.createElement('div');
    upperBar.className = 'waveform-bar upper-bar';
    // Varied heights for a natural look
    const upperHeight = Math.random() * 25 + 5; // 5-30px height
    upperBar.style.height = `${upperHeight}px`;
    
    // Create lower bar (darker orange/brown)
    const lowerBar = document.createElement('div');
    lowerBar.className = 'waveform-bar lower-bar';
    // Varied heights for a natural look
    const lowerHeight = Math.random() * 25 + 5; // 5-30px height
    lowerBar.style.height = `${lowerHeight}px`;
    
    // Create bar wrapper
    const barWrapper = document.createElement('div');
    barWrapper.className = 'bar-wrapper';
    barWrapper.appendChild(upperBar);
    barWrapper.appendChild(lowerBar);
    
    // Add to waveform
    waveform.appendChild(barWrapper);
  }
  
  // Create progress overlay
  const progressOverlay = document.createElement('div');
  progressOverlay.className = 'progress-overlay';
  
  // Create progress handle
  const progressHandle = document.createElement('div');
  progressHandle.className = 'progress-handle';
  
  // Create time display
  const timeDisplay = document.createElement('div');
  timeDisplay.className = 'time-display';
  timeDisplay.innerHTML = `
    <span class="current-time">0:00</span>
    <span class="duration">0:00</span>
  `;
  
  // Add all elements to container
  waveformContainer.appendChild(waveform);
  waveformContainer.appendChild(progressOverlay);
  waveformContainer.appendChild(progressHandle);
  waveformContainer.appendChild(timeDisplay);
  
  // Insert after track info and before track controls
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

/**
 * Toggle play/pause for a track
 * @param {HTMLElement} track - The track element to play/pause
 */
function togglePlay(track) {
  const audioSrc = track.getAttribute('data-src');
  const playBtn = track.querySelector('.play-btn');
  
  // If we already have a different audio playing, stop it
  if (currentAudio && currentAudio.getAttribute('data-track-id') !== track.id) {
    const previousTrack = document.getElementById(currentAudio.getAttribute('data-track-id'));
    if (previousTrack) {
      resetPlayButton(previousTrack);
    }
    currentAudio.pause();
  }
  
  // Get or create the audio element for this track
  let audio = track.querySelector('audio');
  if (!audio) {
    audio = document.createElement('audio');
    audio.src = audioSrc;
    audio.setAttribute('data-track-id', track.id);
    
    // Set up audio event listeners
    audio.addEventListener('timeupdate', () => updateProgress(track));
    audio.addEventListener('loadedmetadata', () => updateDuration(track));
    audio.addEventListener('ended', () => resetPlayButton(track));
    
    // Add loading indicator
    audio.addEventListener('waiting', () => track.classList.add('loading'));
    audio.addEventListener('canplaythrough', () => track.classList.remove('loading'));
    
    track.appendChild(audio);
  }
  
  // Toggle play/pause
  if (audio.paused) {
    // Show loading indicator until audio starts playing
    track.classList.add('loading');
    
    // Pause any currently playing audio
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
    }
    
    // Update current audio reference
    currentAudio = audio;
    
    // Play the audio
    audio.play()
      .then(() => {
        // Remove loading indicator once playing
        track.classList.remove('loading');
        
        // Update button to show pause icon
        playBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor"/>
          </svg>
        `;
      })
      .catch(error => {
        console.error('Error playing audio:', error);
        track.classList.remove('loading');
        alert('Error playing audio. Please check if the file exists at the correct path.');
      });
  } else {
    // Pause the audio
    audio.pause();
    
    // Update button to show play icon
    resetPlayButton(track);
  }
}

/**
 * Update the progress display for a track
 * @param {HTMLElement} track - The track element
 */
function updateProgress(track) {
  const audio = track.querySelector('audio');
  const progressOverlay = track.querySelector('.progress-overlay');
  const progressHandle = track.querySelector('.progress-handle');
  const currentTimeEl = track.querySelector('.current-time');
  
  if (audio && progressOverlay && progressHandle && currentTimeEl) {
    // Calculate progress percentage
    const progress = (audio.currentTime / audio.duration);
    
    // Update progress overlay width
    progressOverlay.style.width = `${progress * 100}%`;
    
    // Update progress handle position
    progressHandle.style.left = `${progress * 100}%`;
    
    // Update time display
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
}

/**
 * Update the duration display for a track
 * @param {HTMLElement} track - The track element
 */
function updateDuration(track) {
  const audio = track.querySelector('audio');
  const durationEl = track.querySelector('.duration');
  
  if (audio && durationEl && !isNaN(audio.duration)) {
    durationEl.textContent = formatTime(audio.duration);
  }
}

/**
 * Reset the play button to show play icon
 * @param {HTMLElement} track - The track element
 */
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

/**
 * Seek to a position in the audio when clicking the waveform
 * @param {HTMLElement} track - The track element
 * @param {Event} event - The click event
 */
function seekAudio(track, event) {
  const audio = track.querySelector('audio');
  const waveformContainer = track.querySelector('.waveform-container');
  
  if (audio && waveformContainer) {
    // Get click position relative to waveform container
    const rect = waveformContainer.getBoundingClientRect();
    const clickPos = (event.clientX - rect.left) / rect.width;
    
    // Set the audio time based on click position
    audio.currentTime = clickPos * audio.duration;
    
    // Update progress display
    updateProgress(track);
  }
}

/**
 * Format time in MM:SS
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}