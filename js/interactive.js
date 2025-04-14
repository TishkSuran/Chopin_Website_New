/**
 * Chopin Interactive Page - Mood Player
 * 
 * Features:
 * - Mood-based video selection
 * - Responsive design
 * - Descriptive information for each piece
 */

document.addEventListener('DOMContentLoaded', function() {
    setupMoodPlayer();
});

/**
 * Mood Player Setup
 */
function setupMoodPlayer() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    const moodInfo = document.getElementById('mood-info');
    const videoFrame = document.getElementById('chopin-video');
    
    let activeButton = null;
    
    const moodDescriptions = {
            'melancholy': {
              title: "Prelude in E minor, Op. 28, No. 4",
              description: "A sad, reflective piece from 1839. Known for its haunting melody and emotional impact."
            },
            'joyful': {
              title: "Grande Valse Brillante in E-flat major, Op. 18",
              description: "An upbeat waltz from 1833 that's full of energy and optimism. Perfect for celebrating."
            },
            'passionate': {
              title: "Revolutionary Étude in C minor, Op. 10, No. 12",
              description: "A powerful, intense piece from 1831. Written after Poland's failed uprising against Russia."
            },
            'dreamy': {
              title: "Nocturne in E-flat major, Op. 9, No. 2",
              description: "A gentle night piece from 1830-32. Features a beautiful melody that feels like floating."
            }
    };

    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mood = button.getAttribute('data-mood');
            const videoUrl = button.getAttribute('data-video');
            
            if (activeButton) {
                activeButton.classList.remove('active');
            }

            button.classList.add('active');
            activeButton = button;

            if (videoFrame) {
                videoFrame.src = videoUrl;
            }

            if (moodInfo && moodDescriptions[mood]) {
                const piece = moodDescriptions[mood];
                moodInfo.innerHTML = `
                    <h3>${piece.title}</h3>
                    <p>${piece.description}</p>
                `;
            }
        });
    });
    
    if (moodButtons.length > 0) {
        // Slight delay to ensure the page is fully loaded
        setTimeout(() => {
            moodButtons[0].click();
        }, 500);
    }
}