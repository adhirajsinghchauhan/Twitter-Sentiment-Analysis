// Includes
var util = require('util'),
	twitter = require('twitter'),
	sentimentAnalysis = require('./sentimentAnalysis'),
	db = require('diskdb'),
	fs = require('fs');

var stopWordsFile = fs.readFileSync('logic/stopWords.js', 'utf8'),
	stopWords = stopWordsFile.split(",");

db = db.connect('logic/db', ['sentiments']);

// Config
var config = {
	consumer_key: 'a8LdqCeuxEsCL8XvTfihNrbv8',
	consumer_secret: 'uipMUpSHve9tvJgajFrInbcANVr8qPXGw6Bhhe5XNR49wtkl14',
	access_token_key: '280550165-kyepTVsp0ScBpNeQXjKO1EQ0agsdcZS8XGVnNuZg',
	access_token_secret: 'c1z8ke9G41OpeZuCmMXtsEj3beLa9mxVc2plMisn80Pjk',
	request_options: {
		proxy: 'http://172.16.19.10:80/'
	}
};

var stemmer = (function() {
	var step2list = {
			"ational": "ate",
			"tional": "tion",
			"enci": "ence",
			"anci": "ance",
			"izer": "ize",
			"bli": "ble",
			"alli": "al",
			"entli": "ent",
			"eli": "e",
			"ousli": "ous",
			"ization": "ize",
			"ation": "ate",
			"ator": "ate",
			"alism": "al",
			"iveness": "ive",
			"fulness": "ful",
			"ousness": "ous",
			"aliti": "al",
			"iviti": "ive",
			"biliti": "ble",
			"logi": "log"
		},

		step3list = {
			"icate": "ic",
			"ative": "",
			"alize": "al",
			"iciti": "ic",
			"ical": "ic",
			"ful": "",
			"ness": ""
		},

		c = "[^aeiou]", // consonant
		v = "[aeiouy]", // vowel
		C = c + "[^aeiouy]*", // consonant sequence
		V = v + "[aeiou]*", // vowel sequence

		mgr0 = "^(" + C + ")?" + V + C, // [C]VC... is m>0
		meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$", // [C]VC[V] is m=1
		mgr1 = "^(" + C + ")?" + V + C + V + C, // [C]VCVC... is m>1
		s_v = "^(" + C + ")?" + v; // vowel in stem

	function dummyDebug() {}

	function realDebug() {
		console.log(Array.prototype.slice.call(arguments).join(' '));
	}

	return function(w, debug) {
		var stem,
			suffix,
			firstch,
			re,
			re2,
			re3,
			re4,
			debugFunction,
			origword = w;

		if (debug) {
			debugFunction = realDebug;
		} else {
			debugFunction = dummyDebug;
		}

		if (w.length < 3) {
			return w;
		}

		firstch = w.substr(0, 1);
		if (firstch == "y") {
			w = firstch.toUpperCase() + w.substr(1);
		}

		// Step 1a
		re = /^(.+?)(ss|i)es$/;
		re2 = /^(.+?)([^s])s$/;

		if (re.test(w)) {
			w = w.replace(re, "$1$2");
			debugFunction('1a', re, w);

		} else if (re2.test(w)) {
			w = w.replace(re2, "$1$2");
			debugFunction('1a', re2, w);
		}

		// Step 1b
		re = /^(.+?)eed$/;
		re2 = /^(.+?)(ed|ing)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			re = new RegExp(mgr0);
			if (re.test(fp[1])) {
				re = /.$/;
				w = w.replace(re, "");
				debugFunction('1b', re, w);
			}
		} else if (re2.test(w)) {
			var fp = re2.exec(w);
			stem = fp[1];
			re2 = new RegExp(s_v);
			if (re2.test(stem)) {
				w = stem;
				debugFunction('1b', re2, w);

				re2 = /(at|bl|iz)$/;
				re3 = new RegExp("([^aeiouylsz])\\1$");
				re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");

				if (re2.test(w)) {
					w = w + "e";
					debugFunction('1b', re2, w);

				} else if (re3.test(w)) {
					re = /.$/;
					w = w.replace(re, "");
					debugFunction('1b', re3, w);

				} else if (re4.test(w)) {
					w = w + "e";
					debugFunction('1b', re4, w);
				}
			}
		}

		// Step 1c
		re = new RegExp("^(.*" + v + ".*)y$");
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			w = stem + "i";
			debugFunction('1c', re, w);
		}

		// Step 2
		re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			suffix = fp[2];
			re = new RegExp(mgr0);
			if (re.test(stem)) {
				w = stem + step2list[suffix];
				debugFunction('2', re, w);
			}
		}

		// Step 3
		re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			suffix = fp[2];
			re = new RegExp(mgr0);
			if (re.test(stem)) {
				w = stem + step3list[suffix];
				debugFunction('3', re, w);
			}
		}

		// Step 4
		re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
		re2 = /^(.+?)(s|t)(ion)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(mgr1);
			if (re.test(stem)) {
				w = stem;
				debugFunction('4', re, w);
			}
		} else if (re2.test(w)) {
			var fp = re2.exec(w);
			stem = fp[1] + fp[2];
			re2 = new RegExp(mgr1);
			if (re2.test(stem)) {
				w = stem;
				debugFunction('4', re2, w);
			}
		}

		// Step 5
		re = /^(.+?)e$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(mgr1);
			re2 = new RegExp(meq1);
			re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
			if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
				w = stem;
				debugFunction('5', re, re2, re3, w);
			}
		}

		re = /ll$/;
		re2 = new RegExp(mgr1);
		if (re.test(w) && re2.test(w)) {
			re = /.$/;
			w = w.replace(re, "");
			debugFunction('5', re, re2, w);
		}

		// and turn initial Y back to y
		if (firstch == "y") {
			w = firstch.toLowerCase() + w.substr(1);
		}


		return w;
	}
})();

