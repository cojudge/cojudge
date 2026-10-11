A city skyline is described by a list of buildings, where each building is `[left, right, height]`: it spans the ground from `left` to `right` (exclusive of `right`) and rises to `height`. The skyline silhouette is the outline you see from afar.

Return the silhouette as a list of key points `[x, h]`, ordered by increasing `x`. Each key point marks where the visible height changes: consecutive points `[x1, h1], [x2, h2]` mean the height is `h1` on the stretch from `x1` to `x2`. The outline starts at the first edge where the height leaves 0 and must finish with a point whose height is 0. No two consecutive points share the same height.

**Example 1:**
```
Input: buildings = [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]
Output: [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]
Explanation: The overlapping blocks merge into one silhouette; the height drops to 0 at 12, resumes at 15, and ends at 24.
```

**Example 2:**
```
Input: buildings = [[0,2,3],[2,5,3]]
Output: [[0,3],[5,0]]
Explanation: The two blocks touch and share one height, so the outline is flat from 0 to 5.
```

**Example 3:**
```
Input: buildings = [[1,2,1]]
Output: [[1,1],[2,0]]
Explanation: A single block rises to 1 between 1 and 2.
```

**Constraints:**
- `1 <= buildings.length <= 10^4`
- `0 <= left < right <= 2^31 - 1`
- `1 <= height <= 2^31 - 1`
- The buildings are given in non-decreasing order of `left`.
