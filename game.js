var HEIGHT = 7;
var WIDTH = 7;
var INITIAL_VALUES = [2,3,5,7];
var div;
var board;
var visited = [];
var longPress = undefined;
var longPressTimeout;
var inAction = false;
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
    var square = document.createElement('div');
    square.setAttribute('style','position:absolute; top:'+30*(i-k)+'px; left:'+30*j+'px; width: 28px; height: 28px; color: white; text-align: center; line-height: 30px; vertical-align: middle; background-color: rgb('+(board.grid[i][j]*102)%255+",128,"+(board.grid[i][j]*193)%255+");");
    square.setAttribute('id','row'+i+'col'+j);
    square.setAttribute('onmouseup','clickSquare('+i+','+j+')');
    square.setAttribute('onmousedown','mousedown('+i+','+j+')');
    square.setAttribute('onmouseout','mouseout()');
    var span = document.createElement('span');
    span.setAttribute('class','text');
    var text = document.createTextNode(board.grid[i][j]);
    span.appendChild(text);
    square.appendChild(span);
    div.append(square);
    
}
function mouseout() {
    if (longPressTimeout != undefined){
	clearTimeout(longPressTimeout);
    }
}
function mousedown(i,j) {
    if (longPressTimeout == undefined) {
	longPressTimeout = setTimeout(function(){squareAction(i,j); longPressTimeout = undefined;},1500);
    }
}
function squareActionDone() {
    if (longPress != undefined) {
	$('#mainCircle').animate({
		width: '1px',
		    height: '1px',
		    left: '15px',
		    top: '15px'}, 200, function(){$('#mainCircle').remove()});
	$('#row'+longPress[0]+'col'+longPress[1]+'>.text').animate({
		fontSize: '100%'}, 200);
	longPress = undefined;
    }
}
function squareAction(i,j) {
    if (longPress != undefined) {
	return;
    }
    if (longPressTimeout != undefined){
	clearTimeout(longPressTimeout);
    }
    longPress = [i,j];
    $('#row'+i+'col'+j).append('<div class="circle" id="mainCircle" style="width: 1px; height: 1px; position: absolute; left: 15px; top: 15px; background-color: rgb(255,200,0);">');
    $('#mainCircle').animate({
	    width: '40px',
		height: '40px',
		left: '-6px',
		top: '-6px'}, 200);
    $('#row'+i+'col'+j+'>.text').animate({
	    fontSize: '150%'}, 200);
}
function clickSquare(x,y) {
    if (longPress != undefined || inAction) {
	return;
    }
    inAction = true;
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
	    $('.toReappear').removeClass('toReappear').css('background-color', 'rgb('+(newVal*68)%255+",128,"+(newVal*193)%255+")").animate({
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
	    if (invalidBelow[i][j] && board.valid[i][j]) {
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
		$('#row'+newi+'col'+j).attr('onmouseup','clickSquare('+newi+','+j+');');
		$('#row'+newi+'col'+j).attr('onmousedown','mousedown('+newi+','+j+');');
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
    setTimeout(function() {inAction = false;},1000);
    
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