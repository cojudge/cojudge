You are given `k` sorted integer lists. Find the narrowest interval `[a, b]` that contains at least one number from every list.

Compare candidates by width `b - a` first; when widths tie, prefer the smaller start `a`. Return the winning pair.

**Example 1:**
```
Input: nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]
Output: [20,24]
```

**Example 2:**
```
Input: nums = [[1,2,3],[1,2,3],[1,2,3]]
Output: [1,1]
```

**Example 3:**
```
Input: nums = [[10,10],[11,11]]
Output: [10,11]
```

**Constraints:**
- At least one list is present; each list is sorted increasingly.
- Values fit comfortably in 32-bit signed range.

*Adaptation: the nested input maps to `int_array_2d` and the two-element answer maps to `int_array` in this judge, even though the natural statement uses lists of lists.*
