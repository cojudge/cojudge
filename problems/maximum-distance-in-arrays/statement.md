You are given `m` arrays, each sorted in non-decreasing order. Choose two numbers coming from two different arrays and look at their absolute difference. Return the largest achievable difference.

Because every row is ordered, only row endpoints influence the optimum, but the two picks must never share a row.

**Example 1:**
```
Input: arrays = [[1,2,3],[4,5],[1,2,3]]
Output: 4
Explanation: 1 (first row) and 5 (second row) differ by 4.
```

**Example 2:**
```
Input: arrays = [[1],[1]]
Output: 0
```

**Example 3:**
```
Input: arrays = [[1,4],[2,5]]
Output: 4
Explanation: 1 and 5 come from different rows.
```

**Constraints:**
- At least two arrays are present; total values are modest.
- Each array has at least one number; values fit in [-10000, 10000].

*Adaptation: the nested input maps to `int_array_2d` in this judge.*
