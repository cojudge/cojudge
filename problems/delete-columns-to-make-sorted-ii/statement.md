Delete the fewest columns so the remaining rows read in order.

All strings share one length and may lose whole columns: choosing a column index removes that character from every row. After deletions, the rows must be lexicographically non-decreasing from top to bottom (each row is less than or equal to the next). Equal rows are fine.

Given `strs`, return the smallest number of columns to drop.

**Example 1:**
```
Input: strs = ["ca","bb","ac"]
Output: 1
Explanation: Dropping column 0 leaves ["a","b","c"], which is ordered; keeping both columns gives ca > bb, which is not.
```

**Example 2:**
```
Input: strs = ["xc","yb","za"]
Output: 0
Explanation: The rows xc <= yb <= za already hold, so nothing is dropped.
```

**Example 3:**
```
Input: strs = ["zyx","wvu","tsr"]
Output: 3
Explanation: Every column steps down, so all three must go, leaving empty (ordered) rows.
```

**Constraints:**
- `1 <= strs.length <= 100`
- `1 <= strs[i].length <= 100`
- All rows share the same length and hold lowercase English letters.
