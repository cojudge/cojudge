You stand on an array `arr`. From index `i` you make numbered jumps: jump 1, 3, 5, ... are odd-numbered and jumps 2, 4, 6, ... are even-numbered. The next jump starts counting at 1 again for each new starting index.

- On an odd-numbered jump from `i`, hop to the smallest index `j > i` whose value is the smallest value `>= arr[i]`. If several positions share that value, pick the smallest index. If no such `j` exists, the walk stops.
- On an even-numbered jump from `i`, hop to the smallest index `j > i` whose value is the largest value `<= arr[i]`, again breaking ties by smallest index. If none exists, the walk stops.

A start index is good when the walk beginning with an odd jump eventually lands exactly on the last array index. Count the good starting indices.

**Constraints:**
- `1 <= arr.length <= 20000`
- `1 <= arr[i] <= 100000`
