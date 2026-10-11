Measure the longest subsequence whose steps zigzag up and down.

A wiggle run requires neighboring differences to strictly alternate in sign: positive, negative, positive, and so on. The opening step may point either way. A single value always qualifies with length 1, and any two different values qualify with length 2, while equal neighbors can never sit next to each other in the subsequence. From `nums`, keep a subsequence (deleting entries freely but preserving order) that wiggles and is as long as possible, then return its length.

**Example 1:**
```
Input: nums = [1,7,4,9,2,5]
Output: 6
Explanation: The whole array already alternates steps +6,-3,+5,-7,+3.
```

**Example 2:**
```
Input: nums = [1,17,5,10,13,15,10,5,16,8]
Output: 7
Explanation: One best subsequence keeps seven entries with alternating steps.
```

**Example 3:**
```
Input: nums = [1,2,3,4,5,6,7,8,9]
Output: 2
Explanation: Every step climbs, so any two different entries form the longest wiggle.
```

**Constraints:**
- `1 <= nums.length <= 1000`
- `0 <= nums[i] <= 1000`
