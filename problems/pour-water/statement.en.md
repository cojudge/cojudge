You are given terrain heights `heights`, a number of water units `volume`, and a drop index `k`.

Process the units one at a time. For each unit, decide where it settles by this rule. First look left: walk left while the level (terrain plus water already placed) never rises, and remember the leftmost lowest reachable spot. If that spot sits lower than the drop column, the unit rests there. Otherwise perform the mirror search to the right. If neither side offers a lower home, the unit stays at `k`. Each settled unit raises its column by one before the next unit falls.

Return the final levels after all units settle. The input array may be updated in place.

**Constraints:**
- `1 <= heights.length <= 100`
- `0 <= heights[i] <= 99`
- `0 <= volume <= 2000`
- `0 <= k < heights.length`
