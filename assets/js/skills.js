/* =====================================================================
   Skills Animation & GitHub Integration
   ===================================================================== */

(function() {
  'use strict';

  // Skills carousel enhanced interactions
  function initSkillsInteraction() {
    const skillIcons = document.querySelectorAll('.skill-icon');
    
    skillIcons.forEach((icon, index) => {
      // Add staggered animation delays
      icon.style.animationDelay = `${index * 2}s`;
      
      // Enhanced hover effects
      icon.addEventListener('mouseenter', () => {
        // Pause rotation on hover
        icon.style.animationPlayState = 'paused';
        
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'skill-ripple';
        icon.appendChild(ripple);
        
        setTimeout(() => {
          if (ripple.parentNode) {
            ripple.remove();
          }
        }, 600);
      });
      
      icon.addEventListener('mouseleave', () => {
        // Resume rotation
        icon.style.animationPlayState = 'running';
      });
    });
  }

  // GitHub Activity Simulation (since we can't make API calls from static site)
  function simulateGitHubActivity() {
    const activityGrid = document.querySelector('.activity-grid');
    if (!activityGrid) return;

    // Create a simple contribution-like grid
    const contributionGrid = document.createElement('div');
    contributionGrid.className = 'contribution-grid';
    
    // Generate contribution squares for the last 365 days
    const today = new Date();
    const oneYear = 365;
    
    for (let i = oneYear; i >= 0; i--) {
      const square = document.createElement('div');
      square.className = 'contribution-square';
      
      // Random activity level (0-4)
      const activity = Math.floor(Math.random() * 5);
      square.dataset.level = activity;
      square.dataset.count = activity > 0 ? Math.floor(Math.random() * 10) + 1 : 0;
      
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      square.title = `${square.dataset.count} contributions on ${date.toDateString()}`;
      
      contributionGrid.appendChild(square);
    }

    // Replace placeholder
    const placeholder = document.querySelector('.activity-placeholder');
    if (placeholder) {
      activityGrid.replaceChild(contributionGrid, placeholder);
    }

    // Add CSS for contribution grid
    addContributionGridStyles();
  }

  // Add dynamic styles for contribution grid
  function addContributionGridStyles() {
    if (document.getElementById('contribution-styles')) return;

    const style = document.createElement('style');
    style.id = 'contribution-styles';
    style.textContent = `
      .contribution-grid {
        display: grid;
        grid-template-columns: repeat(53, 1fr);
        gap: 3px;
        padding: 1rem;
        max-width: 100%;
        overflow-x: auto;
      }

      .contribution-square {
        width: 10px;
        height: 10px;
        background: var(--color-border);
        border-radius: 2px;
        transition: all .2s ease;
        cursor: pointer;
      }

      .contribution-square:hover {
        transform: scale(1.5);
        z-index: 10;
        position: relative;
      }

      .contribution-square[data-level="1"] { 
        background: rgba(0, 123, 255, 0.3); 
      }
      .contribution-square[data-level="2"] { 
        background: rgba(0, 123, 255, 0.5); 
      }
      .contribution-square[data-level="3"] { 
        background: rgba(0, 123, 255, 0.7); 
      }
      .contribution-square[data-level="4"] { 
        background: var(--color-accent); 
      }

      /* Light mode adjustments */
      :root.light .contribution-square[data-level="1"] { 
        background: rgba(0, 123, 255, 0.2); 
      }
      :root.light .contribution-square[data-level="2"] { 
        background: rgba(0, 123, 255, 0.4); 
      }
      :root.light .contribution-square[data-level="3"] { 
        background: rgba(0, 123, 255, 0.6); 
      }

      @media (max-width: 768px) {
        .contribution-grid {
          grid-template-columns: repeat(26, 1fr);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Enhanced skill icon animations
  function addSkillRippleStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .skill-ripple {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: radial-gradient(circle, transparent 20%, var(--color-accent) 20%, var(--color-accent) 80%, transparent 80%);
        opacity: 0;
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
      }

      @keyframes rippleEffect {
        0% {
          transform: scale(0);
          opacity: 0.8;
        }
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }

      .skill-icon {
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
  }

  // Intersection Observer for skills animation
  function initSkillsObserver() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Stagger icon animations
          const icons = entry.target.querySelectorAll('.skill-icon');
          icons.forEach((icon, index) => {
            setTimeout(() => {
              icon.classList.add('animate-in');
            }, index * 100);
          });
        }
      });
    }, {
      threshold: 0.2
    });

    skillCategories.forEach(category => {
      observer.observe(category);
    });
  }

  // Initialize everything when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    addSkillRippleStyles();
    initSkillsInteraction();
    simulateGitHubActivity();
    initSkillsObserver();
  });

})();
