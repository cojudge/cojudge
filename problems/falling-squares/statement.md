Squares fall one by one onto a flat baseline. Each entry `positions[i] = [left, size]` describes a square whose side length equals `size` and whose left edge starts at coordinate `left`. A square drops straight down until it rests on the baseline or on top of a previously placed square. Touching only at a vertical edge does not count as support.

After every drop, record how tall the tallest stack has become. Return those maxima in order.

**Example 1:**
```
Input: positions = [[1,2],[2,3],[6,1]]
Output: [2,5,5]
Explanation: The first square reaches height 2. The second overlaps it and climbs to 5. The third is isolated with height 1, so the maximum stays 5.
```

**Example 2:**
```
Input: positions = [[100,100],[200,100]]
Output: [100,100]
Explanation: The squares do not overlap, so the tallest height remains 100.
```

**Example 3:**
```
Input: positions = [[0,2],[1,2],[3,1]]
Output: [2,4,4]
Explanation: The second square lands partly on the first and rises to 4; the third is too far right to raise the maximum.
```

**Constraints:**
- `1 <= positions.length <= 1000`
- `0 <= left <= 10^8`
- `1 <= size <= 10^6`
