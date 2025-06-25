function findCore(word){
  let digits = word.toLowerCase().split("").map(letter => letter.charCodeAt(letter) - 96)
  let possibilities = []
  possibilities.push(((digits[0] - digits[1]) * digits[2]) / digits[3])
  possibilities.push(((digits[0] - digits[1]) / digits[2]) * digits[3])
  possibilities.push(((digits[0] * digits[1]) - digits[2]) / digits[3])
  possibilities.push(((digits[0] * digits[1]) / digits[2]) - digits[3])
  possibilities.push(((digits[0] / digits[1]) - digits[2]) * digits[3])
  possibilities.push(((digits[0] / digits[1]) / digits[2]) - digits[3])
  possibilities = possibilities.filter(val => val % 1 === 0 && val > 0 && val < 27).sort((a, b) => a < b ? -1 : 1)
  possibilities = possibilities.map(v => String.fromCharCode(v + 96))
  return possibilities[0]
}