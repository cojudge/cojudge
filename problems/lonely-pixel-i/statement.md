You are given a picture as a grid of characters where `B` marks a black pixel and `W` marks a white pixel. A black pixel is called *lonely* when its entire row and its entire column contain no other black pixels (it is the only `B` in both).

Return the number of lonely black pixels in the picture.

**Example 1:**
```
Input: picture = [["W","W","B"],["W","B","W"],["B","W","W"]]
Output: 3
Explanation: Each black pixel sits alone in its row and column.
```

**Example 2:**
```
Input: picture = [["B","B"],["B","W"]]
Output: 0
Explanation: Every black pixel shares its row or column with another black pixel.
```

**Example 3:**
```
Input: picture = [["W","B","W"]]
Output: 1
Explanation: The single black pixel has no company in its row or column.
```

**Constraints:**
- `1 <= picture.length, picture[i].length <= 500`
- The grid is rectangular and holds only `B` and `W`.
