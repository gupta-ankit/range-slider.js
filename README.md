# range-slider.js
range-slider.js provides a d3.js based widget that can be used to select a range as well as slide the range

## Usage:
To use the widget, first create a `svg` element in your page.

```
<svg id="my-svg">
</svg>
```

To initialize the slider initialize the slider like this

```
var params = {min: 0, max: 24, defaultMin: 10, defaultMax: 20};
var slider = new RangeSlider("my-svg", params);
```

The first argument of `RangeSlider` constructor is the id of the svg. The second argument is a hash of parameters
for the widget. Currently the following parameters are supported:

* min: The minimum value of the slider
* max: The maximum value of the slider
* defaultMin: The default value where the **left** handle of slider should be when created.
* defaultMax: The default value where the **right** handle of slider should be when created.

To listen to user input, add an event handler like this:

```
slider.on("change", function(){
  ...do something
});
```

To get the values of the slider use the following functions:

* getSliderMin() : get the minimum of the range
* getSliderMax() : get the maximum of the range
