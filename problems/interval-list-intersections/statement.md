You are given two lists of closed intervals, `firstList` and `secondList`. Within each list the intervals are pairwise disjoint and sorted by start. Compute all pairwise intersections: for every `I` in the first list and `J` in the second list, if they share at least one point, include their overlap `[max(starts), min(ends)]` in the answer. Return the intersections sorted by start (the two-pointer scan naturally produces this order).

**Example 1:**
```
Input: firstList = [[0,2],[5,10],[13,23],[24,25]], secondList = [[1,5],[8,12],[15,24],[25,26]]
Output: [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]
Explanation: The six overlaps above are exactly the non-empty pairwise intersections.
```

**Example 2:**
```
Input: firstList = [[1,3],[5,9]], secondList = []
Output: []
Explanation: An empty list yields no overlaps.
```

**Constraints:**
- `0 <= firstList.length, secondList.length <= 1000`
- `firstList[i], secondList[i]` each hold `[start, end]` with `0 <= start <= end <= 10^9`.
- Intervals inside each list are disjoint and sorted.