var cleanTweets = function(foo, callback) {

	var cleanTweets = {};
	cleanTweets.tweets = Array();
	if (foo != 'undefined')
		for (var i = 0; i < foo.statuses.length; i++) {
			var flag = true;
			var newStr = '';
			var newWords = Array();

			// remove urls
			var reg = /http(.)*\b/;
			foo.statuses[i].text = foo.statuses[i].text.replace(reg, '');

			// remove hashtags
			var reg = /#(.)*\b/;
			foo.statuses[i].text = foo.statuses[i].text.replace(reg, '');

			// remove @s
			var reg = /@(.)*\b/;
			foo.statuses[i].text = foo.statuses[i].text.replace(reg, '');

			// check for very short tweets
			if (foo.statuses[i].text.length < 30) {
				flag = false;
			}

			// check for retweets and flag
			if (foo.statuses[i].text.indexOf('RT') > -1) {
				flag = false;
			}

			// old string after regex modifications
			var oldStr = foo.statuses[i].text.toLowerCase();

			// remove stop words
			var wordList = oldStr.split(' ');
			for (var j = 0; j < wordList.length; j++) {
				if (stopWords.indexOf(wordList[j]) > -1) {
					// do not add
				} else {
					newWords.push(wordList[j]);
				}
			}
			newStr = wordList.join(' ');

			// remove non alphabets
			var reg = /\W+/g;
			newStr = newStr.replace(reg, ' ');

			// remove numbers
			var reg = /[0-9]/g;
			newStr = newStr.replace(reg, '');

			// stem each word in the string
			// var newStr = '';
			// var wordList = foo.statuses[i].text.split(' ');
			// for(var j = 0 ; j<wordList.length ; j++){
			// 	newStr += stemmer(wordList[j]) + ' ';
			// }

			if (flag) {
				var tmp = {};
				tmp.text = newStr.trim(); // chomp
				tmp.oldString = oldStr;
				cleanTweets.tweets.push(tmp);

				foo.statuses[i].text = newStr.trim();
			}
		}
	return callback(foo);
};

var analyzeTweets = function(tweets, callback) {
	var json = {};
	var dbData = [];

	json.response = [];
	if (tweets.statuses != null) {
		for (var i = 0; i < tweets.statuses.length; i++) {
			var resp = {};

			resp.tweet = tweets.statuses[i];
			resp.sentiment = sentimentAnalysis(tweets.statuses[i].text);
			dbData.push({
				user: {
					name: resp.tweet.user.name,
					screen: resp.tweet.user.screen_name,
					dp: resp.tweet.user.profile_image_url
				},
				urls: resp.tweet.entities.urls,
				hashtags: resp.tweet.entities.hashtags,
				tweet: resp.tweet,
				score: resp.sentiment.score,
				sentiment: resp.sentiment
			});
			json.response.push(resp);
		};

		return callback(dbData);
	}
}

module.exports = function(text, callback) {
	var twitterClient = new twitter(config);
	var response = [],
		dbData = []; // to store the tweets and sentiment

	twitterClient.get('search/tweets', {
		q: text,
		// lang: 'en',
		count: 100
	}, function(error, tweets, response) {
		// cleanTweets(tweets, function(cleanedTweets) {
		analyzeTweets(tweets, function(dbData) {
			db.sentiments.save(dbData);
			callback(dbData);
		});
		// });
	});
}
