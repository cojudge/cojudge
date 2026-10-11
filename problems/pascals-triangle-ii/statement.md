Return a single 0-based row of Pascal's triangle.

Row 0 is `[1]`, row 1 is `[1,1]`, and each later row starts and ends with `1` while interior entries sum the two numbers above them. Given `rowIndex`, produce exactly that row without necessarily building the whole triangle.

**Example 1:**
```
Input: rowIndex = 3
Output: [1,3,3,1]
```

**Example 2:**
```
Input: rowIndex = 0
Output: [1]
```

**Example 3:**
```
Input: rowIndex = 1
Output: [1,1]
```

**Constraints:**
- `0 <= rowIndex <= 33`

**Adaptation note:** The value list is represented as `int_array` in this judge.
