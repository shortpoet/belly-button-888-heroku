function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel
    var url = `/metadata/${sample}`;
    d3.json(url).then(function(response) {
      console.log('metadata response');
      console.log(response);
      var metadata = d3.select('#sample-metadata')
      metadata.html("")
      Object.entries(response).forEach(([k,v]) => {
        metadata.append('strong').text(`${k}:`).attr('value', `${k}`); 
        metadata.append('p').text(`${v}`).attr('value', `${v}`)
      });
      var gaugeDivHeight = document.getElementById('gauge').clientHeight;
      var gaugeDivWidth = document.getElementById('gauge').clientWidth;
  
      var level = 0;
      switch (response.WFREQ) {
        case null:
          level = -90;
          break;
        case 1:
          level = 10;
          break;
        case 2:
          level = 30;
          break;
        case 3:
          level = 50;
          break;
        case 4:
          level = 70;
          break;
        case 5:
          level = 90;
          break;
        case 6:
          level = 110;
          break;
        case 7:
          level = 130;
          break;
        case 8:
          level = 150;
          break;
        case 9:
          level = 170;
          break;
      }
  
      // Trig to calc meter point
      var degrees = 180 - level,
           radius = .5;
      var radians = degrees * Math.PI / 180;
      var x = radius * Math.cos(radians);
      var y = radius * Math.sin(radians);
      
      // Path: may have to change to create a better triangle
      var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
           pathX = String(x),
           space = ' ',
           pathY = String(y),
           pathEnd = ' Z';
      var path = mainPath.concat(pathX,space,pathY,pathEnd);
      
      var gaugeData = [{ type: 'scatter',
         x: [0], y:[0],
          marker: {size: 28, color:'850000'},
          showlegend: false,
          name: 'Washes per Week',
          //text: level,
          hoverinfo: 'name'},
        { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition:'inside',
        marker: {colors:['rgba(131, 181, 136, .5)', 'rgba(136, 188, 141, .5)',
                               'rgba(138, 192, 134 .5)', 'rgba(182, 205, 143, .5)',
                               'rgba(213, 229, 153, .5)', 'rgba(229, 232, 176, .5)',
                               'rgba(233, 230, 201, .5)', 'rgba(244, 241, 228, .5)',
                               'rgba(248, 243, 236, .5)', 'rgba(255, 255, 255, 0)']},
        labels: [...Array(10).keys()].map(x => `${x} washes per week`).reverse(),
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
      }];
      
      var gaugeLayout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
              color: '850000'
            }
          }],
        title: 'Washes per Week 0-9',
        height: gaugeDivHeight,
        width: gaugeDivWidth,
        xaxis: {zeroline:false, showticklabels:false,
                   showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                   showgrid: false, range: [-1, 1]}
      };
      
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    });
    // Use `d3.json` to fetch the metadata for a sample
      // Use d3 to select the panel with id of `#sample-metadata`
  
      // Use `.html("") to clear any existing metadata
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      
  
      // BONUS: Build the Gauge Chart
      // buildGauge(data.WFREQ);
  }
  
  function buildCharts(sample) {
  
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    var url = `/samples/${sample}`;
    d3.json(url).then(function(response) {
      //console.log(response)
  
      var pieDivHeight = document.getElementById('pie').clientHeight;
      var pieDivWidth = document.getElementById('pie').clientWidth;
      var bubbleDivHeight = document.getElementById('bubble').clientHeight;
      var bubbleDivWidth = document.getElementById('bubble').clientWidth;
      var pieValues = response.sample_values.slice(0, 10) 
      var pieLabels = response.otu_ids.slice(0, 10) 
      var pieNames = response.otu_labels.slice(0, 10) 
      var pieData = [{
        values: pieValues,
        labels: pieLabels,
        hovertext: pieNames,
        hoverinfo: 'label+percent+text+name+value',
        name: sample,
        textinfo: "label",
        type: 'pie'
      }];
      //console.log(pieData)
      var pieLayout = {
        height: pieDivHeight,
        width: pieDivWidth
      };
      Plotly.newPlot('pie', pieData, pieLayout)
      //console.log(pieLayout)
      var bubbleData = [];
      for (var i = 0; i < response.otu_ids.length; i++) {
        var trace = {
            x: [response.otu_ids[i]],
            y: [response.sample_values[i]],
            hovertext: response.otu_labels[i],
            hoverinfo: 'all',
            showlegend: true,
            text: response.otu_labels[i],
            name: `${response.otu_labels[i].slice(0, 44)}<br>${response.otu_labels[i].slice(44)}`,
            //hovertemplate: "label: %{response.otu_labels}",
            mode: 'markers',
            marker: {
              size: response.sample_values[i],
              color: response.otu_ids[i],
              //opacity: response.sample_values
            }
        }
        bubbleData.push(trace);
      };
      
    
      
      console.log('bubbleData');
      console.log(bubbleData);
      var bubbleLayout = {
        title: sample,
        height: bubbleDivHeight,
        width: bubbleDivWidth
      }
      Plotly.newPlot('bubble', bubbleData, bubbleLayout)
    });
      // @TODO: Build a Bubble Chart using the sample data
      // @TODO: Build a Pie Chart
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).
  }
  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();
  