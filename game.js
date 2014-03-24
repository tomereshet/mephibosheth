var HEIGHT = 7;
var WIDTH = 7;
var INITIAL_VALUES = [2,3,5,7];
var div;
var board;
var visited = [];
function Square() {}
function Board(height,width) {
    this.height = height;
    this.width = width;
    this.grid = new Array();
    this.valid = new Array();
    this.INITIAL_VALUES = [2,3,5,7];
    for (var i=0; i<height; i++) {
	this.grid[i] = new Array();
	this.valid[i] = new Array();
    }
    this.fillSquare = fillSquare;
    function fillSquare(i, j) {
	var ind = Math.floor(Math.random() * this.INITIAL_VALUES.length);
	if (ind == this.INITIAL_VALUES.length) {
	    ind = this.INITIAL_VALUES.length;
	}
	this.grid[i][j] = INITIAL_VALUES[ind];
    }
}
$(document).ready(function() {
	board = new Board(HEIGHT,WIDTH);
	div = $('#grid');
	fillGrid();
	displayGrid();
    });
function fillGrid() {
    for (var i=0; i<board.height; i++) {
	for (var j=0; j<board.width; j++) {
	    board.fillSquare(i,j);
	}
    }
}
function displayGrid() {
    for (var i=0; i<board.height; i++) {
	for (var j=0; j<board.width; j++) {
	    createSquareElement(i,j,0);
	}
    }
}
function createSquareElement(i,j,k) {
    if (k == undefined) {
	k = 0;
    }
    var square = document.createElement('a');
    square.setAttribute('style','position:absolute; top:'+30*(i-k)+'px; left:'+30*j+'px; width: 30px; text-align: center;');
    square.setAttribute('id','row'+i+'col'+j);
    square.setAttribute('onclick','clickSquare('+i+','+j+')');
    var text = document.createTextNode(board.grid[i][j]);
    square.appendChild(text);
    div.append(square);
    
}
function clickSquare(x,y) {
    visited = new Array();
    for (var i=0; i<board.height; i++) {
	visited[i] = new Array();
	for (var j=0; j<board.width; j++) {
	    visited[i][j] = false;
	    board.valid[i][j] = true;
	}
    }
    var indexes = [];
    indexes = indexes.concat(visit(x,y,board.grid[x][y]));
    for (var i=0; i<indexes.length; i++) {
	var currInd = indexes[i];
	board.valid[currInd[0]][currInd[1]] = false;
    }
    newVal = board.grid[x][y] = board.grid[x][y] * indexes.length;
    board.valid[x][y] = true;
    invalidBelow = new Array();
    for (i = board.height - 1; i >= 0; i--) {
	invalidBelow[i] = new Array();
    }
    var i = board.height - 1;
    for (var j = 0; j < board.width; j++) {
	invalidBelow[i][j] = 0;
    }
    for (i--; i >= 0; i--) {
	invalidBelow[i] = new Array();
	for (var j = 0; j < board.width; j++) {
	    invalidBelow[i][j] = invalidBelow[i + 1][j];
	    if (!board.valid[i + 1][j]) {
		invalidBelow[i][j]++;
	    }
	}
    }
    $('#row'+x+'col'+y).addClass('toReappear').animate({
	    opacity: 0
		}, 250, function() {
	    $('.toReappear').empty().append(newVal);
	    $('.toReappear').removeClass('toReappear').animate({
	    opacity: 1
			}, 250);
	});
    //squares to be removed:
    for (i = board.height - 1; i >= 0; i--) {
	for (var j = 0; j < board.width; j++) {
	    if (!board.valid[i][j]) {
		$('#row'+i+'col'+j).removeAttr('id').addClass('toBeRemoved').animate({
			opacity: 0
			    }, 750, function() {
			$('.toBeRemoved').remove();
		    });
		
	    }
	}
    }
    for (i = board.height - 1; i >= 0; i--) {
	for (var j = 0; j < board.width; j++) {
	    if (invalidBelow[i][j]) {
		board.valid[i][j] = false;
		board.grid[i + invalidBelow[i][j]][j] = board.grid[i][j];
		board.valid[i + invalidBelow[i][j]][j] = true;
	    }
	}
    }
    //slide square down
    for (i = board.height - 1; i >= 0; i--) {
	for (var j = 0; j < board.width; j++) {
	    if (invalidBelow[i][j]) {
		var newi = (i + invalidBelow[i][j]);
		$('#row'+i+'col'+j).animate({
			top: 30*newi+'px'
			    }, 750);
		$('#row'+i+'col'+j).attr('id','row'+newi+'col'+j);
		$('#row'+newi+'col'+j).attr('onclick','clickSquare('+newi+','+j+');');
	    }
	}
    }
    for (i = board.height - 1; i >= 0; i--) {
	for (var j = 0; j < board.width; j++) {
	    if (!board.valid[i][j]) {
		board.fillSquare(i,j);
		createSquareElement(i,j,1+invalidBelow[0][j]);

		$('#row'+i+'col'+j).animate({
			top: 30*i+'px'
			    }, 750);
		board.valid[i][j] = true;
	    }
	}
    }
    
}
function visit(i,j,value) {
    var res = [];
    if (i < 0 || j < 0 || i >= board.height || j>= board.width) {
	return res;
    }
    if (visited[i][j]) {
	return res;
    }
    if (board.grid[i][j] != value) {
	return res;
    }
    visited[i][j] = true;
    res = [[i,j]];
    res = res.concat(visit(i+1,j,value));
    res = res.concat(visit(i-1,j,value));
    res = res.concat(visit(i,j+1,value));
    res = res.concat(visit(i,j-1,value));
    return res;
}