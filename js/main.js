var ATTACK = {
	blue   : 0,
	green  : 1,
	red    : 2,
	yellow : 3
};
var DEFENSE = {
	black  : 4,
	white  : 5
};
var dice = new Array(6);
// [damage, surges, accuracy]
dice[ATTACK.blue] =   [[0, 1, 2],
                       [1, 0, 2],
                       [2, 0, 3],
                       [1, 1, 3],
                       [2, 0, 4],
                       [1, 0, 5]];
dice[ATTACK.green] =  [[0, 1, 1],
                       [2, 0, 1],
                       [1, 1, 1],
                       [1, 1, 2],
                       [2, 0, 2],
                       [2, 0, 3]];
dice[ATTACK.red] =    [[1, 0, 0],
                       [2, 0, 0],
                       [2, 0, 0],
                       [2, 1, 0],
                       [3, 0, 0],
                       [3, 0, 0]];
dice[ATTACK.yellow] = [[0, 1, 0],
                       [1, 2, 0],
                       [1, 1, 1],
                       [2, 0, 1],
                       [1, 0, 2],
                       [0, 1, 2]];
// [block, evade, dodge]
dice[DEFENSE.black] = [[0, 1, 0],
                       [1, 0, 0],
                       [1, 0, 0],
                       [2, 0, 0],
                       [2, 0, 0],
                       [3, 0, 0]];
dice[DEFENSE.white] = [[0, 0, 0],
                       [0, 1, 0],
                       [1, 0, 0],
                       [1, 1, 0],
                       [1, 1, 0],
                       [0, 0, 1]];

function addToPool(pool, die) {
	var result = new Array(pool.length * die.length);
	for(var i = 0; i < pool.length; i++) {
		for(var j = 0; j < die.length; j++) {
			var resultIndex = i * die.length + j;
			result[resultIndex] = new Array(die[0].length);
			for(var k = 0; k < result[resultIndex].length; k++) {
				result[resultIndex][k] = pool[i][k] + die[j][k];
			}
		}
	}
	return result;
}
// Round to 2 decimal places
function round(n) {
	return Math.floor(n * 100) / 100;
}
function calculate() {
	var numDice = 0;

	var attackDice  = [[0, 0, 0]];
	for(var color in ATTACK) {
		var num = parseInt($('#' + color + ' option:selected').text())
		numDice += num;
		for(var i = 0; i < num; i++) {
			attackDice = addToPool(attackDice, dice[ATTACK[color]]);
		}
	}

	var defenseDice = [[0, 0, 0]];
	for(var color in DEFENSE) {
		var num = parseInt($('#' + color + ' option:selected').text())
		numDice += num;
		for(var i = 0; i < num; i++) {
			defenseDice = addToPool(defenseDice, dice[DEFENSE[color]]);
		}
	}

	var range = $('#range option:selected').text();
	var hits = damage = surges = tmp = 0;
	for(var i = 0; i < attackDice.length; i++) {
		for(var j = 0; j < defenseDice.length; j++) {
			if(attackDice[i][2] >= range && defenseDice[j][2] == 0) {
				hits++;
				damage += (tmp = attackDice[i][0] - defenseDice[j][0]) > 0 ? tmp : 0;
				surges += (tmp = attackDice[i][1] - defenseDice[j][1]) > 0 ? tmp : 0;
			}
		}
	}

	$('#chance').html(round(hits / (attackDice.length * defenseDice.length)));
	$('#damage').html(damage ? round(damage / hits) : 'N/A');
	$('#surges').html(surges ? round(surges / hits) : 'N/A');
}
function appendToSelect(selectId, len) {
	for(var i = 0; i <= len; i++) {
		$('#' + selectId).append($("<option></option>").text(i));
	}
}
$(document).ready(function() {
	appendToSelect('range',  10);
	appendToSelect('blue',    2);
	appendToSelect('green',   2);
	appendToSelect('red',     2);
	appendToSelect('yellow',  2);
	appendToSelect('black',   2);
	appendToSelect('white',   1);
	$.each(['range', 'blue', 'green', 'red', 'yellow', 'black', 'white'], function(unused, value) {
		$('#' + value).change(calculate);
	});
	$('#clear').click(function() {
		document.getElementById("diceform").reset();
		calculate();
	});
});
