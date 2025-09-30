# Armenia Tourism Dashboard

A comprehensive interactive web application for visualizing and analyzing tourism data for Armenia.

## 📋 Files Overview

### Core Application Files
- **`index.html`** - Landing page with project overview
- **`tourism-dashboard.html`** - Main dashboard interface
- **`tourism-dashboard.js`** - JavaScript logic and interactivity
- **`tourism-dashboard.css`** - Styling and layout
- **`data-story.html`** - Data storytelling page (placeholder)
- **`contributors.html`** - Contributors page (placeholder)

### Data Files
- **`armenia_inbound_tourism_by_country_quarter_2019q1_2025q3.csv`** - Quarterly tourism data (2019-2025)
- **`armenia_inbound_tourism_yearly_2019_2025.csv`** - Pre-aggregated yearly tourism data

### Assets
- **`teevial.jpg`** - Teevial organization logo

## 🚀 Features

### Interactive Visualization
- **World Map Display**: Interactive map showing tourism flows from source countries to Armenia
- **Country Markers**: Circular markers sized by tourist volume or spending
- **Connection Lines**: Visual connections between countries and Armenia
- **Hover Effects**: Interactive tooltips with detailed country statistics

### Data Analysis
- **Quarterly & Yearly Views**: Switch between detailed quarterly data and aggregated yearly statistics
- **Multiple Metrics**: Toggle between tourist numbers and spending amounts
- **Growth Analysis**: Year-over-year and quarter-over-quarter growth calculations
- **Market Share**: Percentage share of each country in Armenia's tourism market

### Comparative Tools
- **Country Comparison**: Select and compare multiple countries side-by-side
- **Trends Analysis**: Visualize tourism trends over time periods
- **Statistical Insights**: Comprehensive statistics panel with key metrics

### Performance Optimizations
- **Dual Dataset System**: Separate quarterly and yearly datasets for optimal performance
- **Smart Data Loading**: Parallel loading of both datasets
- **Efficient Calculations**: Pre-aggregated yearly data eliminates runtime calculations
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🎯 Data Coverage

### Time Period
- **Years**: 2019-2025 (7 years of data)
- **Quarters**: Q1, Q2, Q3, Q4 for each year
- **Countries**: 40+ source countries tracked

### Exclusions
- Azerbaijan and Turkey are excluded from all analysis per project requirements

### Key Statistics
- **2019**: 1,866,264 tourists, $1,717.6M spending
- **2023**: 2,288,234 tourists, $2,609.6M spending (peak year)
- **2024**: 2,174,210 tourists, $2,105.2M spending

## 🛠️ Technical Stack

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with flexbox/grid layouts
- **JavaScript (ES6+)**: Interactive functionality and data processing

### Libraries & Dependencies
- **Leaflet.js**: Interactive maps and geospatial visualization
- **Leaflet.heat**: Heatmap visualization plugin
- **Leaflet.markercluster**: Marker clustering for performance
- **Chart.js**: Charts and graphs for data visualization
- **Bootstrap 5**: Responsive UI framework
- **Bootstrap Icons**: Icon library

### Data Processing
- **CSV Parsing**: Client-side CSV data processing
- **Real-time Aggregation**: Dynamic data filtering and sorting
- **Performance Optimization**: Efficient data structures and algorithms

## 🌐 Usage

### Local Development
1. Start a local web server in this directory:
   ```bash
   python3 -m http.server 8000
   ```
2. Open browser to `http://localhost:8000`
3. Click "Launch Dashboard" or navigate directly to `tourism-dashboard.html`

### Navigation
- **Home**: Main dashboard with interactive map
- **Data Story**: Narrative analysis (content to be added)
- **Contributors**: Team information (content to be added)

## 🎨 Customization

### Adding New Countries
1. Add coordinates to `countryCoordinates` object in JavaScript
2. Add to appropriate region in `regionCategories`
3. Data will be automatically included if present in CSV files

### Modifying Time Periods
- Update year options in HTML select element
- Ensure corresponding data exists in CSV files
- The system will automatically handle new years

### Styling Changes
- Modify `tourism-dashboard.css` for visual customizations
- Update color schemes in `getColor()` function
- Adjust marker sizes in `getMarkerSize()` function

## 📊 Data Sources

The tourism data represents inbound tourism to Armenia and includes:
- Tourist arrival numbers by country and time period
- Estimated tourist spending in USD
- Quarterly breakdowns for detailed analysis
- Pre-aggregated yearly totals for performance

## 🔄 Updates

To update the data:
1. Replace CSV files with new data (maintain same format)
2. Update year ranges in HTML if needed
3. The dashboard will automatically adapt to new data ranges

---

**Project**: Teevial Armenian Water Experimental Project  
**Dashboard Version**: 2.0  
**Last Updated**: 2025  
**Status**: Production Ready ✅
