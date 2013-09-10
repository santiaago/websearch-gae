//---------------------------------------------------------------------------
// variables
//---------------------------------------------------------------------------
var width = 512; // bl.ocks.org viewport width
var height = 512; // bl.ocks.org viewport height

var cellwidth = 32;//128; // cellWidth
var cellheight = 32;//128; // cellHeight

var mode = false // toggle mode on mousedown/mouseup

var cellcountx = width/cellwidth; // cell count x
var cellcounty = height/cellheight; // cell count y

var xs = d3.scale.linear().domain([0, cellcountx]).rangeRound([0, cellcountx * cellwidth])
var ys = d3.scale.linear().domain([0, cellcounty]).rangeRound([0, cellcounty * cellheight])

var G = 'g';
var S = 's';
var tab_goal = [5,7]
var tab_start = [0,0]
var goal = coord(tab_goal);
var start = coord(tab_start);
var states = [];

//---------------------------------------------------------------------------
// Functions
//---------------------------------------------------------------------------
function coord(p){return coord(p[0],p[1]);}
function coord(x, y) {
    // returns the grid number starting from 0
    return coord[x +','+ y] ||
	(coord[x +','+ y] = cellcountx * ((cellcounty + y) % cellcounty) + ((cellcountx + x) % cellcountx));
}
function logcoord(x,y){console.log('('+x+','+y+') = '+coord(x,y));}
function issimplecell(d){ return (d != S && d != G);}
function issimplecoord(c){ return (c != start && c != goal);}
function isgoal(d){ return (d==G);}
function isstart(d){ return (d==S);}

function coloralleven(){
    // change color of the grid for even cells
    nstate = [];
    for(var i = 0; i<cellcountx;i++){
	for(var j = 0; j<cellcounty;j++){
	    c = coord(i,j)
	    if(issimplecoord(c)){
		nstate[c] = (c%2)==0;
	    }
	}
    }
    return nstate;
}

function colorallrandom(){
    // change color of gird for random cells
    nstate = [];
    for(var i = 0; i<cellcountx;i++){
	for(var j = 0; j<cellcounty;j++){
	    c = coord(i,j)
	    if(issimplecoord(c)){
		nstate[c] = Math.random() > .5;
	    }
	}
    }
    return nstate;
}

function colorstates(query){
    // color a state by poping cell from var Path.
    if(path.length == 0){
	clearInterval(setIntervalColorId);
    }
    var c = path.pop();
    if(issimplecoord(c)){states[c] = true;}
    //console.log(this.query)
    //console.log(this.prototype.colorstates.query)
    //console.log(colorstates.query)
    d3.select(query).selectAll('rect')
	.data(states = states)
	.classed('life',function(d){if(issimplecell(d)) {return d;} });
}

function initgoal(goalcoord){
    // initilize goal cell in grid
    var cgoal = coord(goalcoord[0],goalcoord[1])
    goal = cgoal;
    states[cgoal] = G;
    d3.selectAll('rect')
	.data(states =states)
	.classed('goal', function(d){ if(isgoal(d)) return d;});
}

function initstart(initcoord){
    // initialize start cell in grid
    var cstart = coord(initcoord[0],initcoord[1])
    start = cstart;
    states[cstart] = S;
    d3.selectAll('rect')
	.data(states = states)
	.classed('start', function(d){ if(isstart(d)) return d;});
}

var updatecounter = 0;
function updategrid(){
    if(updatecounter < 5){
	d3.selectAll('rect')
	    .data(states = colorallrandom())
	    .classed('life', function(d){
		if( issimplecell(d)) return d;});
	updatecounter++;
    }
    else{clearInterval(updateId);}
}

//---------------------------------------------------------------------------
// Search algorithms
// Directions Object
// Action Object
// Search Object
// DFS function
// DFS mesure time
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
var Directions = (function(){
    //Direction object defines N,E,S,W
    var _NORTH = 'North';
    var _SOUTH = 'South';
    var _EAST = 'East';
    var _WEST = 'West';
    var _STOP = 'Stop';

    function Directions(){};
    
    Directions.prototype.getNorth = function(){return _NORTH;}
    Directions.prototype.getSouth = function(){return _SOUTH;}
    Directions.prototype.getEast = function(){return _EAST;}
    Directions.prototype.getWest = function(){return _WEST;}
    Directions.prototype.getStop = function(){return _STOP;}

    return Directions;
})();

