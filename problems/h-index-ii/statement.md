Given citation counts already sorted in non-decreasing order, compute the h-index in logarithmic time.

The h-index is the largest `h` with at least `h` papers cited at least `h`
times. Implement `hIndex(citations)` where `citations` is ascending, using a
binary search rather than a linear scan.

**Examples:**
```
Input: citations = [0,1,3,5,6]
Output: 3
```
```
Input: citations = [1,2,100]
Output: 2
```
```
Input: citations = [0]
Output: 0
```

**Constraints:**
- `1 <= citations.length <= 10^5`
- `0 <= citations[i] <= 1000`
- `citations` is sorted ascending.
