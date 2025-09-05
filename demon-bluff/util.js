export function delay(ms){
  return new Promise(res => {
    setTimeout(res, ms)
  })
}

export function randomChoice(arr){
	return arr[Math.floor(Math.random() * arr.length)]
}

export function lerp(start, end, p) {
 return start + p * (end - start)
}

export function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}