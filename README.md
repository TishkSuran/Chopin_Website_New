# Chopin Fan Website

A responsive website dedicated to the life and works of Frédéric Chopin, created for the Web Development module at Manchester Metropolitan University.

## Features

- **Responsive Design**: Fully adaptive layout that works on mobile, tablet and desktop devices
- **Multiple Pages**: Biography, Nocturnes, Gallery, Interactive, and Hall of Fame sections
- **Music Player**: Custom-built audio player with interactive waveform
- **Mailing List**: Form with validation and API integration
- **Rock & Roll Hall of Fame**: Interactive guide to Hall of Fame inductees by year
- **Image Gallery**: Showcase of Chopin-related imagery
- **Modular CSS**: Well-organized CSS structure for better maintainability

## Technical Implementation

### HTML
- Semantic markup throughout the site
- Proper nesting and organisation of elements
- Validated using W3C validator

### CSS
- Modular structure with separate files for base, layout, components, and pages
- Custom properties (variables) for consistent styling
- Responsive design using media queries
- Smooth animations and transitions

### JavaScript
- Form validation for the mailing list signup
- Custom audio player implementation
- API integration with the Hall of Fame endpoint
- Dynamic content loading and error handling
- Interactive mood-based music selection

## Project Structure

```
├── assets/
│   ├── images/        # Image files used throughout the site
│   ├── audio/         # Music files for the audio player
├── css/
│   ├── main.css       # Main CSS file that imports all modules
│   ├── base.css       # Base styles, variables and typography
│   ├── layout.css     # Layout components
│   ├── components.css # Reusable components
│   ├── pages.css      # Page-specific styles
│   ├── responsive.css # Media queries
├── js/
│   ├── static-waveform.js  # Audio player functionality
│   ├── mailing-list.js     # Form validation and API calls
│   ├── interactive.js      # Interactive page functionalit
│   ├── hall-of-fame.js     # Hall of Fame API integration
├── index.html         # Home page
├── biography.html     # Biography page
├── works.html         # Works overview
├── nocturnes.html     # Nocturnes showcase
├── gallery.html       # Image gallery
├── interactive.html   # Interactive features
├── hall-of-fame.html  # Hall of Fame lookup
├── mailing-list.html  # Mailing list signup
├── README.md          # This file
```

## API Integration

The site integrates with two external APIs:

1. **Mailing List API**: Submits user information to the server
   - Endpoint: `https://mudfoot.doc.stu.mmu.ac.uk/ash/api/mailinglist`
   - Method: POST
   - Format: JSON

2. **Hall of Fame API**: Retrieves Rock & Roll Hall of Fame inductees
   - Endpoint: `https://mudfoot.doc.stu.mmu.ac.uk/ash/api/halloffame`
   - Method: GET
   - Query Parameters: year (e.g. ?year=2021)

## Acknowledgements

- All Chopin biographical information sourced from Wikipedia
- Images sourced from various public domain repositories
- Audio samples from public domain recordings of Chopin's works

## Known Issues

- Some audio files may not load properly in certain browsers due to format compatability
- The gallery page is intentionally left with minimum content as it exceeds assignment requirements
- The works page contains a placeholder message explaining that the additional content would exceed assignment scope

