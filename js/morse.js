var Morse = function () {
	var that = this;

	// Morse cypher core code
	var morseCypher = {
		'A': '.-',
		'B': '-...',
		'C': '-.-.',
		'D': '-..',
		'E': '.',
		'F': '..-.',
		'G': '--.',
		'H': '....',
		'I': '..',
		'J': '.---',
		'K': '-.-',
		'L': '.-..',
		'M': '--',
		'N': '-.',
		'O': '---',
		'P': '.--.',
		'Q': '--.-',
		'R': '.-.',
		'S': '...',
		'T': '-',
		'U': '..-',
		'V': '...-',
		'W': '.--',
		'X': '-..-',
		'Y': '-.--',
		'Z': '--..',
		'0': '-----',
		'1': '.----',
		'2': '..---',
		'3': '...--',
		'4': '....-',
		'5': '.....',
		'6': '-....',
		'7': '--...',
		'8': '---..',
		'9': '----.',
		'.': '.-',
		',': '--..-',
		' ': '/',
		'\n': '\n'
	};

	// substitution characters for dashes and dots. Note that order is important (highest number of dots/dashes first)
	// could have done this programmatically, I suppose
	var morseCypherObfuscationInterpolation = [
		[/\.\.\.\.\./g, '5'],
		[/\.\.\.\./g, '4'],
		[/\.\.\./g, '3'],
		[/\.\./g, '2'],
		[/\./g, '1'],
		[/-----/g, 'E'],
		[/----/g, 'D'],
		[/---/g, 'C'],
		[/--/g, 'B'],
		[/-/g, 'A']
	];

	var LETTER_SEPARATOR = '|';
	var WHITESPACE_REGEX = /\s/;

	var isWhiteSpace = function(str) {
		return WHITESPACE_REGEX.test(str);
	};

	var obfuscateMorse = function(val, key) {
		var obfuscatedMorse = val;
		for (var i = 0; i < morseCypherObfuscationInterpolation.length; i++) {
			obfuscatedMorse = obfuscatedMorse.replace(morseCypherObfuscationInterpolation[i][0], morseCypherObfuscationInterpolation[i][1]);
		}
		return {
			plain: val,
			obfuscated: obfuscatedMorse
		};
	};

	// initialise cypher table.
	var cypherTable = _.mapObject( morseCypher, obfuscateMorse );

	that.encodeMorse = function(message, obfuscated) {
		if (typeof message !== 'string') {
			return '';
		}
		var encoding = obfuscated ? 'obfuscated' : 'plain';
		var messageArray = message.split('');
		var encoded = '';
		var cypherObject;
		for (var i = 0; i < messageArray.length; i++) {
			cypherObject = cypherTable[messageArray[i]];

			if (cypherObject) {
				encoded += cypherObject[encoding];
			} else {
				console.log("Discarding unrecognised character: " + messageArray[i]);
			}

			// suppress letter separator for whitespace characters and characters where the following char is whitespace
			if ((i < (messageArray.length - 1) ) && (!isWhiteSpace(messageArray[i])) && (!isWhiteSpace(messageArray[i+1]))) {
				encoded += LETTER_SEPARATOR;
			}
		}
		return encoded;
	};

	that.testEncoding = function() {
		var testValues = [
			['ABC', '.-|-...|-.-.', '1A|A3|A1A1'],
			['HELLO', '....|.|.-..|.-..|---', '4|1|1A2|1A2|C'],
			['I AM IN TROUBLE', '../.-|--/..|-./-|.-.|---|..-|-...|.-..|.', '2/1A|B/2|A1/A|1A1|C|2A|A3|1A2|1']
		];

		var testsPassed = 0;
		var testsFailed = 0;
		for (var i = 0; i < testValues.length; i++) {
			if ((that.encodeMorse(testValues[i][0]) === testValues[i][1]) &&
				(that.encodeMorse(testValues[i][0], true) === testValues[i][2])) {
				testsPassed++;
			} else {
				testsFailed++;
			}
		}

		alert('Tests complete. \n Tests Passed: ' + testsPassed + ' \n Tests Failed: ' + testsFailed );
	};

	return that;
};

