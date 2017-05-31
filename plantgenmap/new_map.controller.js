dighumApp.controller('newMapController', ['$scope', function($scope){

d3.json('plantgenmap/new_map/spec_country_lists.json', function(error, spec_country_lists){

	var colorscat = d3.scale.category10();
	//other colors list for funding
	//var colors = [colorscat(0), colorscat(1), colorscat(2), colorscat(3), colorscat(4)]

	var colors = [colorscat(0), colorscat(1), colorscat(2), colorscat(3), colorscat(4)]
	
	var width  = 1200;
    var height = 600;

    var species_label_width = 400

	var labelFields = [['Authors', true, 0, 'authors'], 
					['First Author', true, 1, 'firstauthor'], 
					['Last Author', true, 2, 'lastauthor'],  
					//['Funding', true, 3, 'funding'],
					['Species', true, 4, 'focalspecies']]

	var labels = d3.select('#labels')
                .append('svg')
                .attr('id', 'label_svg')
                .attr('height', 90)
                .attr('width', width)


    var label_g = labels.selectAll('svg')
                    .data(labelFields)
                    .enter()
                    .append('svg')
                    .attr('x', function(d, i){
                      return 160 * i
                    })
                    .attr('y', 20)
                    .attr('height', 30)
                    .attr('width', function(d, i){
                    	if(d[3] != 'species'){
                    		return 160;
                    	}
                    	else{
                    		return species_label_width
                    	}
                    })
                    .attr('id', function(d){
                    	return d[3]
                    })
                    .on('mouseover', function(d){
                    d3.select(this).style('cursor', 'pointer')
                    if(d[3] != 'species'){
                      d3.select(this).selectAll('rect').transition().duration(250)
                      .attr('height', 28)
                    	}
                    else{
                    	d3.select(this).selectAll('rect').transition().duration(250)
                      .attr('height', 28)
                    	}
                	})
                    .on('mouseout', function(d){
                    if(d[3] != 'species'){
                         d3.select(this).selectAll('rect').transition().duration(250)
                         .attr('height', 22)
                      }
                    else{
                    	d3.select(this).selectAll('rect').transition().duration(250)
                      .attr('height', 22)
                    }
                  	})
                    .on('click', function(d){
                      if (d[1]){
                        d[1] = false
                        d3.select(this).selectAll('rect').transition().duration(250).style('opacity', .1)
                        if(d[3] == 'focalspecies'){
                        d3.select('#spec_options')
                        	.transition()
                        	.duration(250)
                        	.style('opacity', 0)
                        	}
                        $scope.updateData(d)
                      }
                      else{
                        d3.select(this).selectAll('rect').transition().duration(250).style('opacity', .7)
                         d[1] = true
                        if(d[3] == 'focalspecies'){
                        d3.select('#spec_options')
                        	.transition()
                        	.duration(250)
                        	.style('opacity', 1)
                        	}
                        $scope.updateData(d)  
                      };
                    })//label_g

var restore_button_svg = labels.append('svg')
							.attr('x', 0)
							.attr('y', 60)
							.attr('height', 30)
							.attr('width', 160)
							.attr('id','restoreButton')
							.classed('restore_button_active', false)
							.classed('restore_button_inactive', true)
							.on('click', function(d){
								hidden_elements = d3.selectAll('.zhidden')
								hidden_elements.classed('zhidden', false)
								restor_b = d3.select(this)
								restor_b.classed('restore_button_active', false)
								restor_b.classed('restore_button_inactive', true)
							})
var restore_button_rect = restore_button_svg.append('rect')
							.attr('x', 0)
							.attr('y', 0)
							.attr('id', 'restoreRect')
							.style('rx', 10)
							.style('ry', 10)
							.style('height', 22)
							.style('width', 150)
							.style('fill', 'grey')
							.style('opacity', .7)
var restore_text = restore_button_svg.append('text')
			.style('font-family', 'Helvetica')
            .style('font-size', 20)
            .attr('x', 25)
            .attr('y', 18)
            .style('opacity', 7)
            .text('Restore')



$scope.updateData = function(field){
	var field_vis = d3.selectAll('.' + field[3])
	field_vis.classed('hidden', function (d, i) {
    return !d3.select(this).classed("hidden")})
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


                 
var rect = label_g.append('rect')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('id', function(d){
                          return 'select' + d[3]
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

spec = d3.select('#species')
spec_select = spec.append('select')
$scope.spec_country_lists = spec_country_lists
$scope.cur_spec_ar = ['']
$scope.spec_auth = ''
$scope.spec_selected_country = $scope.cur_spec_ar[0]
$scope.spec_authors = [['All Species', true],
						['All Authors', false], 
						['First Author', false], 
						['Last Author', false]]
$scope.spec_select = function(d){
	$scope.spec_authors[d][1] = true
	if(d == 0){
		$scope.cur_spec_ar = ['']
		$scope.spec_selected_country = 'none'
		$scope.spec_auth = 'none'
	}
	if(d == 1){
		$scope.cur_spec_ar = spec_country_lists.all_author
		$scope.spec_selected_country = $scope.cur_spec_ar[0]
		$scope.spec_auth = 'species_all_auth'
	}
	if(d == 2){
		$scope.cur_spec_ar = spec_country_lists.first_author
		$scope.spec_selected_country = $scope.cur_spec_ar[0]
		$scope.spec_auth = 'species_first_auth'
	}
	if(d == 3){
		$scope.cur_spec_ar = spec_country_lists.last_author
		$scope.spec_selected_country = $scope.cur_spec_ar[0]
		$scope.spec_auth = 'species_last_auth'
	}

	for (var i = 0; i < 4; i++){
		if( i != d){
			$scope.spec_authors[i][1] = false
		}
	}
}

$scope.select_spec_country = function(){
	console.log($scope.spec_auth)
	console.log($scope.spec_selected_country)
	visualize_country_data('focalspecies', colorscat(3), 3, $scope.spec_auth, $scope.spec_selected_country)

}
spec_color	= hexToRgb(colors[labelFields.length - 1])

spec_options = d3.select('#spec_options')
spec_options
	.style('background-color','rgba(' + spec_color.r + ',' + spec_color.g + ',' + spec_color.b + ', .7)')
	.style('border-radius', '4px')
	var projection = d3.geo.mercator()
                .translate([600, 400])
                .scale(width + 100);

    var path = d3.geo.path().projection(projection);

  	d3.select("#map")
  		.style('text-align', 'center')


	var tooltip = d3.select("#map").append("div")
    	.attr("class", "tooltip");

    var svg = d3.select("#map").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("id", "map1")
	    .style('display', 'block')
	    .style('margin', 'auto')
	    .call(d3.behavior.zoom()
	    .on("zoom", redraw))
	    .append("g")


    function redraw() {
    	svg.attr("transform", function(){ return "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"});
	}

	queue()
    .defer(d3.json, "plantgenmap/data/world-50m.json")
    .defer(d3.tsv, "plantgenmap/data/world-country-names.tsv")
    .await(ready);

    function ready(error, world, names){
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

  		country
		   	.enter()
		    .insert("path")
		    .attr("class", "country")    
		      .attr("title", function(d,i) { return d.name; })
		      .attr("d", path)
		      .style('fill', 'white')
		      .style('opacity', 1)
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
	      visualize_country_data('authors', colorscat(0), 0)
	      visualize_country_data('firstauthor', colorscat(1), 1)
	      visualize_country_data('lastauthor', colorscat(2), 2)
	      visualize_country_data('focalspecies', colorscat(3), 3)
    }//ready


function getName(name){
	if (name == 'authors'){return 'authors2.json'};
	if (name == 'firstauthor'){return 'firstauthor2.json'};
	if (name == 'lastauthor'){return 'lastauthor2.json'};
	if (name == 'focalspecies'){return 'focalspecies2.json'};
	return 'none'
	
}

function getFancyName(name){
	if (name == 'authors'){return 'authors'};
	if (name == 'firstauthor'){return 'first author'};
	if (name == 'lastauthor'){return 'last author'};
	if (name == 'focalspecies'){return 'focal species'};
	return 'none'
	
}

$scope.filter_country = function(country){
	var c_nodes = d3.selectAll('.point')
	var c_links = d3.selectAll('.link')

	var restore_button = d3.select('#restoreButton')
	restore_button.classed('restore_button_inactive', false)
	restore_button.classed('restore_button_active', true)

	c_nodes.classed('zhidden', function(d, i){
		if (d3.select(this).classed(country)){return false}
		else{return true}
	})
	console.log(d3.selectAll('.point.Canada'))
	c_links.classed('zhidden', function(d, i){
		l_class = d3.select(this)
		l_class_arr = l_class.attr('class').split(' ')
		if(l_class_arr[0] == country){
			d3.selectAll('.point.' + l_class_arr[1]).classed('zhidden', false)
			return false
		}
		else if (l_class_arr[1] == country){
			d3.selectAll('point.' + l_class_arr[0]).classed('zhidden', false)
			return false
		}
		else{return true}
	})
	
		
}

svg.append("svg:defs").selectAll("marker")
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
    .attr("d", "M0,-3L10,0L0,3");

function visualize_country_data(name, color, index, specauthfield, specauthcoo ){

	specauthfield = specauthfield || ''
	specauthcoo = specauthcoo || ''


	var file
	if (specauthfield.length == 0){
		file = getName(name)
	}
	else{
		hidden_elements = d3.selectAll('.zhidden')
		hidden_elements.classed('zhidden', false)
		if(specauthfield == 'none'){
			file = 'focalspecies2.json'

		}
		else{
			file = specauthfield + '/' + specauthcoo + '.json'
		}
		d3.selectAll('.focalspecies').remove()
		var restore_button = d3.select('#restoreButton')
		restore_button.classed('restore_button_inactive', true)
		restore_button.classed('restore_button_active', false)

	}

	var fancyName = getFancyName(name)

	var arrowstring = '<=>'
	if(name == 'firstauthor' || name == 'lastauthor'){arrowstring = '=>'}
	d3.json('plantgenmap/' + file, function(error, data){


		var i = index

		var species_boo = false

		if (index == 3){
			species_boo = true
		}

	    field = data
		
		var links = field.links
		links.forEach(function(link){
	
		link.source = field.nodes[link.source];
		link.target = field.nodes[link.target]
		})
		var path1 = svg.append("svg:g").selectAll("path")
    		.data(links)
  			.enter().append("svg:path")	
			.attr("class", function(d){
		    	//console.log(d)
			     var source = d.source.properties.name.replace(" ", "_");
			     var target = d.target.properties.name.replace(" ", "_");
			     return source + ' ' + target;})
			.classed(name, true)
			.classed('link', true)
			.style('stroke-width', function(d){
				if(species_boo){
					return d.score/300
				}
			      return d.score / 8
			      
		    })
		    .style('stroke', color)
		    .style('stroke-opacity', 1)

		field.nodes.forEach(function(d) { 
		    var x = projection(d.geometry.coordinates)[0];
		    var y = projection(d.geometry.coordinates)[1];
		    var r = d.score
		    var co_name = d.properties.name;
		    var cl_name = d.properties.name.replace(' ', '_')


		    var circles = svg.append("circle")
		        .classed('point', true)
		        .classed(cl_name, true)
		        .classed(name, true)
		        .attr("cx", x)
		        .attr("cy", y)
		        .attr("r",  function(d) {
		            if ( species_boo){
		              return Math.sqrt(r/Math.PI) / 3
		            }
		            return Math.sqrt(r/Math.PI) //* 10
		        })
		        .style("fill", color)
		        .style("fill-opacity", .8)
		        .style('stroke', 'black')
		        .style('stroke-width', .5)
		        .on('click', function(){
		        	$scope.filter_country(cl_name)
		        })


		       svg.append("svg:text")
		          .attr("x", x+4)
		          .attr("y", y+1)
		          .text();

		        circles.on("mousemove", function(d,i) {
		        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

		        tooltip
		          .classed("hidden", false)
		          .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1] +"px")
		          .html(co_name + ' ' + fancyName + ' ' + r)
		      })
		      .on("mouseout",  function(d,i) {
		        tooltip.classed("hidden", true)
		      });

  });//nodes

path1.attr("d", function(d) {
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
    .style('stroke-opacity', .3)
if (name == 'firstauthor' || name == 'lastauthor'){
      path1.attr("marker-mid", "url(#middle)");
    }


path1.on("mousemove", function(d,i) {
        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );

        tooltip
          .classed("hidden", false)
          .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
          .html(d.source.properties.name + ' ' + arrowstring +' ' + d.target.properties.name + '\n' + d.score)
      })
      .on("mouseout",  function(d,i) {
        tooltip.classed("hidden", true)
      });



	})//get_file
	}//visualize country_data
})//get spec_country_lists

}]);//controller