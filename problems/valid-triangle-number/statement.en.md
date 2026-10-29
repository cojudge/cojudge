You are given side lengths in an array `nums`. Count how many index triples `i < j < k` could serve as the three sides of a non-degenerate triangle.

Three lengths form a genuine triangle exactly when the sum of any two exceeds the third. After sorting, it suffices to verify that the two shorter sides beat the longest one.

Return the number of valid triples.

**Constraints:**
- `1 <= nums.length <= 1000`
- `0 <= nums[i] <= 1000`
