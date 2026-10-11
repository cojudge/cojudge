Two rectangles sit on a grid with sides parallel to the axes. The first has corners `(ax1, ay1)` (bottom-left) and `(ax2, ay2)` (top-right); the second has corners `(bx1, by1)` and `(bx2, by2)`.

Return the total area covered by at least one of the rectangles, counting any overlap only once.

**Example 1:**
```
Input: ax1 = -3, ay1 = 0, ax2 = 3, ay2 = 4, bx1 = 0, by1 = -1, bx2 = 9, by2 = 2
Output: 45
Explanation: The first rectangle covers 24 and the second covers 27, while their overlap covers 6; 24 + 27 - 6 = 45.
```

**Example 2:**
```
Input: ax1 = -2, ay1 = -2, ax2 = 2, ay2 = 2, bx1 = -2, by1 = -2, bx2 = 2, by2 = 2
Output: 16
Explanation: Both rectangles are identical, so the union is just 16.
```

**Example 3:**
```
Input: ax1 = 0, ay1 = 0, ax2 = 1, ay2 = 1, bx1 = 2, by1 = 2, bx2 = 3, by2 = 3
Output: 2
Explanation: The rectangles do not touch, so the answer is 1 + 1 = 2.
```

**Constraints:**
- `-10^4 <= ax1 < ax2 <= 10^4`
- `-10^4 <= ay1 < ay2 <= 10^4`
- `-10^4 <= bx1 < bx2 <= 10^4`
- `-10^4 <= by1 < by2 <= 10^4`
