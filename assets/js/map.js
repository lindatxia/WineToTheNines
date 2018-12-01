/* VARIABLE DECLARATION */ 
var format; 
var tip; 
var margin; 
var svg; 
var color; 
var projection; 
var path;

/* Reads from tab-delimited text files and stores data in an array */ 
var countries;
var allWines; 
var cabernetWines;
var chardonnayWines;
var pinotnoirWines; 
var pinotgrigioWines; 
var rieslingWines; 
var sauvignonblancWines; 
var syrahWines; 
var merlotWines; 
var gewurztraminerWines;

var allData;
var random;
var first = true;

/* INITIALIZATION OF VARIABLES */
function init() { 
    format = d3.format(",");
    
    // Set tooltips
    tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                  return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br/><strong>Count: </strong><span class='details'>" + format(d.count) + "</span>";
                })

    margin = {top: 0, right: 0, bottom: 0, left: 0},
                width = parseInt(d3.select("#map").node().getBoundingClientRect().width) - margin.left - margin.right,
                mapRatio = 0.5,
                height = width*mapRatio;

    // For responsiveness, include viewBox and preserveAspectRatio attributes 
    svg = d3.select("#vis-canvas")
                .append("svg")
                .attr("viewBox", "0 0 960 550")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("preserveAspectRatio", "xMidYMid");
    
    // Creates a color scale that corresponds to the wine count. More wines from certain countries yield darker colors.
    color = d3.scaleThreshold()
        .domain([0,1,5,10,50,100,500,1000,2000,5000,10000])
        .range(["rgb(95,92,88)",
                "rgb(245,245,245)", 
                "rgb(255,218,218)", 
                "rgb(255,172,172)", 
                "rgb(250,128,100)", 
                "rgb(205,92,92)", 
                "rgb(228,77,46)",
                "rgb(206,22,17)",
                "rgb(159,0,0)",
                "rgb(126,31,25)",
                "rgb(52,0,2)"]);
    
    projection = d3.geoMercator()
                .scale(130)
                .translate( [width / 2, height / 1.5]);
    
    path = d3.geoPath().projection(projection);
    
    svg.call(tip);
}



$(document).ready(function() {
    
    // When the document loads, call helper functions to initalize variables.
    init();
    loadAllWineCounts();

    // Uses JQuery ajax method that reads in a CSV file, and after success, parses it using a Javascript library called Papa. 
    $.ajax({
        type: "GET", 
        url: "data/allwine.csv", 
        dataType: "text", 
        success: function(data) {
            allData = Papa.parse(data);
        }
    })
    
    // When different wines are clicked, the data visualization changes. 
    d3.selectAll("a.step-link").on("click", function(d) {
        var clickedStep = d3.select(this).attr("id");
        switchStep(clickedStep);
        switchAnnotation(clickedStep);
        
        switch (clickedStep) { 
            // All wines
            case "step1":
                d3.select("g").remove(); 
                addNewMap(countries, allWines);
                break;
            // Cabernet Sauvignon count
            case "step2":
                d3.select("g").remove(); 
                addNewMap(countries, cabernetWines);
                break;
            // Merlot count 
            case "step3": 
                d3.select("g").remove();
                addNewMap(countries, merlotWines);
                break;
            // Syrah count 
            case "step4": 
                d3.select("g").remove();
                addNewMap(countries, syrahWines);
                break;
            // Pinot noir count 
            case "step5": 
                d3.select("g").remove();
                addNewMap(countries, pinotnoirWines);
                break;
            // Riesling count
            case "step6": 
                d3.select("g").remove();
                addNewMap(countries, rieslingWines);
                break;
            // Chardonnay count
            case "step7": 
                d3.select("g").remove();
                addNewMap(countries, chardonnayWines);
                break;
            // Pinot grigio count
            case "step8": 
                d3.select("g").remove();
                addNewMap(countries, pinotgrigioWines);
                break;
            // Sauvignon blanc count
            case "step9": 
                d3.select("g").remove();
                addNewMap(countries, sauvignonblancWines);
                break;
            // Gewurztraminer count
            case "step10": 
                d3.select("g").remove();
                addNewMap(countries, gewurztraminerWines);
                break;
        }
        
        return false;
    });
    
    // When the "generate" button is clicked, a new random one is generated and displayed. 
    d3.select("#button").on("click", function(d)  {
        var selectedWine = generateRandomWine(allData); 
        displayRandomWine(selectedWine);
    })
    
});


/* ALL OTHER FUNCTIONS */ 


/* By default, load all of the counts. This code is only called once as an initialization function when the document loads, to increase the loading response time and reduce redundancy. */ 
function loadAllWineCounts() { 
    queue()
        .defer(d3.json, "data/world_countries.json")
        .defer(d3.tsv, "data/allcount.txt")
        .defer(d3.tsv, "data/cabernetsauvignoncount.txt")
        .defer(d3.tsv, "data/chardonnaycount.txt")
        .defer(d3.tsv, "data/pinotnoircount.txt")
        .defer(d3.tsv, "data/pinotgrigiocount.txt")
        .defer(d3.tsv, "data/rieslingcount.txt")
        .defer(d3.tsv, "data/sauvignonblanccount.txt")
        .defer(d3.tsv, "data/syrahcount.txt")
        .defer(d3.tsv, "data/merlotcount.txt")
        .defer(d3.tsv, "data/gewurztraminercount.txt")
        .await(ready);
}

