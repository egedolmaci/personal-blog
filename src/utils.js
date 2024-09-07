const isIndexValid = (array, index) => {
  return index >= 0 && index < array.length;
};

module.exports = { isIndexValid };
