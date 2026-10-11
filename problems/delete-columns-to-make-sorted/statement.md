Count the grid columns that break top-to-bottom order.

The input strings all share one length, so they form rows of a grid. A column is fine when its letters never decrease from the first row to the last; otherwise that whole column must be removed. Columns are judged independently of each other.

Given the row array `strs`, return how many columns need removal.

**Constraints:**
- `1 <= strs.length <= 100`
- `1 <= strs[i].length <= 1000`
- All rows share the same length and hold lowercase English letters.
