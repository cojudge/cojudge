You are given two lists of closed intervals, `firstList` and `secondList`. Within each list the intervals are pairwise disjoint and sorted by start. Compute all pairwise intersections: for every `I` in the first list and `J` in the second list, if they share at least one point, include their overlap `[max(starts), min(ends)]` in the answer. Return the intersections sorted by start (the two-pointer scan naturally produces this order).

**Constraints:**
- `0 <= firstList.length, secondList.length <= 1000`
- `firstList[i], secondList[i]` each hold `[start, end]` with `0 <= start <= end <= 10^9`.
- Intervals inside each list are disjoint and sorted.
