You are given an array `intervals` of start/end pairs. Delete as few of them as possible so that the survivors are pairwise non-overlapping. Return that smallest deletion count.

Two intervals that meet only at an endpoint do not count as overlapping. As an illustration, `[1, 2]` and `[2, 3]` may both be kept.

**Constraints:**

- 1 ≤ intervals.length ≤ 10^5
- intervals[i].length == 2
- -5 * 10^4 ≤ starti < endi ≤ 5 * 10^4
