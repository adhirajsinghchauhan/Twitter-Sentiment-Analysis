var responseNodes;

var runEngine = function(qry, callback) {
	$.get('/api/' + qry, function(e) {
		return callback(e);
	});
}

var initGraph = function(e) {
	// create required JSON
	var obj = {};
	var nodeArr = Array();
	var edgeArr = Array();

	for (var i = 0; i < e.response.length; i++) {
		var cluster;
		var resp = JSON.parse(e.response[i].response);
		if (resp.label == 'neutral') {
			cluster = 2;
		} else if (resp.label == 'pos') {
			cluster = 1;
		} else {
			cluster = 3;
		}
		console.log(e.response[i]);
		var tmpNode = {};
		tmpNode.id = i + 1;
		tmpNode.name = e.response[i].text;
		tmpNode.cluster = cluster;
		tmpNode.label = resp.label;
		nodeArr.push(tmpNode);
	}
	console.log(nodeArr);
	obj.nodes = nodeArr;
	obj.edges = edgeArr;
	console.log(obj);

	var config = {
		dataSource: 'js/actors.json',
		forceLocked: false,
		nodeCaption: 'name',
		cluster: true,
		clusterColours: ["#e74c3c", "#D95F02", "#1abc9c", "#66a61e"],
		zoomControls: true,
		initialScale: 0.5,
		caption: function(node) {
			return node.text;
		}
	};


	// alchemy.begin({"dataSource": obj,nodeCaption: 'id',nodeMouseOver: 'text',cluster: true,clusterColours: ["#1B9E77","#D95F02","#E7298A","#66A61E"]});
	alchemy.begin(config);
};

var toggleLoader = function() {
	var loader = $('#p2');
	var curr = loader.css('display');
	if (curr == 'none') {
		loader.css({
			'display': 'block'
		});
	} else {
		loader.css({
			'display': 'none'
		});
	}
};

$(document).on('click', '#search-btn', function(e) {
	toggleLoader();

	// get query
	var qry = $('#search-text').val();
	runEngine(qry, function(e) {
		initGraph(e);
		toggleLoader();
	});
});