You are given an integer array `nums` and must reorder it so that strict ups and downs alternate: `nums[0] < nums[1] > nums[2] < nums[3] ...`. Every input given here admits at least one such ordering. Return any reordered array meeting the condition (it must reuse exactly the same elements).

*Adaptation note:* the original statement rearranges the array in place without returning anything; here you return the reordered array instead, holding the same values.

**Example 1:**
```
Input: nums = [1,5,1,1,6,4]
Output: [1,6,1,5,1,4]
Explanation: 1 < 6 > 1 < 5 > 1 < 4 holds; other valid orders such as [1,4,1,5,1,6] are also accepted.
```

**Example 2:**
```
Input: nums = [1,3,2,2,3,1]
Output: [2,3,1,3,1,2]
Explanation: 2 < 3 > 1 < 3 > 1 < 2 is a valid strict wiggle.
```

**Example 3:**
```
Input: nums = [1,1,2]
Output: [1,2,1]
Explanation: With one peak in the middle, 1 < 2 > 1 works.
```

**Constraints:**
- `1 <= nums.length <= 5 * 10^4`
- `0 <= nums[i] <= 5000`
- A valid answer always exists for the given input.
