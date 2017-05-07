/*

The recursive array flattener is a bit of a sprawling mess (sorry) but the Morse core code is a bit more
reasonably structured.

*/

$( document ).ready(function() {

	var morse = Morse();

	// array flatten core code
	var recursiveFlatten = function(input, output) {
		output = output ? output : [];
		for (var i = 0; i < input.length; i++) {
			if ( Object.prototype.toString.call( input[i] ) === '[object Array]' ) {
				recursiveFlatten(input[i], output);
			} else {
				output.push( input[i] );
			}
		}
		return output;
	};

	var viewArrayClick = function(event) {
		event.stopPropagation();
		$el.card.intro.hide();
		$el.card.mainArray.show();
		return false;
	};

	var viewMorseClick = function(event) {
		event.stopPropagation();
		$el.card.intro.hide();
		$el.card.mainMorse.show();
		return false;
	};

	var runTestArrayClick = function(event) {
		event.stopPropagation();
		// this is a bit scrappy, admittedly
		var checked = $el.data.filter(':checked');
		var dataString;
		if (checked.is('#data-custom')) {
			dataString = $el.customArray.val();
		} else {
			dataString = checked.parent().find('label').html();
		}
		runTestArray( dataString );
		return false;
	};
	
	var runTestArray = function(dataString) {

		var dataParsed;
		try {
			dataParsed = eval(dataString); // Yes, I'd be cautious about eval in production code
		} catch (ex) {
			$el.output.testMessage.html('Parsing data failed: ' + ex);
			return false;
		}

		var robOut = JSON.stringify(recursiveFlatten(dataParsed));
		var lodashOut = JSON.stringify(_.flatten(dataParsed));
		var underscoreOut = JSON.stringify(__.flattenDeep(dataParsed));

		$el.output.algoOutput.html(robOut);
		$el.output.lodashOutput.html(lodashOut);
		$el.output.underscoreOutput.html(underscoreOut);

		if ((robOut === underscoreOut) && (robOut === lodashOut)) {
			$el.output.testMessage.html('All outputs match');
		} else {
			$el.output.testMessage.html('Mismatch between outputs');
		}

	};

	var encodeMessage = function(event) {
		if(event) {
			event.stopPropagation();
		}
		$el.inputMessage.val( $el.inputMessage.val().toUpperCase() );
		var message = $el.inputMessage.val();
		$el.output.morseStandard.text(morse.encodeMorse(message, false));
		$el.output.morseObfuscated.text(morse.encodeMorse(message, true));


		$el.downloadOutputWrapper.html(
			'<a id="download-output" href="data:application/octet-stream;charset=utf-8;base64,' +
				btoa(encodeMorse(message, true)) + '">Download</a>');
	};

	var uploadFile = function() {
		try {
			var file = $el.fileUpload[0].files[0];
			var textType = /text.*/;

			var reader = new FileReader();

			reader.onload = function(e) {
				$el.inputMessage.val(reader.result);
				encodeMessage();
			};

			reader.readAsText(file);
		} catch (ex) {
			$el.inputMessage.text('All is lost!');
			encodeMessage();
		}
	};


	// bind elements
	$el = {
		data: $('[name="data"]'),
		customArray: $('#custom-array'),
		inputMessage: $('#input-message'),
		fileUpload: $('#file-upload'),
		runTestMorse: $('#run-test-morse'),
		downloadOutputWrapper: $('#download-output-wrapper'),
		card: {
			intro: $('#intro'),
			mainArray: $('#main-array'),
			mainMorse: $('#main-morse')
		},
		buttons: {
			viewArray: $('#view-array'),
			viewMorse: $('#view-morse'),
			runTestArray: $('#run-test')
		},
		output : {
			algoOutput: $('#algo-output'),
			underscoreOutput: $('#underscore-output'),
			lodashOutput: $('#lodash-output'),
			testMessage: $('#test-message'),
			morseStandard: $('#encoded-message-morse'),
			morseObfuscated: $('#encoded-message-obfuscated')
		}
	};

	// bind events
	$el.buttons.viewArray.on('click', viewArrayClick);
	$el.buttons.viewMorse.on('click', viewMorseClick);
	$el.buttons.runTestArray.on('click', runTestArrayClick);
	$el.inputMessage.on('keyup', encodeMessage);
	$el.fileUpload.on('change', uploadFile);

	$el.runTestMorse.on('click', function() {
		testEncoding();
	});
	$el.downloadOutputWrapper.on('click', uploadFile);

	// initialisation code
	encodeMessage();

});