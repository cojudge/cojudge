Delete the fewest columns so the remaining rows read in order.

All strings share one length and may lose whole columns: choosing a column index removes that character from every row. After deletions, the rows must be lexicographically non-decreasing from top to bottom (each row is less than or equal to the next). Equal rows are fine.

Given `strs`, return the smallest number of columns to drop.

**Constraints:**
- `1 <= strs.length <= 100`
- `1 <= strs[i].length <= 100`
- All rows share the same length and hold lowercase English letters.
