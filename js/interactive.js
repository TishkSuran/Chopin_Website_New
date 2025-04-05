/**
 * Chopin Interactive Page - Mood Player
 * 
 * Features:
 * - Mood-based video selection
 * - Responsive design
 * - Descriptive information for each piece
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the mood player
    setupMoodPlayer();
});

/**
 * Mood Player Setup
 */
function setupMoodPlayer() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    const moodInfo = document.getElementById('mood-info');
    const videoFrame = document.getElementById('chopin-video');
    
    // Active button reference
    let activeButton = null;
    
    // Dictionary of mood descriptions
    const moodDescriptions = {
        'melancholy': {
            title: "Prelude in E minor, Op. 28, No. 4",
            description: "This somber prelude captures a sense of profound sadness and introspection. Composed in 1839, this piece is known for its deep emotional impact and haunting melody. The repeated chord progression creates a sense of inevitability and resignation."
        },
        'joyful': {
            title: "Grande Valse Brillante in E-flat major, Op. 18",
            description: "This lively waltz expresses elegance, optimism, and the joy of dance. Composed in 1833, it exemplifies Chopin's ability to elevate the waltz from a simple dance form to concert music. Its sparkling runs and joyful themes create an atmosphere of celebration."
        },
        'passionate': {
            title: "Revolutionary Étude in C minor, Op. 10, No. 12",
            description: "This powerful étude conveys intense emotion and revolutionary spirit. Written around 1831 in response to the failed Polish uprising against Russia, its dramatic descending left-hand passages and emotional intensity make it one of Chopin's most recognizable works."
        },
        'dreamy': {
            title: "Nocturne in E-flat major, Op. 9, No. 2",
            description: "This beloved nocturne evokes the tranquil, dreamy atmosphere of night. Composed in 1830-1832, it features a beautiful, ornate melody over a steady left-hand accompaniment. The piece creates a sense of intimate reflection and gentle contemplation."
        }
    };
    
    // Set up mood button click handlers
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get mood and video URL
            const mood = button.getAttribute('data-mood');
            const videoUrl = button.getAttribute('data-video');
            
            // Reset active button styling
            if (activeButton) {
                activeButton.classList.remove('active');
            }
            
            // Set this button as active
            button.classList.add('active');
            activeButton = button;
            
            // Update the video source
            if (videoFrame) {
                videoFrame.src = videoUrl;
            }
            
            // Update mood information
            if (moodInfo && moodDescriptions[mood]) {
                const piece = moodDescriptions[mood];
                moodInfo.innerHTML = `
                    <h3>${piece.title}</h3>
                    <p>${piece.description}</p>
                `;
            }
        });
    });
    
    // Auto-select the first mood on page load
    if (moodButtons.length > 0) {
        // Slight delay to ensure the page is fully loaded
        setTimeout(() => {
            moodButtons[0].click();
        }, 500);
    }
}