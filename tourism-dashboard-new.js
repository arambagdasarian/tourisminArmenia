// ============================================================================
// Armenia Tourism Dashboard - Complete JavaScript
// Version: 2.0 - Clean Build
// ============================================================================

console.log('🚀 Armenia Tourism Dashboard v2.0 - Loading...');

// ============================================================================
// CONFIGURATION
// ============================================================================

const DATA_ROOT = './data/';
const ARMENIA_COORDS = [40.1792, 44.4991];

// ============================================================================
// GLOBAL STATE
// ============================================================================

let map;
let currentYear = '2024';
let currentQuarter = 'ALL';
let currentMetric = 'tourists';
let currentView = 'flow';
let currentRegionFilter = 'all';
let currentTopCountries = 'all';
let showConnections = true;
let showLabels = false;

// Data storage
let tourismData = {}; // Quarterly data
let yearlyTourismData = {}; // Yearly aggregated data
let countryLayers = {};

// ============================================================================
// REGION CATEGORIZATION
// ============================================================================

const regionCategories = {
    'europe': ['Germany', 'France', 'United Kingdom', 'Italy', 'Spain', 'Netherlands', 
               'Poland', 'Czechia', 'Greece', 'Switzerland', 'Austria', 'Belgium', 
               'Norway', 'Sweden', 'Denmark', 'Finland'],
    'asia': ['China', 'India', 'Japan', 'South Korea'],
    'americas': ['United States', 'Canada'],
    'middle-east': ['Iran', 'Israel', 'Lebanon', 'UAE', 'Qatar', 'Kuwait', 'Saudi Arabia', 'Iraq'],
    'post-soviet': ['Russia', 'Georgia', 'Kazakhstan', 'Belarus', 'Ukraine', 'Uzbekistan', 
                    'Kyrgyzstan', 'Tajikistan', 'Armenian Diaspora (non-resident)']
};

// ============================================================================
// COUNTRY COORDINATES
// ============================================================================

const countryCoordinates = {
    'Russia': [55.7558, 37.6176],
    'Georgia': [41.7151, 44.8271],
    'Iran': [35.6892, 51.3890],
    'United States': [38.9072, -77.0369],
    'Germany': [52.5200, 13.4050],
    'France': [48.8566, 2.3522],
    'United Kingdom': [51.5074, -0.1278],
    'Italy': [41.9028, 12.4964],
    'Spain': [40.4168, -3.7038],
    'Netherlands': [52.3676, 4.9041],
    'Poland': [52.2297, 21.0122],
    'Czechia': [50.0755, 14.4378],
    'Greece': [37.9838, 23.7275],
    'Switzerland': [46.9481, 7.4474],
    'Austria': [48.2082, 16.3738],
    'Belgium': [50.8503, 4.3517],
    'Norway': [59.9139, 10.7522],
    'Sweden': [59.3293, 18.0686],
    'Denmark': [55.6761, 12.5683],
    'Finland': [60.1699, 24.9384],
    'Canada': [45.4215, -75.6972],
    'China': [39.9042, 116.4074],
    'India': [28.6139, 77.2090],
    'Japan': [35.6762, 139.6503],
    'South Korea': [37.5665, 126.9780],
    'Israel': [31.7683, 35.2137],
    'Lebanon': [33.8938, 35.5018],
    'UAE': [24.4539, 54.3773],
    'Qatar': [25.2764, 51.5205],
    'Kuwait': [29.3117, 47.4818],
    'Saudi Arabia': [24.7136, 46.6753],
    'Iraq': [33.3152, 44.3661],
    'Kazakhstan': [51.1694, 71.4491],
    'Belarus': [53.9045, 27.5615],
    'Ukraine': [50.4501, 30.5234],
    'Uzbekistan': [41.3775, 64.5853],
    'Kyrgyzstan': [42.8746, 74.5698],
    'Tajikistan': [38.5598, 68.7870],
    'Armenian Diaspora (non-resident)': ARMENIA_COORDS,
    'Other': ARMENIA_COORDS
};

// ============================================================================
// DATA LOADING
// ============================================================================

