You are given a sorted array `nums` with no duplicates, plus bounds `lower` and `upper`. Every integer from `lower` to `upper` should appear, but the ones already in `nums` are covered.

Return the missing pieces as strings. A lone missing number becomes just that number (for example `"2"`), while a run of consecutive missing numbers becomes `"start->end"` (for example `"4->49"`). List the pieces in increasing order. When nothing is missing, return an empty list.

**Example 1:**
```
Input: nums = [0,1,3,50,75], lower = 0, upper = 99
Output: ["2","4->49","51->74","76->99"]
Explanation: 2 is missing alone; 4 through 49, 51 through 74, and 76 through 99 are missing runs.
```

**Example 2:**
```
Input: nums = [], lower = 1, upper = 1
Output: ["1"]
Explanation: The only value in range is missing.
```

**Example 3:**
```
Input: nums = [-1], lower = -1, upper = -1
Output: []
Explanation: The single value in range is present, so nothing is missing.
```

**Constraints:**
- `-10^9 <= lower <= upper <= 10^9`
- `0 <= nums.length <= 10^4`
- `nums` is sorted in strictly increasing order and every element lies within `[lower, upper]`.
