const convertQuarter = (quarter) => {
  let quarterDict = {
    "First Quarter": "Q1", "Second Quarter": "Q2", "Third Quarter": "Q3", "Fourth Quarter": "Q4"
  }
  return quarterDict[quarter]
}

module.exports = convertQuarter