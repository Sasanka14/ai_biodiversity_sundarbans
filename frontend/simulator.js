/**
 * Sundarbans Biodiversity AI - Premium Simulator
 * Advanced Climate Simulation Interface
 */

// ============================================
// CONFIGURATION
// ============================================

// 🔴 IMPORTANT: Replace with your Render backend URL after deployment
const API_BASE_URL = 'https://YOUR-RENDER-APP-NAME.onrender.com';
// For local development, use: 'http://localhost:3005'


const DEFAULT_VALUES = {
    air_temperature: 28,
    humidity: 70,
    temp_lag_3: 27,
    hum_lag_3: 72,
    T2M_lag_1: 28,
    RH2M_lag_1: 70,
    T2M_lag_3: 27,
    RH2M_lag_3: 72,
    T2M_lag_6: 26,
    RH2M_lag_6: 75
};

// ============================================
// STATE
// ============================================

let lastResults = null;
let isSimulating = false;
let currentPage = 1;
const totalPages = 3;

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
    simulateBtn: document.getElementById('simulateBtn'),
    resetBtn: document.getElementById('resetBtn'),
    exportBtn: document.getElementById('exportBtn'),
    loading: document.getElementById('loading'),
    resultsContent: document.getElementById('results-content'),
    initialState: document.getElementById('initial-state'),
    gaugeNeedle: document.getElementById('gauge-needle'),
    riskBadge: document.getElementById('risk-badge'),
    riskLevel: document.getElementById('risk-level'),
    riskMessage: document.getElementById('risk-message'),
    healthFill: document.getElementById('health-fill'),
    baselineValue: document.getElementById('baseline-value'),
    predictionValue: document.getElementById('prediction-value'),
    deltaValue: document.getElementById('delta-value'),
    interpretationText: document.getElementById('interpretation-text'),
    conservationList: document.getElementById('conservation-list'),
    prevPageBtn: document.getElementById('prevPageBtn'),
    nextPageBtn: document.getElementById('nextPageBtn'),
    pageProgressFill: document.getElementById('page-progress-fill')
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initSliders();
    initTabs();
    initPagination();
    initEventListeners();
    console.log('🌿 Sundarbans Biodiversity AI Simulator initialized');
    
console.log('🔗 API Endpoint:', API_BASE_URL);

});

// ============================================
// PARTICLE ANIMATION
// ============================================

function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particle.style.opacity = (0.1 + Math.random() * 0.3);
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// ============================================
// SLIDER INITIALIZATION
// ============================================

function initSliders() {
    const sliders = document.querySelectorAll('.premium-slider');
    
    sliders.forEach(slider => {
        updateSliderTrack(slider);
        updateValueDisplay(slider);
        
        slider.addEventListener('input', (e) => {
            updateSliderTrack(e.target);
            updateValueDisplay(e.target);
        });
    });
}

function updateSliderTrack(slider) {
    const track = document.getElementById(`${slider.id}_track`);
    if (!track) return;
    
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const value = parseFloat(slider.value);
    const percentage = ((value - min) / (max - min)) * 100;
    
    track.style.width = percentage + '%';
}

function updateValueDisplay(slider) {
    const display = document.getElementById(`${slider.id}_value`);
    if (!display) return;
    
    display.textContent = slider.value;
    
    // Animate the value change
    display.style.transform = 'scale(1.1)';
    setTimeout(() => {
        display.style.transform = 'scale(1)';
    }, 150);
}

// ============================================
// TAB NAVIGATION
// ============================================

function initTabs() {
    const tabs = document.querySelectorAll('.param-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Hide all tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Activate clicked tab
            tab.classList.add('active');
            
            // Show corresponding content
            const tabId = tab.getAttribute('data-tab');
            const content = document.getElementById(`tab-${tabId}`);
            if (content) {
                content.classList.add('active');
            }
        });
    });
}

// ============================================
// PAGINATION SYSTEM
// ============================================

function initPagination() {
    // Navigation buttons
    elements.prevPageBtn?.addEventListener('click', () => navigateToPage(currentPage - 1));
    elements.nextPageBtn?.addEventListener('click', () => navigateToPage(currentPage + 1));
    
    // Page dots
    const pageDots = document.querySelectorAll('.page-dot');
    pageDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const page = parseInt(dot.getAttribute('data-page'));
            navigateToPage(page);
        });
    });
    
    updatePaginationUI();
}

