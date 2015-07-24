function RangeSlider(id, params){
    "use strict"

    var sliderObj = this;

    if( !(this instanceof RangeSlider) ){
        throw new Error("RangeSlider needs to be called with the new keyword");
    }

    this.id = id;

    if (params === undefined) {
        params = {};
    }

    this.margin = {top: 0, left: 10, right: 15, bottom: 2};

    var min = params.min === undefined ? 0 : params.min;
    var max = params.max === undefined ? (min + 5) : params.max;

    var sliderMin = params.defaultMin === undefined? min : params.defaultMin;
    var sliderMax = params.defaultMax === undefined? max : params.defaultMax;

    var bbox = d3.select(this.id).node().getBoundingClientRect();

    var height = bbox.height;
    var width = bbox.width;

    var sliderScale = d3.scale.linear().domain([min, max]).range([ this.margin.left, width - this.margin.right ]);

    var axis = d3.svg.axis().scale(sliderScale).orient("bottom");


    var line = d3.select(this.id)
    .append("rect")
    .attr("x", this.margin.left)
    .attr("y", sliderObj.margin.top)
    .attr("width", width - this.margin.right - this.margin.left)
    .attr("height", height/2)
    .attr("fill", "white");

    var slider = d3.select(this.id).append("g");

    var gAxis = slider.append("g").attr("class", "axis").attr("transform", "translate(0,"+(sliderObj.margin.top + height/2)+")").call(axis);

    var sliderRect = slider.append("rect")
    .attr("x", sliderScale(sliderMin))
    .attr("y", sliderObj.margin.top)
    .attr("width", sliderWidth())
    .attr("height", height/2)
    .attr("fill", "red");

    var sliderLeftHandle = slider.append("rect")
    .attr("x", sliderScale(sliderMin))
    .attr("y", sliderObj.margin.top)
    .attr("width", 10)
    .attr("height", height/2)
    .attr("fill", "black");

    var leftDrag = d3.behavior.drag();
    leftDrag.on("drag", function(){
        var currentX = +sliderLeftHandle.attr("x");
        var newX = currentX + d3.event.dx;
        if (sliderScale.invert(newX) < min) {
            sliderMin = min;
        } else if (sliderScale.invert(newX + 20) < sliderMax ) {
            sliderMin = sliderScale.invert(newX );
            callEventListeners("changing", { cause: "range-left" });
        }
        redraw();
    })
    .on("dragend", function(){
        callEventListeners("change", { cause: "range-left" });
    })
    sliderLeftHandle.call(leftDrag);

    var sliderRightHandle = slider.append("rect")
    .attr("x", sliderScale(sliderMax) - 10)
    .attr("y", sliderObj.margin.top)
    .attr("width", 10)
    .attr("height", height/2)
    .attr("fill", "black");

    var rightDrag = d3.behavior.drag();
    rightDrag.on("drag", function(){
        var currentX = +sliderRightHandle.attr("x");

        var newX = currentX + d3.event.dx + 10;

        if (sliderScale.invert(newX) > max) {
            sliderMax = max;
        } else if (sliderScale.invert(newX - 20) > sliderMin ){
            sliderMax = sliderScale.invert(newX);
            callEventListeners("changing", { cause: "range-right" });
        }
        redraw();
    })
    .on("dragend", function(){
        callEventListeners("change", { cause: "range-right" });
    })
    sliderRightHandle.call(rightDrag);


    var sliderRectDrag = d3.behavior.drag();
    sliderRectDrag.on("drag", function(){
        var currentLeftX = +sliderLeftHandle.attr("x");
        var newLeftX = currentLeftX + d3.event.dx;

        var currentRightX = +sliderRightHandle.attr("x");
        var newRightX = currentRightX + d3.event.dx + 10;

        if (sliderScale.invert(newLeftX) >= min && sliderScale.invert(newRightX) <= max) {
            sliderMin = sliderScale.invert(newLeftX);
            sliderMax = sliderScale.invert(newRightX);
            callEventListeners("changing", { cause: "slide" });
        }
        redraw();
    })
    .on("dragend", function(){
        callEventListeners("change", { cause: "slide" });
    });
    sliderRect.call(sliderRectDrag);

    function redraw(){
        sliderRightHandle.attr("x", sliderScale(sliderMax) - 10);
        sliderLeftHandle.attr("x", sliderScale(sliderMin));
        sliderRect.attr("x", sliderScale(sliderMin)).attr("width", sliderWidth());
    }

    function sliderWidth(){
        return sliderScale(sliderMax) - sliderScale(sliderMin);
    }

    this.getSliderMin = function() {
        return sliderMin;
    }

    this.getSliderMax = function() {
        return sliderMax;
    }

    var eventListeners = Object.create(null);
    eventListeners.change = [];
    eventListeners.changing = [];

    var changeEventListeners = [];
    this.on = function(event, fn) {
        switch (event) {
            case "change":
                if( fn === null) {
                    eventListeners["change"] = [];
                }else {
                    eventListeners["change"].push(fn);
                }
                break;

            case "changing":
                if( fn === null) {
                    eventListeners["changing"] = [];
                }else {
                    eventListeners["changing"].push(fn);
                }
                break;
        }
    }

    function callEventListeners(event, params){
        var listeners = eventListeners[event];

        for(var i in listeners){
            listeners[i](params);
        }
    }
}
