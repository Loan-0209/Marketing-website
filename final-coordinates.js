/**
 * FINAL OPTIMIZED COORDINATES FOR PRODUCTION
 * Generated from automated testing and manual verification
 * Date: July 18, 2025
 */

const OPTIMIZED_COORDINATES = {
    // Map settings
    viewBox: "0 0 1000 600",
    preserveAspectRatio: "xMidYMid slice",
    
    // Facilities with optimized positions
    facilities: {
        // Hydro Power Plant - Left side (Blue icon area)
        "hydro-plant": {
            type: "rect",
            x: 70,          // Adjusted from test: was 80
            y: 300,         // Adjusted from test: was 290  
            width: 40,      // Increased from 35 for better visibility
            height: 40,     // Increased from 35 for better visibility
            rx: 8,
            ry: 8,
            text: {
                x: 90,      // Center of rect
                y: 325,     // Center + text offset
                content: "HYDRO",
                fontSize: 10,
                fill: "#3498db"
            },
            color: {
                stroke: "#3498db",
                fill: "rgba(52, 152, 219, 0.1)"
            }
        },
        
        // 500kV Substation - Center (Red icon area)
        "500kv-substation": {
            type: "rect", 
            x: 490,         // Adjusted from test: was 485
            y: 275,         // Adjusted from test: was 285
            width: 35,      // Increased from 30
            height: 35,     // Increased from 30
            rx: 6,
            ry: 6,
            text: {
                x: 507.5,   // Center of rect
                y: 297,     // Center + text offset
                content: "500kV",
                fontSize: 10,
                fill: "#e74c3c"
            },
            color: {
                stroke: "#e74c3c", 
                fill: "rgba(231, 76, 60, 0.1)"
            }
        },
        
        // 110kV La Son Substation - Top right (Orange icon area)
        "110kv-substation": {
            type: "rect",
            x: 870,         // Adjusted from test: was 850  
            y: 160,         // Adjusted from test: was 150
            width: 30,      // Increased from 25
            height: 30,     // Increased from 25
            rx: 6,
            ry: 6,
            text: {
                x: 885,     // Center of rect
                y: 178,     // Center + text offset
                content: "110kV",
                fontSize: 9,
                fill: "#f39c12"
            },
            color: {
                stroke: "#f39c12",
                fill: "rgba(243, 156, 18, 0.1)"
            }
        },
        
        // Data Center - Right side (Green icon area)
        "data-center": {
            type: "rect",
            x: 830,         // Adjusted from test: was 820
            y: 350,         // Adjusted from test: was 340
            width: 35,      // Increased from 30
            height: 35,     // Increased from 30
            rx: 6,
            ry: 6,
            text: {
                x: 847.5,   // Center of rect
                y: 372,     // Center + text offset
                content: "DC",
                fontSize: 10,
                fill: "#27ae60"
            },
            color: {
                stroke: "#27ae60",
                fill: "rgba(39, 174, 96, 0.1)"
            }
        },
        
        // Tech Park Boundary - Central area
        "tech-park": {
            type: "rect",
            x: 420,         // Adjusted from test: was 410
            y: 250,         // Adjusted from test: was 240
            width: 170,     // Reduced from 180 to avoid overlap
            height: 110,    // Reduced from 120 to avoid overlap
            rx: 12,
            ry: 12,
            color: {
                stroke: "#2ecc71",
                fill: "rgba(46, 204, 113, 0.05)"
            }
        },
        
        // Transmission Points - Strategic positions
        "transmission-points": [
            {
                type: "circle",
                cx: 290,        // Adjusted from test: was 280
                cy: 225,        // Adjusted from test: was 220
                r: 8,           // Increased from 6 for better visibility
                color: {
                    stroke: "#e74c3c",
                    fill: "rgba(231, 76, 60, 0.2)"
                }
            },
            {
                type: "circle", 
                cx: 730,        // Adjusted from test: was 720
                cy: 255,        // Adjusted from test: was 250
                r: 8,           // Increased from 6 for better visibility
                color: {
                    stroke: "#e74c3c",
                    fill: "rgba(231, 76, 60, 0.2)"
                }
            },
            {
                type: "circle",
                cx: 330,        // New transmission point
                cy: 415,        
                r: 8,
                color: {
                    stroke: "#3498db",
                    fill: "rgba(52, 152, 219, 0.2)"
                }
            },
            {
                type: "circle",
                cx: 690,        // New transmission point
                cy: 440,        
                r: 8,
                color: {
                    stroke: "#3498db", 
                    fill: "rgba(52, 152, 219, 0.2)"
                }
            }
        ]
    },
    
    // Validation rules
    validation: {
        minDistance: 25,        // Minimum distance between facilities
        boundaryPadding: 10,    // Padding from map edges
        maxOverlapTolerance: 5  // Maximum allowed overlap
    },
    
    // Performance settings
    performance: {
        transitionDuration: "0.3s",
        transitionEasing: "ease",
        transformOrigin: "center",
        hoverScale: 1.05
    }
};

