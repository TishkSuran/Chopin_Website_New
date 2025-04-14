/**
 * Rock and Roll Hall of Fame API Integration
 * 
 * This script fetches and displays data from the Rock and Roll Hall of Fame API.
 * It allows users to view inductees from different years and displays the results with error handling.
 */

document.addEventListener('DOMContentLoaded', function() {
    const yearForm = document.getElementById('year-form');
    const yearSelect = document.getElementById('year-select');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const hofResults = document.getElementById('hof-results');
    
    const apiBaseUrl = 'https://mudfoot.doc.stu.mmu.ac.uk/ash/api/halloffame';
    
    // Load initial data (2021)
    fetchHallOfFameData('2021');
    
    if (yearForm) {
        yearForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const selectedYear = yearSelect.value;
            fetchHallOfFameData(selectedYear);
        });
    }
    
    function fetchHallOfFameData(year) {
        showLoading(true);
        showError(false);
        hofResults.style.display = 'none';

        const apiUrl = `${apiBaseUrl}?year=${year}`;
        
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                displayHallOfFameData(data, year);
            })
            .catch(error => {
                console.error('Error fetching Hall of Fame data:', error);
                showError(true, `Failed to load Hall of Fame data: ${error.message || 'Unknown error'}`);
            })
            .finally(() => {
                showLoading(false);
            });
    }
    
    function displayHallOfFameData(data, year) {
        hofResults.innerHTML = '';
        
        const yearHeader = document.createElement('div');
        yearHeader.className = 'hof-year-header';
        yearHeader.innerHTML = `
            <h3>Rock & Roll Hall of Fame Inductees ${year}</h3>
            <p>Artists and contributors recognised for their significant impact on the evolution of rock and roll.</p>
        `;
        hofResults.appendChild(yearHeader);
        
        if (data && data.data && data.data.length > 0) {
            const inducteesGrid = document.createElement('div');
            inducteesGrid.className = 'inductees-grid';
            
            data.data.forEach(inductee => {
                const card = createInducteeCard(inductee);
                inducteesGrid.appendChild(card);
            });
            
            hofResults.appendChild(inducteesGrid);
        } else {
            const noInductees = document.createElement('div');
            noInductees.className = 'no-inductees';
            noInductees.innerHTML = `
                <h3>No inductees found for ${year}</h3>
                <p>Try selecting a different year to view Hall of Fame inductees.</p>
            `;
            hofResults.appendChild(noInductees);
        }
        
        hofResults.style.display = 'block';
    }
    
    function createInducteeCard(inductee) {
        const card = document.createElement('div');
        card.className = 'inductee-card';
        const artistName = inductee.band && inductee.band.name ? inductee.band.name : 'Unknown Artist';
        
        let imageUrl = '/api/placeholder/300/200';
        
        // Try to get a better quality image by modifying the thumbnail URL
        if (inductee.image && inductee.image.source) {
            imageUrl = inductee.image.source.replace('/75px-', '/300px-');
        }
        
        let membersHTML = '';
        if (inductee.inducted_members && inductee.inducted_members.length > 0) {
            membersHTML = '<div class="inducted-members"><h5>Inducted Members:</h5><ul>';
            inductee.inducted_members.forEach(member => {
                membersHTML += `<li>${member.name || 'Unknown'}</li>`;
            });
            membersHTML += '</ul></div>';
        }
        
        card.innerHTML = `
            <div class="inductee-image">
                <img src="${imageUrl}" alt="${artistName}">
            </div>
            <div class="inductee-info">
                <h4>${artistName}</h4>
                <div class="inductee-category">Performer</div>
                ${membersHTML}
                <p class="inductee-bio">
                    ${inductee.image && inductee.image.title ? inductee.image.title : 'No additional information available.'}
                </p>
            </div>
        `;
        
        return card;
    }
    
    function showLoading(show) {
        loadingIndicator.style.display = show ? 'flex' : 'none';
    }
    
    function showError(show, message = '') {
        errorMessage.style.display = show ? 'block' : 'none';
        if (show) {
            errorMessage.textContent = message;
        }
    }
});