async function loadQuarterlyData() {
    try {
        console.log('📊 Loading quarterly data from CSV...');
        const response = await fetch(`${DATA_ROOT}armenia_inbound_tourism_by_country_quarter_2019q1_2025q3.csv`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const csvText = await response.text();
        const lines = csvText.trim().split('\n');
        
        // Skip header
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            if (values.length >= 4) {
                const quarter = values[0];
                const country = values[1];
                const tourists = parseInt(values[2]);
                const spending = parseFloat(values[3]);
                
                // Skip Azerbaijan and Turkey
                if (country === 'Azerbaijan' || country === 'Turkey') continue;
                
                const [year, q] = quarter.split('-');
                
                if (!tourismData[year]) tourismData[year] = {};
                if (!tourismData[year][q]) tourismData[year][q] = {};
                
                tourismData[year][q][country] = {
                    tourists: tourists,
                    spending: spending,
                    coordinates: countryCoordinates[country] || ARMENIA_COORDS
                };
            }
        }
        
        console.log('✅ Quarterly data loaded:', Object.keys(tourismData).length, 'years');
        return true;
    } catch (error) {
        console.error('❌ Error loading quarterly data:', error);
        return false;
    }
}

async function loadYearlyData() {
    try {
        console.log('📊 Loading yearly data from CSV...');
        const response = await fetch(`${DATA_ROOT}armenia_inbound_tourism_yearly_2019_2025.csv`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const csvText = await response.text();
        const lines = csvText.trim().split('\n');
        
        // Skip header
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            if (values.length >= 4) {
                const year = values[0];
                const country = values[1];
                const tourists = parseInt(values[2]);
                const spending = parseFloat(values[3]);
                
                // Skip Azerbaijan and Turkey
                if (country === 'Azerbaijan' || country === 'Turkey') continue;
                
                if (!yearlyTourismData[year]) yearlyTourismData[year] = {};
                
                yearlyTourismData[year][country] = {
                    tourists: tourists,
                    spending: spending,
                    coordinates: countryCoordinates[country] || ARMENIA_COORDS
                };
            }
        }
        
        console.log('✅ Yearly data loaded:', Object.keys(yearlyTourismData).length, 'years');
        return true;
    } catch (error) {
        console.error('❌ Error loading yearly data:', error);
        return false;
    }
}

async function loadTourismData() {
    console.log('📊 Loading tourism data...');
    try {
        const [quarterlyLoaded, yearlyLoaded] = await Promise.all([
            loadQuarterlyData(),
            loadYearlyData()
        ]);
        
        if (quarterlyLoaded && yearlyLoaded) {
            console.log('✅ All data loaded successfully');
            updateMapData();
            updateStatistics();
            updateInsightCards();
            return true;
        } else {
            console.log('⚠️ One or both datasets failed to load');
            return false;
        }
    } catch (error) {
        console.error('❌ Error loading tourism data:', error);
        loadSampleData();
        updateMapData();
        updateStatistics();
        updateInsightCards();
        return false;
    }
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
            inQuotes = !inQuotes;
        } else if (line[i] === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += line[i];
        }
    }
    result.push(current.trim());
    return result;
}

function loadSampleData() {
    console.log('📊 Loading sample data...');
    
    tourismData = {
        '2024': {
            'Q1': {
                'Russia': { tourists: 143965, spending: 149005804.2, coordinates: [55.7558, 37.6176] },
                'Georgia': { tourists: 56457, spending: 35631179.05, coordinates: [41.7151, 44.8271] },
                'Iran': { tourists: 39520, spending: 31594190.7, coordinates: [35.6892, 51.3890] },
                'United States': { tourists: 16167, spending: 25344241.71, coordinates: [38.9072, -77.0369] },
                'Germany': { tourists: 10778, spending: 14808375.94, coordinates: [52.5200, 13.4050] }
            }
        }
    };
    
    yearlyTourismData = {
        '2024': {
            'Russia': { tourists: 575860, spending: 596023216.8, coordinates: [55.7558, 37.6176] },
            'Georgia': { tourists: 225828, spending: 142524716.2, coordinates: [41.7151, 44.8271] },
            'Iran': { tourists: 158080, spending: 126376762.8, coordinates: [35.6892, 51.3890] },
            'United States': { tourists: 64668, spending: 101376966.84, coordinates: [38.9072, -77.0369] },
            'Germany': { tourists: 43112, spending: 59233503.76, coordinates: [52.5200, 13.4050] }
        }
    };
    
    console.log('✅ Sample data loaded');
}

