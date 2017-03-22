

  dighumApp.controller('allvisNovDec',['$scope', function($scope){
  var width = 1200,
      height = 1200,
      radius = 4,
      charge = -20,
      linkDistance = 20;
    //linkDistance = 0.5714285714285714;


  var color = d3.scale.category20();
  $scope.days=[]
  for(var i = 23; i < 31; i++){
    $scope.days.push(i)
  }
  for(var j = 1; j < 8; j++){
    $scope.days.push(j)
  }
  $scope.day = 23
  var parseDate = d3.time.format("%a %b %d %X %Z %Y").parse;
  var origin = 220
  var slide_h = 150
  


  //move to front
  d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
  };

 
  $scope.viz = function(){
    console.log(d3.select('#svg_network'))
   d3.select('#svg_network').remove()
    console.log(d3.select('#svg_network'))
   d3.select('#labelgraph').remove()

function getMonth(day){
  if(day < 10){
    return 'dec'
  }
  else{
    return 'nov'
  }
}



d3.json("twitter-network-creator/all-vis/formatted_data/"+ $scope.day + getMonth($scope.day) + ".json", function(error, graph) {

var  numnodes = graph.nodes.length


var chargeCalc = function(num){
  console.log(num);

      if(num < 800){
        return -30
      }
      if(num < 1000){
        return -23
      }
      if(num < 2000){
        return -18
      }
      if(num < 3000){
        return - 12
      }
      if(num < 4000){
        return -8
      }
      if(num < 5000){
        return -6
      }
      if(num < 6000){
        return -5
      }
      return -3
}

charge = chargeCalc(numnodes)

var force = d3.layout.force()
    .charge(charge)
    .linkDistance(linkDistance)
      .size([width - origin, height - origin]);

force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();
  var labelcols = 4

  labelenclosewidth = width-origin

  var labelwidth = (width-origin)/4 - 10
  var square = 15

  var textboxwidth = 170;

  graph.nodes.forEach(function(node){
    node.hour = parseInt(node.time[0].slice(10, 13)) 
    node.time.forEach(function(tim){
      tim = parseDate(tim);
    })
  })

  var svg_labels = d3.select("#graph").append("svg")
      .attr('id', 'labelgraph')
      .attr("width", width)
      .attr("height", (graph.terms.length /labelcols) * 50)

var depthChart = dc.barChart("#dc-depth-chart");

  var facts = crossfilter(graph.nodes)
  var all = facts.groupAll()


  var hourValue = facts.dimension(function(d){
    return  d.hour
  })
  var hourValueGroup = hourValue.group()

  var thing = dc.dataCount(".dc-data-count")
    .dimension(facts)
    .group(all);


depthChart.width(width - origin)
    .height(slide_h)
    .margins({top: 10, right: 10, bottom: 20, left: 40})
    .dimension(hourValue)
    .group(hourValueGroup)
  .transitionDuration(500)
    .centerBar(true)  
  .gap(1)  
    .x(d3.scale.linear().domain([-.5, 23.5]))
  .elasticY(true)
 
depthChart.on('postRedraw', function(chart){
  extent = chart.brush().extent()
  $scope.updateData(parseInt(Math.round(extent[0])), parseInt(Math.round(extent[1])))
})

 dc.renderAll();







  //format labels
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
                .on('click', selectHashtag)
                .on('mouseover', function(d){
                  d3.select(this).style('cursor', 'pointer')
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

  var visouter = d3.select("#network").append("svg")
      .attr('width', width)
      .attr('height', height)
      .attr('id', 'svg_network')

  var vis = d3.select('#svg_network').append("svg")
      .attr('width', width)
      .attr('height', height )
       .attr('x', -1 * origin + 10)
      .attr('y', -1 * origin + 10)

  var cScale = d3.scale.linear().domain([0, graph.terms.length]).range([0, 2 * Math.PI]);

  var arc = d3.svg.arc()
      .innerRadius(0)
      .outerRadius(function(d) {return Math.sqrt(d[3]/Math.PI) * 10})
      .startAngle(function(d){return cScale(d[0]);})
      .endAngle(function(d){return cScale(d[1]);})

  var arc2 = d3.svg.arc()
      .innerRadius(0)
      .outerRadius(30)
      .startAngle(function(d){return cScale(d[0]);})
      .endAngle(function(d){return cScale(d[1]);});




  var link2 = vis.selectAll(".link")
        .data(graph.links)
      .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function(d) { return Math.sqrt(d.value); })
        .style('stroke', 'black')
        .style('stroke-opacity', .5);

  var svg =  vis.selectAll(".node").data(graph.nodes)
    .enter()
    .append('svg')
    .attr('hashtags', function(d){
      return d.tweets_in_text
    })
    .classed('small', function(d, i){
      var thing = setClass(d3.select(this), d, i)
      return thing
    })
    .call(force.drag)

function setClass(node, d, i){
  d.tweets_in_text.forEach(function(tag){
    node.classed(tag, true)
  })
  return true
}

  var circle = svg.selectAll('.circle')

  function selectHashtag(d,i){
    console.log(d)

    console.log(d3.selectAll('.' + d))

    box = d3.select(this)
    console.log(box.attr('class'))
    if (box.attr('class') == 'unselected'){
      box.attr('class', 'selected')
      box.select('#select' + d).transition()
          .duration(250)
          .style('opacity', .5)
          
       d3.selectAll('.' + d)
      .classed('hide', true)
    }
    else{
      box.attr('class', 'unselected')
      box.select('#select' + d).transition()
          .duration(250)
          .style('opacity', .1)
         d3.selectAll('.' + d)
      .classed('hide', false)
    }


    return 1
  }

  function enlargeNode(){
    var node = d3.select(this)
    console.log(node.attr('class'))
    node.moveToFront();
    tweetbox = node.select('.tweetbox')
    tweettext = node.select('.tweettext')
    //show box so it appears within bounding area
    if (node.attr('x') < width/2 - origin){
      tweetbox.attr('x', 15)
      tweettext.attr('x', 15)
    }
    else{
      tweetbox.attr('x', -textboxwidth - 15)
      tweettext.attr('x', -textboxwidth - 15)
    }
    if (node.attr('y') < height/2 - origin){
      tweetbox.attr('y', 0)
      tweettext.attr('y', 0)
    }
    else{
      tweetbox.attr('y', -50)
      tweettext.attr('y', -50)
    }
    console.log()
    var selnode = node.selectAll('path').transition()
    if (node.classed('big')){
       selnode
      .duration(250)
      .attr('d', arc)
      .style('opacity', 1);
    node.classed('small', true)
    node.classed('big', false)
     node.select('.tweetbox').transition()
      .duration(250).attr('display', 'none')
      tweettext.style('display', 'none')
    }
    else{
    selnode
      .duration(250)
      .attr('d', arc2)
      .style('opacity', 1);
    node.classed('big', true)
    node.classed('small', false)
     node.select('.tweetbox').transition()
      .duration(250).attr('display', '')

      tweettext.style('display', '')

    }
    return
  }

  function showName(){
    node = d3.select(this)
    node.moveToFront();
    node.style('stroke-opacity', 1)
    node.select('.nametext').classed('hide', false)//.attr('display', '')
  }

  function hideName(){
    node = d3.select(this)
        node.style('stroke-opacity', .3)
    node.select('.nametext').classed('hide', true)
  }
   
$scope.resetNodeMap = function(){
  $scope.updateData(0, 24)
}
 $scope.updateData = function(low, high){

  svg.transition().duration(250).attr('display', function(d){
    var hour =  parseInt(d.time[0].slice(10, 13));
    if(hour < low || hour > high){
      return 'none';
    }
    else{
      return ''
    }
    })

  }
    
  circle.data(function(d, i ){ return d.angles })
                .enter()
                .append('path')
                .attr('class', function(d){ return 'arccircle';})

                .attr('d', arc)
                .style('fill', function(d, i){ return color(d[2])})
                .style('opacity', 1)
                .style('stroke', "black")
                .style('stroke-opacity', .3)
                .style('stroke-width', 1)
                .attr("transform", 'translate(' + origin + ',' + origin + ')')

  svg.on('click', enlargeNode)



  svg.on('mouseover', showName)
    .on('mouseout', hideName)


 /* var tweetbox = svg.append('rect')
              .attr('class', 'tweetbox')
              .attr('x', 15)
              .attr('y', 0)
              .attr('width', textboxwidth)
              .attr('height', function(d){
                return d.text.length * 100
              })
              .style('stroke', 'black')
              .style('stroke-opacity', .3 )
              .style('fill', function(d){return color(d.group[0])})
              //.style('fill', 'white')
              .style('fill-opacity', 1)
              .attr('display', 'none')
               .attr('transform', 'translate(' + origin +','+ origin + ')')*/

  var tweettext = svg.append("foreignObject")
    //.attr({width: textboxwidth, height: 50})
    .attr('width', textboxwidth)
    .attr('height', function(d){
              len = 0
              d.text.forEach(function(tweet){
                len = len + tweet.length
              })
            return   (len/20 + 2) * 13
              //  return d.text.length *70
              })
    .style('color', "white")//function(d){return color[d.group[0]]})
    .style('fill-opacity', 1)
    .style('display', 'none')
    .attr('class', 'tweettext')
    .attr('x', 0 + 'px')
    .attr('y', '0px')
    .attr('transform', 'translate(' + origin +','+ origin + ')')
    .style({width: textboxwidth + 'px', 
          //height: 70 + 'px', 
          "font-size": "11px",
          "font-family": "Helvetica"
      })
    .style('background-color', function(d){
      return color(d.group[0]);
    })
      .html(function(d){
        text = d.name + ':'
        d.text.forEach(function(entry){
          text = text + '\n' + entry
        })

        return text
      });


      
  var text3 = svg.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('class', 'nametext')
             .style('font-family', 'Helvetica')
             .style('fill', 'black')
             .style('stroke', function(d){return color(d.group[0])})
             .style('stroke-width', .1)
             .style('background-color', 'black')
            .style('font-size', '14px')
            .text(function(d){return d.name;})
            .classed('hide', true)
             .attr('transform', 'translate(' + origin +','+ origin + ')')

    force.on("tick", function() {
      link2.attr("x1", function(d) { return d.source.x + origin; })
          .attr("y1", function(d) { return d.source.y + origin; })
          .attr("x2", function(d) { return d.target.x + origin; })
          .attr("y2", function(d) { return d.target.y + origin; });

    svg.attr("x", function(d) { return d.x = Math.max(radius, Math.min(width - (origin + 5) - d.score, d.x)); })
          .attr("y", function(d) { return d.y = Math.max(radius, Math.min(height-(origin + 5)  -d.score, d.y)); });
    });

   
  })//d3.json fetch
;}//$scope.vis


  $scope.viz();
  }]);//controller