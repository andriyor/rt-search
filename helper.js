const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const randomChoice = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
  getRandomInt,
  randomChoice
}