// ============================================================================
// MAP INITIALIZATION
// ============================================================================

function initMap() {
    console.log('🗺️ Initializing map...');
    
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('❌ Map element not found!');
        return;
    }
    
    try {
        map = L.map('map').setView([45, 25], 3);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
            minZoom: 2
        }).addTo(map);
        
        console.log('✅ Map initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing map:', error);
    }
}

// ============================================================================
// DATA RETRIEVAL
// ============================================================================

function getCurrentPeriodData() {
    console.log(`📊 Getting data for ${currentYear} ${currentQuarter}`);
    
    if (currentQuarter === 'ALL') {
        const yearData = yearlyTourismData[currentYear];
        if (!yearData) {
            console.warn('No yearly data for year:', currentYear);
            // Fallback to aggregating quarterly data
            const quarterlyData = tourismData[currentYear];
            if (!quarterlyData) return {};
            
            const aggregated = {};
            Object.keys(quarterlyData).forEach(quarter => {
                Object.keys(quarterlyData[quarter]).forEach(country => {
                    if (!aggregated[country]) {
                        aggregated[country] = { 
                            tourists: 0, 
                            spending: 0, 
                            coordinates: quarterlyData[quarter][country].coordinates 
                        };
                    }
                    aggregated[country].tourists += quarterlyData[quarter][country].tourists;
                    aggregated[country].spending += quarterlyData[quarter][country].spending;
                });
            });
            return aggregated;
        }
        return yearData;
    } else {
        const yearData = tourismData[currentYear];
        if (!yearData || !yearData[currentQuarter]) {
            console.warn('No quarterly data for:', currentYear, currentQuarter);
            return {};
        }
        return yearData[currentQuarter];
    }
}

function getTopCountries(periodData) {
    const entries = Object.entries(periodData);
    const filtered = currentRegionFilter === 'all' ? entries : 
        entries.filter(([country]) => regionCategories[currentRegionFilter]?.includes(country));
    
    const sorted = filtered.sort(([,a], [,b]) => b[currentMetric] - a[currentMetric]);
    
    if (currentTopCountries === 'all') return sorted;
    return sorted.slice(0, parseInt(currentTopCountries));
}

// ============================================================================
// MAP VISUALIZATION
// ============================================================================

function updateMapData() {
    console.log(`🗺️ Updating map: ${currentYear} ${currentQuarter} ${currentMetric}`);
    
    clearAllLayers();
    
    const periodData = getCurrentPeriodData();
    
    if (!periodData || Object.keys(periodData).length === 0) {
        console.warn('⚠️ No data available');
        showNoDataMessage();
        return;
    }
    
    const topCountries = getTopCountries(periodData);
    updateTopCountriesPanel(topCountries);
    
    // Always render flow view
    renderFlowView(periodData, topCountries);
    
    addArmeniaMarker();
    updateStatistics();
}

function clearAllLayers() {
    Object.values(countryLayers).forEach(layer => {
        if (layer.marker && map.hasLayer(layer.marker)) map.removeLayer(layer.marker);
        if (layer.line && map.hasLayer(layer.line)) map.removeLayer(layer.line);
    });
    countryLayers = {};
}

