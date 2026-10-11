Produce the first `numRows` rows of Pascal's triangle.

Begin with a single `1` at the top. Every later row starts and ends with `1`, and each interior position holds the sum of the two numbers directly above it from the previous row. Collect all rows from top to bottom and return them.

**Example 1:**
```
Input: numRows = 5
Output: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
Explanation: Row 3 ([1,2,1]) comes from row 2 ([1,1]) via 1, 1+1, 1; the pattern continues downward.
```

**Example 2:**
```
Input: numRows = 1
Output: [[1]]
```

**Constraints:**
- `1 <= numRows <= 30`

**Adaptation note:** The nested value list is represented as `int_list_2d` in this judge.
