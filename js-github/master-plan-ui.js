/**
 * HEART Technology Park - Master Plan UI Controller
 * Handles all UI interactions and responsive behavior
 */

class MasterPlanUI {
    constructor() {
        this.masterPlan3D = null;
        this.isInitialized = false;
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.isResizing = false;
        
        // UI State
        this.currentPhase = 'phase1';
        this.currentView = 'overview';
        this.isTimelineExpanded = true;
        
        // Performance tracking
        this.performanceMetrics = {
            loadTime: 0,
            renderTime: 0,
            interactionLatency: 0
        };
        
        this.init();
    }

    async init() {
        try {
            console.log('🎮 Initializing Master Plan UI...');
            
            this.setupEventListeners();
            this.setupPerformanceMonitoring();
            this.setupAccessibility();
            this.setupResponsiveHandlers();
            
            // Initialize 3D after UI is ready
            await this.init3D();
            
            this.isInitialized = true;
            console.log('✅ Master Plan UI initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize UI:', error);
            this.showError('Failed to initialize user interface');
        }
    }

    async init3D() {
        const startTime = performance.now();
        
        this.masterPlan3D = new MasterPlan3D();
        await this.masterPlan3D.init();
        
        this.performanceMetrics.loadTime = performance.now() - startTime;
        console.log(`⚡ 3D scene loaded in ${this.performanceMetrics.loadTime.toFixed(2)}ms`);
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Navigation
        this.setupNavigationHandlers();
        
        // Timeline
        this.setupTimelineHandlers();
        
        // View Controls
        this.setupViewControlHandlers();
        
        // Keyboard Navigation
        this.setupKeyboardHandlers();
        
        // Touch Gestures
        this.setupTouchHandlers();
        
        // Window Events
        this.setupWindowHandlers();
    }

