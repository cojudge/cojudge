Given citation counts for each paper, compute the researcher's h-index.

The h-index is the largest `h` such that at least `h` papers have `h` or
more citations each. Implement `hIndex(citations)` returning that maximum.

**Examples:**
```
Input: citations = [3,0,6,1,5]
Output: 3
Explanation: Papers cited [3,6,5] satisfy h = 3; h = 4 is impossible.
```
```
Input: citations = [1,3,1]
Output: 1
```
```
Input: citations = [0]
Output: 0
```

**Constraints:**
- `1 <= citations.length <= 5000`
- `0 <= citations[i] <= 1000`
