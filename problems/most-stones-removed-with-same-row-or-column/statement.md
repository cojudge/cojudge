Remove as many stones as possible when each removal needs a row or column partner.

Stones sit on integer grid points with at most one stone per point. A stone may be taken away only while some other remaining stone shares its row or its column. Plan the removals to clear the maximum count.

Given `stones` where each entry is `[x, y]`, return the largest number of stones that can disappear.

**Constraints:**
- `1 <= stones.length <= 1000`
- `0 <= xi, yi <= 10^4`
- No two stones share a coordinate.