function navigateToPage(page) {
    if (page < 1 || page > totalPages) return;
    
    // Hide current page
    const currentPageEl = document.getElementById(`results-page-${currentPage}`);
    if (currentPageEl) {
        currentPageEl.classList.remove('active');
    }
    
    // Update state
    currentPage = page;
    
    // Show new page
    const newPageEl = document.getElementById(`results-page-${currentPage}`);
    if (newPageEl) {
        newPageEl.classList.add('active');
    }
    
    updatePaginationUI();
}

function updatePaginationUI() {
    // Update page dots
    const pageDots = document.querySelectorAll('.page-dot');
    pageDots.forEach(dot => {
        const page = parseInt(dot.getAttribute('data-page'));
        dot.classList.toggle('active', page === currentPage);
    });
    
    // Update navigation buttons
    if (elements.prevPageBtn) {
        elements.prevPageBtn.disabled = currentPage === 1;
    }
    if (elements.nextPageBtn) {
        elements.nextPageBtn.disabled = currentPage === totalPages;
    }
    
    // Update progress bar
    if (elements.pageProgressFill) {
        const progress = (currentPage / totalPages) * 100;
        elements.pageProgressFill.style.width = `${progress}%`;
    }
}

function resetPagination() {
    currentPage = 1;
    navigateToPage(1);
}

// ============================================
// EVENT LISTENERS
// ============================================

function initEventListeners() {
    elements.simulateBtn?.addEventListener('click', runSimulation);
    elements.resetBtn?.addEventListener('click', resetValues);
    elements.exportBtn?.addEventListener('click', exportResults);
}

// ============================================
// SIMULATION
// ============================================

function getParameterValues() {
    const params = {};
    
    Object.keys(DEFAULT_VALUES).forEach(key => {
        const slider = document.getElementById(key);
        if (slider) {
            params[key] = parseFloat(slider.value);
        }
    });
    
    return params;
}

async function runSimulation() {
    if (isSimulating) return;
    
    const params = getParameterValues();
    isSimulating = true;
    
    // Update UI state
    elements.initialState.style.display = 'none';
    elements.resultsContent.classList.remove('visible');
    elements.loading.style.display = 'block';
    elements.simulateBtn.disabled = true;
    elements.simulateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Processing...</span>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/simulate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        lastResults = { params, ...data };
        
        // Simulate processing time for better UX
        await new Promise(resolve => setTimeout(resolve, 800));
        
        displayResults(data);
        
    } catch (error) {
        console.error('Simulation error:', error);
        showError(
  'Unable to connect to the simulation server. Please ensure the backend is running at ' +
  API_BASE_URL
);
    } finally {
        elements.loading.style.display = 'none';
        elements.simulateBtn.disabled = false;
        elements.simulateBtn.innerHTML = '<i class="fas fa-play"></i> <span>Run Simulation</span> <div class="btn-glow"></div>';
        isSimulating = false;
    }
}

// ============================================
// RESULTS DISPLAY
// ============================================

function displayResults(results) {
    // Reset to page 1
    resetPagination();
    
    // Animate metric values
    animateValue(elements.baselineValue, 0, results.baseline, 1000);
    animateValue(elements.predictionValue, 0, results.prediction, 1000);
    animateValue(elements.deltaValue, 0, results.delta, 1000, true);
    
    // Update risk gauge
    updateRiskGauge(results.delta, results.risk_level);
    
    // Update ecosystem health
    updateEcosystemHealth(results.delta);
    
    // Update interpretation
    updateInterpretation(results);
    
    // Update conservation recommendations
    updateConservationRecommendations(results);
    
    // Show results with animation
    elements.resultsContent.classList.add('visible');
}

