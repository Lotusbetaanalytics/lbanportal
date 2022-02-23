const convertQuarter = (quarter) => {
  let quarterDict = {
    "First Quarter": "Q1", "Second Quarter": "Q2", "Third Quarter": "Q3", "Fourth Quarter": "Q4"
  }
  return quarterDict[quarter]
}

const firstName = (words) => {
  var n = words.split(" ");
  return n[n.length - 1];
}

const hrEmail = "akinwalejude@gmail.com"

module.exports = {convertQuarter, hrEmail, firstName}