Given a set of distinct points on the integer grid, consider every rectangle (of any tilt, not just axis-aligned) whose four corners all belong to the set. Return the smallest such rectangle's area, or 0 when no four points form a rectangle.

Adaptation note: because all coordinates are integers, the area of any qualifying rectangle is always a whole number, so this task returns that exact integer area rather than a floating-point value.

**Constraints:**
- `1 <= points.length <= 50`
- All points are distinct.
- `0 <= points[i][0], points[i][1] <= 40000`
- The points arrive as a 2D integer array.
