Rebuild the final array after many interval increments.

Start with an array of `length` zeros. Each entry of `updates` is a triple `[start, end, inc]` meaning add `inc` to every position from `start` through `end` inclusive. Apply all triples in order and return the resulting array. When `updates` is empty the answer is all zeros; when `length` is zero the answer is the empty array.

**Example 1:**
```
Input: length = 5, updates = [[1,3,2],[2,4,3],[0,2,-2]]
Output: [-2,0,3,5,3]
Explanation: After [1,3,2] the array is [0,2,2,2,0]. After [2,4,3] it is [0,2,5,5,3]. After [0,2,-2] it is [-2,0,3,5,3].
```

**Example 2:**
```
Input: length = 3, updates = []
Output: [0,0,0]
Explanation: With no triples every entry stays zero.
```

**Example 3:**
```
Input: length = 1, updates = [[0,0,5]]
Output: [5]
Explanation: The single entry grows by 5.
```

**Constraints:**
- `0 <= length <= 10^4`
- `0 <= updates.length <= 10^4`
- Each triple has the form `[start, end, inc]` with `0 <= start <= end < length` when `length > 0`.
- `-1000 <= inc <= 1000`
