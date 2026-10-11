Locate the summit of a mountain array.

An array `arr` is a mountain when its length is at least three and there is a single peak index `p` such that values rise strictly from the start to `p` and then fall strictly after `p`. Given such an array, return the peak index.

**Example 1:**
```
Input: arr = [0,1,0]
Output: 1
Explanation: Values climb to index 1 then descend.
```

**Example 2:**
```
Input: arr = [0,2,1,0]
Output: 1
Explanation: The maximum sits at index 1.
```

**Example 3:**
```
Input: arr = [0,10,5,2]
Output: 1
Explanation: Index 1 holds the lone summit.
```

**Constraints:**
- `3 <= arr.length <= 10^4`
- `0 <= arr[i] <= 10^6`
- `arr` is guaranteed to be a mountain array.