/**
 * Generate SVG string for a facility
 */
function generateFacilitySVG(facilityName, facilityData) {
    const { type, color, text } = facilityData;
    let svgElements = [];
    
    if (type === "rect") {
        const { x, y, width, height, rx, ry } = facilityData;
        svgElements.push(`
        <g class="facility-group" data-facility="${facilityName}" data-name="${text?.content || facilityName}">
            <rect class="facility-border" 
                  x="${x}" y="${y}" 
                  width="${width}" height="${height}" 
                  rx="${rx}" ry="${ry}"/>
            ${text ? `<text x="${text.x}" y="${text.y}" text-anchor="middle" font-size="${text.fontSize}" fill="${text.fill}" font-weight="bold">${text.content}</text>` : ''}
        </g>`);
    } else if (type === "circle") {
        const { cx, cy, r } = facilityData;
        svgElements.push(`
        <g class="facility-group" data-facility="${facilityName}">
            <circle class="facility-border" 
                    cx="${cx}" cy="${cy}" r="${r}"/>
        </g>`);
    }
    
    return svgElements.join('\n');
}

/**
 * Generate complete SVG overlay
 */
function generateCompleteSVG() {
    const { viewBox, preserveAspectRatio, facilities } = OPTIMIZED_COORDINATES;
    
    let svgContent = [`<svg viewBox="${viewBox}" preserveAspectRatio="${preserveAspectRatio}" class="icon-overlay">`];
    
    // Add facilities
    Object.entries(facilities).forEach(([name, data]) => {
        if (name === "transmission-points") {
            data.forEach((point, index) => {
                svgContent.push(generateFacilitySVG(`transmission-point-${index}`, point));
            });
        } else {
            svgContent.push(generateFacilitySVG(name, data));
        }
    });
    
    svgContent.push('</svg>');
    return svgContent.join('\n');
}

/**
 * Generate CSS for optimized styling
 */
function generateOptimizedCSS() {
    const { performance } = OPTIMIZED_COORDINATES;
    
    return `
/* OPTIMIZED SVG POSITIONING SYSTEM */
.svg-icon-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
}

.svg-icon-overlay svg {
    width: 100%;
    height: 100%;
}

.facility-group {
    pointer-events: all;
    cursor: pointer;
    transition: all ${performance.transitionDuration} ${performance.transitionEasing};
    transform-origin: ${performance.transformOrigin};
}

.facility-border {
    fill: transparent;
    stroke-width: 3;
    transition: all ${performance.transitionDuration} ${performance.transitionEasing};
}

.facility-group:hover .facility-border {
    stroke-width: 4;
    filter: drop-shadow(0 0 10px currentColor);
}

.facility-group:hover {
    transform: scale(${performance.hoverScale});
}

/* Facility-specific colors */
${Object.entries(OPTIMIZED_COORDINATES.facilities).map(([name, data]) => {
    if (data.color && name !== "transmission-points") {
        return `.facility-group[data-facility="${name}"] .facility-border {
    stroke: ${data.color.stroke};
    fill: ${data.color.fill};
}`;
    }
    return '';
}).filter(Boolean).join('\n\n')}

/* Responsive scaling */
@media (max-width: 768px) {
    .facility-border {
        stroke-width: 2;
    }
    .facility-group:hover .facility-border {
        stroke-width: 3;
    }
    .facility-group:hover {
        transform: scale(1.03);
    }
}

/* Animation classes */
.facility-group.active .facility-border {
    animation: facilityPulse 2s ease-in-out infinite;
}

@keyframes facilityPulse {
    0%, 100% {
        opacity: 1;
        filter: drop-shadow(0 0 5px currentColor);
    }
    50% {
        opacity: 0.8;
        filter: drop-shadow(0 0 15px currentColor);
    }
}
`;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        OPTIMIZED_COORDINATES,
        generateFacilitySVG,
        generateCompleteSVG,
        generateOptimizedCSS
    };
} else if (typeof window !== 'undefined') {
    window.OPTIMIZED_COORDINATES = OPTIMIZED_COORDINATES;
    window.generateCompleteSVG = generateCompleteSVG;
    window.generateOptimizedCSS = generateOptimizedCSS;
}
