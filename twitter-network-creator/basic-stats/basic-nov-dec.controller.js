
  
  dighumApp.controller('basicnovdecController',['$scope', function($scope){


  var volumeChart = dc.barChart('#volume-chart');
  var dayOfWeekChart = dc.rowChart('#day-of-week-chart');
  var groupChart = dc.rowChart('#group-chart');
  var retweetedChart = dc.pieChart('#retweet-chart');
  var moveChart = dc.lineChart('#move-chart');

  var width = 1000
  var height = 1000

    var labelcols = 4

  labelenclosewidth = width

  var labelwidth = (width)/4 - 10
  var square = 15

  var textboxwidth = 170;

  var color = d3.scale.category20();

  console.log(color(20))


var parseDate = d3.time.format('%a %b %d %X +0000 %Y')//.parse();


  d3.json('twitter-network-creator/basic-stats/basic_stats/novdec.json', function(error,graph){
    console.log(graph.stats[0].tags)

    graph.stats.forEach(function(d){
      d.dd = parseDate.parse(d.time)
      d.day = d3.time.day(d.dd)
      //d.hour = d3.time.hour(d.dd)
    })



    var stats = crossfilter(graph.stats)
    var all = stats.groupAll()
var thing = dc.dataCount(".dc-data-count")
    .dimension(stats)
    .group(all);

    var dateDimension = stats.dimension(function (d) {
      var ret = d3.time.hour(d.dd)
        return ret
    });

    var hashTagGroup = dateDimension.group()
    count = 0
    var groupDimension = stats.dimension(function (d) {

     return d.tags[0]
    })

    var retweetDimension = stats.dimension(function(d){
      return d.retweeted
    })

    var retweetGroup = retweetDimension.group()

    var groupGroup = groupDimension.group()

    var dateGroup = dateDimension.group()

  /*  var hourDimension = stats.dimension(function(d){
       console.log(d.hour)
      console.log(count)
      count++
      return d.hour
    })

    var hourGroup = hourDimension.group()*/


    var dayDimension = stats.dimension(function(d){
      return d.day
    })

    var dayGroup = dayDimension.group()


    var dayOfWeek = stats.dimension(function (d) {
        var day = d.dd.getDay();
        var name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return day + '.' + name[day];
    });

    var dayOfWeekGroup = dayOfWeek.group();

    groupChart
      .width(200)
      .height(600)
      .margins({top: 20, left: 10, right: 10, bottom: 20})
      .group(groupGroup)
      .dimension(groupDimension)
      .elasticX(true)
      .colors(color)
      .colorAccessor(function(d, i){
        term_number = graph.terms.length
         for (var i = 0; i < term_number; i++){
            if (graph.terms[i] == d.key){
              return i
            }
          }
        return 0
      })
      .label(function(d){
        return d.key
      })
      .title(function(d){
        return d.key
      })
      .xAxis().ticks(4)
    var weekcolor = ['#6baed6']

    dayOfWeekChart /* dc.rowChart('#day-of-week-chart', 'chartGroup') */
        .width(250)
        .height(250)
        .margins({top: 20, left: 10, right: 10, bottom: 20})
        .group(dayOfWeekGroup)
        .dimension(dayOfWeek)
        .colors(weekcolor)
        .colorAccessor(function(d){
          return 0
        })
        // Assign colors to each value in the x scale domain
        //.ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])

        .label(function (d) {
            return d.key.split('.')[1];
        })
        // Title sets the row text
        .title(function (d) {
            return d.value;
        })
       // .color('#6baed6')
        .elasticX(true)
        .xAxis().ticks(4);

  

var tagGroupArray = [];
    graph.terms.forEach(function(t){
      var tempGroup = dateDimension.group().reduce(
  function(p, v) { if (v.tags[0] == t){p++;};return p;},
    function(p, v) { if (v.tags[0] == t){p--;}return p;},
    function() { return 0;});

      tagGroupArray.push(tempGroup)
    })



 


    var secondThing = dateDimension.group()

    moveChart 
        .renderArea(true)
        .width(820)
        .height(250)
        .transitionDuration(1000)
        .margins({top: 30, right: 50, bottom: 25, left: 40})
        .dimension(dateDimension)
        .mouseZoomable(true)
    // Specify a "range chart" to link its brush extent with the zoom of the current "focus chart".
        .rangeChart(volumeChart)
        .x(d3.time.scale().domain([new Date(2014, 10, 22), new Date(2014, 11, 9)]))
       // .round(d3.time.hours.round)
        .xUnits(d3.time.hours)
        .elasticY(true)
        .renderHorizontalGridLines(true)
  
        .brushOn(false)
        .colors(color)
        .colorAccessor(function(d, i){
        term_number = graph.terms.length
         for (var i = 0; i < term_number; i++){
            if (graph.terms[i] == d.key){
              return i
            }
          }
        return 0
      })
        .group(tagGroupArray[0], '')
        .valueAccessor(function (d) {
            return d.value;
        })
       
tagGroupArray.shift()

    tagGroupArray.forEach(function(f, i){
      moveChart.stack(f, graph.terms[i], function(d){
        return d.value
      })
    })


    volumeChart.width(820) 
        .height(50)
        .margins({top: 0, right: 50, bottom: 20, left: 40})
        .dimension(dateDimension)
        .group(dateGroup)
        .centerBar(true)
        .gap(1)
        .x(d3.time.scale().domain([new Date(2014, 10, 22), new Date(2014, 11, 9)]))
        .round(d3.time.hours.round)
       // .alwaysUseRounding(true)
        .xUnits(d3.time.hours)
        .yAxis().ticks(4)


    retweetedChart /* dc.pieChart('#gain-loss-chart', 'chartGroup') */
        .width(250)
        .height(250)
    // Define pie radius
        .radius(120)
    // Set dimension
        .dimension(retweetDimension)
    // Set group
        .group(retweetGroup)
    // (_optional_) by default pie chart will use `group.key` as its label but you can overwrite it with a closure.
        .label(function (d) {
          startlabel = ''
          if (d.data.key){
              startlabel =  'Retweeted'
            }
            else{
               startlabel =  'Original'
            }

           if (retweetedChart.hasFilter() && !retweetedChart.hasFilter(d.data.key)) {
                return startlabel + '(0%)';
            }
            var label = startlabel;
            if (all.value()) {
                label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
            }
            return label;
        })
    /*
        // (_optional_) whether chart should render labels, `default = true`
        .renderLabel(true)
        // (_optional_) if inner radius is used then a donut chart will be generated instead of pie chart
        .innerRadius(40)
        // (_optional_) define chart transition duration, `default = 350`
        .transitionDuration(500)
        // (_optional_) define color array for slices
        .colors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
        // (_optional_) define color domain to match your data domain if you want to bind data or color
        .colorDomain([-1750, 1644])
        // (_optional_) define color value accessor
        .colorAccessor(function(d, i){return d.value;})
        */;




    var svg_labels = d3.select("#graph").append("svg")
      .attr('id', 'labelgraph')
      .attr("width", width)
      .attr("height", (graph.terms.length /labelcols) * 40)

     function labely(i, text){
        var row = 35
        var sq = square 
        if(text){
          sq  = 0
      }
       // var row = 20
        if( i < 4){
          return row - sq
        }
        if( i < 8){
          return row * 2  - sq
        }
        if( i < 12){
          return row * 3 - sq
        }
        if( i < 16){
          return row * 4 - sq
        }
        if( i < 20){
          return row * 5 - sq
        }
      }

    var labelgroups = svg_labels.selectAll('svg')
                .data(graph.terms)
                .enter()
                .append('svg')
                .attr('class', 'unselected')
                .attr('x', function(d, i) { return labelenclosewidth/labelcols *  (i % labelcols)})
                .attr('y', function(d, i) { return labely(i, false)})
                .attr('height', 35)
                .attr('width', labelwidth)
               // .on('click', selectHashtag)
                .on('mouseover', function(d){
                 // d3.select(this).style('cursor', 'pointer')
                })


    var labelsquares = labelgroups.append('rect')
                      .style('fill', function(d, i){return color(i)})
                      .style('stroke', 'black')
                      .style('stroke-opacity', .2)
                      .attr('height', square)
                      .attr('width', square)
                      .attr('y', 3)
                      .attr('x', 5)

    var labeltext = labelgroups
            .append('text')
            .style('font-family', 'Helvetica')
            .attr('x', 25)
            .attr('y', 16)
            .text(function(d){return d})
    var selectionrects = labelgroups.append('rect')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('id', function(d){
                          return 'select' + d
                        })
                        .style('rx', 4)
                        .style('ry', 4)
                        .attr('height', 22)
                        .attr('width', labelwidth)
                        .style('opacity', .1)

        dc.renderAll();

      $scope.changeTagLabels = function(){
        console.log( d3.select('body').select('#group-chart').selectAll('text'))
      d3.select('body').select('#group-chart').selectAll('text').style('fill', '#333')

    }

        $scope.changeTagLabels()


     
  })




  }]);