You are given an integer array `height`, where the value at index `i` denotes the height of a vertical wall standing at that position. Select two positions to serve as the sides of a vessel (the base being the x-axis) and determine the greatest quantity of water such a vessel could retain. Return that maximum.

The retained quantity for a pair of positions is the gap between them multiplied by the shorter of the two walls.

**Example 1:**
```
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
```

**Example 2:**
```
Input: height = [1,1]
Output: 1
```

**Constraints:**
- `n == height.length`
- `2 <= n <= 10^5`
- `0 <= height[i] <= 10^4`
