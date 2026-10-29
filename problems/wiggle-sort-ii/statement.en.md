You are given an integer array `nums` and must reorder it so that strict ups and downs alternate: `nums[0] < nums[1] > nums[2] < nums[3] ...`. Every input given here admits at least one such ordering. Return any reordered array meeting the condition (it must reuse exactly the same elements).

*Adaptation note:* the original statement rearranges the array in place without returning anything; here you return the reordered array instead, holding the same values.

**Constraints:**
- `1 <= nums.length <= 5 * 10^4`
- `0 <= nums[i] <= 5000`
- A valid answer always exists for the given input.
