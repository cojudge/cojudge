A city skyline is described by a list of buildings, where each building is `[left, right, height]`: it spans the ground from `left` to `right` (exclusive of `right`) and rises to `height`. The skyline silhouette is the outline you see from afar.

Return the silhouette as a list of key points `[x, h]`, ordered by increasing `x`. Each key point marks where the visible height changes: consecutive points `[x1, h1], [x2, h2]` mean the height is `h1` on the stretch from `x1` to `x2`. The outline starts at the first edge where the height leaves 0 and must finish with a point whose height is 0. No two consecutive points share the same height.

**Constraints:**
- `1 <= buildings.length <= 10^4`
- `0 <= left < right <= 2^31 - 1`
- `1 <= height <= 2^31 - 1`
- The buildings are given in non-decreasing order of `left`.
