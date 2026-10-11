From the digits 1 through 9, pick exactly `k` different digits whose values add up to `n`. Return every such selection; each selection is listed in increasing order and the order of the selections does not matter.

**Example 1:**
```
Input: k = 3, n = 7
Output: [[1,2,4]]
Explanation: 1 + 2 + 4 = 7 is the only triple of distinct digits 1-9 with that sum.
```

**Example 2:**
```
Input: k = 3, n = 9
Output: [[1,2,6],[1,3,5],[2,3,4]]
Explanation: These are the three triples of distinct digits 1-9 summing to 9.
```

**Example 3:**
```
Input: k = 4, n = 1
Output: []
Explanation: The smallest sum of four distinct digits 1-9 is 1+2+3+4 = 10, so nothing qualifies.
```

**Constraints:**
- `2 <= k <= 9`
- `1 <= n <= 60`
