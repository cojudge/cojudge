You hold several equal-length lowercase strings, one per row. You may delete any set of columns (the same positions in every row). After the deletions, every remaining row must read in non-decreasing order from top to bottom within each kept column — that is, for any two rows where the upper row comes first, its kept characters must never exceed the lower row's kept characters column by column.

Remove as few columns as possible while achieving this column-wise order, and return that minimum deletion count.

**Constraints:**
- `1 <= strs.length <= 100`
- `1 <= strs[i].length <= 100`
- All rows share the same length and use lowercase English letters.
- The input is given as a plain string array.
