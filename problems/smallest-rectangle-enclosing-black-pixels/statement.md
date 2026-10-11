A binary picture is given as rows of `'0'` (white) and `'1'` (black) characters holding at
least one black pixel; all black pixels link together through shared sides. You are also
given the coordinates `(x, y)` of one black pixel. Return the area of the smallest
axis-aligned rectangle that covers every black pixel.

**Example 1:**
```
Input: image = [["0","0","1","0"],["0","1","1","0"],["0","1","0","0"]], x = 0, y = 2
Output: 6
Explanation: Black rows span 0..2 and black columns span 1..2, giving 3 x 2 = 6.
```

**Example 2:**
```
Input: image = [["1"]], x = 0, y = 0
Output: 1
Explanation: A single pixel covers area 1.
```

**Example 3:**
```
Input: image = [["1","1"],["1","1"]], x = 1, y = 1
Output: 4
Explanation: The whole 2 x 2 picture is black.
```

**Constraints:**
- `1 <= m, n <= 850`
- `image[x][y] == '1'`.
- The picture contains at least one `'1'`, all linked 4-directionally.
