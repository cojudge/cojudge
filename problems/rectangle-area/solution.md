## Approach

Add the two individual areas and subtract the overlap once. The overlap is the rectangle between the rightmost left edge and the leftmost right edge (likewise bottom/top); if either dimension is non-positive the rectangles are disjoint and the overlap is zero.

## Complexity Analysis

- **Time Complexity:** O(1).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def computeArea(self, ax1: int, ay1: int, ax2: int, ay2: int, bx1: int, by1: int, bx2: int, by2: int) -> int:
        area_a = (ax2 - ax1) * (ay2 - ay1)
        area_b = (bx2 - bx1) * (by2 - by1)
        overlap_w = min(ax2, bx2) - max(ax1, bx1)
        overlap_h = min(ay2, by2) - max(ay1, by1)
        overlap = overlap_w * overlap_h if overlap_w > 0 and overlap_h > 0 else 0
        return area_a + area_b - overlap
```
