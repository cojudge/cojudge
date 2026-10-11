Each rectangle is given as `[x1, y1, x2, y2]`, where `(x1, y1)` is the bottom-left corner and `(x2, y2)` is the top-right corner, with `x1 < x2` and `y1 < y2`. Two rectangles overlap when their intersection has positive area — touching only at an edge or a corner does not count. Return `true` when `rec1` and `rec2` overlap and `false` otherwise.

**Example 1:**
```
Input: rec1 = [0,0,2,2], rec2 = [1,1,3,3]
Output: true
Explanation: The unit square from (1,1) to (2,2) belongs to both.
```

**Example 2:**
```
Input: rec1 = [0,0,1,1], rec2 = [1,0,2,1]
Output: false
Explanation: The rectangles share only the edge x = 1, which has no area.
```

**Example 3:**
```
Input: rec1 = [0,0,1,1], rec2 = [2,2,3,3]
Output: false
Explanation: They are fully separated.
```

**Constraints:**
- `rec1.length == rec2.length == 4`
- `-10^9 <= rec1[i], rec2[i] <= 10^9`
- `rec1[0] < rec1[2]`, `rec1[1] < rec1[3]`, `rec2[0] < rec2[2]`, `rec2[1] < rec2[3]`