function animateValue(element, start, end, duration, showSign = false) {
    if (!element) return;
    
    const startTime = performance.now();
    const startValue = start;
    const endValue = end;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = startValue + (endValue - startValue) * easeOutQuart;
        
        if (showSign && current > 0) {
            element.textContent = '+' + current.toFixed(2);
        } else {
            element.textContent = current.toFixed(2);
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function updateRiskGauge(delta, riskLevel) {
    // Calculate needle angle (-90 to 90 degrees)
    // Low risk = -90, High risk = 90
    let angle;
    if (delta > 0) {
        angle = -80; // Very low risk
    } else if (delta > -5) {
        angle = -60 + ((-delta) / 5) * 40; // Low risk range
    } else if (delta > -15) {
        angle = -20 + ((- delta - 5) / 10) * 50; // Moderate risk range
    } else {
        angle = Math.min(80, 30 + ((-delta - 15) / 10) * 50); // High risk range
    }
    
    elements.gaugeNeedle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    
    // Update risk badge
    elements.riskBadge.className = 'risk-badge';
    elements.riskLevel.textContent = riskLevel;
    
    let message = '';
    
    if (riskLevel === 'High Risk') {
        elements.riskBadge.classList.add('high');
        message = 'Critical ecosystem stress detected. The simulated climate conditions pose a severe threat to species diversity. Immediate conservation intervention is strongly recommended.';
    } else if (riskLevel === 'Moderate Risk') {
        elements.riskBadge.classList.add('moderate');
        message = 'Moderate ecosystem pressure identified. Species richness is notably affected under these conditions. Implement adaptive management strategies and increase monitoring frequency.';
    } else {
        elements.riskBadge.classList.add('low');
        message = 'Ecosystem demonstrates resilience to the simulated conditions. Current conservation efforts appear sufficient. Continue monitoring for early warning signs.';
    }
    
    elements.riskMessage.textContent = message;
}

function updateEcosystemHealth(delta) {
    // Convert delta to health percentage (0-100)
    // delta > 0 = 100%, delta < -20 = 0%
    let health;
    if (delta >= 0) {
        health = 100;
    } else if (delta < -20) {
        health = Math.max(10, 20 + delta);
    } else {
        health = 100 + (delta * 4);
    }
    
    health = Math.max(10, Math.min(100, health));
    elements.healthFill.style.width = health + '%';
}

function updateInterpretation(results) {
    const deltaPercent = Math.abs((results.delta / results.baseline) * 100).toFixed(1);
    const direction = results.delta >= 0 ? 'increase' : 'decrease';
    
    let interpretation = `Based on the simulated climate parameters, our AI model predicts a species richness index of ${results.prediction.toFixed(2)}, `;
    interpretation += `compared to the baseline of ${results.baseline.toFixed(2)}. `;
    interpretation += `This represents a ${deltaPercent}% ${direction} in biodiversity (Δ = ${results.delta >= 0 ? '+' : ''}${results.delta.toFixed(2)}). `;
    
    if (results.risk_level === 'High Risk') {
        interpretation += `The ecosystem is under significant stress. Key indicator species may face population decline, and habitat connectivity could be compromised.`;
    } else if (results.risk_level === 'Moderate Risk') {
        interpretation += `Some species may experience habitat pressure. Proactive conservation measures can help mitigate potential impacts.`;
    } else {
        interpretation += `The mangrove ecosystem shows strong adaptive capacity under these conditions. Biodiversity indicators remain within healthy ranges.`;
    }
    
    elements.interpretationText.textContent = interpretation;
}

function updateConservationRecommendations(results) {
    if (!elements.conservationList) return;
    
    let recommendations = [];
    
    if (results.risk_level === 'High Risk') {
        recommendations = [
            { icon: 'fa-exclamation-circle', text: 'Implement emergency habitat protection protocols immediately' },
            { icon: 'fa-tree', text: 'Increase mangrove reforestation efforts in vulnerable zones' },
            { icon: 'fa-water', text: 'Monitor water salinity levels and establish freshwater reserves' },
            { icon: 'fa-fish', text: 'Activate species relocation programs for endangered fauna' },
            { icon: 'fa-users', text: 'Engage local communities in rapid response conservation initiatives' }
        ];
    } else if (results.risk_level === 'Moderate Risk') {
        recommendations = [
            { icon: 'fa-shield-alt', text: 'Enhance existing conservation buffer zones' },
            { icon: 'fa-seedling', text: 'Continue mangrove nursery development programs' },
            { icon: 'fa-binoculars', text: 'Increase wildlife monitoring frequency in sensitive areas' },
            { icon: 'fa-hand-holding-water', text: 'Implement sustainable water management practices' }
        ];
    } else {
        recommendations = [
            { icon: 'fa-check-circle', text: 'Maintain current conservation efforts and monitoring schedules' },
            { icon: 'fa-chart-line', text: 'Continue long-term ecological data collection' },
            { icon: 'fa-graduation-cap', text: 'Expand community education and eco-tourism programs' },
            { icon: 'fa-leaf', text: 'Focus on habitat connectivity enhancement projects' }
        ];
    }
    
    elements.conservationList.innerHTML = recommendations
        .map(rec => `<li><i class="fas ${rec.icon}"></i> <span>${rec.text}</span></li>`)
        .join('');
}

// ============================================
// ERROR HANDLING
// ============================================

function showError(message) {
    elements.loading.style.display = 'none';
    elements.initialState.style.display = 'none';
    
    const errorHTML = `
        <div style="text-align: center; padding: 60px 30px;">
            <div style="width: 80px; height: 80px; background: rgba(239, 68, 68, 0.1); border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px; font-size: 32px; color: #ef4444;">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3 style="font-size: 18px; font-weight: 700; color: white; margin-bottom: 15px;">Connection Error</h3>
            <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6); line-height: 1.7; max-width: 350px; margin: 0 auto;">${message}</p>
            <button onclick="location.reload()" style="margin-top: 25px; padding: 12px 30px; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.5); border-radius: 10px; color: #ef4444; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                <i class="fas fa-redo" style="margin-right: 8px;"></i>Retry
            </button>
        </div>
    `;
    
    elements.resultsContent.innerHTML = errorHTML;
    elements.resultsContent.classList.add('visible');
}

// ============================================
// RESET VALUES
// ============================================

function resetValues() {
    Object.entries(DEFAULT_VALUES).forEach(([key, value]) => {
        const slider = document.getElementById(key);
        if (slider) {
            slider.value = value;
            updateSliderTrack(slider);
            updateValueDisplay(slider);
        }
    });
    
    // Reset results display
    elements.resultsContent.classList.remove('visible');
    elements.initialState.style.display = 'block';
    lastResults = null;
    
    // Reset pagination
    resetPagination();
    
    // Visual feedback
    elements.resetBtn.innerHTML = '<i class="fas fa-check"></i> <span>Reset!</span>';
    setTimeout(() => {
        elements.resetBtn.innerHTML = '<i class="fas fa-undo"></i> <span>Reset</span>';
    }, 1000);
}

// ============================================
// EXPORT RESULTS
// ============================================

function exportResults() {
    if (!lastResults) {
        alert('No simulation results to export. Please run a simulation first.');
        return;
    }

    const exportData = {
        metadata: {
            exported_at: new Date().toISOString(),
            source: 'Sundarbans Biodiversity AI Simulator',
            version: '2.0'
        },
        parameters: lastResults.params,
        results: {
            baseline_richness: lastResults.baseline,
            predicted_richness: lastResults.prediction,
            change_delta: lastResults.delta,
            risk_level: lastResults.risk_level,
            risk_assessment: getRiskAssessmentText(lastResults.risk_level)
        },
        analysis: {
            percentage_change: ((lastResults.delta / lastResults.baseline) * 100).toFixed(2) + '%',
            direction: lastResults.delta >= 0 ? 'increase' : 'decrease',
            ecosystem_health_index: Math.max(10, Math.min(100, 100 + (lastResults.delta * 4))).toFixed(1) + '%'
        }
    };

    // Create and download file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sundarbans-simulation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Visual feedback
    elements.exportBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
    setTimeout(() => {
        elements.exportBtn.innerHTML = '<i class="fas fa-file-export"></i> Export Analysis Report';
    }, 2000);
}

function getRiskAssessmentText(riskLevel) {
    const assessments = {
        'High Risk': 'Critical ecosystem stress detected. Immediate conservation intervention strongly recommended.',
        'Moderate Risk': 'Moderate ecosystem pressure identified. Adaptive management strategies recommended.',
        'Low Risk': 'Ecosystem demonstrates resilience. Current conservation efforts appear sufficient.'
    };
    return assessments[riskLevel] || 'Unknown risk level';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
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

console.log('✅ Simulator script loaded successfully');