function renderFlowView(quarterData, topCountries) {
    topCountries.forEach(([country, data]) => {
        const color = getColor(data[currentMetric], currentMetric);
        const size = getMarkerSize(data[currentMetric], currentMetric);
        
        // Create flow line
        if (showConnections) {
            const line = L.polyline([data.coordinates, ARMENIA_COORDS], {
                color: color,
                weight: Math.max(2, size / 8),
                opacity: 0.7,
                className: 'flow-line'
            }).addTo(map);
            
            if (!countryLayers[country]) countryLayers[country] = {};
            countryLayers[country].line = line;
        }
        
        // Create marker
        const marker = L.circleMarker(data.coordinates, {
            radius: Math.max(5, size / 3),
            fillColor: color,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        
        marker.bindPopup(createPopupContent(country, data, currentMetric));
        
        if (showLabels) {
            const label = L.marker(data.coordinates, {
                icon: L.divIcon({
                    className: 'country-label',
                    html: `<div style="background: white; padding: 2px 6px; border-radius: 3px; font-size: 11px; font-weight: bold; white-space: nowrap;">${country}</div>`,
                    iconSize: [100, 20]
                })
            }).addTo(map);
            
            if (!countryLayers[country]) countryLayers[country] = {};
            countryLayers[country].label = label;
        }
        
        if (!countryLayers[country]) countryLayers[country] = {};
        countryLayers[country].marker = marker;
    });
}

function addArmeniaMarker() {
    const armeniaIcon = L.divIcon({
        html: '<div style="background-color: #000064; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">🇦🇲</div>',
        className: 'armenia-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
    
    const marker = L.marker(ARMENIA_COORDS, { icon: armeniaIcon }).addTo(map);
    marker.bindPopup('<strong>🇦🇲 Armenia</strong><br>Tourist Destination');
    countryLayers['armenia'] = { marker };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getColor(value, metric) {
    if (metric === 'tourists') {
        if (value > 100000) return '#2E8B57';
        if (value > 50000) return '#FFD700';
        if (value > 10000) return '#FFA500';
        return '#FF6B47';
    } else {
        if (value > 100000000) return '#2E8B57';
        if (value > 50000000) return '#FFD700';
        if (value > 10000000) return '#FFA500';
        return '#FF6B47';
    }
}

function getMarkerSize(value, metric) {
    if (metric === 'tourists') {
        if (value > 200000) return 40;
        if (value > 100000) return 32;
        if (value > 50000) return 24;
        if (value > 10000) return 16;
        return 10;
    } else {
        if (value > 200000000) return 40;
        if (value > 100000000) return 32;
        if (value > 50000000) return 24;
        if (value > 10000000) return 16;
        return 10;
    }
}

function createPopupContent(country, data, metric) {
    return `
        <div style="font-family: 'Lato', sans-serif; min-width: 200px;">
            <h6 style="color: #000064; margin: 0 0 8px 0; font-weight: 600;">${country}</h6>
            <div style="display: flex; justify-content: space-between; margin: 4px 0;">
                <span>Tourists:</span>
                <strong style="color: #000064;">${data.tourists.toLocaleString()}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 4px 0;">
                <span>Spending:</span>
                <strong style="color: #000064;">$${(data.spending / 1000000).toFixed(2)}M</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 4px 0;">
                <span>Avg/Tourist:</span>
                <strong style="color: #000064;">$${Math.round(data.spending / data.tourists).toLocaleString()}</strong>
            </div>
        </div>
    `;
}

function showNoDataMessage() {
    console.log('📊 Showing no data message');
    
    ['totalVisitors', 'totalSpending', 'avgSpending', 'topCountry', 'countryCount'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = 'No data available';
    });
    
    const topCountriesList = document.getElementById('topCountriesList');
    if (topCountriesList) {
        topCountriesList.innerHTML = '<div class="loading-spinner">No data available</div>';
    }
}

// ============================================================================
// UI UPDATES
// ============================================================================

function updateStatistics() {
    const periodData = getCurrentPeriodData();
    if (!periodData || Object.keys(periodData).length === 0) {
        showNoDataMessage();
        return;
    }
    
    const totalTourists = Object.values(periodData).reduce((sum, country) => sum + country.tourists, 0);
    const totalSpending = Object.values(periodData).reduce((sum, country) => sum + country.spending, 0);
    const avgSpending = totalTourists > 0 ? totalSpending / totalTourists : 0;
    
    const sortedCountries = Object.entries(periodData).sort(([,a], [,b]) => b.tourists - a.tourists);
    const topCountry = sortedCountries[0] ? sortedCountries[0][0] : 'N/A';
    const countryCount = sortedCountries.length;
    
    document.getElementById('totalVisitors').textContent = totalTourists.toLocaleString();
    document.getElementById('totalSpending').textContent = `$${(totalSpending / 1000000).toFixed(2)}M`;
    document.getElementById('avgSpending').textContent = `$${Math.round(avgSpending).toLocaleString()}`;
    document.getElementById('topCountry').textContent = topCountry;
    document.getElementById('countryCount').textContent = countryCount;
    
    const periodText = currentQuarter === 'ALL' ? currentYear : `${currentYear} ${currentQuarter}`;
    document.getElementById('statsTitle').textContent = periodText;
}

function updateTopCountriesPanel(topCountries) {
    const panel = document.getElementById('topCountriesList');
    if (!panel) return;
    
    if (topCountries.length === 0) {
        panel.innerHTML = '<div class="loading-spinner">No data available</div>';
        return;
    }
    
    panel.innerHTML = topCountries.map(([country, data], index) => `
        <div class="country-item">
            <span class="country-rank">${index + 1}</span>
            <span class="country-name">${country}</span>
            <span class="country-value">${data[currentMetric].toLocaleString()}</span>
        </div>
    `).join('');
}

function updateInsightCards() {
    console.log('📊 Updating insight cards');
    
    const periodData = getCurrentPeriodData();
    if (!periodData || Object.keys(periodData).length === 0) {
        return;
    }
    
    const countries = Object.keys(periodData);
    const totalTourists = countries.reduce((sum, country) => sum + (periodData[country].tourists || 0), 0);
    const totalSpending = countries.reduce((sum, country) => sum + (periodData[country].spending || 0), 0);
    
    if (totalTourists > 0) {
        const sortedCountries = countries.sort((a, b) => (periodData[b].tourists || 0) - (periodData[a].tourists || 0));
        const topCountry = sortedCountries[0];
        const topCountryTourists = periodData[topCountry].tourists || 0;
        const topCountryPercentage = Math.round((topCountryTourists / totalTourists) * 100);
        
        const leadingMarketsText = document.getElementById('leadingMarketsText');
        const leadingMarketsProgress = document.getElementById('leadingMarketsProgress');
        
        if (leadingMarketsText) {
            leadingMarketsText.textContent = `${topCountry} dominates with ${topCountryTourists.toLocaleString()} visitors (${topCountryPercentage}% of total), followed by ${sortedCountries[1] || 'other countries'}.`;
        }
        
        if (leadingMarketsProgress) {
            leadingMarketsProgress.style.width = `${topCountryPercentage}%`;
            leadingMarketsProgress.setAttribute('aria-valuenow', topCountryPercentage);
        }
    }
    
    // Tourism growth
    const previousYear = (parseInt(currentYear) - 1).toString();
    if (yearlyTourismData[currentYear] && yearlyTourismData[previousYear]) {
        const currentYearTotal = Object.values(yearlyTourismData[currentYear]).reduce((sum, c) => sum + (c.tourists || 0), 0);
        const previousYearTotal = Object.values(yearlyTourismData[previousYear]).reduce((sum, c) => sum + (c.tourists || 0), 0);
        
        if (previousYearTotal > 0) {
            const growthRate = ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100;
            const recoveryPercentage = Math.min(Math.max(growthRate + 50, 0), 100);
            
            const recoveryText = document.getElementById('recoveryText');
            const recoveryProgress = document.getElementById('recoveryProgress');
            
            if (recoveryText) {
                const growthText = growthRate > 0 ? `+${growthRate.toFixed(1)}%` : `${growthRate.toFixed(1)}%`;
                recoveryText.textContent = `Tourism shows ${growthText} growth from ${previousYear} to ${currentYear}, with ${currentYearTotal.toLocaleString()} total visitors.`;
            }
            
            if (recoveryProgress) {
                recoveryProgress.style.width = `${recoveryPercentage}%`;
                recoveryProgress.setAttribute('aria-valuenow', recoveryPercentage);
            }
        }
    }
    
    // Economic impact
    if (totalSpending > 0 && totalTourists > 0) {
        const avgSpendingPerTourist = totalSpending / totalTourists;
        const spendingInBillions = totalSpending / 1000000000;
        
        const economicImpactText = document.getElementById('economicImpactText');
        const economicImpactProgress = document.getElementById('economicImpactProgress');
        
        if (economicImpactText) {
            economicImpactText.textContent = `Tourism spending reached $${spendingInBillions.toFixed(2)}B in ${currentYear}, with average spending of $${avgSpendingPerTourist.toFixed(0)} per tourist.`;
        }
        
        if (economicImpactProgress) {
            const progressPercentage = Math.min((spendingInBillions / 3) * 100, 100);
            economicImpactProgress.style.width = `${progressPercentage}%`;
            economicImpactProgress.setAttribute('aria-valuenow', progressPercentage);
        }
    }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

function handleControlChange() {
    console.log('🎛️ Control change triggered');
    
    const yearSelect = document.getElementById('yearSelect');
    const quarterSelect = document.getElementById('quarterSelect');
    const metricSelect = document.getElementById('metricSelect');
    const regionFilter = document.getElementById('regionFilter');
    const topCountries = document.getElementById('topCountries');
    const connectionsToggle = document.getElementById('showConnections');
    const labelsToggle = document.getElementById('showLabels');
    
    if (yearSelect) currentYear = yearSelect.value;
    if (quarterSelect) currentQuarter = quarterSelect.value;
    if (metricSelect) currentMetric = metricSelect.value;
    if (regionFilter) currentRegionFilter = regionFilter.value;
    if (topCountries) currentTopCountries = topCountries.value;
    if (connectionsToggle) showConnections = connectionsToggle.checked;
    if (labelsToggle) showLabels = labelsToggle.checked;
    
    updateMapData();
    updateInsightCards();
}

function exportData() {
    const periodData = getCurrentPeriodData();
    const exportData = {
        year: currentYear,
        quarter: currentQuarter,
        metric: currentMetric,
        data: Object.entries(periodData).map(([country, data]) => ({
            country,
            tourists: data.tourists,
            spending: data.spending
        }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `armenia-tourism-${currentYear}-${currentQuarter}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function shareData() {
    const url = `${window.location.origin}${window.location.pathname}?year=${currentYear}&quarter=${currentQuarter}&metric=${currentMetric}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Armenia Tourism Dashboard',
            text: `Tourism data for ${currentYear} ${currentQuarter}`,
            url: url
        });
    } else {
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 DOM loaded, starting initialization...');
    
    try {
        initMap();
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('🔄 Loading sample data first...');
        loadSampleData();
        updateMapData();
        updateStatistics();
        updateInsightCards();
        
        console.log('🔄 Attempting to load real data...');
        const dataLoaded = await loadTourismData();
        
        if (dataLoaded) {
            console.log('✅ Real data loaded successfully');
        } else {
            console.log('✅ Using sample data');
        }
    } catch (error) {
        console.error('❌ Initialization failed:', error);
    }
    
    // Event listeners
    const addListener = (id, event, handler) => {
        const element = document.getElementById(id);
        if (element) element.addEventListener(event, handler);
    };
    
    addListener('yearSelect', 'change', handleControlChange);
    addListener('quarterSelect', 'change', handleControlChange);
    addListener('metricSelect', 'change', handleControlChange);
    addListener('regionFilter', 'change', handleControlChange);
    addListener('topCountries', 'change', handleControlChange);
    addListener('showConnections', 'change', handleControlChange);
    addListener('showLabels', 'change', handleControlChange);
    
    addListener('updateButton', 'click', handleControlChange);
    addListener('resetViewButton', 'click', () => {
        if (map) map.setView([45, 25], 3);
    });
    addListener('focusArmeniaButton', 'click', () => {
        if (map) map.setView(ARMENIA_COORDS, 6);
    });
    addListener('exportDataButton', 'click', exportData);
    addListener('shareButton', 'click', shareData);
    
    addListener('toggleStats', 'click', function() {
        const panel = document.querySelector('.statistics-panel');
        if (panel) panel.classList.toggle('collapsed');
    });
    
    console.log('✅ Dashboard ready!');
});

console.log('✅ Armenia Tourism Dashboard JavaScript loaded');

