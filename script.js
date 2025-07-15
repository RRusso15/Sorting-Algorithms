
'use strict';
const ACCENT = '#0087ff';
const BASE = '#353535';
const N = 75;
const MARGIN = 0;
const PADDING = 0;
const SPEED = 2;


function swap(arr,a,b){
	let temp = arr[a];
	arr[a] = arr[b];
	arr[b] = temp;
}

function compare(arr,a,b){
	return arr[a] < arr[b];
}

function reverse(arr){ return arr.reverse(); }

function* shuffle(arr,callback = () => null){
	let n = arr.length;
	for(let i = n-1; i >= 1; i--){
		let j = Math.floor(Math.random()*i);
		swap(arr,i,j);
		yield [i,j];
		//callback(arr,i,j);
	}
	//return arr;
}

function mix(arr){
	let result = [];
	let n = arr.length;
	for(let i = 0; i < n; i++){
		let index = Math.floor(Math.random()*arr.length);
		result.push(arr.splice(index,1)[0]);
	}
	return result;
}

function range(min,max){
	return [...Array(max-min)].map((_,i) => min+i);
}

function iterate(generator){
	for(let _ of generator);
}


const defaultOptions = {
	compare,
	swap
}


// bubble sort
function* bubbleSort(arr,{ compare, swap } = defaultOptions){
	let n = arr.length;
	for(let i = n-1; i >= 0; i--){
		for(let j = 1; j <= i; j++){
			yield [j,j-1];
			if(compare(arr,j,j-1)){
				swap(arr,j-1,j);
				yield [j-1,j];
			}
		}
	}
	//return arr;
}


// selection sort
function* selectionSort(arr,{ compare, swap } = defaultOptions){
	let n = arr.length;
	for(let i = 0; i < n; i++){
		let min = i;
		for(let j = i; j < n; j++){
			yield [j,min];
			if(compare(arr,j,min)) min = j;
		}
		swap(arr,min,i);
		yield [min,i];
	}
	//return arr;
}


// quicksort
function quickSort(arr,{ compare, swap } = defaultOptions){
 return function* recursiveQuickSort(arr,l,r){
		let n = r-l+1;
		if(n <= 1) return;
		let pivotIndex = l+Math.floor((r-l)/2);
		let pivot = arr[pivotIndex];
		let [ left, right ] = [l,r];
		while(left <= right){
			while(compare(arr,left,pivotIndex)){
				yield [left,pivotIndex];
				left++;
			}
			while(compare(arr,pivotIndex,right)){
				yield [pivotIndex,right];
				right--;
			}
			if(left <= right){
				if(left == pivotIndex || right == pivotIndex){
					pivotIndex = left == pivotIndex ? right : left;
				}
				swap(arr,left,right);
				yield [left,right];
				left++;
				right--;
			}
		}
		for(let _ of recursiveQuickSort(arr,l,right)) yield _;
		for(let _ of recursiveQuickSort(arr,left,r)) yield _;

		//return arr
	}(arr,0,arr.length-1);
}

function* shakerSort(arr,{ compare, swap } = defaultOptions){
	let n = arr.length;
	var swapped = false;
	let count = 0;
	do{
		swapped = false;
		for(let i = count; i <= n-2-count; i++){
			yield [i+1,i];
			if(compare(arr,i+1,i)){
				swap(arr,i,i+1);
				yield [i+1,i];
				swapped = true;
			}
		}
		if(!swapped) break;
		swapped = false;
		for(let i = n-2-count; i >= 0+count; i--){
			yield [i+1,i];
			if(compare(arr,i+1,i)){
				swap(arr,i+1,i);
				yield [i+1,i];
				swapped = true;
			}
		}
	count++;
	}while(swapped)
}

function* comboSort(arr,{ compare, swap } = defaultOptions){
	let n = arr.length;
	let gap = n;
	let shrink = 1.3;
	let sorted = false;

	while(sorted == false){
		gap = Math.floor(gap/shrink);
		sorted = gap <= 1;
		for(let i = 0; i + gap < n; i++){
			yield [i,i+gap];
			if(compare(arr,i+gap,i)){
				swap(arr,i,i+gap);
				yield [i, i+gap];
				sorted = false;
			}
		}
	}
}

function* insertionSort(arr,{ compare, swap } = defaultOptions){
	let n = arr.length;
	for(let i = 1; i < n; i++){
		for(let j = i; j > 0; j--){
			yield [j,j-1];
			if(!compare(arr,j,j-1)){
				break;
			}
			swap(arr,j,j-1);
			yield [j, j-1];
		}
	}
}
//program

