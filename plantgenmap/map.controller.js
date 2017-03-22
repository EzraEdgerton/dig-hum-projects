dighumApp.controller('mapController',['$scope', function($scope){
// The SVG container
var width  = 800,
    height = 480;

var colorscat = d3.scale.category10();

var projection = d3.geo.mercator()
                .translate([400, 300])
                .scale(width);

var path = d3.geo.path()
    .projection(projection);


//var colors = [  'green', 'red', 'blue', 'orange']


var labelFields = [['Authors', true, 0, 'authors'], ['First Author', true, 1, 'firstauthor'], ['Last Author', true, 2, 'lastauthor'],  ['Funding', true, 4, 'funding']]



d3.select("#map")
  .attr("height", height)
  .attr("width", width)
var tooltip = d3.select("#map").append("div")
    .attr("class", "tooltip");




d3.select("#species-map")
  .attr("height", height)
  .attr("width", width)

var spectooltip = d3.select("#species-map").append("div")
    .attr("class", "tooltip");


var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "map1")
    .call(d3.behavior.zoom()
    .on("zoom", redraw))
    .append("g");

var specsvg = d3.select("#species-map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "map2")
    .call(d3.behavior.zoom()
    .on("zoom", specredraw))
    .append("g");

  svg.append("svg:defs").selectAll("marker")
    .data(["middle"])      // Different link/path types can be defined here
  .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 1)
    .attr("markerHeight", 1)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5")
    .style('fill', 'orange');



    function redraw() {
    svg.attr("transform", function(){ return "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"});
}
function specredraw(){
  specsvg.attr("transform", function(){ return "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"});
  }
 /*   function redraw() {
    svg.attr("transform", function(){ return "translate(" + d3.event.translate + ")scale(" + Math.max(d3.event.scale, .63) + ")"});
}
}*/

queue()
    .defer(d3.json, "plantgenmap/data/world-50m.json")
    .defer(d3.tsv, "plantgenmap/data/world-country-names.tsv")
    .defer(d3.json, "plantgenmap/authors.json")
    .defer(d3.json, "plantgenmap/lastauthor.json")
    .defer(d3.json, "plantgenmap/funding.json")
    .defer(d3.json, "plantgenmap/firstauthor.json")
    .defer(d3.json, "plantgenmap/focalspecies.json")
    .await(ready);

function ready(error, world, names, authors, lastauthor, funding, firstauthor, focalspecies) {


  var countries = topojson.object(world, world.objects.countries).geometries,
      neighbors = topojson.neighbors(world, countries),
      i = -1,
      n = countries.length;

  countries.forEach(function(d) { 
    var tryit = names.filter(function(n) { return d.id == n.id; })[0];
    if (typeof tryit === "undefined"){
      d.name = "Undefined";
      console.log(d);
    } else {
      d.name = tryit.name; 
    }
  });

var country = svg.selectAll(".country").data(countries);

var speccountry = specsvg.selectAll('.country').data(countries)



  country
   .enter()
    .insert("path")
    .attr("class", "country")    
      .attr("title", function(d,i) { return d.name; })
      .attr("d", path)
      //.style("fill", function(d, i) { return color(d.color = d3.max(neighbors[i], function(n) { return countries[n].color; }) + 1 | 0); });
      .style('fill', 'white')
      .style('opacity', .3)
      .style('stroke', 'black')
      .style('stroke-width', 1)

    //Show/hide tooltip
    country
      .on("mousemove", function(d,i) {
        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

        tooltip
          .classed("hidden", false)
          .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
          .html(d.name)
      })
      .on("mouseout",  function(d,i) {
        tooltip.classed("hidden", true)
      });


speccountry
   .enter()
    .insert("path")
    .attr("class", "country")    
      .attr("title", function(d,i) { return d.name; })
      .attr("d", path)
      //.style("fill", function(d, i) { return color(d.color = d3.max(neighbors[i], function(n) { return countries[n].color; }) + 1 | 0); });
      .style('fill', 'white')
      .style('opacity', .3)
      .style('stroke', 'black')
      .style('stroke-width', 1)

    //Show/hide tooltip
    speccountry
      .on("mousemove", function(d,i) {
        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

        spectooltip
          .classed("hidden", false)
          .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
          .html(d.name)
      })
      .on("mouseout",  function(d,i) {
        spectooltip.classed("hidden", true)
      });



//console.log(points[1].links)
var fieldstrings = [ 'authors', 'firstauthor', 'lastauthor', 'funding']

//var fieldstrings = ['focalspecies', 'authors', 'firstauthor', 'lastauthor', 'funding']

 var fields = [ authors, firstauthor, lastauthor, funding];

//  var fields = [focalspecies, authors, firstauthor, lastauthor, funding];
 //var fields = [lastauthor, firstauthor];
 //var colors = [ 'grey', 'green', 'red', 'blue', 'white']

// var colors = [  'green', 'red', 'blue', 'orange']

var colors = [ colorscat(0), colorscat(1), colorscat(2), colorscat(3)]
for (var i = 0; i < fields.length; i++){
  drawFieldMap(fields[i], colors[i], fieldstrings[i])
}



function drawFieldMap(field, color, f_name){

 // console.log(field[1].nodes.length)

  var links = field[1].links

  fieldName = f_name


  links.forEach(function(link){
    if (link.source == -1 || link.target == -1){
      link.source = 1;
      link.target = 1;
    }
    link.source = field[0].cities[link.source];
    link.target = field[0].cities[link.target]

  })

  var path2 = svg.append("svg:g").selectAll("path")
      .data(links)
    .enter().append("svg:path")
  //    .attr("class", function(d) { return "link " + d.type; })
      .attr("class", "link " + fieldstrings[i])
      .attr('stroke-width', function(d){
       /* if (i == 0){
          return .1
        }*/
        return d.value / 8
      })
      .attr('stroke', color)
      .attr('stroke-opacity', 1)
     // .attr('class', field)
     // .attr("marker-end", "url(#middle)");

  field[0].cities.forEach(function(d) { 
        var x = projection(d.geometry.coordinates)[0];
        var y = projection(d.geometry.coordinates)[1];
        var r = d.score
        var fieldName = f_name

        var circles = svg.append("svg:circle")
            .attr("class", 'point ' + fieldstrings[i])
            .attr("cx", x)
            .attr("cy", y)
            .attr("r",  function(d) {
              /*if ( i == 0){
                return Math.sqrt(r/Math.PI) / 3
              }*/
              return Math.sqrt(r/Math.PI) 
             })
            .style("fill", color)
            .style("fill-opacity", .8)
            .style('stroke', 'black')
            .on('click', function(){
              console.log(fieldName)
              var thing = getSideGraph(d.properties.name, fieldName, color, 1)
              var otherthing = filterSpeciesMap(d.properties.name.replace(" ", "_"))
             // getSideGraph(d.properties.name, 'focalspecies', colorscat(4), thing)
            })



        var name = d.properties.name;

         svg.append("svg:text")
            .attr("x", x+4)
            .attr("y", y+1)
            .text();

          circles.on("mousemove", function(d,i) {
          var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

          tooltip
            .classed("hidden", false)
            .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
            .html(name + ' ' + r)
        })
        .on("mouseout",  function(d,i) {
          tooltip.classed("hidden", true)
        });

    });

  path2.attr("d", function(d) {
          var source = projection(d.source.geometry.coordinates)
          var target = projection(d.target.geometry.coordinates)
          var dx = target[0]- source[0],
              dy = target[1] - source[1],
              dr = Math.sqrt(dx * dx + dy * dy);
          return "M" + 
              source[0] + "," + 
              source[1]+ "A" + 
              dr / (1 + (i/10)) + "," + dr + " 0 0,1 " + 
              target[0] + "," + 
              target[1];
      })
      .style('stroke', color)
      .style('stroke-opacity', .1)


  path2.on("mousemove", function(d,i) {
          var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

          tooltip
            .classed("hidden", false)
            .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
            .html(d.source.properties.name + ' => ' + d.target.properties.name + '\n' + d.value)
        })
        .on("mouseout",  function(d,i) {
          tooltip.classed("hidden", true)
        });

}//drawmapfield


$scope.updateData = function(thing){
  var change = svg.selectAll("." + thing[3]).transition()
  //var change = svg.selectAll('#map1').transition()
  change
      .duration(750)
      .attr('display', function(d){
      if (thing[1]){
        return ''
      }
      else {
        return 'none'
      }
    });
}

var labels = d3.select('#labels')
                .append('svg')
                .attr('id', 'label_svg')
                .attr('height', 70)
                .attr('width', width)


var label_g = labels.selectAll('svg')
                    .data(labelFields)
                    .enter()
                    .append('svg')
                    .attr('x', function(d, i){
                      return 160 * i
                    })
                    .attr('y', 20)
                    .attr('height', 50)
                    .attr('width', 160)
                    .on('mouseover', function(d){
                      d3.select(this).style('cursor', 'pointer')
                      d3.select(this).selectAll('rect').transition().duration(250)
                      .attr('height', 28)
                     // .attr('width', 153)
                      
                      
                    })
                    .on('mouseout', function(d){
                         d3.select(this).selectAll('rect').transition().duration(250)
                         .attr('height', 22)
                      //  .attr('width', 150)
                       
                      })
                    .on('click', function(d){
                      if (d[1]){
                        d[1] = false
                        d3.select(this).selectAll('rect').transition().duration(250).style('opacity', .1)
                        $scope.updateData(d)
                       
                      }
                      else{
                        d3.select(this).selectAll('rect').transition().duration(250).style('opacity', .7)
                         d[1] = true
                        $scope.updateData(d)  
                      };
                    })
                 
var rect = label_g.append('rect')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('id', function(d){
                          return 'select' + d
                        })
                        .style('rx', 4)
                        .style('ry', 4)
                        .attr('height', 22)
                        .attr('width', 150)
                        .style('opacity', .7)
                        .style('fill', function(d, i){
                          return colors[i]
                        })

var text = label_g.append('text')
            .style('font-family', 'Helvetica')
            .style('font-size', 20)
            .attr('x', 25)
            .attr('y', 18)
            .style('opacity', 7)
            .text(function(d){return d[0]})



field = focalspecies
color = colorscat(4)
var links = field[1].links

links.forEach(function(link){
  if (link.source == -1 || link.target == -1){
    link.source = 1;
    link.target = 1;
  }
  link.source = field[0].cities[link.source];
  link.target = field[0].cities[link.target]

})

var path2 = specsvg.append("svg:g").selectAll("path")
    .data(links)
  .enter().append("svg:path")
//    .attr("class", function(d) { return "link " + d.type; })
    .attr("class", function(d){
     var source = d.source.properties.name.replace(" ", "_");
     var target = d.target.properties.name.replace(" ", "_");
     return "link " + source + ' ' + target;  })
    .style('stroke-width', function(d){
      return d.value/500
    })
    .style('stroke', color)
    .style('stroke-opacity', .03)
   // .attr('class', field)
   // .attr("marker-end", "url(#middle)");


field[0].cities.forEach(function(d) { 
      var x = projection(d.geometry.coordinates)[0];
      var y = projection(d.geometry.coordinates)[1];
      var r = d.score


      var circles = specsvg.append("svg:circle")
          .attr("class", 'point ' + fieldstrings[i])
          .attr("cx", x)
          .attr("cy", y)
          .attr("r",  function(d) {
            /*if ( i == 0){
              return Math.sqrt(r/Math.PI) / 3
            }*/
            return Math.sqrt(r/Math.PI) /2
           })
          .style("fill", color)
          .style("fill-opacity", .8)
          .style('stroke', 'black')
          .on('click', function(){
           var otherthing = filterSpeciesMap(d.properties.name.replace(" ", "_"))
          })



      var name = d.properties.name;

       specsvg.append("svg:text")
          .attr("x", x+4)
          .attr("y", y+1)
          .text();

        circles.on("mousemove", function(d,i) {
        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

        spectooltip
          .classed("hidden", false)
          .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
          .html(name + ' ' + r)
      })
      .on("mouseout",  function(d,i) {
        spectooltip.classed("hidden", true)
      });

  });

path2.attr("d", function(d) {
        var source = projection(d.source.geometry.coordinates)
        var target = projection(d.target.geometry.coordinates)
        var dx = target[0]- source[0],
            dy = target[1] - source[1],
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + 
            source[0] + "," + 
            source[1]+ "A" + 
            dr / (1 + (i/10)) + "," + dr + " 0 0,1 " + 
            target[0] + "," + 
            target[1];
    })
    .style('stroke', color)
   // .style('stroke-opacity', .08)


path2.on("mousemove", function(d,i) {
        var mouse = d3.mouse(specsvg.node()).map( function(d) { return parseInt(d); } );

        spectooltip
          .classed("hidden", false)
          .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
          .html(d.source.properties.name + ' <=> ' + d.target.properties.name + '\n' + d.value)
      })
      .on("mouseout",  function(d,i) {
        spectooltip.classed("hidden", true)
      });


function filterSpeciesMap(country){
  specsvg.selectAll(".link").attr('display', 'none')

  specsvg.selectAll('.' + country).attr('display', '').style('stroke-opacity', .3)
}

function resetSpeciesMap(){
  specsvg.selectAll(".link").attr('display', '').style('stroke-opacity', .03).style('stroke-opacity', .03)

}//specmap

var resetbutton = d3.select('#resetbutton')

var resetsvg = resetbutton.append('svg')
                .attr('id', 'specreset')
                .attr('height', 30)
                .attr('width', width)

var reset_g = resetsvg.append('svg').attr('x', 3)
                    .attr('y',3)
                    .attr('height', 50)
                    .attr('width', 160)
                    .on('mouseover', function(d){
                      d3.select(this).style('cursor', 'pointer')
                      d3.select(this).selectAll('rect').transition().duration(250)
                      .attr('height', 28)    
                    })
                    .on('mouseout', function(d){
                         d3.select(this).selectAll('rect').transition().duration(250)
                         .attr('height', 22)

                      })
                    .on('click', function(d){
                      resetSpeciesMap()
                    })

          reset_g.append('rect')
              .attr('x', 0)
            .attr('y', 0)
              .attr('id', 'resetrect')
              .style('rx', 4)
              .style('ry', 4)
              .attr('height', 22)
              .attr('width', 150)
              .style('opacity', .7)
              .style('fill', colorscat(4))
            reset_g.append('text')
            .style('font-family', 'Helvetica')
            .style('font-size', 20)
            .attr('x', 10)
            .attr('y', 18)
            .style('opacity', 7)
            .text("Reset Species")

//resetbutton.append()



var sideHeight = 492
var sideWidth = 405

nodemap_h = 400
var map_side_box = d3.select('#map-side')

var mapSide = map_side_box.append('div')
                .attr('height', sideHeight)
                .attr('width', sideWidth)
                .attr('id', 'side_box')
                .style('text-align', 'center')

var side_nodemap = mapSide.append('svg')
                      .attr('height', nodemap_h)
                      .attr('width', sideWidth)
                      .attr('id', 'side_nodemap')





side_nodemap.append('text')
          .attr('x', 70)
          .attr('y', 100)
          .style('font-size', 13)
          .text('Select a country Circle to see relationships')

var spec_map_side_box = d3.select('#spec-map-side')
var specMapSide = spec_map_side_box.append('div')
                          .attr('height', sideHeight)
                          .attr('width', sideWidth)
                          .attr('id', 'spec_side_box')
                          .style('text-align', 'center')

var spec_side_nodemap = specMapSide.append('svg')
                                .attr('height', nodemap_h)
                                .attr('width', sideWidth)
                                .attr('id', 'spec_side_nodemap')

spec_side_nodemap.append('text')
          .attr('x', 70)
          .attr('y', 100)
          .style('font-size', 13)
          .text('Select a country Circle to see relationships')

var linktable = mapSide.append('div')
                    .attr('height', sideHeight - nodemap_h)
                    .attr('width', sideWidth)
                    .attr('id', 'link-table')
                    .attr('x', 0)
                     .attr('overflow', 'scroll')
                  
var speclinktable = specMapSide.append('div')
                    .attr('height', sideHeight - nodemap_h)
                    .attr('width', sideWidth)
                    .attr('id', 'speclink-table')
                    .attr('x', 0)
                    .attr('overflow', 'scroll')
                   

linktable.append('p')
        .attr('x', 70)
        .attr('y', 30)
        .style('padding-bottom', '72px')
        .style('padding-left', '0px')
        .text('Select a country to see relationships table')

speclinktable.append('p')
        .attr('x', 70)
        .attr('y', 30)
        .style('padding-bottom', '72px')
        .style('padding-left', '0px')
        .text('Select a country to see relationships table')

function removeDuplicates(originalArray, prop) {
     var newArray = [originalArray[0]];
    

     for(var i = 0; i < originalArray.length; i++){
      if (newArray.find(function(element){
        return element.id == originalArray[i].id
      }) == undefined){
        newArray.push(originalArray[i])
      }
     }

     /*var lookupObject  = {};

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }*/
     console.log(newArray.length)
      return newArray;
 }//removeDuplicates


function getFieldFromCountryJson(selfield, data){
   for( var i = 0; i < data.length; i++){
      if (data[i].field == selfield){
       return data[i];
      };
    };
  return {}
};

function countryNodesIndex(nodes, index_f){
  for (var i = 0; i < nodes.length; i++){
    if(nodes[i].index == index_f){
      return i
    }
  }
  return -1
}

function formatForTable(graph, directed){
  nodes = graph.nodes;
  links = graph.links;

  console.log(nodes[0])

  result = [];
  if(!directed){
    for(var i = 1; i < nodes.length; i++){
      result.push({
        score : nodes[i].score,
        country : nodes[i].properties.name,
        link1 : findLinks(links, i)
      })
    }
  }
  else{
    for(var i = 1; i < nodes.length; i++){
      result.push({
        score : nodes[i].score,
        country : nodes[i].properties.name,
        link1 : findDirectedLinks(links, i, 'source'),
        link2 : findDirectedLinks(links, i, 'target')
      })
    }
  }
  var sorted = result.sort(function(a,b){ return b.score - a.score;})
  return sorted
}

function findLinks(links, index){
  for(var i = 0; i < links.length; i++){
    if( links[i].target == index || links[i].source == index){
      return links[i].value;
    }
  }
  return 0
}

function reOrderTable(data, order){
  if (order == 'index'){
    return data.sort(function(a,b){ return b.index - a.index})
  }
  if (order == 'title'){
    return data.sort(function(a,b){ 
      if(a.country < b.country) return -1;
      if(a.country> b.country) return 1;
      return 0;})
  }
  if (order == 'link1'){
      return data.sort(function(a,b){ return b.link1 - a.link1})
  }
  if (order == 'link2'){
     return data.sort(function(a,b){ return b.link2 - a.link2})
  }
  if (order == 'score'){
     return data.sort(function(a,b){ return b.score - a.score})
  }
  return data
}

function findDirectedLinks(links, index, t){
  for(var i = 0; i < links.length; i++){
    if(links[i][t] == index){
      return links[i].value
    }
  }
  return 0
}
                      
function getSideGraph(country, sel_field, color, side_no){



function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

table_color = hexToRgb(color)

spectable_color = colorscat(4)

rgbspectable_color = hexToRgb(spectable_color)

  side_graph = d3.select('#side_nodemap')
  side_table = d3.select('#link-table')

  specside_graph = d3.select('#spec_side_nodemap')
  specside_table = d3.select('#speclink-table')

s_width = 405
s_height = 400
side_graph.remove()
side_table.remove()
specside_graph.remove()
specside_table.remove()

side_graph = mapSide.append('svg')
                      .attr('height', s_height)
                      .attr('width', s_width)
                      .attr('id' , 'side_nodemap')
                       .style('text-align', 'center')
side_table = mapSide.append('div')
                    .attr('id', 'link-table')
                    .attr('x', 0)
                    .style('background-color', "rgba(" + table_color.r + "," + table_color.g + "," + table_color.b + ",.1)")

specside_graph = specMapSide.append('svg')
                      .attr('height', s_height)
                      .attr('width', s_width)
                      .attr('id', 'spec_side_nodemap')
                       .style('text-align', 'center')
specside_table = specMapSide.append('div')
                    .attr('id', 'speclink-table')
                    .attr('x', 0)
                    .style('background-color', "rgba(" + rgbspectable_color.r + "," + rgbspectable_color.g + "," + rgbspectable_color.b + ",.1)")


var table = side_table.append('table').attr('class', 'table');

var spectable = specside_table.append('table').attr('class', 'table');



 

  country = country.replace(' ', '_');


  var charge = -150;
  var linkDistance = 150;
  var radius = 10;

  var folderpath = 'country_force/';

  var  specfolderpath = 'spec_country_force/';
  var  speccharge = -100;
  var  speclinkDistance = 60;
  

  d3.json('plantgenmap/' + folderpath + country +".json", function(error, graph) {
   
    var force_graph_data; 
  

    force_graph_data = getFieldFromCountryJson(sel_field, graph);

    var country_index = force_graph_data.nodes[0].index;





    if (sel_field == 'firstauthor' || sel_field == 'lastauthor'){
      force_graph_data.nodes = removeDuplicates(force_graph_data.nodes, "index")
    }



    force_graph_data.links.forEach(function(l){
      l.source = countryNodesIndex(force_graph_data.nodes, l.source)
      l.target = countryNodesIndex(force_graph_data.nodes, l.target)
      //clean up errors
      if (l.source == -1 || l.target == -1){
        l.source = 0;
        l.target = 0
      }
    }) 

    var columns = [
        { head: 'Index', cl: 'center', html: 'index' },
        { head: 'Country', cl: 'center', html: 'title' },
        { head: 'Score', cl: 'center', html: 'score' },
        { head: 'Link Score', cl: 'center', html: 'link1' }
    ];



 if (sel_field == 'firstauthor' || sel_field == 'lastauthor'){
    columns = [
        { head: 'Index', cl: 'center', html: 'index' },
        { head: 'Country', cl: 'center', html: 'title' },
        { head: 'Score', cl: 'center', html: 'score' },
        { head: 'Link-towards Score', cl: 'center', html: 'link1' },
        { head: 'Link-away Score', cl: 'center', html: 'link2' }
    ];

    var table_data = formatForTable(force_graph_data, true)
  }
  else{
    var table_data = formatForTable(force_graph_data, false)
  }

    table.append('thead').append('tr')
        .selectAll('th')
        .data(columns).enter()
        .append('th')
        .attr('class', (d) => d.cl)
        .attr('id', (d)=> d.head + 1)
        .text((d) => d.head)
        .on('click', function(d){
          var reordered = reOrderTable(table_data, d.html)
          redrawTable(reordered)
        })
        .on('mouseover', function(d){
           d3.select(this).style("cursor", "pointer")
        });

    function redrawTable(reordered){
      table.select('tbody').remove();
      table.append('tbody')
        .attr('id', 'spectbody')
        .selectAll('tr')
        .data(reordered).enter()
        .append('tr')
        .attr('class', (d) => d.country.replace(' ', '_') + 1)
        .selectAll('td')
        .data(function(d, i) { 
            if (sel_field == 'firstauthor' || sel_field == 'lastauthor'){
            return [i + 1, d.country, d.score, d.link1, d.link2 ]
          }
          else{
            return [i + 1, d.country, d.score, d.link1]
          }
        }).enter()
        .append('td')
        .html((d) => d)
        .attr('class', 'center');
    };



    table.append('tbody')
        .selectAll('tr')
        .data(table_data).enter()
        .append('tr')
        .attr('class', (d) => d.country.replace(' ', '_') + side_no)
        .selectAll('td')
        .data(function(d, i) { 
          if (sel_field == 'firstauthor' || sel_field == 'lastauthor'){
            return [i + 1, d.country, d.score, d.link1, d.link2 ]
          }
          else{
            return [i + 1, d.country, d.score, d.link1]
          }
        }).enter()
        .append('td')
        .html((d) => d)
        .attr('class', 'center');





    var force = d3.layout.force()
    .charge(charge)
    .linkDistance(linkDistance)
      .size([400, 600])
      .gravity(0);
    force
        .nodes(force_graph_data.nodes)
        .links(force_graph_data.links)
        .start();


   var linksize = 3
   var nodesize = 1

  side_graph.append("svg:defs").selectAll("marker")
    .data(["middle"])      
  .enter().append("svg:marker")  
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 10)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .style('stroke-opacity', .3)
    .style('fill-opacity', 1 )
    .style('fill', 'grey')
  .append("svg:path")
    .attr("d", "M0,-3L10,0L0,3");//marker

  var linkpath = side_graph.selectAll("path")
    .data(force_graph_data.links)
      .enter().append("svg:path")
      .attr("class", "link")
      .style("stroke-width", function(d) { return d.value/ linksize; })
      .style('stroke', 'black')
      .style('stroke-opacity', .3)
      .on('click', function(d){
        console.log(d.target.properties.name.replace(' ', '_'))
      })//links

    if (sel_field == 'firstauthor' || sel_field == 'lastauthor'){
      linkpath.attr("marker-mid", "url(#middle)");
    }
     linkpath.append("title")
      .text(function(d) { return  d.value });



  var node = side_graph.selectAll(".node")
      .data(force_graph_data.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", function(d) { return (Math.sqrt(d.score/Math.PI) * 3)/ nodesize  })
      .style("fill", color)
      .style("opacity", .6)
      .style("stroke", 'black')
      .call(force.drag)
      .on('click', function(d){
        table_rows = d3.selectAll('.' + d.properties.name.replace(' ', '_') + side_no)
        //var rowPos = table[0][0].find(table_rows[0][0]).position();
        //console.log(rowPos)
        //$("html").scrollTop();
       // table_rows[0][0]
      });//nodes

      node.append("title")
      .text(function(d) { return  d.score });


var text = side_graph.selectAll('.text')
    .data(force_graph_data.nodes)
    .enter().append('text')
    .attr('x', 100)
    .attr('y', 100)
    .style('font-family', 'Helvetica')
    .style('font-size', '9px')
    .style('font-weight', 'bold')
    .text((d) => d.properties.name);//text

       text.append("title")
      .text(function(d) { return  d.score });

    force.on("tick", function() {

      var q = d3.geom.quadtree(force_graph_data.nodes),
      i = 0,
      n = force_graph_data.nodes.length;

  while (++i < n) q.visit(collide(force_graph_data.nodes[i]));


      linkpath.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
         if (sel_field == 'firstauthor' || sel_field == 'lastauthor'){
              dr = Math.sqrt(dx * dx + dy * dy);
        }
        else{
          dr = 0
        }
        return "M" + 
            d.source.x + "," + 
            d.source.y + "A" + 
            dr + "," + dr + " 0 0,1 " + 
            d.target.x + "," + 
            d.target.y;
    });//links

      node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(s_width - 10, d.x)); })
          .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(s_height - 10, d.y)); });
      text.attr("x", function(d) { return d.x = Math.max(radius, Math.min(s_width - 10, d.x)); })
          .attr("y", function(d) { return d.y = Math.max(radius, Math.min(s_height - 10, d.y)); });

     })//on tick;

    function collide(node) {
  var r = ((Math.sqrt(node.score/Math.PI) * 3)/ nodesize) + 40
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = node.radius + quad.point.radius;
      if (l < r) {
        l = (l - r) / l * .5;
        node.x -= x *= l;
        node.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}//collide



})//other field data
d3.json('plantgenmap/' +specfolderpath + country + ".json", function(error2, graph2){

  var specforce_graph_data;

  var specforce_graph_data = graph2[0];
  var speccountry_index = specforce_graph_data.nodes[0].index;


  specforce_graph_data.links.forEach(function(l){
      l.source = countryNodesIndex(specforce_graph_data.nodes, l.source)
      l.target = countryNodesIndex(specforce_graph_data.nodes, l.target)

      if (l.source == -1 || l.target == -1){
        l.source = 0;
        l.target = 0
      }
    })

    var speccolumns = [
        { head: 'Index', cl: 'center', html: 'index' },
        { head: 'Country', cl: 'center', html: 'title' },
        { head: 'Score', cl: 'center', html: 'score' },
        { head: 'Link Score', cl: 'center', html: 'link1' }
    ]; 

    var spectable_data = formatForTable(specforce_graph_data, false)

     spectable.append('thead').append('tr')
        .selectAll('th')
        .data(speccolumns).enter()
        .append('th')
        .attr('class', (d) => d.cl)
        .attr('id', (d) => d.html + 2)
        .text((d) => d.head)
        .on('click', function(d){
          var reordered = reOrderTable(spectable_data, d.html)
          redrawTable(reordered)
        })
        .on('mouseover', function(d){
           d3.select(this).style("cursor", "pointer")
        });

    function redrawTable(reordered){
      spectable.select('tbody').remove();
      spectable.append('tbody')
        .attr('id', 'spectbody')
        .selectAll('tr')
        .data(reordered).enter()
        .append('tr')
        .attr('class', (d) => d.country.replace(' ', '_') + 2)
        .selectAll('td')
        .data(function(d, i) { 
            return [i + 1, d.country, d.score, d.link1]
        }).enter()
        .append('td')
        .html((d) => d)
        .attr('class', 'center');
    }


    spectable.append('tbody')
        .attr('id', 'spectbody')
        .selectAll('tr')
        .data(spectable_data).enter()
        .append('tr')
        .attr('class', (d) => d.country.replace(' ', '_') + 2)
        .selectAll('td')
        .data(function(d, i) { 
            return [i + 1, d.country, d.score, d.link1]
        }).enter()
        .append('td')
        .html((d) => d)
        .attr('class', 'center');

    var specforce = d3.layout.force()
            .charge(speccharge)
            .linkDistance(speclinkDistance)
            .size([400, 600])
            .gravity(0);
    specforce
        .nodes(specforce_graph_data.nodes)
        .links(specforce_graph_data.links)
        .start();

    var speclinksize = 1000;
    var specnodesize = 3;
    var specradius = 5;

    var speclinkpath = specside_graph.selectAll("path")
      .data(specforce_graph_data.links)
      .enter().append("svg:path")
      .attr("class", "link")
      .style("stroke-width", function(d) { return d.value/ speclinksize; })
      .style('stroke', 'black')
      .style('stroke-opacity', .3)
      .on('click', function(d){
        console.log(d.target.properties.name.replace(' ', '_'))
      })//links

    speclinkpath.append("title")
      .text(function(d) { return  d.value });

    var specnode = specside_graph.selectAll(".node")
      .data(specforce_graph_data.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", function(d) { return (Math.sqrt(d.score/Math.PI) * 3)/ specnodesize  })
      .style("fill", spectable_color)
      .style("opacity", .6)
      .style("stroke", 'black')
      .call(specforce.drag)
      .attr('href', 'https://www.reddit.com/')
      //.on('click', function(d){
       // table_rows = d3.selectAll('.' + d.properties.name.replace(' ', '_') + side_no)



        //var rowPos = table[0][0].find(table_rows[0][0]).position();
        //console.log(rowPos)
        //$("html").scrollTop();
       // table_rows[0][0]
    //  });//nodes

    specnode.append("title")
      .text(function(d) { return d.properties.name + ':' +  d.score });


    var spectext = specside_graph.selectAll('.text')
        .data(specforce_graph_data.nodes)
        .enter().append('text')
        .attr('x', 100)
        .attr('y', 100)
        .style('font-family', 'Helvetica')
        .style('font-size', '7px')
        .style('font-weight', 'bold')
        .text((d) => d.properties.name);//text

        spectext.append("title")
          .text(function(d) { return  d.score });

    specforce.on("tick", function() {

      var q = d3.geom.quadtree(specforce_graph_data.nodes),
      i = 0,
      n = specforce_graph_data.nodes.length;

  while (++i < n) q.visit(collide(specforce_graph_data.nodes[i]));


      speclinkpath.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
            dr = 0
        
        return "M" + 
            d.source.x + "," + 
            d.source.y + "A" + 
            dr + "," + dr + " 0 0,1 " + 
            d.target.x + "," + 
            d.target.y;
    });//links

      specnode.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(s_width - 10, d.x)); })
          .attr("cy", function(d) { return d.y = Math.max(specradius, Math.min(s_height - 10, d.y)); });
      spectext.attr("x", function(d) { return d.x = Math.max(specradius, Math.min(s_width - 10, d.x)); })
          .attr("y", function(d) { return d.y = Math.max(specradius, Math.min(s_height - 10, d.y)); });

     })//on tick;

        function collide(node) {
  var r = ((Math.sqrt(node.score/Math.PI) * 3)/ specnodesize) + 40
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = node.radius + quad.point.radius;
      if (l < r) {
        l = (l - r) / l * .5;
        node.x -= x *= l;
        node.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}//collide


  })//focalspecies data
return 2;
}//getSideGraph

}//ready
}])