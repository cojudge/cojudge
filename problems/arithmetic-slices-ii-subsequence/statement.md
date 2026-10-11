You are given an integer list `nums`. A subsequence keeps the original order but may skip entries. It counts as arithmetic when it holds at least three numbers and the gap between consecutive numbers never changes.

Count all such arithmetic subsequences. Overlapping subsequences that use different positions count separately even when their values look the same.

**Example 1:**
```
Input: nums = [2,4,6,8,10]
Output: 7
Explanation: Five length-3 progressions with gap 2, plus [2,6,10] and [2,4,6,8,10], total 7.
```

**Example 2:**
```
Input: nums = [7,7,7,7,7]
Output: 16
Explanation: Every choice of at least 3 positions out of 5 works: 10 triples plus 5 quadruples plus 1 quintuple.
```

**Constraints:**
- `1 <= nums.length <= 1000`
- `-2^31 <= nums[i] <= 2^31 - 1`
