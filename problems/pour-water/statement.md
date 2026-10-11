You are given terrain heights `heights`, a number of water units `volume`, and a drop index `k`.

Process the units one at a time. For each unit, decide where it settles by this rule. First look left: walk left while the level (terrain plus water already placed) never rises, and remember the leftmost lowest reachable spot. If that spot sits lower than the drop column, the unit rests there. Otherwise perform the mirror search to the right. If neither side offers a lower home, the unit stays at `k`. Each settled unit raises its column by one before the next unit falls.

Return the final levels after all units settle. The input array may be updated in place.

**Example 1:**
```
Input: heights = [2,1,1,2,1,2,2], volume = 4, k = 3
Output: [2,2,2,3,2,2,2]
Explanation: The first two units roll left to the dips, the third rolls right, and the fourth stays home.
```

**Example 2:**
```
Input: heights = [1,2,3,4], volume = 2, k = 2
Output: [2,3,3,4]
Explanation: Both units drift left down the slope, landing at indices 0 and 1.
```

**Example 3:**
```
Input: heights = [3,1,3], volume = 5, k = 1
Output: [4,4,4]
Explanation: Units fill the middle dip first, then spread evenly until all columns tie.
```

**Constraints:**
- `1 <= heights.length <= 100`
- `0 <= heights[i] <= 99`
- `0 <= volume <= 2000`
- `0 <= k < heights.length`
