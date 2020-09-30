var currentChart;
document.getElementById('renderBtn').addEventListener('click', fetchData);
async function fetchData() {
    var countryCode = document.getElementById('country').value;
    const indicatorCode = 'SP.POP.TOTL';  
    const baseUrl = 'https://api.worldbank.org/v2/country/';
    const url = baseUrl + countryCode + '/indicator/' + indicatorCode + '?format=json';
    console.log('Fetching data from URL: ' + url);

    var response = await fetch(url);

    if (response.status == 200) {
        var fetchedData = await response.json();
        console.log(fetchedData);

        var data = getValues(fetchedData);
        var labels = getLabels(fetchedData);
        var countryName = getCountryName(fetchedData);
        renderChart(data, labels, countryName);
    }
}
function getValues(data) {
    var vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
    return vals;
}

function getLabels(data) {
    var labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
    return labels;
}

function getCountryName(data) {
    var countryName = data[1][0].country.value;
    return countryName;
}

function getIndicatorName(data) {
    var indicatorName = data[1][0].indicator.value;
}

function renderChart(data, labels, countryName) {
    var ctx = document.getElementById('myChart').getContext('2d');

    var gradientStroke = ctx.createLinearGradient(0, 0, 600, 0);
    gradientStroke.addColorStop(0, 'black');

    gradientStroke.addColorStop(0.5, 'purple');
    
    gradientStroke.addColorStop(1, 'white');

    if (currentChart) {
        // Clear the previous chart if it exists
        currentChart.destroy();
    }
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Population, ' + countryName,
                data: data,
                // borderColor: 'rgba(75, 192, 192, 1)',
                // backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: gradientStroke,
                pointBorderColor: gradientStroke,
                pointBackgroundColor: gradientStroke,
                pointHoverBackgroundColor: gradientStroke,
                pointHoverBorderColor: gradientStroke,
            }]
        },
        options: {
            animation: {
                duration: 10000
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })
};