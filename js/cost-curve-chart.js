function costCurveChart() {

	var margin = {top: 40, right: 40, bottom: 40, left: 40}
		, width = document.documentElement.clientWidth * .8
		, height = document.documentElement.clientHeight * .8
		, tooltip = {
				mouseover: function(d) { 
					var html = "<span>" + d.n + "</span><br>" +
										 "<span>" + "Unit Cost: $ " + d.h + "</span><br>" +
										 "<span>" + "Quantity: " + d.w + "</span>"
					this.el.html(html).transition()        
						.duration(100)      
						.style("opacity", 1)
				}
			, mousemove: function() {
					var pageX = event.pageX || event.clientX
						, pageY = event.pageY || event.clientY
					if (pageX < (width / 2) + 100) {
						return this.el.style("top", (pageY-30)+"px").style("left",(pageX+25)+"px");
					} else {
						return this.el.style("top", (pageY-30)+"px").style("left",(pageX-137)+"px");
					}
				}
			, mouseout: function(d) {       
					this.el.transition()        
						.duration(200)      
						.style("opacity", 0);   
				}
			}

  function chart(selection) {
		
		if (selection) {

			selection.each(function(data) {
					
				var aH = []
					, aW = []
	
				for (o in data) {
					aW.push(data[o].w)
					aH.push(data[o].h)
				}
		
				var innerWidth = width - margin.left - margin.right
					, innerHeight = height - margin.top - margin.bottom

					, max = d3.max(aH)
					, min = d3.min(aH)
					, barsHeight = min < 0 ? Math.abs(min) + max : max
					, yHeight = d3.max([max, Math.abs(min)])
					, xScale = d3.scale.linear()
					, yScale = d3.scale.linear()
					
					, w = innerWidth / aW.length
					, wRatio = innerWidth / d3.sum(aW)
					, hRatio = innerHeight / barsHeight
					, h = yHeight && hRatio ? yHeight * hRatio : innerHeight / 2

				// Update the x-scale
				xScale
					.domain([0, 1])
					.range([0, w])

				// Update the y-scale - rangeRound is used for antialiasing
				yScale
					.domain([0, yHeight])
					.rangeRound([0, yHeight])
				
				// initialize tooltip
				tooltip.el = d3.select(this).append("div")   
											 .attr("class", "tooltip")               
											 .style("opacity", 0)

				// Create the svg element
				var outerChart = d3.select(this).append("svg")
			
				// Update the outer dimensions
				outerChart.attr("class", "chart")
					.attr("width", width)
					.attr("height", height)
					
			
				var innerChart = outerChart.append("g")
 													 .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			
				// create chart
				innerChart.selectAll("rect")
					.data(data)
					.enter()
					.append("rect")

					// bar x position and width
					.attr("x", function(d, i) {
						if (i > 0) { 
							var start = 0, j
							for (j = 0; j < i; j++) {
								start += data[j].w * wRatio
							}
							return start
						} else { return 0 - .5}
					})
					.attr("width", function(d) {
						return (d.w * wRatio) < .5 ? .5 : (d.w * wRatio) - .5
					})

					// bar y position and height
					.attr("y", function(d) {
						return h - .5
					})
					.attr("height", 0)
					.transition()
					.attr("y", function(d) {
						if (d.h < 0) { return h - .5 } 
						else { return h - yScale(d.h * hRatio) - .5 }
					})
					.attr("height", function(d) { 
						return yScale(Math.abs(d.h) * hRatio) 
					})
					.duration(500)
					
				// add event handlers
				innerChart.selectAll("rect")
					.on("mouseover", function(d) { return tooltip.mouseover(d) })
					.on("mousemove", function() { return tooltip.mousemove() })
					.on("mouseout", function(d) { return tooltip.mouseout(d) })


				// create middle line
				innerChart.append("g").attr("class", "line")
					.append("line")
					.attr("x1", .5)
					.attr("x2", innerWidth - 1)
					.attr("y1", h - .5)
					.attr("y2", h - .5)
					.style("stroke", "#000")

				var yAxisScale = d3.scale.linear()
													 .domain([max || 100, min || -100])
													 .range([0, innerHeight]);


				var yAxis = d3.svg.axis()
											.scale(yAxisScale)
											.orient("left")
									 
				// create Y axis
				var yAxisGroup = innerChart.append("g")
													 .attr("class", "axis")
													 .call(yAxis)


			})
		}
	}

  chart.tooltip = function(_) {
    if (!arguments.length) return tooltip;
    tooltip = _;
    return chart;
  };
  
  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

	return chart;
}