/* Generates a random wine given a CSV file array that is already parsed.
    @d - CSV file array parsed by Papa JS library
    returns - a randomWine object
*/ 
function generateRandomWine(d) {
    var size = d.data.length; 
    var randomIndex = Math.floor((Math.random() * size) + 1);
    var randomRow = d.data[randomIndex];
    var randomWine = { 
        country: randomRow[0], 
        description: randomRow[1], 
        designation: randomRow[2], 
        points: randomRow[3], 
        price: randomRow[4], 
        province: randomRow[5], 
        region: randomRow[6], 
        taster: randomRow[7], 
        tasterTwitter: randomRow[8], 
        title: randomRow[9], 
        variety: randomRow[10], 
        winery: randomRow[11], 
        year: randomRow[12]
    }
    return randomWine;
}

/* Appends a random wine to the #rec-container div for display. 
    @selectedWine - a randomWine object
*/
function displayRandomWine(selectedWine) { 
    // First, clear the div. 
    $("#rec-container").empty();
    
    // Append a random wine per your fancy to this div. Slide down animation is called only on first click of "generate" button. 
    if (first) {
        $("#rec-container").append("<div id='wine-rec'><div class='large-subtitle'>"+selectedWine.title+ "</div><b style='color:#FFA500'> Type: "+ selectedWine.variety +" | Year: "+ selectedWine.year+ " | Points: "+selectedWine.points+" | Price: $"+ selectedWine.price + "</b><br/><br/>" + selectedWine.description + "<br/><br/>- " + selectedWine.taster + "<br/><a href='https://twitter.com/"+ selectedWine.tasterTwitter.replace('@','') + "' class='twitter-follow-button' data-show-count='false'>Follow " + selectedWine.tasterTwitter + "</a><script async src='https://platform.twitter.com/widgets.js' charset='utf-8'></script></div>").hide().slideDown('slow');
        first = false;
    }
    
    else { 
        $("#rec-container").append("<div id='wine-rec'><div class='large-subtitle'>"+selectedWine.title+ "</div><b style='color:#FFA500'> Type: "+ selectedWine.variety +" | Year: "+ selectedWine.year+ " | Points: "+selectedWine.points+" | Price: $"+ selectedWine.price + "</b><br/><br/>" + selectedWine.description + "<br/><br/>- " + selectedWine.taster + "<br/><a href='https://twitter.com/"+ selectedWine.tasterTwitter.replace('@','') + "' class='twitter-follow-button' data-show-count='false'>Follow " + selectedWine.tasterTwitter + "</a><script async src='https://platform.twitter.com/widgets.js' charset='utf-8'></script></div>")
    }
}

/* Once all of the data files have finished loading, this function saves each wine count by country into a variable */ 
function ready(error, data, all, cabernet, chardonnay, pinotnoir, pinotgrigio, riesling, sauvignonblanc, syrah, merlot, gewurztraminer) { 
    countries = data;
    allWines = all; 
    cabernetWines = cabernet; 
    chardonnayWines = chardonnay; 
    pinotnoirWines = pinotnoir; 
    pinotgrigioWines = pinotgrigio; 
    rieslingWines = riesling; 
    sauvignonblancWines = sauvignonblanc; 
    syrahWines = syrah; 
    merlotWines = merlot; 
    gewurztraminerWines = gewurztraminer;
    
    // By default, display the "all wines" map.
    addNewMap(countries, allWines);
}

/* Updates the display of SVG map with new wine type. 
    @data - Dictionary of all countries in SVG map, the key is the country ID
    @wine - Wine count for a specific wine
*/ 
function addNewMap(data, wine) { 
    var wineById = {}; 
    wine.forEach(function(d) { wineById[d.id] = +d.count; });

    // Looks through all of the country objects and assigns a count property to it
    data.features.forEach(function(d) {d.count = wineById[d.id];});
    data.features.forEach(function(d) {
        if (d.count == null) { 
            d.count = 0;
        }
    });

    // Appends all of the countries and their coordinates read in from the world_countries.json into an interactive D3.js map
    svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .style("width", width + "px")
        .data(data.features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) { 
            return color(d.count); 
        })
        .style('stroke', 'white')
        .style('stroke-width', 1.3)
        .style("opacity",0.8)

        // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          tip.show(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
        })
        .on('mouseout', function(d){
          tip.hide(d);

          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","white")
            .style("stroke-width",0.3);
        });

    svg.append("path")
        .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
        .attr("class", "names")
        .attr("d", path);

}


/* Stepper D3.js code for tabbing between different visualizations */ 
/* Code modified from: https://github.com/vlandham/stepper_example */
    
/* When you click another stepper, this function deactivates all steppers and activates the current one selected */

function switchStep(newStep) {
    d3.selectAll(".step-link").classed("activated", false);
    d3.select("#" + newStep).classed("activated", true)
}

function switchAnnotation(newStep) {
    d3.selectAll(".annotation-step")
        .style("display", "none")
        .style("opacity", 0.0);

    d3.select("#" + newStep + "-annotation")
        .style("display", "block")
        .transition().delay(300).duration(500)
        .style("opacity", 1);
}

