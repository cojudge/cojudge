Consider the binary tree whose entry point is `root`, observed from a vantage point far to its east.
List, from the highest row to the lowest row, the value that can still be seen on each row.

For every row, exactly one value is recorded: the easternmost occupied slot of that row.
That slot need not lie on the all-rightward path; a left descendant is recorded whenever nothing stands to its east on the same row.

**Constraints:**

- The tree contains between `0` and `100` nodes.
- `-100 <= node.val <= 100`