    setupNavigationHandlers() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                // Add active state handling if needed
                this.handleNavigation(e, link);
            });
        });

        // Logo click
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'index.html';
            });
        }
    }

    setupTimelineHandlers() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            // Click handler
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleTimelineSelection(item, index);
            });

            // Hover effects
            item.addEventListener('mouseenter', () => {
                this.handleTimelineHover(item, true);
            });

            item.addEventListener('mouseleave', () => {
                this.handleTimelineHover(item, false);
            });

            // Touch handlers for mobile
            item.addEventListener('touchstart', (e) => {
                this.handleTimelineTouch(e, item);
            });

            // Focus handler for accessibility
            item.addEventListener('focus', () => {
                this.handleTimelineFocus(item);
            });
        });

        // Timeline scroll behavior
        this.setupTimelineScroll();
    }

    setupViewControlHandlers() {
        const controlButtons = document.querySelectorAll('.control-btn');
        
        controlButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleViewControl(btn);
            });

            // Touch feedback
            btn.addEventListener('touchstart', () => {
                btn.style.transform = 'scale(0.95)';
            });

            btn.addEventListener('touchend', () => {
                btn.style.transform = '';
            });
        });
    }

    setupKeyboardHandlers() {
        document.addEventListener('keydown', (e) => {
            if (!this.isInitialized) return;

            switch (e.key) {
                case '1':
                    e.preventDefault();
                    this.selectPhase('phase1');
                    break;
                case '2':
                    e.preventDefault();
                    this.selectPhase('phase2');
                    break;
                case '3':
                    e.preventDefault();
                    this.selectPhase('phase3');
                    break;
                case 'o':
                case 'O':
                    e.preventDefault();
                    this.selectView('overview');
                    break;
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.selectView('aerial');
                    break;
                case 'g':
                case 'G':
                    e.preventDefault();
                    this.selectView('ground');
                    break;
                case 'Escape':
                    this.resetView();
                    break;
                case 'h':
                case 'H':
                    e.preventDefault();
                    this.toggleHelp();
                    break;
            }
        });
    }

    setupTouchHandlers() {
        const timelinePanel = document.querySelector('.timeline-panel');
        if (!timelinePanel) return;

        // Swipe to navigate phases on mobile
        timelinePanel.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
        });

        timelinePanel.addEventListener('touchend', (e) => {
            this.touchEndY = e.changedTouches[0].clientY;
            this.handleSwipeGesture();
        });

        // Prevent scroll bounce on iOS
        timelinePanel.addEventListener('touchmove', (e) => {
            const panel = e.currentTarget;
            const isScrollable = panel.scrollHeight > panel.clientHeight;
            
            if (!isScrollable) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    setupWindowHandlers() {
        // Resize handler with debouncing
        const resizeHandler = this.debounce(() => {
            this.handleResize();
        }, 250);
        
        window.addEventListener('resize', resizeHandler);

        // Orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleResize();
                this.adjustLayoutForOrientation();
            }, 100);
        });

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Before unload cleanup
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    // Handler Methods
    handleNavigation(e, link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            // Handle internal navigation if needed
        }
    }

    handleTimelineSelection(item, index) {
        const startTime = performance.now();
        
        // Update UI state
        this.updateTimelineSelection(item);
        
        // Update 3D scene
        const phase = item.dataset.phase;
        if (this.masterPlan3D) {
            this.masterPlan3D.updatePhaseVisibility(phase);
        }
        
        // Analytics
        this.performanceMetrics.interactionLatency = performance.now() - startTime;
        console.log(`⚡ Timeline selection processed in ${this.performanceMetrics.interactionLatency.toFixed(2)}ms`);
        
        // Haptic feedback on mobile
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Update URL hash for bookmarking
        this.updateURL(phase);
    }

    handleTimelineHover(item, isEntering) {
        if (this.isMobile()) return; // Skip hover effects on mobile
        
        if (isEntering) {
            item.style.transform = 'translateX(12px)';
            this.showPhasePreview(item.dataset.phase);
        } else {
            item.style.transform = '';
            this.hidePhasePreview();
        }
    }

    handleTimelineTouch(e, item) {
        // Add touch ripple effect
        this.createRippleEffect(e, item);
    }

    handleTimelineFocus(item) {
        // Scroll into view if needed
        item.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }

    handleViewControl(btn) {
        const view = btn.dataset.view;
        
        if (this.masterPlan3D) {
            this.masterPlan3D.setCameraView(view);
        }
        
        this.updateViewControlButtons(btn);
        
        // Analytics
        console.log(`📷 View changed to: ${view}`);
    }

    handleSwipeGesture() {
        const swipeDistance = this.touchStartY - this.touchEndY;
        const minSwipeDistance = 50;
        
        if (Math.abs(swipeDistance) < minSwipeDistance) return;
        
        const phases = ['phase1', 'phase2', 'phase3'];
        const currentIndex = phases.indexOf(this.currentPhase);
        
        let newIndex;
        if (swipeDistance > 0) {
            // Swipe up - next phase
            newIndex = Math.min(currentIndex + 1, phases.length - 1);
        } else {
            // Swipe down - previous phase
            newIndex = Math.max(currentIndex - 1, 0);
        }
        
        if (newIndex !== currentIndex) {
            this.selectPhase(phases[newIndex]);
        }
    }

    handleResize() {
        if (this.isResizing) return;
        this.isResizing = true;
        
        setTimeout(() => {
            this.adjustLayoutForScreenSize();
            this.isResizing = false;
        }, 100);
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Pause any animations or reduce performance
            if (this.masterPlan3D) {
                this.masterPlan3D.pauseAnimation();
            }
        } else {
            // Resume animations
            if (this.masterPlan3D) {
                this.masterPlan3D.resumeAnimation();
            }
        }
    }

    // UI Update Methods
    updateTimelineSelection(selectedItem) {
        // Remove active class from all items
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.classList.remove('active');
            item.setAttribute('aria-selected', 'false');
        });
        
        // Add active class to selected item
        selectedItem.classList.add('active');
        selectedItem.setAttribute('aria-selected', 'true');
        
        // Update current phase
        this.currentPhase = selectedItem.dataset.phase;
        
        // Animate selection
        this.animateTimelineSelection(selectedItem);
    }

    updateViewControlButtons(activeBtn) {
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-pressed', 'true');
        
        this.currentView = activeBtn.dataset.view;
    }

    animateTimelineSelection(item) {
        // Add selection animation
        item.style.animation = 'none';
        item.offsetHeight; // Trigger reflow
        item.style.animation = 'pulse 0.6s ease-out';
        
        setTimeout(() => {
            item.style.animation = '';
        }, 600);
    }

    // Responsive Design
    adjustLayoutForScreenSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        if (width <= 768) {
            this.enableMobileLayout();
        } else {
            this.enableDesktopLayout();
        }
        
        // Update 3D renderer if initialized
        if (this.masterPlan3D) {
            this.masterPlan3D.handleResize();
        }
    }

    adjustLayoutForOrientation() {
        const isLandscape = window.innerWidth > window.innerHeight;
        
        if (this.isMobile()) {
            if (isLandscape) {
                this.enableMobileLandscapeLayout();
            } else {
                this.enableMobilePortraitLayout();
            }
        }
    }

    enableMobileLayout() {
        document.body.classList.add('mobile-layout');
        
        // Adjust timeline panel height
        const timelinePanel = document.querySelector('.timeline-panel');
        if (timelinePanel) {
            timelinePanel.style.maxHeight = '40vh';
        }
        
        // Hide some controls on very small screens
        if (window.innerWidth <= 480) {
            this.hideSecondaryControls();
        }
    }

    enableDesktopLayout() {
        document.body.classList.remove('mobile-layout');
        
        // Reset timeline panel
        const timelinePanel = document.querySelector('.timeline-panel');
        if (timelinePanel) {
            timelinePanel.style.maxHeight = '';
        }
        
        this.showSecondaryControls();
    }

    enableMobileLandscapeLayout() {
        document.body.classList.add('mobile-landscape');
        
        // Optimize for landscape viewing
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            mainContainer.style.gridTemplateColumns = '1fr 300px';
        }
    }

    enableMobilePortraitLayout() {
        document.body.classList.remove('mobile-landscape');
        
        // Reset to portrait layout
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            mainContainer.style.gridTemplateColumns = '';
        }
    }

    hideSecondaryControls() {
        const controls = document.querySelectorAll('.control-btn:not([data-view="overview"])');
        controls.forEach(control => {
            control.style.display = 'none';
        });
    }

    showSecondaryControls() {
        const controls = document.querySelectorAll('.control-btn');
        controls.forEach(control => {
            control.style.display = '';
        });
    }

    // Accessibility
    setupAccessibility() {
        // Add ARIA labels
        this.setupAriaLabels();
        
        // Add keyboard navigation hints
        this.setupKeyboardHints();
        
        // Setup screen reader announcements
        this.setupScreenReaderSupport();
        
        // Add focus management
        this.setupFocusManagement();
    }

    setupAriaLabels() {
        // Timeline items
        document.querySelectorAll('.timeline-item').forEach((item, index) => {
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
            item.setAttribute('aria-label', `Development phase ${index + 1}`);
            item.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        });

        // View controls
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.setAttribute('role', 'button');
            btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
        });

        // 3D container
        const container = document.getElementById('threejs-container');
        if (container) {
            container.setAttribute('role', 'img');
            container.setAttribute('aria-label', '3D visualization of HEART Technology Park master plan');
        }
    }

    setupKeyboardHints() {
        // Add keyboard shortcut indicators
        const helpButton = this.createHelpButton();
        document.querySelector('.viewer-controls')?.appendChild(helpButton);
    }

    setupScreenReaderSupport() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
        
        this.liveRegion = liveRegion;
    }

    setupFocusManagement() {
        // Ensure focus is visible
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
        }
    }

    // Performance Monitoring
    setupPerformanceMonitoring() {
        // Monitor frame rate
        this.setupFPSMonitoring();
        
        // Monitor memory usage
        this.setupMemoryMonitoring();
        
        // Monitor user interactions
        this.setupInteractionMonitoring();
    }

    setupFPSMonitoring() {
        // FPS counter is handled by the 3D class
        const indicator = document.createElement('div');
        indicator.className = 'performance-indicator';
        indicator.textContent = 'Loading...';
        document.querySelector('.viewer-container')?.appendChild(indicator);
    }

    setupMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                console.log(`💾 Memory: ${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB used`);
            }, 10000);
        }
    }

    setupInteractionMonitoring() {
        let interactionCount = 0;
        
        document.addEventListener('click', () => {
            interactionCount++;
        });
        
        // Log interaction stats every minute
        setInterval(() => {
            console.log(`🎯 Interactions in last minute: ${interactionCount}`);
            interactionCount = 0;
        }, 60000);
    }

    // Utility Methods
    selectPhase(phase) {
        const phaseItem = document.querySelector(`[data-phase="${phase}"]`);
        if (phaseItem) {
            this.handleTimelineSelection(phaseItem, 0);
        }
    }

    selectView(view) {
        const viewBtn = document.querySelector(`[data-view="${view}"]`);
        if (viewBtn) {
            this.handleViewControl(viewBtn);
        }
    }

    resetView() {
        this.selectView('overview');
        this.selectPhase('phase1');
    }

    toggleHelp() {
        // Implementation for help overlay
        console.log('Help overlay toggle');
    }

    createHelpButton() {
        const btn = document.createElement('button');
        btn.className = 'control-btn';
        btn.textContent = '?';
        btn.setAttribute('aria-label', 'Show keyboard shortcuts');
        btn.addEventListener('click', () => this.toggleHelp());
        return btn;
    }

    createRippleEffect(e, element) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.touches[0].clientX - rect.left - size / 2;
        const y = e.touches[0].clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    updateURL(phase) {
        if (history.pushState) {
            history.pushState(null, null, `#${phase}`);
        }
    }

    showPhasePreview(phase) {
        // Implementation for phase preview
    }

    hidePhasePreview() {
        // Implementation for hiding phase preview
    }

    showError(message) {
        console.error(message);
        // Implementation for error display
    }

    isMobile() {
        return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Cleanup
    cleanup() {
        if (this.masterPlan3D) {
            this.masterPlan3D.dispose();
        }
        
        // Remove event listeners
        // (Most are automatically cleaned up on page unload)
        
        console.log('🧹 UI resources cleaned up');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.masterPlanUI = new MasterPlanUI();
});

// Handle hash changes for direct linking
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash.startsWith('phase') && window.masterPlanUI) {
        window.masterPlanUI.selectPhase(hash);
    }
});

// Export for external use
window.MasterPlanUI = MasterPlanUI;