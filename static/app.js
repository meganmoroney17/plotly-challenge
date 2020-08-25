url = "../samples.json"

function buildMetadata(sample) {

    // Use d3 to select id of `#sample-metadata`
    d3.json(url).then(function(sample){
      var sampleData = d3.select(`#sample-metadata`);
      sampleData.html("");
      Object.entries(sample).forEach(function([key,value]){
        var row = sampleData.append("p");
        row.text(`${key}:${value}`);
        console.log(value);
      })
    
    });
}


function buildCharts(sample) {
  var plotData = `/samples/${sample}`;
  d3.json(plotData).then(function(data){
    var x_axis = data.otu_ids;
    var y_axis = data.sample_values;
    var size = data.sample_values;
    var color = data.otu_ids;
    var texts = data.otu_labels;
  
    var bubble = {
      x: x_axis,
      y: y_axis,
      text: texts,
      mode: `markers`,
      marker: {
        size: size,
        color: color
      }
    };

    var data = [bubble];
    var layout = {
      title: "Belly Button Bacteria",
      xaxis: {title: "OTU ID"}
    };
    Plotly.newPlot("bubble", data, layout);

    // Build a Pie Chart
    d3.json(plotData).then(function(data){
      var values = data.sample_values.slice(0,10);
      var labels = data.otu_ids.slice(0,10);
      var display = data.otu_labels.slice(0,10);

      var pie_chart = [{
        values: values,
        lables: labels,
        hovertext: display,
        type: "pie"
      }];
      Plotly.newPlot('pie',pie_chart);
    });
  });
};


function init() {
  console.log('hello');
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json(url).then((sampleNames) => {
    sampleNames = sampleNames.names;
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