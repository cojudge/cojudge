Build an `n` by `n` grid filled with the numbers `1` through `n * n` in clockwise spiral order, starting at the top-left corner and initially moving right.

Walk right along the top edge, down the right edge, left along the bottom edge, and up the left side, then continue inward layer by layer until every cell holds a value. The first number placed is `1` and each subsequent cell gets the next integer.

**Example 1:**
```
Input: n = 3
Output: [[1,2,3],[8,9,4],[7,6,5]]
Explanation: The outer ring is 1-8 clockwise and the center is 9.
```

**Example 2:**
```
Input: n = 1
Output: [[1]]
Explanation: A 1x1 grid holds only the value 1.
```

**Example 3:**
```
Input: n = 2
Output: [[1,2],[4,3]]
Explanation: Going right gives 1, 2, then down to 3 and left to 4.
```

**Constraints:**
- `1 <= n <= 20`