function update(arr,ctx,x,y,width,height,changes=[],algorithm){
	ctx.clearRect(x,y,width,height);

	for(let n = arr.length, i = 0; i < n; i++){
		if(changes.length != 0);
		if(changes.indexOf(i) != -1){
			ctx.beginPath();
			ctx.fillStyle = ACCENT;
			ctx.rect(x+i/n*width,y+height - height*(arr[i]/n),width/n,height*(arr[i]/n));
			ctx.fill();
		}else{
			ctx.beginPath();
			ctx.fillStyle = BASE;
			ctx.rect(x+i/n*width,y+height - height*(arr[i]/n),width/n,height*(arr[i]/n));
			ctx.fill();
		}
	}

	ctx.beginPath();
	ctx.strokeStyle = ACCENT;
	ctx.lineWidth = 2;
	ctx.rect(x,y,width,height);
	ctx.stroke();

	if(algorithm){
		ctx.fillStyle = ACCENT;
		ctx.font = '24px menlo';
		ctx.textAlign = 'left';
		ctx.fillText(algorithm,x+6,y+24);
	}
}

function drawScreen(ctx,x,y,width,height,algorithm,place){
	let colors = [...Array(6)].map((_,i) => `hsl(${20+80*i/6},100%,50%)`).reverse();
	ctx.beginPath();
	ctx.fillStyle = colors[place];
	ctx.rect(x,y,width,height);
	ctx.fill();

	ctx.font = '24px menlo';
	ctx.fillStyle = BASE;
	ctx.textAlign = 'center';
	ctx.fillText(`${place+1}. ${algorithm}`,x+width/2,y+12+height/2);
}


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let [ rows, cols ] = [3,2];

function setupGrid(canvas,ctx){
	let ratio = canvas.width/canvas.height;
	[ rows, cols ] = canvas.width > canvas.height ? [3,2] : [6,1];
	if(ratio >= 3) [ rows, cols ] = [2,3];
	let padding = PADDING;
	let margin = MARGIN;
	const [ width, height ] = [canvas.width/cols,canvas.height/rows];
	for(let i = 0; i < rows; i++){
		for(let j = 0; j < cols; j++){
			ctx.beginPath();
			ctx.strokeStyle = ACCENT;
			ctx.rect(j*width+margin/2,i*height+margin/2,width-margin,height-margin);
			ctx.stroke();
			draw[i*cols+j](ctx,j*width+(margin+padding)/2,i*height+(margin+padding)/2,width-(margin+padding),height-(margin+padding));
		}
	}
}

function setupCanvas(canvas,ctx){
	return function(){
		canvas.style.width = `${window.innerWidth}px`;
		canvas.style.height = `${window.innerHeight}px`;
		canvas.width = window.innerWidth*2;
		canvas.height = window.innerHeight*2;
		ctx.clearRect(0,0,canvas.width,canvas.height);
		setupGrid(canvas,ctx);
	}
}

let offsets = [...Array(rows*cols)];
let draw = [...Array(rows*cols)].map((_,i) => offset(i));
function offset(id){
	return function(ctx,x,y,width,height){
		offsets[id] = [x,y,width,height];
	}
}

setupCanvas(canvas,ctx)();

window.addEventListener('resize',setupCanvas(canvas,ctx));
let arrays = [...Array(rows*cols)].map(() => range(1,N));
let states = ['shuffling...','sorting'];
const [ SHUFFLING, SORTING ] = states;
let currentState = states[0];
let sortingAlgorithms = [quickSort,comboSort,insertionSort,selectionSort,shakerSort,bubbleSort];
let algorithmList = {
	[SORTING]:['quick sort','combo sort','insertion sort','selection sort','cocktail sort','bubble sort'],
	[SHUFFLING]:['shuffling','shuffling','shuffling','shuffling','shuffling','shuffling']
};

function animate(generators,state,done,pause){
	return function(){
		for(let i = 0; i < SPEED; i++){
			var changes = generators.map(g => g.next());
		}
		offsets.forEach(function(offset,i){
			let algorithm = algorithmList[currentState][i];
			if(!changes[i].done && done.indexOf(i) == -1){
				update(arrays[i],ctx,...offset,changes[i].value,algorithm);
			}else if(done.indexOf(i) == -1){
				done.push(i);
			}else if(currentState == SORTING){
				drawScreen(ctx,...offset,algorithm,done.indexOf(i));
			}
		});
		if(done.length == generators.length){
			pause = true;
			var last = done.pop();
			done = [];
			if(currentState == SHUFFLING){
				currentState = SORTING;
				generators = sortingAlgorithms.map((s,i) => s(arrays[i]));
			}else if(currentState == SORTING){
				currentState = SHUFFLING;
				generators = arrays.map(a => shuffle(a));
			}
		}
		if(pause){
			setTimeout(animate(generators,state,done,false),1000);
			if(currentState == SHUFFLING){
				drawScreen(ctx,...offsets[last],algorithmList[SORTING][last],arrays.length-1);
			}else if(currentState == SORTING){
				offsets.forEach((offset,i) => update(arrays[i],ctx,...offset))
			}
		}else{
			requestAnimationFrame(animate(generators,state,done,false));
		}
	}
}
requestAnimationFrame(animate(arrays.map(arr => shuffle(arr)),currentState,[],false));