//---------------------------------------------------------------------------
var Actions = (function(){
    //Actions object defines direction methods from vector or direction
    var _directions;

    //constructor
    function Actions(){
	directions = new Object();
	var d = new Directions();
	directions[d.getNorth()]=[0,-1];
	directions[d.getSouth()]=[0,1];
	directions[d.getEast()]=[1,0];
	directions[d.getWest()]=[-1,0];

	this._directions = directions;
    }
    Actions.prototype.vectorToDirection = function(vector){
	//return direction (N,E,W,S) of var vector
	var d = new Directions();
	dx = vector[0];
	dy = vector[1];
	if(dy < 0){return d.getNorth();}
	if(dy > 0){return d.getSouth();}
	if(dx < 0){return d.getWest();}
	if(dx > 0){return d.getEast();}
	return d.getStop();
    }
    Actions.prototype.directionToVector = function(direction, speed){
	//from direction and speed returns vector

	//default values
	speed = typeof speed !== 'undefined' ? speed : 1.0;
	dx = this._directions[direction][0];
	dy = this._directions[direction][1];
	return [dx*speed,dy*speed];
    }
    return Actions;
})();
//---------------------------------------------------------------------------
var Search = (function(){
    // Search object defines goal, start and successor function

    // private vars
    var _start;
    var _goal;
    var _walls;
    
    //constructor
    function Search(vstart, vgoal){
	_walls = this.getWalls();
	_goal = vgoal;
	_start = vstart;
    };

    Search.prototype.getStartState = function(){
	return _start;
    }
    Search.prototype.isGoalState = function(state){
	return areCellsEqual(state,_goal);
    }
    Search.prototype.getWalls = function(){
	//cellcountx and cellcounty are the size of the grid
	wall = [];
	for(var i = -1; i <= cellcountx ;i++){
	    wall.push([-1,i]);
	    wall.push([cellcounty,i]);
	}
	for(var j = 0; j < cellcounty;j++){
	    wall.push([j,-1]);
	    wall.push([j,cellcounty]);
	}
	return wall;
    }
    Search.prototype.isWall = function(cell){
	// is cell a wall cell?
	for(var i =0; i < _walls.length;i++){
	    if(areCellsEqual(_walls[i],cell)){ return true;}
	}
	return false;
    }
    Search.prototype.costFn = function(x){return 1;}
    Search.prototype.getSuccessors = function(state){
	// successor function
	var a = new Actions();
	var successors = [];
	var d = new Directions();
	var actions = [d.getNorth(),d.getSouth(),d.getEast(),d.getWest()];
	for( var i = 0; i<actions.length;i++){
	    action = actions[i];
	    x = state[0];
	    y = state[1];
	    dtv = a.directionToVector(action);
	    dx = dtv[0];
	    dy = dtv[1];
	    nextx = x + dx;
	    nexty = y + dy;
	    if (!this.isWall([nextx,nexty])){
		nextState = [nextx,nexty];
		cost = this.costFn(nextState);
		successors.push([nextState,action,cost]);
	    }
	}
	return successors;
    }
    return Search;
})();

//---------------------------------------------------------------------------
var Stack = (function(){
    var _list;
    
    //constructor
    function Stack(){
	this._list = [];
    };
    Stack.prototype.push = function(item){
	this._list.push(item);
    }
    Stack.prototype.pop = function(){
	return this._list.pop();
    }
    Stack.prototype.isEmpty = function(){
	return this._list.length == 0;
    }
    return Stack;
})();

//---------------------------------------------------------------------------
function areCellsEqual(c1,c2){
    if( c1.length != c2.length){return false;}

    for(var i = 0; i <c1.length;i++){
	if(c1[i] != c2[i]){ return false;}
    }
    return true;
}
function contains(item,container){
    for(var i = 0; i < container.length;i++){
	if(areCellsEqual(item,container[i]) ){
	    return true;
	}
    }
    return false;
}

