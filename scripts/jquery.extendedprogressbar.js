/**
 * @author Accorpa, LLC
 */
(function($) {  
	var settings;
	var methods = {
		init: function(options){
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		 	=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		 	=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//reset your settings
			settings = {
				min_val: 0,
				max_val: 100,
				initial_val: 0,
				critical_val: 80,
				critical_percent: 80,
				critical_enabled: true,
				normal_color: "#7cbc9a",
				critical_color: "#ffe6c9",
				overflow_color: "#e33e76",
				normal_complete_color: "#ef8c91",
				critical_complete_color: "#80d8ff",
				same_color_critical: false,
				direction: 'LTR',
				percentage_label: true,
				percentage_position: 'MC',
				percentage_font_size: 0,
				percentage_color: "#000000",
				value_label: false,
				value_position: 'MC',
				value_font_size: 0,
				value_color: "black",
				min_label: false,
				min_label_position: 'M',
				min_label_font_size: 0,
				min_label_color: "#000000",
				max_label: false,
				max_label_position: 'M',
				max_label_font_size: 0,
				max_label_color: "#000000",
				separator: true,
				infinite: false,
				tooltip: true,
				overflow: true
			};
			//passed options (if any) overwrite your defaults
			if (options) {
				$.extend(settings, options);
				if (options['critical_val']) {
					settings['critical_percent'] = (settings['critical_val'] - settings['min_val']) / (settings['max_val'] - settings['min_val']) * 100;
				}
				else if (options['critical_percent']) {
					settings['critical_val'] = ((settings['critical_percent'] / 100) * (settings['max_val'] - settings['min_val'])) + settings['min_val'];
				}
				else {
					//adjust critical val to match 80% of interval
					settings['critical_val'] = ((settings['critical_percent'] / 100) * (settings['max_val'] - settings['min_val'])) + settings['min_val'];
				}
				if (!options['normal_complete_color']) {
					settings['normal_complete_color'] = settings['normal_color'];
				}
				if (!options['critical_complete_color']) {
					settings['critical_complete_color'] = settings['critical_color'];
				}
				
				/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
				=-=-=-=-=Handling Wrong Cases-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
				=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
				if (settings['max_val'] < settings['min_val']) {
					var tmp = settings['max_val'];
					settings['max_val'] = settings['min_val'];
					settings['min_val'] = tmp;
				}
				if (settings['initial_val'] < settings['min_val']) {
					settings['initial_val'] = settings['min_val'];
				}
				if (settings['critical_percent'] > 100){
					settings['critical_percent'] = 100;
					settings['critical_val'] = settings['max_val'];
				}
				if (settings['critical_val'] > settings['max_val']){
					settings['critical_val'] = settings['max_val'];
					settings['critical_percent'] = 100;
				}
				if (settings['critical_percent'] < 0){
					settings['critical_percent'] = 100;
					settings['critical_val'] = settings['max_val'];
				}
				if (settings['critical_val'] < settings['min_val']){
					settings['critical_percent'] = 100;
					settings['critical_val'] = settings['max_val'];
				}
				/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
				/*-----------------------------------------------------------*/
				/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
				//save critical_val
				this.data('extendedprogressbar_critical_val', settings['critical_val']);
				if (settings['critical_enabled'] == false) {
					settings['critical_val'] = settings['max_val'];
					settings['critical_percent'] = 100;
				}
			}
			this.data('extendedprogressbar_options', settings);
			this.data('extendedprogressbar_current_value', settings['initial_val']);
			this.addClass("extendedprogressbarframe");
			var contents = "<div class='bars_holder' style='display: inline; position: relative; z-index: 2;'>";
			if (settings['direction'] == 'LTR') {
				//this.append("<div class='tesst1'></div>");
				//this.append("<div class='tesst2'></div>");
				//this.append("<div class='tesst3'></div>");
				//this.append("<div class='empty_bar'></div>")
				this.append("<div class='full_horizontal_bar ltr_bar'></div>");
				this.children('.full_horizontal_bar').css('left', '0px');
				this.append("<div class='empty_horizontal_bar'></div>");
				this.children('.empty_horizontal_bar').css('right', '0px');
				this.append("<div class='horizontal_bar_image ltr_bar'></div>");
				contents = contents + "<div class='normal_progress horizontalextendedprogressbar normal_bar' style='width:0; background-color: " + settings['normal_color'] + ";'></div>";
				contents = contents + "<div class='critical_progress critical_bar horizontalextendedprogressbar' style='width:0; background-color: " + settings['critical_color'] + ";'></div>";
				contents = contents + "<div class='separator horizontalextendedprogressbar' style='width: 0px;'></div>";
				contents = contents + "<div class='overflow_bar horizontalextendedprogressbar' style='width:0; background-color: " + settings['overflow_color'] + ";'></div>";
			}
			else if (settings['direction'] == 'RTL') {
				this.append("<div class='full_horizontal_bar rtl_bar'></div>");
				this.children('.full_horizontal_bar').css('right', '0px');
				this.append("<div class='empty_horizontal_bar'></div>");
				this.children('.empty_horizontal_bar').css('left', '0px');
				this.append("<div class='horizontal_bar_image rtl_bar'></div>");
				contents = contents + "<div class='horizontalextendedprogressbar dummy_bar' style='width:" + this.width() + "'></div>";
				contents = contents + "<div class='overflow_bar horizontalextendedprogressbar' style='width:0; background-color: " + settings['overflow_color'] + ";'></div>";
				contents = contents + "<div class='separator horizontalextendedprogressbar' style='width: 0px;'></div>";
				contents = contents + "<div class='critical_progress critical_bar horizontalextendedprogressbar' style='width:0; background-color: " + settings['critical_color'] + ";'></div>";
				contents = contents + "<div class='normal_progress horizontalextendedprogressbar normal_bar' style='width:0; background-color: " + settings['normal_color'] + ";'></div>";
			}
			else if (settings['direction'] == 'TTB') {
				this.append("<div class='full_vertical_bar ttb_bar'></div>");
				this.children('.full_vertical_bar').css('top', '0px');
				this.append("<div class='empty_vertical_bar'></div>");
				this.children('.empty_vertical_bar').css('bottom', '0px');
				this.append("<div class='vertical_bar_image ttb_bar'></div>");
				contents = contents + "<div class='normal_progress verticalextendedprogressbar normal_bar' style='height:0; background-color: " + settings['normal_color'] + ";'></div>";
				contents = contents + "<div class='critical_progress critical_bar verticalextendedprogressbar' style='height:0; background-color: " + settings['critical_color'] + ";'></div>";
				contents = contents + "<div class='separator verticalextendedprogressbar' style='width: 0px;'></div>";
				contents = contents + "<div class='overflow_bar verticalextendedprogressbar' style='height:0; background-color: " + settings['overflow_color'] + ";'></div>";
			}
			else {
				this.append("<div class='full_vertical_bar btt_bar'></div>");
				this.children('.full_vertical_bar').css('bottom', '0px');
				this.append("<div class='empty_vertical_bar'></div>");
				this.children('.empty_vertical_bar').css('top', '0px');
				this.append("<div class='vertical_bar_image btt_bar'></div>");
				contents = contents + "<div class='verticalextendedprogressbar dummy_bar' style='height:" + this.height() + "'></div>";
				contents = contents + "<div class='overflow_bar verticalextendedprogressbar' style='height:0; background-color: " + settings['overflow_color'] + ";'></div>";
				contents = contents + "<div class='separator verticalextendedprogressbar' style='width: 0px;'></div>";
				contents = contents + "<div class='critical_progress critical_bar verticalextendedprogressbar' style='height:0; background-color: " + settings['critical_color'] + ";'></div>";
				contents = contents + "<div class='normal_progress verticalextendedprogressbar normal_bar' style='height:0; background-color: " + settings['normal_color'] + ";'></div>";
			}
			contents = contents + "</div>";
			contents = contents + "<span class='label_holder percentage_label'></span><span class='label_holder value_label'></span><span class='label_holder minval_label'></span><span class='label_holder maxval_label'></span>";
			this.append(contents);
			if (settings['tooltip'] == true) {
				this.addClass("vtip");
				if (settings['min_val'] > 0) {
					this.attr('title', settings['min_val'] + '/ (' + settings['min_val'] + '-' + settings['max_val'] + ') (0%)');
				}
				else {
					this.attr('title', '0/' + settings['max_val'] + ' (0%)');
				}
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		 	=-=-=-=-=Initializer Update-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		 	=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			var arr = [];
			arr[0] = settings['initial_val']
			methods['updateValue'].apply(this, Array.prototype.slice.call(arr, 0));
		},
		updateValue: function(current_value){
			reset(this);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		 	=-=-=First - Check if Infinite=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		 	=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			if (this.data('extendedprogressbar_options')['infinite'] == true) {
				this.children('.bars_holder').children('.normal_progress').width(this.width());
				this.children('.bars_holder').children('.normal_progress').height(this.height());
				this.children('.bars_holder').children('.normal_progress').css('background-color', this.data('extendedprogressbar_options')['normal_color']);
				this.children('.bars_holder').children('.normal_progress').addClass('full_radius');
				if (!this.children('.bars_holder').children('.normal_progress').hasClass('infinite_bar')) {
					this.children('.bars_holder').children('.normal_progress').addClass('infinite_bar');
				}
				this.children('.bars_holder').children('.critical_progress').width(0);
				this.children('.bars_holder').children('.critical_progress').height(0);
				this.children('.bars_holder').children('.overflow_bar').width(0);
				this.children('.bars_holder').children('.overflow_bar').height(0);
				this.children('.bars_holder').children('.dummy_bar').width(0);
				this.children('.bars_holder').children('.dummy_bar').height(0);
				this.children('.bars_holder').children('.separator').removeClass('horizontal_separator');
				this.children('.bars_holder').children('.separator').removeClass('vertical_separator');
				if (this.data('extendedprogressbar_options')['tooltip'] == true) {
					this.attr('title', 'loading...');
				}
				this.children('.full_horizontal_bar').width(this.width());
				this.children('.full_vertical_bar').height(this.height());
				return;
			}
			/*-----------------------------------------------------------------
			-----------------------------------------------------------------*/
			//fetch some data
			var max_value = this.data('extendedprogressbar_options')['max_val'];
			var min_value = this.data('extendedprogressbar_options')['min_val'];
			var previous_value = this.data('extendedprogressbar_current_value');
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		 	=-=-=Second - Check Cheating :)-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		 	=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			if (current_value < min_value) {
				if (previous_value == min_value){
					return;
				}
				current_value = min_value;
			}
			/*-----------------------------------------------------------------
			-----------------------------------------------------------------*/
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		 	=-=-=Third - Overflow check =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		 	=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			if (this.data('extendedprogressbar_options')['overflow'] == false && current_value > max_value) {
				if (previous_value == max_value) {
					return;
				}
				current_value = max_value;
			}
			/*-----------------------------------------------------------------
			-----------------------------------------------------------------*/
			//code goes here
			this.data('extendedprogressbar_current_value', current_value);
			var percent = (current_value - min_value) / (max_value - min_value);
			if (this.data('extendedprogressbar_options')['direction'] == 'LTR') {
				updateLTR(this, min_value, max_value, current_value, percent);
			}
			else if (this.data('extendedprogressbar_options')['direction'] == 'RTL') {
				updateRTL(this, min_value, max_value, current_value, percent);
			}
			else if (this.data('extendedprogressbar_options')['direction'] == 'TTB') {
				updateTTB(this, min_value, max_value, current_value, percent);
			}
			else {
				updateBTT(this, min_value, max_value, current_value, percent);
			}
			updateLabels(this, this.data('extendedprogressbar_options'), min_value, max_value, current_value);
			invokeEventHandlers(this, previous_value);
		},
		updatePercentage: function(percent){
			reset(this);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		 	=-=-=First - Check if Infinite=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		 	=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			if (this.data('extendedprogressbar_options')['infinite'] == true) {
				this.children('.bars_holder').children('.normal_progress').width(this.width());
				this.children('.bars_holder').children('.normal_progress').height(this.height());
				this.children('.bars_holder').children('.normal_progress').css('background-color', this.data('extendedprogressbar_options')['normal_color']);
				this.children('.bars_holder').children('.normal_progress').addClass('full_radius');
				if (!this.children('.bars_holder').children('.normal_progress').hasClass('infinite_bar')) {
					this.children('.bars_holder').children('.normal_progress').addClass('infinite_bar');
				}
				this.children('.bars_holder').children('.critical_progress').width(0);
				this.children('.bars_holder').children('.critical_progress').height(0);
				this.children('.bars_holder').children('.overflow_bar').width(0);
				this.children('.bars_holder').children('.overflow_bar').height(0);
				this.children('.bars_holder').children('.dummy_bar').width(0);
				this.children('.bars_holder').children('.dummy_bar').height(0);
				this.children('.bars_holder').children('.separator').removeClass('horizontal_separator');
				this.children('.bars_holder').children('.separator').removeClass('vertical_separator');
				if (this.data('extendedprogressbar_options')['tooltip'] == true) {
					this.attr('title', 'loading...');
				}
				this.children('.full_horizontal_bar').width(this.width());
				this.children('.full_vertical_bar').height(this.height());
				return;
			}
			/*-----------------------------------------------------------------
			-----------------------------------------------------------------*/
			var previous_value = this.data('extendedprogressbar_current_value');
			percent = percent / 100;
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		 	=-=-=Second - Check Cheating :)-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		 	=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			if (percent < 0) {
				percent = 0;
			}
			/*-----------------------------------------------------------------
			-----------------------------------------------------------------*/
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		 	=-=-=Third - Overflow check =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		 	=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			if (this.data('extendedprogressbar_options')['overflow'] == false && percent > 1) {
				percent = 1;
			}
			/*-----------------------------------------------------------------
			-----------------------------------------------------------------*/
			var max_value = this.data('extendedprogressbar_options')['max_val'];
			var min_value = this.data('extendedprogressbar_options')['min_val'];
			var current_value = (percent * (max_value - min_value)) + min_value;
			this.data('extendedprogressbar_current_value', current_value);
			if (this.data('extendedprogressbar_options')['direction'] == 'LTR') {
				updateLTR(this, min_value, max_value, current_value, percent);
			}
			else if (this.data('extendedprogressbar_options')['direction'] == 'RTL') {
				updateRTL(this, min_value, max_value, current_value, percent);
			}
			else if (this.data('extendedprogressbar_options')['direction'] == 'TTB') {
				updateTTB(this, min_value, max_value, current_value, percent);
			}
			else {
				updateBTT(this, min_value, max_value, current_value, percent);
			}
			updateLabels(this, this.data('extendedprogressbar_options'), min_value, max_value, current_value);
			invokeEventHandlers(this, previous_value);
		},
		updateOptions: function (options) {
			var settings = this.data('extendedprogressbar_options');
			settings['critical_val'] = this.data('extendedprogressbar_critical_val'); 
			var current_val = [];
			current_val[0] = this.data('extendedprogressbar_current_value');
			$.extend(settings, options);
			if (!options['initial_val']){
				if (current_val[0] < settings['min_val']) {
					current_val[0] = settings['min_val'];
				}
			}
			this.empty();
			this.removeClass('extendedprogressbarframe');
			this.removeClass('vtip');
			this.attr('title', null);
			var arguments = [settings];
			methods.init.apply( this, arguments );
			methods['updateValue'].apply(this, Array.prototype.slice.call(current_val, 0));
		},
		incrementValue: function (value, udf) {
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=Collect Data-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			var current_value = this.data('extendedprogressbar_current_value');
			var min_value = this.data('extendedprogressbar_options')['min_val'];
			var max_value = this.data('extendedprogressbar_options')['max_val'];
			var percent = value / (max_value - min_value) * 100;
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=Function Call=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			if (udf != null) {
				if (udf.apply(this, [value, percent, current_value, min_value, max_value]) == true) {
					var arr = [];
					arr[0] = current_value + value;
					methods['updateValue'].apply(this, Array.prototype.slice.call(arr, 0));
				}
			}
			else {
				if (defaultIncrement(this, value, percent, current_value, min_value, max_value) == true) {
					var arr = [];
					arr[0] = current_value + value;
					methods['updateValue'].apply(this, Array.prototype.slice.call(arr, 0));
				}
				//defaultIncrement(this, value, current_value, min_value, max_value);
			}
		},
		incrementPercentage: function (percent, udf) {
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=Collect Data-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			var current_value = this.data('extendedprogressbar_current_value');
			var min_value = this.data('extendedprogressbar_options')['min_val'];
			var max_value = this.data('extendedprogressbar_options')['max_val'];
			var value = percent / 100 * (max_value - min_value);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=Function Call=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			if (udf != null) {
				if (udf.apply(this, [value, percent, current_value, min_value, max_value]) == true) {
					var arr = [];
					arr[0] = current_value + value;
					methods['updateValue'].apply(this, Array.prototype.slice.call(arr, 0));
				}
			}
			else {
				if (defaultIncrement(this, value, percent, current_value, min_value, max_value) == true) {
					var arr = [];
					arr[0] = current_value + value;
					methods['updateValue'].apply(this, Array.prototype.slice.call(arr, 0));
				}
				//defaultIncrement(this, value, current_value, min_value, max_value);
			}
		},
		decrementValue: function (value, udf) {
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=Collect Data-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			var current_value = this.data('extendedprogressbar_current_value');
			var min_value = this.data('extendedprogressbar_options')['min_val'];
			var max_value = this.data('extendedprogressbar_options')['max_val'];
			var percent = value / (max_value - min_value) * 100;
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=Function Call=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			if (udf != null) {
				if (udf.apply(this, [value, percent, current_value, min_value, max_value]) == true) {
					var arr = [];
					arr[0] = current_value - value;
					methods['updateValue'].apply(this, Array.prototype.slice.call(arr, 0));
				}
			}
			else {
				if (defaultIncrement(this, -1 * value, -1 * percent, current_value, min_value, max_value) == true) {
					var arr = [];
					arr[0] = current_value - value;
					methods['updateValue'].apply(this, Array.prototype.slice.call(arr, 0));
				}
				//defaultIncrement(this, value, current_value, min_value, max_value);
			}
		},
		decrementPercentage: function (percent, udf) {
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=Collect Data-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			var current_value = this.data('extendedprogressbar_current_value');
			var min_value = this.data('extendedprogressbar_options')['min_val'];
			var max_value = this.data('extendedprogressbar_options')['max_val'];
			var value = percent / 100 * (max_value - min_value);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=Function Call=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			if (udf != null) {
				if (udf.apply(this, [value, percent, current_value, min_value, max_value]) == true) {
					var arr = [];
					arr[0] = current_value - value;
					methods['updateValue'].apply(this, Array.prototype.slice.call(arr, 0));
				}
			}
			else {
				if (defaultIncrement(this, -1 * value, -1 * percent, current_value, min_value, max_value) == true) {
					var arr = [];
					arr[0] = current_value - value;
					methods['updateValue'].apply(this, Array.prototype.slice.call(arr, 0));
				}
				//defaultIncrement(this, value, current_value, min_value, max_value);
			}
		}
	}
    // jQuery plugin definition  
    $.fn.extendedprogressbar = function(method, params) {  
        
		// Method calling logic
	    if ( methods[method] ) {
	      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      return methods.init.apply( this, arguments );
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.extendedprogressbar' );
	    }
		
		
		
	    // allow jQuery chaining  
	    return this;
    };
	
	function updateLTR(thisObject, min_value, max_value, current_value, percent){
		//code goes here
		mySettings = thisObject.data('extendedprogressbar_options');
		//var max_value = 100;
		if (mySettings['tooltip'] == true) {
			if (min_value > 0) {
				thisObject.attr('title', (Math.round(current_value * 100) / 100) + '/ (' + min_value + '-' + max_value + ') (' + (Math.round(percent * 10000) / 100) + '%)');
			}
			else {
				thisObject.attr('title', (Math.round(current_value * 100) / 100) + '/' + max_value + ' (' + (Math.round(percent * 10000) / 100) + '%)');
			}
		}
		var overall_width = thisObject.width();
		var overall_height = thisObject.height();
		var ua = $.browser;
		if (ua.msie && ua.version.slice(0,1) == '8') { //la sama7 Allah
			overall_width = overall_width - 2;
			overall_height = overall_height - 2;
		}
		else if (ua.msie && ua.version.slice(0,1) == '7') { //A3oozo be Allah
			overall_width = overall_width - 4;
			overall_height = overall_height - 4;
		}
		else if (ua.msie && ua.version.slice(0,1) == '6') { //A3oozo be Allah
			overall_width = overall_width - 4;
			overall_height = overall_height - 4;
		}
		var critical_percent = mySettings['critical_percent'] / 100;
		//case 1 - critical percentage not reached
		//not affected by critical options
		if (percent < critical_percent) {
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH
			thisObject.children('.bars_holder').children('.normal_progress').width(Math.round(percent * overall_width));
			//RADIUS
			thisObject.children('.bars_holder').children('.normal_progress').addClass("left_radius");
			//COLOR
			thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_color']);
			//separator
			if (percent != 0) {
				thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_LTR_separator');
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.critical_progress').width(0);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.overflow_bar').width(0);
		}
		//case 2 - critical percentage exactly reached
		else if (percent == critical_percent) {
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH
			thisObject.children('.bars_holder').children('.normal_progress').width(Math.round(percent * overall_width));
			//RADIUS
			if (percent < 1){
				thisObject.children('.bars_holder').children('.normal_progress').addClass("left_radius");
			}
			else if (percent == 1) {
				thisObject.children('.bars_holder').children('.normal_progress').addClass("full_radius");
			}
			//COLOR
			thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_complete_color']);
			if (percent != 1) {
				//separator
				thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_LTR_separator');
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.critical_progress').width(0);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.overflow_bar').width(0);
		}
		//case 3 - critical percentage passed - full percentage not reached (not reachable block if critical percent = 100)
		else if (percent < 1) {
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH
			if((mySettings['critical_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) {
				thisObject.children('.bars_holder').children('.normal_progress').width(Math.round(percent * overall_width));
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').width(Math.round(critical_percent * overall_width));
			}
			//RADIUS
			thisObject.children('.bars_holder').children('.normal_progress').addClass("left_radius");
			//COLOR
			if (mySettings['same_color_critical'] == true) {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['critical_color']);
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_complete_color']);
			}
			//separator
			thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_LTR_separator');
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH
			if ((mySettings['critical_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) {
				thisObject.children('.bars_holder').children('.critical_progress').width(0);
			}
			else {
				thisObject.children('.bars_holder').children('.critical_progress').width(Math.round((percent - critical_percent) * overall_width));
			}
			//COLOR
			thisObject.children('.bars_holder').children('.critical_progress').css("background-color", mySettings['critical_color']);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.overflow_bar').width(0);
		}
		//case 4 - FULL percentage exactly reached - (not reachable block if critical percent = 100)
		else if (percent == 1){
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH - MASTER
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true) || (mySettings['critical_val'] == mySettings['max_val']) || (mySettings['critical_percent'] == 1) || (mySettings['critical_enabled'] == false) ) {
				thisObject.children('.bars_holder').children('.normal_progress').width(Math.round(overall_width));
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').width(Math.round(critical_percent * overall_width));
			}
			//RADIUS
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) {
				thisObject.children('.bars_holder').children('.normal_progress').addClass("full_radius");
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').addClass("left_radius");
			}
			//COLOR
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['critical_complete_color']);
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_complete_color']);
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH - SLAVE
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true) || (mySettings['critical_val'] == mySettings['max_val']) || (mySettings['critical_percent'] == 1) || (mySettings['critical_enabled'] == false) ) {
				thisObject.children('.bars_holder').children('.critical_progress').width(0);
			}
			else {
				thisObject.children('.bars_holder').children('.critical_progress').width(overall_width - thisObject.children('.bars_holder').children('.normal_progress').width());
				//separator
				thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_LTR_separator');
			}
			//RADIUS
			thisObject.children('.bars_holder').children('.critical_progress').addClass("right_radius");
			//COLOR
			thisObject.children('.bars_holder').children('.critical_progress').css("background-color", mySettings['critical_complete_color']);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.overflow_bar').width(0);
		}
		//case 5 - overflow
		else{
			//recalculate 100% width
			percent = (max_value - min_value)/(current_value - min_value);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
			=-=-=Separator-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			if (mySettings['separator'] == true) {
				overall_width = overall_width - 1;
				if (!thisObject.children('.bars_holder').children('.separator').hasClass('horizontal_separator')) {
					thisObject.children('.bars_holder').children('.separator').addClass('horizontal_separator');
				}
				thisObject.children('.bars_holder').children('.separator').height(overall_height + 10);
			}
			else{
				if (thisObject.children('.bars_holder').children('.separator').hasClass('horizontal_separator')) {
					thisObject.children('.bars_holder').children('.separator').removeClass('horizontal_separator');
				}
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH - MASTER
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true) || (mySettings['critical_val'] == mySettings['max_val']) || (mySettings['critical_percent'] == 1) || (mySettings['critical_enabled'] == false) ) {
				if (mySettings['separator'] == true) {
					thisObject.children('.bars_holder').children('.normal_progress').width(Math.round(percent * overall_width));
				}
				else{
					thisObject.children('.bars_holder').children('.normal_progress').width(Math.round(percent * overall_width));
				}
			}
			else {
				if (mySettings['separator'] == true) {
					(thisObject.children('.bars_holder')).children('.normal_progress').width(Math.round(critical_percent * percent * overall_width));
				}
				else{
					(thisObject.children('.bars_holder')).children('.normal_progress').width(Math.round(critical_percent * percent * overall_width));
				}
			}
			//RADIUS
			thisObject.children('.bars_holder').children('.normal_progress').addClass("left_radius");
			//COLOR
			if (((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) && critical_percent < 1) {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['critical_complete_color']);
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_complete_color']);
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH - SLAVE 1
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true) || (mySettings['critical_val'] == mySettings['max_val']) || (mySettings['critical_percent'] == 1) || (mySettings['critical_enabled'] == false) ) {
				thisObject.children('.bars_holder').children('.critical_progress').width(0);
				if(mySettings['separator'] != true) {
					//separator
					thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_LTR_separator');
				}
			}
			else {
				thisObject.children('.bars_holder').children('.critical_progress').width(Math.round((percent * overall_width) - thisObject.children('.bars_holder').children('.normal_progress').width()));
				//separator
				thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_LTR_separator');
			}
			//COLOR
			thisObject.children('.bars_holder').children('.critical_progress').css("background-color", mySettings['critical_complete_color']);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH - SLAVE 2
			//calculate overflow_bar width
			thisObject.children('.bars_holder').children('.overflow_bar').width(overall_width - ( thisObject.children('.bars_holder').children('.normal_progress').width() + thisObject.children('.bars_holder').children('.critical_progress').width() ));
			//RADIUS
			thisObject.children('.bars_holder').children('.overflow_bar').addClass("right_radius");
			//COLOR
			thisObject.children('.bars_holder').children('.overflow_bar').css("background-color", mySettings['overflow_color']);
			//restore overall_width
			if (mySettings['separator'] == true) {
				overall_width = overall_width + 1;
			}
		}
		//checking separator case
		if (thisObject.children('.bars_holder').children('.normal_progress').hasClass('normal_LTR_separator')) {
			thisObject.children('.bars_holder').children('.normal_progress').width(thisObject.children('.bars_holder').children('.normal_progress').width() - 1);
		}
		//updating gradient bars
		thisObject.children('.full_horizontal_bar').width(thisObject.children('.bars_holder').children('.normal_progress').width() + thisObject.children('.bars_holder').children('.critical_progress').width() + thisObject.children('.bars_holder').children('.overflow_bar').width());//thisObject.children('.full_horizontal_bar').width(thisObject.children('.bars_holder').width());
		if (thisObject.children('.bars_holder').children('.normal_progress').hasClass('normal_LTR_separator')) {//check for normal separator
			thisObject.children('.full_horizontal_bar').width(thisObject.children('.full_horizontal_bar').width() + 1);
		}
		if (thisObject.children('.bars_holder').children('.separator').hasClass('horizontal_separator')) {//cehck for overflow separator
			thisObject.children('.full_horizontal_bar').width(thisObject.children('.full_horizontal_bar').width() + 1);
		}
		thisObject.children('.empty_horizontal_bar').width(overall_width - thisObject.children('.full_horizontal_bar').width());//thisObject.children('.empty_horizontal_bar').width(overall_width - thisObject.children('.bars_holder').width());
		thisObject.children('.horizontal_bar_image').width(thisObject.children('.full_horizontal_bar').width());
		//checking style bars radius
		if (current_value >= max_value) {
			thisObject.children('.full_horizontal_bar').addClass('full_radius');
			thisObject.children('.horizontal_bar_image').addClass('full_radius');
		}
		else if (current_value == min_value) {
			thisObject.children('.empty_horizontal_bar').addClass('full_radius');
		}
		else {
			thisObject.children('.full_horizontal_bar').addClass('left_radius');
			thisObject.children('.horizontal_bar_image').addClass('left_radius');
			thisObject.children('.empty_horizontal_bar').addClass('right_radius');
		}
	}
	
	function updateRTL(thisObject, min_value, max_value, current_value, percent){
		//code goes here
		mySettings = thisObject.data('extendedprogressbar_options');
		//var max_value = 100;
		if (mySettings['tooltip'] == true) {
			if (min_value > 0) {
				thisObject.attr('title', (Math.round(current_value * 100) / 100) + '/ (' + min_value + '-' + max_value + ') (' + (Math.round(percent * 10000) / 100) + '%)');
			}
			else {
				thisObject.attr('title', (Math.round(current_value * 100) / 100) + '/' + max_value + ' (' + (Math.round(percent * 10000) / 100) + '%)');
			}
		}
		var overall_width = thisObject.width();
		var overall_height = thisObject.height();
		var ua = $.browser;
		if (ua.msie && ua.version.slice(0,1) == '8') { //la sama7 Allah
			overall_width = overall_width - 2;
			overall_height = overall_height - 2;
		}
		else if (ua.msie && ua.version.slice(0,1) == '7') { //A3oozo be Allah
			overall_width = overall_width - 4;
			overall_height = overall_height - 4;
		}
		else if (ua.msie && ua.version.slice(0,1) == '6') { //A3oozo be Allah
			overall_width = overall_width - 4;
			overall_height = overall_height - 4;
		}
		var critical_percent = mySettings['critical_percent'] / 100;
		//case 1 - critical percentage not reached
		//not affected by critical options
		if (percent < critical_percent) {
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH
			thisObject.children('.bars_holder').children('.normal_progress').width(Math.round(percent * overall_width));
			//RADIUS
			thisObject.children('.bars_holder').children('.normal_progress').addClass("right_radius");
			//COLOR
			thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_color']);
			//separator
			if (percent != 0) {
				thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_RTL_separator');
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.critical_progress').width(0);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.overflow_bar').width(0);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Dummy Bar=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH - SLAVE
			thisObject.children('.bars_holder').children('.dummy_bar').width(overall_width - (thisObject.children('.bars_holder').children('.normal_progress').width() + thisObject.children('.bars_holder').children('.critical_progress').width() +  thisObject.children('.bars_holder').children('.overflow_bar').width()));
		}
		//case 2 - critical percentage exactly reached
		else if (percent == critical_percent) {
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH
			thisObject.children('.bars_holder').children('.normal_progress').width(Math.round(percent * overall_width));
			//RADIUS
			if (percent < 1){
				thisObject.children('.bars_holder').children('.normal_progress').addClass("right_radius");
			}
			else if (percent == 1) {
				thisObject.children('.bars_holder').children('.normal_progress').addClass("full_radius");
			}
			//COLOR
			thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_complete_color']);
			if (percent != 1) {
				//separator
				thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_RTL_separator');
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.critical_progress').width(0);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.overflow_bar').width(0);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Dummy Bar=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH - SLAVE
			thisObject.children('.bars_holder').children('.dummy_bar').width(overall_width - (thisObject.children('.bars_holder').children('.normal_progress').width() + thisObject.children('.bars_holder').children('.critical_progress').width() +  thisObject.children('.bars_holder').children('.overflow_bar').width()));
		}
		//case 3 - critical percentage passed - full percentage not reached (not reachable block if critical percent = 100)
		else if (percent < 1) {
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH
			if((mySettings['critical_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) {
				thisObject.children('.bars_holder').children('.normal_progress').width(Math.round(percent * overall_width));
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').width(Math.round(critical_percent * overall_width));
			}
			//RADIUS
			thisObject.children('.bars_holder').children('.normal_progress').addClass("right_radius");
			//COLOR
			if (mySettings['same_color_critical'] == true) {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['critical_color']);
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_complete_color']);
			}
			//separator
			thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_RTL_separator');
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH
			if ((mySettings['critical_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) {
				thisObject.children('.bars_holder').children('.critical_progress').width(0);
			}
			else {
				thisObject.children('.bars_holder').children('.critical_progress').width(Math.round((percent - critical_percent) * overall_width));
			}
			//COLOR
			thisObject.children('.bars_holder').children('.critical_progress').css("background-color", mySettings['critical_color']);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.overflow_bar').width(0);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Dummy Bar=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH - SLAVE
			thisObject.children('.bars_holder').children('.dummy_bar').width(overall_width - (thisObject.children('.bars_holder').children('.normal_progress').width() + thisObject.children('.bars_holder').children('.critical_progress').width() +  thisObject.children('.bars_holder').children('.overflow_bar').width()));
		}
		//case 4 - FULL percentage exactly reached - (not reachable block if critical percent = 100)
		else if (percent == 1){
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH - MASTER
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true) || (mySettings['critical_val'] == mySettings['max_val']) || (mySettings['critical_percent'] == 1) || (mySettings['critical_enabled'] == false) ) {
				thisObject.children('.bars_holder').children('.normal_progress').width(Math.round(overall_width));
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').width(Math.round(critical_percent * overall_width));
			}
			//RADIUS
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) {
				thisObject.children('.bars_holder').children('.normal_progress').addClass("full_radius");
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').addClass("right_radius");
			}
			//COLOR
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['critical_complete_color']);
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_complete_color']);
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH - SLAVE
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true) || (mySettings['critical_val'] == mySettings['max_val']) || (mySettings['critical_percent'] == 1) || (mySettings['critical_enabled'] == false) ) {
				thisObject.children('.bars_holder').children('.critical_progress').width(0);
			}
			else {
				thisObject.children('.bars_holder').children('.critical_progress').width(overall_width - thisObject.children('.bars_holder').children('.normal_progress').width());
				//separator
				thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_RTL_separator');
			}
			//RADIUS
			thisObject.children('.bars_holder').children('.critical_progress').addClass("left_radius");
			//COLOR
			thisObject.children('.bars_holder').children('.critical_progress').css("background-color", mySettings['critical_complete_color']);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.overflow_bar').width(0);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Dummy Bar=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH - SLAVE
			thisObject.children('.bars_holder').children('.dummy_bar').width(overall_width - (thisObject.children('.bars_holder').children('.normal_progress').width() + thisObject.children('.bars_holder').children('.critical_progress').width() +  thisObject.children('.bars_holder').children('.overflow_bar').width()));
		}
		//case 5 - overflow
		else{
			//recalculate 100% width
			percent = (max_value - min_value)/(current_value - min_value);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
			=-=-=Separator-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			if (mySettings['separator'] == true) {
				overall_width = overall_width - 1;
				if (!thisObject.children('.bars_holder').children('.separator').hasClass('horizontal_separator')) {
					thisObject.children('.bars_holder').children('.separator').addClass('horizontal_separator');
				}
				thisObject.children('.bars_holder').children('.separator').height(overall_height + 10);
			}
			else{
				if (thisObject.children('.bars_holder').children('.separator').hasClass('horizontal_separator')) {
					thisObject.children('.bars_holder').children('.separator').removeClass('horizontal_separator');
				}
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH - MASTER
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true) || (mySettings['critical_val'] == mySettings['max_val']) || (mySettings['critical_percent'] == 1) || (mySettings['critical_enabled'] == false) ) {
				thisObject.children('.bars_holder').children('.normal_progress').width(Math.round(percent * overall_width));
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').width(Math.round(critical_percent * percent * overall_width));
			}
			//RADIUS
			thisObject.children('.bars_holder').children('.normal_progress').addClass("right_radius");
			//COLOR
			if (((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) && critical_percent < 1) {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['critical_complete_color']);
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_complete_color']);
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH - SLAVE 1
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true) || (mySettings['critical_val'] == mySettings['max_val']) || (mySettings['critical_percent'] == 1) || (mySettings['critical_enabled'] == false) ) {
				thisObject.children('.bars_holder').children('.critical_progress').width(0);
				if (mySettings['separator'] != true) {
					//separator
					thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_RTL_separator');
				}
			}
			else {
				thisObject.children('.bars_holder').children('.critical_progress').width(Math.round((percent * overall_width) - thisObject.children('.bars_holder').children('.normal_progress').width()));
				//separator
				thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_RTL_separator');
			}
			//COLOR
			thisObject.children('.bars_holder').children('.critical_progress').css("background-color", mySettings['critical_complete_color']);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH - SLAVE 2
			//calculate overflow_bar width
			thisObject.children('.bars_holder').children('.overflow_bar').width(overall_width - ( thisObject.children('.bars_holder').children('.normal_progress').width() + thisObject.children('.bars_holder').children('.critical_progress').width() ));
			//RADIUS
			thisObject.children('.bars_holder').children('.overflow_bar').addClass("left_radius");
			//COLOR
			thisObject.children('.bars_holder').children('.overflow_bar').css("background-color", mySettings['overflow_color']);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Dummy Bar=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//WIDTH - SLAVE
			thisObject.children('.bars_holder').children('.dummy_bar').width(overall_width - (thisObject.children('.bars_holder').children('.normal_progress').width() + thisObject.children('.bars_holder').children('.critical_progress').width() +  thisObject.children('.bars_holder').children('.overflow_bar').width()));
			//restore overall_width
			if (mySettings['separator'] == true) {
				overall_width = overall_width + 1;
			}
		}
		/*if (settings['display_percentage']) {
			this.append((Math.round(percent * 10000) / 100) + "%");
		}*/
		//updating gradient bars
		thisObject.children('.empty_horizontal_bar').width(thisObject.children('.bars_holder').children('.dummy_bar').width());
		thisObject.children('.full_horizontal_bar').width(overall_width - thisObject.children('.bars_holder').children('.dummy_bar').width());
		thisObject.children('.horizontal_bar_image').width(thisObject.children('.full_horizontal_bar').width());
		//checking separator case
		if (thisObject.children('.bars_holder').children('.normal_progress').hasClass('normal_RTL_separator')) {
			thisObject.children('.bars_holder').children('.normal_progress').width(thisObject.children('.bars_holder').children('.normal_progress').width() - 1);
		}
		//checking style bars radius
		if (current_value >= max_value) {
			thisObject.children('.full_horizontal_bar').addClass('full_radius');
			thisObject.children('.horizontal_bar_image').addClass('full_radius');
		}
		else if (current_value == min_value) {
			thisObject.children('.empty_horizontal_bar').addClass('full_radius');
		}
		else {
			thisObject.children('.full_horizontal_bar').addClass('right_radius');
			thisObject.children('.horizontal_bar_image').addClass('right_radius');
			thisObject.children('.empty_horizontal_bar').addClass('left_radius');
		}
	}
	
	function updateTTB(thisObject, min_value, max_value, current_value, percent){
		//code goes here
		mySettings = thisObject.data('extendedprogressbar_options');
		//var max_value = 100;
		if (mySettings['tooltip'] == true) {
			if (min_value > 0) {
				thisObject.attr('title', (Math.round(current_value * 100) / 100) + '/ (' + min_value + '-' + max_value + ') (' + (Math.round(percent * 10000) / 100) + '%)');
			}
			else {
				thisObject.attr('title', (Math.round(current_value * 100) / 100) + '/' + max_value + ' (' + (Math.round(percent * 10000) / 100) + '%)');
			}
		}
		var overall_height = thisObject.height();
		var overall_width = thisObject.width();
		var ua = $.browser;
		if (ua.msie && ua.version.slice(0,1) == '8') { //la sama7 Allah
			overall_height= overall_height - 2;
			overall_width = overall_width - 2;
		}
		else if (ua.msie && ua.version.slice(0,1) == '7') { //A3oozo be Allah
			overall_height = overall_height - 4;
			overall_width = overall_width - 4;
		}
		else if (ua.msie && ua.version.slice(0,1) == '6') { //A3oozo be Allah
			overall_height = overall_height - 4;
			overall_width = overall_width - 4;
		}
		var critical_percent = mySettings['critical_percent'] / 100;
		//case 1 - critical percentage not reached
		//not affected by critical options
		if (percent < critical_percent) {
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT
			thisObject.children('.bars_holder').children('.normal_progress').height(Math.round(percent * overall_height));
			//RADIUS
			thisObject.children('.bars_holder').children('.normal_progress').addClass("top_radius");
			//COLOR
			thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_color']);
			if (percent != 0) {
				//separator
				thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_TTB_separator');
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.critical_progress').height(0);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.overflow_bar').height(0);
		}
		//case 2 - critical percentage exactly reached
		else if (percent == critical_percent) {
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT
			thisObject.children('.bars_holder').children('.normal_progress').height(Math.round(percent * overall_height));
			//RADIUS
			if (percent < 1){
				thisObject.children('.bars_holder').children('.normal_progress').addClass("top_radius");
			}
			else if (percent == 1) {
				thisObject.children('.bars_holder').children('.normal_progress').addClass("full_radius");
			}
			//COLOR
			thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_complete_color']);
			if (percent != 1) {
				//separator
				thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_TTB_separator');
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.critical_progress').height(0);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.overflow_bar').height(0);
		}
		//case 3 - critical percentage passed - full percentage not reached (not reachable block if critical percent = 100)
		else if (percent < 1) {
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT
			if((mySettings['critical_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) {
				thisObject.children('.bars_holder').children('.normal_progress').height(Math.round(percent * overall_height));
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').height(Math.round(critical_percent * overall_height));
			}
			//RADIUS
			thisObject.children('.bars_holder').children('.normal_progress').addClass("top_radius");
			//COLOR
			if (mySettings['same_color_critical'] == true) {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['critical_color']);
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_complete_color']);
			}
			//separator
			thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_TTB_separator');
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT
			if ((mySettings['critical_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) {
				thisObject.children('.bars_holder').children('.critical_progress').height(0);
			}
			else {
				thisObject.children('.bars_holder').children('.critical_progress').height(Math.round((percent - critical_percent) * overall_height));
			}
			//COLOR
			thisObject.children('.bars_holder').children('.critical_progress').css("background-color", mySettings['critical_color']);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.overflow_bar').height(0);
		}
		//case 4 - FULL percentage exactly reached - (not reachable block if critical percent = 100)
		else if (percent == 1){
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT - MASTER
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true) || (mySettings['critical_val'] == mySettings['max_val']) || (mySettings['critical_percent'] == 1) || (mySettings['critical_enabled'] == false) ) {
				thisObject.children('.bars_holder').children('.normal_progress').height(Math.round(overall_height));
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').height(Math.round(critical_percent * overall_height));
			}
			//RADIUS
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) {
				thisObject.children('.bars_holder').children('.normal_progress').addClass("full_radius");
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').addClass("top_radius");
			}
			//COLOR
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['critical_complete_color']);
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_complete_color']);
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT - SLAVE
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true) || (mySettings['critical_val'] == mySettings['max_val']) || (mySettings['critical_percent'] == 1) || (mySettings['critical_enabled'] == false) ) {
				thisObject.children('.bars_holder').children('.critical_progress').height(0);
			}
			else {
				thisObject.children('.bars_holder').children('.critical_progress').height(overall_height - thisObject.children('.bars_holder').children('.normal_progress').height());
				//separator
				thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_TTB_separator');
			}
			//RADIUS
			thisObject.children('.bars_holder').children('.critical_progress').addClass("bottom_radius");
			//COLOR
			thisObject.children('.bars_holder').children('.critical_progress').css("background-color", mySettings['critical_complete_color']);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.overflow_bar').height(0);
		}
		//case 5 - overflow
		else{
			//recalculate 100% height
			percent = (max_value - min_value)/(current_value - min_value);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
			=-=-=Separator-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			if (mySettings['separator'] == true) {
				overall_height = overall_height - 1;
				if (!thisObject.children('.bars_holder').children('.separator').hasClass('vertical_separator')) {
					thisObject.children('.bars_holder').children('.separator').addClass('vertical_separator');
					thisObject.children('.bars_holder').children('.separator').width(overall_width + 10);
				}
			}
			else{
				if (thisObject.children('.bars_holder').children('.separator').hasClass('vertical_separator')) {
					thisObject.children('.bars_holder').children('.separator').removeClass('vertical_separator');
				}
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT - MASTER
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true) || (mySettings['critical_val'] == mySettings['max_val']) || (mySettings['critical_percent'] == 1) || (mySettings['critical_enabled'] == false) ) {
				thisObject.children('.bars_holder').children('.normal_progress').height(Math.round(percent * overall_height));
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').height(Math.round(critical_percent * percent * overall_height));
			}
			//RADIUS
			thisObject.children('.bars_holder').children('.normal_progress').addClass("top_radius");
			//COLOR
			if (((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) && critical_percent < 1) {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['critical_complete_color']);
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_complete_color']);
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT - SLAVE 1
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true) || (mySettings['critical_val'] == mySettings['max_val']) || (mySettings['critical_percent'] == 1) || (mySettings['critical_enabled'] == false) ) {
				thisObject.children('.bars_holder').children('.critical_progress').height(0);
				if (mySettings['separator'] != true) {
					//separator
					thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_TTB_separator');
				}
			}
			else {
				thisObject.children('.bars_holder').children('.critical_progress').height(Math.round((percent * overall_height) - thisObject.children('.bars_holder').children('.normal_progress').height()));
				//separator
				thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_TTB_separator');
			}
			//COLOR
			thisObject.children('.bars_holder').children('.critical_progress').css("background-color", mySettings['critical_complete_color']);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT - SLAVE 2
			//calculate overflow_bar height
			thisObject.children('.bars_holder').children('.overflow_bar').height(overall_height - ( thisObject.children('.bars_holder').children('.normal_progress').height() + thisObject.children('.bars_holder').children('.critical_progress').height() ));
			//RADIUS
			thisObject.children('.bars_holder').children('.overflow_bar').addClass("bottom_radius");
			//COLOR
			thisObject.children('.bars_holder').children('.overflow_bar').css("background-color", mySettings['overflow_color']);
			//restore overall_height
			if (mySettings['separator'] == true) {
				overall_height = overall_height + 1;
			}
		}
		//checking separator case
		if (thisObject.children('.bars_holder').children('.normal_progress').hasClass('normal_TTB_separator')) {
			thisObject.children('.bars_holder').children('.normal_progress').height(thisObject.children('.bars_holder').children('.normal_progress').height() - 1);
		}
		//updating gradient bars
		thisObject.children('.full_vertical_bar').height(thisObject.children('.bars_holder').children('.normal_progress').height() + thisObject.children('.bars_holder').children('.critical_progress').height() + thisObject.children('.bars_holder').children('.overflow_bar').height());
		if (thisObject.children('.bars_holder').children('.normal_progress').hasClass('normal_TTB_separator')) {//check for normal separator
			thisObject.children('.full_vertical_bar').height(thisObject.children('.full_vertical_bar').height() + 1);
		}
		if (thisObject.children('.bars_holder').children('.separator').hasClass('vertical_separator')) {//cehck for overflow separator
			thisObject.children('.full_vertical_bar').height(thisObject.children('.full_vertical_bar').height() + 1);
		}
		thisObject.children('.empty_vertical_bar').height(overall_height - thisObject.children('.full_vertical_bar').height());
		thisObject.children('.vertical_bar_image').height(thisObject.children('.full_vertical_bar').height());
		//checking style bars radius
		if (current_value >= max_value) {
			thisObject.children('.full_vertical_bar').addClass('full_radius');
			thisObject.children('.vertical_bar_image').addClass('full_radius');
		}
		else if (current_value == min_value) {
			thisObject.children('.empty_vertical_bar').addClass('full_radius');
		}
		else {
			thisObject.children('.full_vertical_bar').addClass('top_radius');
			thisObject.children('.vertical_bar_image').addClass('top_radius');
			thisObject.children('.empty_vertical_bar').addClass('bottom_radius');
		}
	}
	
	function updateBTT(thisObject, min_value, max_value, current_value, percent){
		//code goes here
		mySettings = thisObject.data('extendedprogressbar_options');
		//var max_value = 100;
		if (mySettings['tooltip'] == true) {
			if (min_value > 0) {
				thisObject.attr('title', (Math.round(current_value * 100) / 100) + '/ (' + min_value + '-' + max_value + ') (' + (Math.round(percent * 10000) / 100) + '%)');
			}
			else {
				thisObject.attr('title', (Math.round(current_value * 100) / 100) + '/' + max_value + ' (' + (Math.round(percent * 10000) / 100) + '%)');
			}
		}
		var overall_height = thisObject.height();
		var overall_width = thisObject.width();
		var ua = $.browser;
		if (ua.msie && ua.version.slice(0,1) == '8') { //la sama7 Allah
			overall_height= overall_height - 2;
			overall_width = overall_width - 2;
		}
		else if (ua.msie && ua.version.slice(0,1) == '7') { //A3oozo be Allah
			overall_height = overall_height - 4;
			overall_width = overall_width - 4;
		}
		else if (ua.msie && ua.version.slice(0,1) == '6') { //A3oozo be Allah
			overall_height = overall_height - 4;
			overall_width = overall_width - 4;
		}
		var critical_percent = mySettings['critical_percent'] / 100;
		//case 1 - critical percentage not reached
		//not affected by critical options
		if (percent < critical_percent) {
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT
			thisObject.children('.bars_holder').children('.normal_progress').height(Math.round(percent * overall_height));
			//RADIUS
			thisObject.children('.bars_holder').children('.normal_progress').addClass("bottom_radius");
			//COLOR
			thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_color']);
			if (percent != 0) {
				//separator
				thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_BTT_separator');
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.critical_progress').height(0);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.overflow_bar').height(0);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Dummy Bar=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT - SLAVE
			thisObject.children('.bars_holder').children('.dummy_bar').height(overall_height - (thisObject.children('.bars_holder').children('.normal_progress').height() + thisObject.children('.bars_holder').children('.critical_progress').height() +  thisObject.children('.bars_holder').children('.overflow_bar').height()));
		}
		//case 2 - critical percentage exactly reached
		else if (percent == critical_percent) {
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT
			thisObject.children('.bars_holder').children('.normal_progress').height(Math.round(percent * overall_height));
			//RADIUS
			if (percent < 1){
				thisObject.children('.bars_holder').children('.normal_progress').addClass("bottom_radius");
			}
			else if (percent == 1) {
				thisObject.children('.bars_holder').children('.normal_progress').addClass("full_radius");
			}
			//COLOR
			thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_complete_color']);
			if (percent != 1) {
				//separator
				thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_BTT_separator');
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.critical_progress').height(0);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.overflow_bar').height(0);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Dummy Bar=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT - SLAVE
			thisObject.children('.bars_holder').children('.dummy_bar').height(overall_height - (thisObject.children('.bars_holder').children('.normal_progress').height() + thisObject.children('.bars_holder').children('.critical_progress').height() +  thisObject.children('.bars_holder').children('.overflow_bar').height()));
		}
		//case 3 - critical percentage passed - full percentage not reached (not reachable block if critical percent = 100)
		else if (percent < 1) {
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT
			if((mySettings['critical_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) {
				thisObject.children('.bars_holder').children('.normal_progress').height(Math.round(percent * overall_height));
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').height(Math.round(critical_percent * overall_height));
			}
			//RADIUS
			thisObject.children('.bars_holder').children('.normal_progress').addClass("bottom_radius");
			//COLOR
			if (mySettings['same_color_critical'] == true) {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['critical_color']);
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_complete_color']);
			}
			//separator
			thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_BTT_separator');
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT
			if ((mySettings['critical_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) {
				thisObject.children('.bars_holder').children('.critical_progress').height(0);
			}
			else {
				thisObject.children('.bars_holder').children('.critical_progress').height(Math.round((percent - critical_percent) * overall_height));
			}
			//COLOR
			thisObject.children('.bars_holder').children('.critical_progress').css("background-color", mySettings['critical_color']);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.overflow_bar').height(0);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Dummy Bar=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT - SLAVE
			thisObject.children('.bars_holder').children('.dummy_bar').height(overall_height - (thisObject.children('.bars_holder').children('.normal_progress').height() + thisObject.children('.bars_holder').children('.critical_progress').height() +  thisObject.children('.bars_holder').children('.overflow_bar').height()));
		}
		//case 4 - FULL percentage exactly reached - (not reachable block if critical percent = 100)
		else if (percent == 1){
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT - MASTER
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true) || (mySettings['critical_val'] == mySettings['max_val']) || (mySettings['critical_percent'] == 1) || (mySettings['critical_enabled'] == false) ) {
				thisObject.children('.bars_holder').children('.normal_progress').height(Math.round(overall_height));
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').height(Math.round(critical_percent * overall_height));
			}
			//RADIUS
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) {
				thisObject.children('.bars_holder').children('.normal_progress').addClass("full_radius");
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').addClass("bottom_radius");
			}
			//COLOR
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['critical_complete_color']);
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_complete_color']);
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT - SLAVE
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true) || (mySettings['critical_val'] == mySettings['max_val']) || (mySettings['critical_percent'] == 1) || (mySettings['critical_enabled'] == false) ) {
				thisObject.children('.bars_holder').children('.critical_progress').height(0);
			}
			else {
				thisObject.children('.bars_holder').children('.critical_progress').height(overall_height - thisObject.children('.bars_holder').children('.normal_progress').height());
				//separator
				thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_BTT_separator');
			}
			//RADIUS
			thisObject.children('.bars_holder').children('.critical_progress').addClass("top_radius");
			//COLOR
			thisObject.children('.bars_holder').children('.critical_progress').css("background-color", mySettings['critical_complete_color']);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			thisObject.children('.bars_holder').children('.overflow_bar').height(0);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Dummy Bar=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT - SLAVE
			thisObject.children('.bars_holder').children('.dummy_bar').height(overall_height - (thisObject.children('.bars_holder').children('.normal_progress').height() + thisObject.children('.bars_holder').children('.critical_progress').height() +  thisObject.children('.bars_holder').children('.overflow_bar').height()));
		}
		//case 5 - overflow
		else{
			//recalculate 100% height
			percent = (max_value - min_value)/(current_value - min_value);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
			=-=-=Separator-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			if (mySettings['separator'] == true) {
				overall_height = overall_height - 1;
				if (!thisObject.children('.bars_holder').children('.separator').hasClass('vertical_separator')) {
					thisObject.children('.bars_holder').children('.separator').addClass('vertical_separator');
					thisObject.children('.bars_holder').children('.separator').width(overall_width + 10);
				}
			}
			else{
				if (thisObject.children('.bars_holder').children('.separator').hasClass('vertical_separator')) {
					thisObject.children('.bars_holder').children('.separator').removeClass('vertical_separator');
				}
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Normal Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT - MASTER
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true) || (mySettings['critical_val'] == mySettings['max_val']) || (mySettings['critical_percent'] == 1) || (mySettings['critical_enabled'] == false) ) {
				thisObject.children('.bars_holder').children('.normal_progress').height(Math.round(percent * overall_height));
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').height(Math.round(critical_percent * percent * overall_height));
			}
			//RADIUS
			thisObject.children('.bars_holder').children('.normal_progress').addClass("bottom_radius");
			//COLOR
			if (((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true)) && critical_percent < 1) {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['critical_complete_color']);
			}
			else {
				thisObject.children('.bars_holder').children('.normal_progress').css("background-color", mySettings['normal_complete_color']);
			}
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Critical Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT - SLAVE 1
			if ((mySettings['critical_complete_color'] == mySettings['normal_complete_color']) || (mySettings['same_color_critical'] == true) || (mySettings['critical_val'] == mySettings['max_val']) || (mySettings['critical_percent'] == 1) || (mySettings['critical_enabled'] == false) ) {
				thisObject.children('.bars_holder').children('.critical_progress').height(0);
				if (mySettings['separator'] != true) {
					//separator
					thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_BTT_separator');
				}
			}
			else {
				thisObject.children('.bars_holder').children('.critical_progress').height(Math.round((percent * overall_height) - thisObject.children('.bars_holder').children('.normal_progress').height()));
				//separator
				thisObject.children('.bars_holder').children('.normal_progress').addClass('normal_BTT_separator');
			}
			//COLOR
			thisObject.children('.bars_holder').children('.critical_progress').css("background-color", mySettings['critical_complete_color']);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Overflow Bar-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT - SLAVE 2
			//calculate overflow_bar height
			thisObject.children('.bars_holder').children('.overflow_bar').height(overall_height - ( thisObject.children('.bars_holder').children('.normal_progress').height() + thisObject.children('.bars_holder').children('.critical_progress').height() ));
			//RADIUS
			thisObject.children('.bars_holder').children('.overflow_bar').addClass("top_radius");
			//COLOR
			thisObject.children('.bars_holder').children('.overflow_bar').css("background-color", mySettings['overflow_color']);
			/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=Dummy Bar=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
			//HEIGHT - SLAVE
			thisObject.children('.bars_holder').children('.dummy_bar').height(overall_height - (thisObject.children('.bars_holder').children('.normal_progress').height() + thisObject.children('.bars_holder').children('.critical_progress').height() +  thisObject.children('.bars_holder').children('.overflow_bar').height()));
			//restore overall_height
			if (mySettings['separator'] == true) {
				overall_height = overall_height + 1;
			}
		}
		//checking separator case
		if (thisObject.children('.bars_holder').children('.normal_progress').hasClass('normal_BTT_separator')) {
			thisObject.children('.bars_holder').children('.normal_progress').height(thisObject.children('.bars_holder').children('.normal_progress').height() - 1);
		}
		//updating gradient bars
		thisObject.children('.empty_vertical_bar').height(thisObject.children('.bars_holder').children('.dummy_bar').height());
		thisObject.children('.full_vertical_bar').height(overall_height - thisObject.children('.bars_holder').children('.dummy_bar').height());
		thisObject.children('.vertical_bar_image').height(thisObject.children('.full_vertical_bar').height());
		//checking style bars radius
		if (current_value >= max_value) {
			thisObject.children('.full_vertical_bar').addClass('full_radius');
			thisObject.children('.vertical_bar_image').addClass('full_radius');
		}
		else if (current_value == min_value) {
			thisObject.children('.empty_vertical_bar').addClass('full_radius');
		}
		else {
			thisObject.children('.full_vertical_bar').addClass('bottom_radius');
			thisObject.children('.vertical_bar_image').addClass('bottom_radius');
			thisObject.children('.empty_vertical_bar').addClass('top_radius');
		}
	}
	
	function topLabels(options) {
		/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=first, check for horizontal orientation=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
		if (options['direction'] != 'LTR' && options['direction'] != 'RTL') {
			return false;
		}
		/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=second, check positions=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
		if (options['percentage_label'] == true && options['percentage_position'] == 'TL') {
			return true;
		}
		if (options['percentage_label'] == true && options['percentage_position'] == 'TC') {
			return true;
		}
		if (options['percentage_label'] == true && options['percentage_position'] == 'TR') {
			return true;
		}
		if (options['value_label'] == true && options['value_position'] == 'TL') {
			return true;
		}
		if (options['value_label'] == true && options['value_position'] == 'TC') {
			return true;
		}
		if (options['value_label'] == true && options['value_position'] == 'TR') {
			return true;
		}
		if (options['min_label'] == true && options['min_label_position'] == 'T') {
			return true;
		}
		if (options['max_label'] == true && options['max_label_position'] == 'T') {
			return true;
		}
		return false;
	}
	
	function midLabels(options) {
		/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=first, check for horizontal orientation=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
		if (options['direction'] != 'LTR' && options['direction'] != 'RTL') {
			return false;
		}
		/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=second, check positions=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
		if (options['percentage_label'] == true && options['percentage_position'] == 'ML') {
			return true;
		}
		if (options['percentage_label'] == true && options['percentage_position'] == 'MC') {
			return true;
		}
		if (options['percentage_label'] == true && options['percentage_position'] == 'MR') {
			return true;
		}
		if (options['value_label'] == true && options['value_position'] == 'ML') {
			return true;
		}
		if (options['value_label'] == true && options['value_position'] == 'MC') {
			return true;
		}
		if (options['value_label'] == true && options['value_position'] == 'MR') {
			return true;
		}
		return false;
	}
	
	function bottomLabels(options) {
		/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=first, check for horizontal orientation=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
		if (options['direction'] != 'LTR' && options['direction'] != 'RTL') {
			return false;
		}
		/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=second, check positions=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
		if (options['percentage_label'] == true && options['percentage_position'] == 'BL') {
			return true;
		}
		if (options['percentage_label'] == true && options['percentage_position'] == 'BC') {
			return true;
		}
		if (options['percentage_label'] == true && options['percentage_position'] == 'BR') {
			return true;
		}
		if (options['value_label'] == true && options['value_position'] == 'BL') {
			return true;
		}
		if (options['value_label'] == true && options['value_position'] == 'BC') {
			return true;
		}
		if (options['value_label'] == true && options['value_position'] == 'BR') {
			return true;
		}
		if (options['min_label'] == true && options['min_label_position'] == 'B') {
			return true;
		}
		if (options['max_label'] == true && options['max_label_position'] == 'B') {
			return true;
		}
		return false;
	}
	
	function leftLabels(options) {
		/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=first, check for vertical orientation=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
		if (options['direction'] != 'TTB' && options['direction'] != 'BTT') {
			return false;
		}
		/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=second, check positions=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
		if (options['percentage_label'] == true && options['percentage_position'] == 'TL') {
			return true;
		}
		if (options['percentage_label'] == true && options['percentage_position'] == 'ML') {
			return true;
		}
		if (options['percentage_label'] == true && options['percentage_position'] == 'BL') {
			return true;
		}
		if (options['value_label'] == true && options['value_position'] == 'TL') {
			return true;
		}
		if (options['value_label'] == true && options['value_position'] == 'ML') {
			return true;
		}
		if (options['value_label'] == true && options['value_position'] == 'BL') {
			return true;
		}
		if (options['min_label'] == true && options['min_label_position'] == 'L') {
			return true;
		}
		if (options['max_label'] == true && options['max_label_position'] == 'L') {
			return true;
		}
		return false;
	}
	
	function centerLabels(options) {
		/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=first, check for vertical orientation=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
		if (options['direction'] != 'TTB' && options['direction'] != 'BTT') {
			return false;
		}
		/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=second, check positions=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
		if (options['percentage_label'] == true && options['percentage_position'] == 'TC') {
			return true;
		}
		if (options['percentage_label'] == true && options['percentage_position'] == 'MC') {
			return true;
		}
		if (options['percentage_label'] == true && options['percentage_position'] == 'BC') {
			return true;
		}
		if (options['value_label'] == true && options['value_position'] == 'TC') {
			return true;
		}
		if (options['value_label'] == true && options['value_position'] == 'MC') {
			return true;
		}
		if (options['value_label'] == true && options['value_position'] == 'BC') {
			return true;
		}
		return false;
	}
	
	function rightLabels(options) {
		/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=first, check for vertical orientation=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
		if (options['direction'] != 'TTB' && options['direction'] != 'BTT') {
			return false;
		}
		/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=second, check positions=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
		if (options['percentage_label'] == true && options['percentage_position'] == 'TR') {
			return true;
		}
		if (options['percentage_label'] == true && options['percentage_position'] == 'MR') {
			return true;
		}
		if (options['percentage_label'] == true && options['percentage_position'] == 'BR') {
			return true;
		}
		if (options['value_label'] == true && options['value_position'] == 'TR') {
			return true;
		}
		if (options['value_label'] == true && options['value_position'] == 'MR') {
			return true;
		}
		if (options['value_label'] == true && options['value_position'] == 'BR') {
			return true;
		}
		if (options['min_label'] == true && options['min_label_position'] == 'R') {
			return true;
		}
		if (options['max_label'] == true && options['max_label_position'] == 'R') {
			return true;
		}
		return false;
	}
	
	function updateLabels(epbframe, options, minValue, maxValue, currentValue) {
		/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=freeing spans=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
		epbframe.children('.percentage_label').empty();
		epbframe.children('.value_label').empty();
		epbframe.children('.minval_label').empty();
		epbframe.children('.maxval_label').empty();
		/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=setting span font size-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
		if (options['percentage_font_size'] != 0) {
			epbframe.children('.percentage_label').css('font-size', options['percentage_font_size']);
		}
		if (options['value_font_size'] != 0) {
			epbframe.children('.value_label').css('font-size', options['value_font_size']);
		}
		if (options['min_label_font_size'] != 0) {
			epbframe.children('.minval_label').css('font-size', options['min_label_font_size']);
		}
		if (options['max_label_font_size'] != 0) {
			epbframe.children('.maxval_label').css('font-size', options['max_label_font_size']);
		}
		/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=updating percentage & value=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
		if (midLabels(options)) {
			if (options['percentage_label'] == true) {
				epbframe.children('.percentage_label').html(Math.round((currentValue - minValue)/(maxValue - minValue) * 10000) / 100 + '%');
				if (options['percentage_position'] == 'MC') {
					epbframe.children('.percentage_label').css('top', epbframe.height()/2 - epbframe.children('.percentage_label').height()/2 + 'px');
					epbframe.children('.percentage_label').css('left', epbframe.width()/2 - epbframe.children('.percentage_label').width()/2 + 'px')
				}
				else if (options['percentage_position'] == 'ML') {
					epbframe.children('.percentage_label').css('top', epbframe.height()/2 - epbframe.children('.percentage_label').height()/2 + 'px');
					epbframe.children('.percentage_label').css('left', '0px');
				}
				else if (options['percentage_position'] == 'MR') {
					epbframe.children('.percentage_label').css('top', epbframe.height()/2 - epbframe.children('.percentage_label').height()/2 + 'px');
					epbframe.children('.percentage_label').css('left', epbframe.width() - epbframe.children('.percentage_label').width() + 'px');
				}
			}
			if (options['value_label'] == true) {
				epbframe.children('.value_label').html(currentValue);
				if (options['value_position'] == 'MC') {
					epbframe.children('.value_label').css('top', epbframe.height()/2 - epbframe.children('.value_label').height()/2 + 'px');
					epbframe.children('.value_label').css('left', epbframe.width()/2 - epbframe.children('.value_label').width()/2 + 'px');
				}
				else if (options['value_position'] == 'ML') {
					epbframe.children('.value_label').css('top', epbframe.height()/2 - epbframe.children('.value_label').height()/2 + 'px');
					epbframe.children('.value_label').css('left', '0px');
				}
				else if (options['value_position'] == 'MR') {
					epbframe.children('.value_label').css('top', epbframe.height()/2 - epbframe.children('.value_label').height()/2 + 'px');
					epbframe.children('.value_label').css('left', epbframe.width() - epbframe.children('.value_label').width() + 'px');
				}
			}
		}
		if (topLabels(options)) {
			if (options['percentage_label'] == true) {
				epbframe.children('.percentage_label').html(Math.round((currentValue - minValue)/(maxValue - minValue) * 10000) / 100 + '%');
				if (options['percentage_position'] == 'TC') {
					epbframe.children('.percentage_label').css('top', -1 * epbframe.children('.percentage_label').height() + 'px');
					epbframe.children('.percentage_label').css('left', epbframe.width()/2 - epbframe.children('.percentage_label').width()/2 + 'px');
				}
				else if (options['percentage_position'] == 'TL') {
					epbframe.children('.percentage_label').css('top', -1 * epbframe.children('.percentage_label').height() + 'px');
					epbframe.children('.percentage_label').css('left', '0px');
				}
				else if (options['percentage_position'] == 'TR') {
					epbframe.children('.percentage_label').css('top', -1 * epbframe.children('.percentage_label').height() + 'px');
					epbframe.children('.percentage_label').css('left', epbframe.width() - epbframe.children('.percentage_label').width() + 'px');
				}
			}
			if (options['value_label'] == true) {
				epbframe.children('.value_label').html(currentValue);
				if (options['value_position'] == 'TC') {
					epbframe.children('.value_label').css('top', -1 * epbframe.children('.value_label').height() + 'px');
					epbframe.children('.value_label').css('left', epbframe.width()/2 - epbframe.children('.value_label').width()/2 + 'px');
				}
				else if (options['value_position'] == 'TL') {
					epbframe.children('.value_label').css('top', -1 * epbframe.children('.value_label').height() + 'px');
					epbframe.children('.value_label').css('left', '0px');
				}
				else if (options['value_position'] == 'TR') {
					epbframe.children('.value_label').css('top', -1 * epbframe.children('.value_label').height() + 'px');
					epbframe.children('.value_label').css('left', epbframe.width() - epbframe.children('.value_label').width() + 'px');
				}
			}
		}
		if (bottomLabels(options)) {
			if (options['percentage_label'] == true) {
				epbframe.children('.percentage_label').html(Math.round((currentValue - minValue)/(maxValue - minValue) * 10000) / 100 + '%');
				if (options['percentage_position'] == 'BC') {
					epbframe.children('.percentage_label').css('top', epbframe.height() + 'px');
					epbframe.children('.percentage_label').css('left', epbframe.width()/2 - epbframe.children('.percentage_label').width()/2 + 'px');
				}
				else if (options['percentage_position'] == 'BL') {
					epbframe.children('.percentage_label').css('top', epbframe.height() + 'px');
					epbframe.children('.percentage_label').css('left', '0px');
				}
				else if (options['percentage_position'] == 'BR') {
					epbframe.children('.percentage_label').css('top', epbframe.height() + 'px');
					epbframe.children('.percentage_label').css('left', epbframe.width() - epbframe.children('.percentage_label').width() + 'px');
				}
			}
			if (options['value_label'] == true) {
				epbframe.children('.value_label').html(currentValue);
				if (options['value_position'] == 'BC') {
					epbframe.children('.value_label').css('top', epbframe.height() + 'px');
					epbframe.children('.value_label').css('left', epbframe.width()/2 - epbframe.children('.value_label').width()/2 + 'px');
				}
				else if (options['value_position'] == 'BL') {
					epbframe.children('.value_label').css('top', epbframe.height() + 'px');
					epbframe.children('.value_label').css('left', '0px');
				}
				else if (options['value_position'] == 'BR') {
					epbframe.children('.value_label').css('top', epbframe.height() + 'px');
					epbframe.children('.value_label').css('left', epbframe.width() - epbframe.children('.value_label').width() + 'px');
				}
			}
		}
		if (centerLabels(options)) {
			if (options['percentage_label'] == true) {
				epbframe.children('.percentage_label').html(Math.round((currentValue - minValue)/(maxValue - minValue) * 10000) / 100 + '%');
				if (options['percentage_position'] == 'MC') {
					epbframe.children('.percentage_label').css('top', epbframe.height()/2 - epbframe.children('.percentage_label').height()/2 + 'px');
					epbframe.children('.percentage_label').css('left', epbframe.width()/2 - epbframe.children('.percentage_label').width()/2 + 'px');
				}
				else if (options['percentage_position'] == 'TC') {
					epbframe.children('.percentage_label').css('top', '0px');
					epbframe.children('.percentage_label').css('left', epbframe.width()/2 - epbframe.children('.percentage_label').width()/2 + 'px');
				}
				else if (options['percentage_position'] == 'BC') {
					epbframe.children('.percentage_label').css('top', epbframe.height() - epbframe.children('.percentage_label').height() + 'px');
					epbframe.children('.percentage_label').css('left', epbframe.width()/2 - epbframe.children('.percentage_label').width()/2 + 'px');
				}
			}
			if (options['value_label'] == true) {
				epbframe.children('.value_label').html(currentValue);
				if (options['value_position'] == 'MC') {
					epbframe.children('.value_label').css('top', epbframe.height()/2 - epbframe.children('.value_label').height()/2 + 'px');
					epbframe.children('.value_label').css('left', epbframe.width()/2 - epbframe.children('.value_label').width()/2 + 'px');
				}
				else if (options['value_position'] == 'TC') {
					epbframe.children('.value_label').css('top', '0px');
					epbframe.children('.value_label').css('left', epbframe.width()/2 - epbframe.children('.value_label').width()/2 + 'px');
				}
				else if (options['value_position'] == 'BC') {
					epbframe.children('.value_label').css('top', epbframe.height() - epbframe.children('.value_label').height() + 'px');
					epbframe.children('.value_label').css('left', epbframe.width()/2 - epbframe.children('.value_label').width()/2 + 'px');
				}
			}
		}
		if (leftLabels(options)) {
			if (options['percentage_label'] == true) {
				epbframe.children('.percentage_label').html(Math.round((currentValue - minValue)/(maxValue - minValue) * 10000) / 100 + '%');
				if (options['percentage_position'] == 'ML') {
					epbframe.children('.percentage_label').css('top', epbframe.height()/2 - epbframe.children('.percentage_label').height()/2 + 'px');
					epbframe.children('.percentage_label').css('left', -1 * epbframe.children('.percentage_label').width() + 'px');
				}
				else if (options['percentage_position'] == 'TL') {
					epbframe.children('.percentage_label').css('top', '0px');
					epbframe.children('.percentage_label').css('left', -1 * epbframe.children('.percentage_label').width() + 'px');
				}
				else if (options['percentage_position'] == 'BL') {
					epbframe.children('.percentage_label').css('top', epbframe.height() - epbframe.children('.percentage_label').height() + 'px');
					epbframe.children('.percentage_label').css('left', -1 * epbframe.children('.percentage_label').width() + 'px');
				}
			}
			if (options['value_label'] == true) {
				epbframe.children('.value_label').html(currentValue);
				if (options['value_position'] == 'ML') {
					epbframe.children('.value_label').css('top', epbframe.height()/2 - epbframe.children('.value_label').height()/2 + 'px');
					epbframe.children('.value_label').css('left', -1 * epbframe.children('.value_label').width() + 'px');
				}
				else if (options['value_position'] == 'TL') {
					epbframe.children('.value_label').css('top', '0px');
					epbframe.children('.value_label').css('left', -1 * epbframe.children('.value_label').width() + 'px');
				}
				else if (options['value_position'] == 'BL') {
					epbframe.children('.value_label').css('top', epbframe.height() - epbframe.children('.value_label').height() + 'px');
					epbframe.children('.value_label').css('left', -1 * epbframe.children('.value_label').width() + 'px');
				}
			}
		}
		if (rightLabels(options)) {
			if (options['percentage_label'] == true) {
				epbframe.children('.percentage_label').html(Math.round((currentValue - minValue)/(maxValue - minValue) * 10000) / 100 + '%');
				if (options['percentage_position'] == 'MR') {
					epbframe.children('.percentage_label').css('top', epbframe.height()/2 - epbframe.children('.percentage_label').height()/2 + 'px');
					epbframe.children('.percentage_label').css('left', epbframe.width() + 'px');
				}
				else if (options['percentage_position'] == 'TR') {
					epbframe.children('.percentage_label').css('top', '0px');
					epbframe.children('.percentage_label').css('left', epbframe.width() + 'px');
				}
				else if (options['percentage_position'] == 'BR') {
					epbframe.children('.percentage_label').css('top', epbframe.height() - epbframe.children('.percentage_label').height() + 'px');
					epbframe.children('.percentage_label').css('left', epbframe.width() + 'px');
				}
			}
			if (options['value_label'] == true) {
				epbframe.children('.value_label').html(currentValue);
				if (options['value_position'] == 'MR') {
					epbframe.children('.value_label').css('top', epbframe.height()/2 - epbframe.children('.value_label').height()/2 + 'px');
					epbframe.children('.value_label').css('left', epbframe.width() + 'px');
				}
				else if (options['value_position'] == 'TR') {
					epbframe.children('.value_label').css('top', '0px');
					epbframe.children('.value_label').css('left', epbframe.width() + 'px');
				}
				else if (options['value_position'] == 'BR') {
					epbframe.children('.value_label').css('top', epbframe.height() - epbframe.children('.value_label').height() + 'px');
					epbframe.children('.value_label').css('left', epbframe.width() + 'px');
				}
			}
		}
		/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=updating extremes=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
		var margin = 1;
		if (options['min_label'] == true) {
			epbframe.children('.minval_label').html(options['min_val']);
			if (options['direction'] == 'LTR' || options['direction'] == 'RTL') {
				/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
				=-=-=Setting Left Position=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
				=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
				if (options['direction'] == 'LTR' && options['min_label_position'] == 'M') {
					epbframe.children('.minval_label').css('left', -1 * epbframe.children('.minval_label').width() - margin + 'px');
				}
				else if (options['direction'] == 'LTR') {
					epbframe.children('.minval_label').css('left', margin + 'px');
				}
				else if (options['direction'] == 'RTL' && options['min_label_position'] == 'M') {
					epbframe.children('.minval_label').css('left', epbframe.width() + margin + 'px');
				}
				else if (options['direction'] == 'RTL') {
					epbframe.children('.minval_label').css('left', epbframe.width() - epbframe.children('.minval_label').width() - margin + 'px');
				}
				/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
				=-=-=Setting Top Position-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
				=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
				if (options['min_label_position'] == 'T') {
					epbframe.children('.minval_label').css('top', -1 * epbframe.children('.minval_label').height() + 'px');
				}
				else if (options['min_label_position'] == 'M') {
					epbframe.children('.minval_label').css('top', epbframe.height()/2 - epbframe.children('.minval_label').height()/2 + 'px');
				}
				else if (options['min_label_position'] == 'B') {
					epbframe.children('.minval_label').css('top', epbframe.height() + 'px');
				}
			}
			else if (options['direction'] == 'TTB' || options['direction'] == 'BTT') {
				/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
				=-=-=Setting Top Position-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
				=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
				if (options['direction'] == 'TTB' && options['min_label_position'] == 'C') {
					epbframe.children('.minval_label').css('top', -1 * epbframe.children('.minval_label').height() - margin + 'px');
				}
				else if (options['direction'] == 'TTB') {
					epbframe.children('.minval_label').css('top', margin + 'px');
				}
				else if (options['direction'] == 'BTT' && options['min_label_position'] == 'C') {
					epbframe.children('.minval_label').css('top', epbframe.height() + margin + 'px');
				}
				else if (options['direction'] == 'BTT') {
					epbframe.children('.minval_label').css('top', epbframe.height() - epbframe.children('.minval_label').height() - margin + 'px');
				}
				/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
				=-=-=Setting Left Position=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
				=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
				if (options['min_label_position'] == 'L') {
					epbframe.children('.minval_label').css('left', -1 * epbframe.children('.minval_label').width() + 'px');
				}
				else if (options['min_label_position'] == 'C') {
					epbframe.children('.minval_label').css('left', epbframe.width()/2 - epbframe.children('.minval_label').width()/2 + 'px');
				}
				else if (options['min_label_position'] == 'R') {
					epbframe.children('.minval_label').css('left', epbframe.width() + 'px');
				}
			}
		}
		if (options['max_label'] == true) {
			epbframe.children('.maxval_label').html(options['max_val']);
			if (options['direction'] == 'LTR' || options['direction'] == 'RTL') {
				/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
				=-=-=Setting Left Position=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
				=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
				if (options['direction'] == 'LTR' && options['max_label_position'] == 'M') {
					if (currentValue > maxValue) {
						epbframe.children('.maxval_label').css('left', epbframe.children('.bars_holder').children('.normal_progress').width() + epbframe.children('.bars_holder').children('.critical_progress').width() + margin + 'px');
					}
					else {
						epbframe.children('.maxval_label').css('left', epbframe.width() + margin + 'px');
					}
				}
				else if (options['direction'] == 'LTR') {
					if (currentValue > maxValue) {
						epbframe.children('.maxval_label').css('left', epbframe.children('.bars_holder').children('.normal_progress').width() + epbframe.children('.bars_holder').children('.critical_progress').width() - epbframe.children('.maxval_label').width() - margin + 'px');
					}
					else {
						epbframe.children('.maxval_label').css('left', epbframe.width() - epbframe.children('.maxval_label').width() - margin + 'px');
					}
				}
				else if (options['direction'] == 'RTL' && options['max_label_position'] == 'M') {
					if (currentValue > maxValue) {
						epbframe.children('.maxval_label').css('left', epbframe.children('.bars_holder').children('.overflow_bar').width() - epbframe.children('.maxval_label').width() - margin + 'px');
					}
					else {
						epbframe.children('.maxval_label').css('left', -1 * epbframe.children('.maxval_label').width() - margin + 'px');
					}
				}
				else if (options['direction'] == 'RTL') {
					if (currentValue > maxValue) {
						epbframe.children('.maxval_label').css('left', epbframe.children('.bars_holder').children('.overflow_bar').width() + margin + 'px');
					}
					else {
						epbframe.children('.maxval_label').css('left', margin + 'px');
					}
				}
				/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
				=-=-=Setting Top Position-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
				=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
				if (options['max_label_position'] == 'T') {
					epbframe.children('.maxval_label').css('top', -1 * epbframe.children('.maxval_label').height() + 'px');
				}
				else if (options['max_label_position'] == 'M') {
					epbframe.children('.maxval_label').css('top', epbframe.height()/2 - epbframe.children('.maxval_label').height()/2 + 'px');
				}
				else if (options['max_label_position'] == 'B') {
					epbframe.children('.maxval_label').css('top', epbframe.height() + 'px');
				}
			}
			else if (options['direction'] == 'TTB' || options['direction'] == 'BTT') {
				/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
				=-=-=Setting Top Position-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
				=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
				if (options['direction'] == 'TTB' && options['max_label_position'] == 'C') {
					if (currentValue > maxValue ) {
						epbframe.children('.maxval_label').css('top', epbframe.children('.bars_holder').children('.normal_progress').height() + epbframe.children('.bars_holder').children('.critical_progress').height() + margin + 'px');
					}
					else {
						epbframe.children('.maxval_label').css('top', epbframe.height() + margin + 'px');
					}
				}
				else if (options['direction'] == 'TTB') {
					if (currentValue > maxValue ) {
						epbframe.children('.maxval_label').css('top', epbframe.children('.bars_holder').children('.normal_progress').height() + epbframe.children('.bars_holder').children('.critical_progress').height() - epbframe.children('.maxval_label').height() - margin + 'px');
					}
					else {
						epbframe.children('.maxval_label').css('top', epbframe.height() - epbframe.children('.maxval_label').height() - margin + 'px');
					}
				}
				else if (options['direction'] == 'BTT'  && options['max_label_position'] == 'C') {
					if (currentValue > maxValue) {
						epbframe.children('.maxval_label').css('top', epbframe.children('.bars_holder').children('.overflow_bar').height() - epbframe.children('.maxval_label').height() - margin + 'px');
					}
					else {
						epbframe.children('.maxval_label').css('top', -1 * epbframe.children('.maxval_label').height() - margin + 'px');
					}
				}
				else if (options['direction'] == 'BTT') {
					if (currentValue > maxValue) {
						epbframe.children('.maxval_label').css('top', epbframe.children('.bars_holder').children('.overflow_bar').height() + margin + 'px');
					}
					else {
						epbframe.children('.maxval_label').css('top', margin + 'px');
					}
				}
				/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
				=-=-=Setting Left Position=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
				=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
				if (options['max_label_position'] == 'L') {
					epbframe.children('.maxval_label').css('left', -1 * epbframe.children('.maxval_label').width() + 'px');
				}
				else if (options['max_label_position'] == 'C') {
					epbframe.children('.maxval_label').css('left', epbframe.width()/2 - epbframe.children('.maxval_label').width()/2 + 'px');
				}
				else if (options['max_label_position'] == 'R') {
					epbframe.children('.maxval_label').css('left', epbframe.width() + 'px');
				}
			}
		}
		/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=setting span colors=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
		epbframe.children('.percentage_label').css('color', options['percentage_color']);
		epbframe.children('.value_label').css('color', options['value_color']);
		epbframe.children('.minval_label').css('color', options['min_label_color']);
		epbframe.children('.maxval_label').css('color', options['max_label_color']);
	}
	
	function invokeEventHandlers(epbframe, previous_value){
		/*=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=pre processing-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
		=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
		var current_value = epbframe.data('extendedprogressbar_current_value');
		var min_val = epbframe.data('extendedprogressbar_options')['min_val'];
		var max_val = epbframe.data('extendedprogressbar_options')['max_val'];
		var critical_val = epbframe.data('extendedprogressbar_options')['critical_val'];
		//calculating percentage
		var current_percent = Math.round( (current_value - min_val)/(max_val - min_val) * 10000 ) / 100;
		//check point values
		var exceed_value = epbframe.data('extendedprogressbar_options')['exceed_value'];
		var exceed_percentage = epbframe.data('extendedprogressbar_options')['exceed_percentage'];
		var equal_value = epbframe.data('extendedprogressbar_options')['equal_value'];
		var equal_percentage = epbframe.data('extendedprogressbar_options')['equal_percentage'];
		var less_than_value = epbframe.data('extendedprogressbar_options')['less_than_value'];
		var less_than_percentage = epbframe.data('extendedprogressbar_options')['less_than_percentage'];
		
		//1.  onUpdate
		epbframe.trigger('epb_onupdate', [epbframe, current_value]);
		//2.  onNormalUpdate
		if (previous_value <= critical_val && current_value <= critical_val) {
			epbframe.trigger('epb_onnormalupdate', [epbframe, current_value]);
		}
		//3.  onNormalIncrease
		if (current_value > previous_value 
								&& previous_value < critical_val 
								&& current_value <= critical_val) {
			epbframe.trigger('epb_onnormalincrease', [epbframe, current_value]);
		}
		//4.  onNormalDecrease
		if (current_value < previous_value 
								&& previous_value <= critical_val 
								&& current_value < critical_val) {
			epbframe.trigger('epb_onnormaldecrease', [epbframe, current_value]);
		}
		//5.  onCriticalUpdate
		if (previous_value > critical_val && previous_value <= max_val && current_value > critical_val && current_value <= max_val) {
			epbframe.trigger('epb_oncriticalupdate', [epbframe, current_value]);
		}
		//6.  onCriticalIncrease
		if (current_value > previous_value 
								&& previous_value > critical_val 
								&& previous_value < max_val 
								&& current_value > critical_val
								&& current_value <= max_val) {
			epbframe.trigger('epb_oncriticalincrease', [epbframe, current_value]);
		}
		//7.  onCriticalDecrease
		if (current_value < previous_value 
								&& previous_value > critical_val 
								&& previous_value <= max_val 
								&& current_value > critical_val
								&& current_value < max_val) {
			epbframe.trigger('epb_oncriticaldecrease', [epbframe, current_value]);
		}
		//8.  onOverflowUpdate
		if (previous_value > max_val && current_value > max_val) {
			epbframe.trigger('epb_onoverflowupdate', [epbframe, current_value]);
		}
		//9.  onOverflowIncrease
		if (current_value > previous_value 
								&& previous_value > max_val 
								&& current_value > max_val) {
			epbframe.trigger('epb_onoverflowincrease', [epbframe, current_value]);
		}
		//10. onOverflowDecrease
		if (current_value < previous_value 
								&& previous_value > max_val 
								&& current_value > max_val) {
			epbframe.trigger('epb_onoverflowdecrease', [epbframe, current_value]);
		}
		//11. onNormalLeave
		if (current_value > previous_value 
								&& previous_value <= critical_val 
								&& current_value > critical_val) {
			epbframe.trigger('epb_onnormalleave', [epbframe, current_value]);
		}
		//12. onCriticalLeave
		if ((current_value > previous_value && previous_value <= max_val && previous_value > critical_val && current_value > max_val)
				|| (current_value < previous_value && previous_value <= max_val && previous_value > critical_val && current_value <= critical_val)) {
			epbframe.trigger('epb_oncriticalleave', [epbframe, current_value]);
		}
		//13. onOverflowLeave
		if (current_value < previous_value 
								&& previous_value > max_val 
								&& current_value <= max_val) {
			epbframe.trigger('epb_onoverflowleave', [epbframe, current_value]);
		}
		//14. onNormalEnter
		if (current_value < previous_value 
								&& previous_value > critical_val 
								&& current_value <= critical_val) {
			epbframe.trigger('epb_onnormalenter', [epbframe, current_value]);
		}
		//15. onCriticalEnter
		if ((current_value > previous_value && current_value <= max_val && current_value > critical_val && previous_value <= critical_val)
				|| (current_value < previous_value && current_value <= max_val && current_value > critical_val && previous_value > max_val)) {
			epbframe.trigger('epb_oncriticalenter', [epbframe, current_value]);
		}
		//16. onOverflowEnter
		if (current_value > previous_value 
								&& previous_value <= max_val 
								&& current_value > max_val) {
			epbframe.trigger('epb_onoverflowenter', [epbframe, current_value]);
		}
		//17. onComplete
		if (current_value == max_val){
			epbframe.trigger('epb_oncomplete', [epbframe, current_value]);
		}
		//28. onEmpty
		if (current_value == min_val){
			epbframe.trigger('epb_onempty', [epbframe, current_value]);
		}
	}
	
	function reset(epbframe){
		epbframe.children('.bars_holder').children('.separator').removeClass('horizontal_separator');
		epbframe.children('.bars_holder').children('.separator').removeClass('vertical_separator');
		epbframe.children('.bars_holder').children('.separator').width(0);
		epbframe.children('.bars_holder').children('.separator').height(0);
		epbframe.children('.bars_holder').children('.normal_progress').removeClass('normal_LTR_separator');
		epbframe.children('.bars_holder').children('.normal_progress').removeClass('normal_RTL_separator');
		epbframe.children('.bars_holder').children('.normal_progress').removeClass('normal_TTB_separator');
		epbframe.children('.bars_holder').children('.normal_progress').removeClass('normal_BTT_separator');
		
		//clear radius
		epbframe.children('.bars_holder').children('.normal_progress').removeClass('left_radius');
		epbframe.children('.bars_holder').children('.normal_progress').removeClass('right_radius');
		epbframe.children('.bars_holder').children('.normal_progress').removeClass('top_radius');
		epbframe.children('.bars_holder').children('.normal_progress').removeClass('bottom_radius');
		epbframe.children('.bars_holder').children('.normal_progress').removeClass('full_radius');
		
		epbframe.children('.bars_holder').children('.critical_progress').removeClass('left_radius');
		epbframe.children('.bars_holder').children('.critical_progress').removeClass('right_radius');
		epbframe.children('.bars_holder').children('.critical_progress').removeClass('top_radius');
		epbframe.children('.bars_holder').children('.critical_progress').removeClass('bottom_radius');
		epbframe.children('.bars_holder').children('.critical_progress').removeClass('full_radius');
		
		epbframe.children('.bars_holder').children('.overflow_bar').removeClass('left_radius');
		epbframe.children('.bars_holder').children('.overflow_bar').removeClass('right_radius');
		epbframe.children('.bars_holder').children('.overflow_bar').removeClass('top_radius');
		epbframe.children('.bars_holder').children('.overflow_bar').removeClass('bottom_radius');
		epbframe.children('.bars_holder').children('.overflow_bar').removeClass('full_radius');
		
		epbframe.children('.full_horizontal_bar').removeClass('left_radius');
		epbframe.children('.full_horizontal_bar').removeClass('right_radius');
		epbframe.children('.full_horizontal_bar').removeClass('top_radius');
		epbframe.children('.full_horizontal_bar').removeClass('bottom_radius');
		epbframe.children('.full_horizontal_bar').removeClass('full_radius');
		
		epbframe.children('.empty_horizontal_bar').removeClass('left_radius');
		epbframe.children('.empty_horizontal_bar').removeClass('right_radius');
		epbframe.children('.empty_horizontal_bar').removeClass('top_radius');
		epbframe.children('.empty_horizontal_bar').removeClass('bottom_radius');
		epbframe.children('.empty_horizontal_bar').removeClass('full_radius');
		
		epbframe.children('.full_vertical_bar').removeClass('left_radius');
		epbframe.children('.full_vertical_bar').removeClass('right_radius');
		epbframe.children('.full_vertical_bar').removeClass('top_radius');
		epbframe.children('.full_vertical_bar').removeClass('bottom_radius');
		epbframe.children('.full_vertical_bar').removeClass('full_radius');
		
		epbframe.children('.empty_vertical_bar').removeClass('left_radius');
		epbframe.children('.empty_vertical_bar').removeClass('right_radius');
		epbframe.children('.empty_vertical_bar').removeClass('top_radius');
		epbframe.children('.empty_vertical_bar').removeClass('bottom_radius');
		epbframe.children('.empty_vertical_bar').removeClass('full_radius');
		
		epbframe.children('.horizontal_bar_image').removeClass('left_radius');
		epbframe.children('.horizontal_bar_image').removeClass('right_radius');
		epbframe.children('.horizontal_bar_image').removeClass('top_radius');
		epbframe.children('.horizontal_bar_image').removeClass('bottom_radius');
		epbframe.children('.horizontal_bar_image').removeClass('full_radius');
		
		epbframe.children('.vertical_bar_image').removeClass('left_radius');
		epbframe.children('.vertical_bar_image').removeClass('right_radius');
		epbframe.children('.vertical_bar_image').removeClass('top_radius');
		epbframe.children('.vertical_bar_image').removeClass('bottom_radius');
		epbframe.children('.vertical_bar_image').removeClass('full_radius');
	}
	
	function defaultIncrement(epbframe, increment, percent, current_value, min_value, max_value) {
		/*if ( current_value + increment < min_value || (current_value + increment > max_value && epbframe.data('extendedprogressbar_options')['overflow'] == false) ) {
			return;
		}
		var arr = [];
		arr[0] = current_value + increment;
		methods['updateValue'].apply(epbframe, Array.prototype.slice.call(arr, 0));*/
		
		/*
		if ( current_value + increment < min_value || (current_value + increment > max_value && epbframe.data('extendedprogressbar_options')['overflow'] == false) ) {
			return false;
		}
		return true;
		*/
		
		return true;
	}
})(jQuery);