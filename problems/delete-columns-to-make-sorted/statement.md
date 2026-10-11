Count the grid columns that break top-to-bottom order.

The input strings all share one length, so they form rows of a grid. A column is fine when its letters never decrease from the first row to the last; otherwise that whole column must be removed. Columns are judged independently of each other.

Given the row array `strs`, return how many columns need removal.

**Example 1:**
```
Input: strs = ["cba","daf","ghi"]
Output: 1
Explanation: Column 0 (c,d,g) and column 2 (a,f,i) are ordered, but column 1 (b,a,h) dips from b to a, so one column goes.
```

**Example 2:**
```
Input: strs = ["a","b"]
Output: 0
Explanation: The single column a <= b is already ordered.
```

**Example 3:**
```
Input: strs = ["zyx","wvu","tsr"]
Output: 3
Explanation: Every column falls (z > w > t and so on), so all three columns go.
```

**Constraints:**
- `1 <= strs.length <= 100`
- `1 <= strs[i].length <= 1000`
- All rows share the same length and hold lowercase English letters.