function depthFirstSearch(problem){
    //DFS retuns an array of items [coord,action] by looking the tree by DFS
    solution = [];
    walked = [];
    node = [problem.getStartState(),'',1,[]]
    if( problem.isGoalState(problem.getStartState()) ){
	return solution;
    }
    explored = [];
    explored.push(node[0]);
    frontier = new Stack();
    frontier.push(node);
    
    found = false;
    count = 0;
    while(! found){
	if(frontier.isEmpty()){ 
	    return [];
	}
	node = frontier.pop();
	
	children = problem.getSuccessors(node[0]);
	for(var i =0;i<children.length;i++){
	    var child = children[i];
	    if(!contains(child[0],explored) ){
		var current_path = node[3];
		//current_path.push(child[1]); old method for having only actions in solution vector
		current_path.push([child[0],child[1]]);// [coords, action]
		
		var child_temp = child;
		child_temp.push(current_path);
		
		if( !contains(child_temp[0],explored)){
		    explored.push(child_temp[0]);
		}
		frontier.push(child_temp);
		if( problem.isGoalState(child_temp[0])){
		    found = true;
		    solution = child_temp[3];s
		    break;
		}
	    }
	}
    }
    return solution;
}

function breadFirstSearch(s){

    return [];
}
function mesureTimeDFS(v){
    var start = new Date().getTime();
 
    var s = new Search([0,0],v)
    sol = depthFirstSearch(s);
    
    var end = new Date().getTime();
    var time = end - start;
    console.log('Execution time: ' + time);
    return sol;
}
//---------------------------------------------------------------------------
// Main

// initialize state grid
d3.range(cellcountx * cellcounty).forEach(function(c) {
    states[c] = false;
});

// append grid structure
var vis = d3.select('.dfs').append('svg:svg')
    .attr('width', width)
    .attr('height', height);

// fill visualisation element
vis.selectAll('rect')
    .data(states)
    .enter().append('svg:rect')
    .attr('width', cellwidth)
    .attr('height', cellheight)
    .attr('x', function(d, i) { return xs(i % cellcountx); })
    .attr('y', function(d, i) { return ys(i / cellcountx | 0); })
    .on('mouseup', function() { mode = false; })
    .on('mousedown', function() { mode = true; })
    .on('mousemove', function(d, i) { if (mode) states[i] = !states[i]; })
    .classed('life', function(d) {
	if(issimplecell(d)) return d;});
// initialize grid
initstart(tab_start);
initgoal(tab_goal);

// search initialize
var s = new Search(tab_start,tab_goal)
var output_dfs = depthFirstSearch(s);
var path = []; // path of indexes to color
for(var i = 0;i<output_dfs.length;i++){
    path.push(coord(output_dfs[i][0][0],output_dfs[i][0][1]));
}
path.reverse();

// display in intervals
//updateId = setInterval(updategrid,1000);
//var f = colorstates;
//f.prototype.query = function(){return '.dfs';}
var setIntervalColorId = setInterval(function(){colorstates('.dfs')},70);
//--------------------------------------------------
//BFS
/*states_bfs = [];
d3.range(cellcountx * cellcounty).forEach(function(c) {
    states_bfs[c] = false;
});

// append grid structure
var vis_bfs = d3.select('.bfs').append('svg:svg')
    .attr('width', width)
    .attr('height', height);
// fill visualisation element
vis_bfs.selectAll('rect')
    .data(states_bfs)
    .enter().append('svg:rect')
    .attr('width', cellwidth)
    .attr('height', cellheight)
    .attr('x', function(d, i) { return xs(i % cellcountx); })
    .attr('y', function(d, i) { return ys(i / cellcountx | 0); })
    .on('mouseup', function() { mode = false; })
    .on('mousedown', function() { mode = true; })
    .on('mousemove', function(d, i) { if (mode) states_bfs[i] = !states[i]; })
    .classed('life', function(d) {
	if(issimplecell(d)) return d;});
// initialize grid
initstart(tab_start);
initgoal(tab_goal);

// search initialize
var s = new Search(tab_start,tab_goal)
var output_bfs = depthFirstSearch(s);
var path_bfs = []; // path of indexes to color
for(var i = 0;i<output_bfs.length;i++){
    path_bfs.push(coord(output_bfs[i][0][0],output_bfs[i][0][1]));
}
path_bfs.reverse();

// display in intervals
//updateId = setInterval(updategrid,1000);
*/
console.log('end')