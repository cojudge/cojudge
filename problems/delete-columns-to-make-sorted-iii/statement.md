You hold several equal-length lowercase strings, one per row. You may delete any set of columns (the same positions in every row). After the deletions, every remaining row must read in non-decreasing order from top to bottom within each kept column — that is, for any two rows where the upper row comes first, its kept characters must never exceed the lower row's kept characters column by column.

Remove as few columns as possible while achieving this column-wise order, and return that minimum deletion count.

**Example 1:**
```
Input: strs = ["babca","bbazb"]
Output: 3
Explanation: Keeping only 2 of the 5 columns (for instance the middle ones) is the most that stays ordered, so 3 columns must go.
```

**Example 2:**
```
Input: strs = ["edcba"]
Output: 4
Explanation: One strictly falling row keeps at most a single column, forcing 4 deletions.
```

**Example 3:**
```
Input: strs = ["ghi","def","abc"]
Output: 0
Explanation: Each column already reads top-to-bottom in order, so nothing needs deleting.
```

**Constraints:**
- `1 <= strs.length <= 100`
- `1 <= strs[i].length <= 100`
- All rows share the same length and use lowercase English letters.
- The input is given as a plain string array.
