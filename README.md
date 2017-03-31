# Twitter Sentiment Analysis

## Introduction
Sentiment analysis is a growing area of Natural Language Processing (NLP). Text mining and natural language processing have received a lot of focus over the past years, with more and more companies focusing on machine learning and enhancing the way computers understand human-related data.  

This project is based on concepts of text mining (one of the applications of NLP) and data analytics. The [Twitter Streaming API][twitter] is used to download tweets related to specific keywords, which are analyzed by algorithms implemented in ```Javascript```.  

The API response is in a ```JSON``` format, which is parsed and analyzed in ```Javascript```. Twitter data constitutes a rich source that can be used for capturing information about any topic imaginable. However, since the length of characters in a single tweet is limited to 140, analyzing data will be trickier.  
That’s where machine learning comes in. By tokenizing the tweets (extracting their bigrams), extracting hashtags, URLs, usernames and emoticons, data analytics is made easier (eg, emoticons like ```:)``` have a positive polarity while emoticons like ```:(``` have a negative polarity. ```:|``` would be a neutral emoticon).  

This data can be used in different use cases such as finding trends related to a specific keyword, measuring brand sentiment, and gathering feedback about new products and services. 
The data insights can be visualized in the web browser in the form of graphs.

## Steps for installation / use
1. Install [Node.js][nodejs] for your operating system
2. Clone this repository into any directory: ```git clone https://github.com/adhirajsinghchauhan/Twitter-Sentiment-Analysis.git```
3. ```cd``` into the repo's directory: ```cd Twitter-Sentiment-Analysis```
4. Run ```npm install``` to install all dependencies for this project
5. Once npm installs all dependencies successfully, run ```npm start``` to start the server at ```localhost:80```
6. Open your browser, type ```localhost``` into the address bar and hit enter
7. That's it, you're done.

## Libraries used
* [Chartist][chartist]
  * Plugins: [Threshold][chartist-threshold], [Tooltip][chartist-tooltip] and [Zoom][chartist-zoom]
* [Alchemy][alchemy]
* [Sentiment][sentiment]

[twitter]: https://dev.twitter.com/streaming/overview/
[nodejs]: https://nodejs.org/en/download/current/
[chartist]: https://github.com/gionkunz/chartist-js/
[chartist-threshold]: https://github.com/gionkunz/chartist-plugin-threshold/
[chartist-tooltip]: https://github.com/Globegitter/chartist-plugin-tooltip/
[chartist-zoom]: https://github.com/hansmaad/chartist-plugin-zoom/
[alchemy]: https://github.com/GraphAlchemist/Alchemy
[sentiment]: https://github.com/thisandagain/sentiment/
