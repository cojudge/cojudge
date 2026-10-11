A web page needs a rectangular shape whose area equals a given positive integer. Call its sides length `L` and width `W`. The design must satisfy two rules: the length is never shorter than the width (`L >= W`), and the gap between the sides (`L - W`) is as small as possible.

Return the chosen pair as `[L, W]`.

**Example 1:**
```
Input: area = 4
Output: [2,2]
Explanation: Among [1,4] and [2,2], the square has the smallest side gap.
```

**Example 2:**
```
Input: area = 37
Output: [37,1]
Explanation: A prime area only factors as 37 by 1.
```

**Example 3:**
```
Input: area = 122122
Output: [427,286]
Explanation: This factor pair is the closest to a square.
```

**Constraints:**
- `1 <= area <= 10^7`
