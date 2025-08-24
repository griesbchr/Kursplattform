//returns array of arrays
//splits arr into n subarrays as evenly as possible
function splitListEvenly(arr, n) {
  const result = [];
  const quotient = Math.floor(arr.length / n); // Number of items in each part
  const remainder = arr.length % n; // Number of items left over

  let startIndex = 0;

  for (let i = 0; i < n; i++) {
    const endIndex = startIndex + quotient + (i < remainder ? 1 : 0);
    result.push(arr.slice(startIndex, endIndex));
    startIndex = endIndex;
  }

  return result;
}