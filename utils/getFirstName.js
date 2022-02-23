const firstName = (words) => {
  var n = words.split(" ");
  return n[n.length - 1];
}

module.exports = firstName