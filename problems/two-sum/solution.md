## Approach

Use a hash map to store each element's value and its index while iterating through the array. For each element `nums[i]`, compute the complement `target - nums[i]`. If the complement exists in the hash map, return the current index `i` and the stored index of the complement. This avoids a nested loop, achieving a single pass through the array.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of the input array. Each element is visited once, and hash map lookups are O(1) on average.
- **Space Complexity:** O(n). In the worst case, we store nearly all elements in the hash map before finding the pair.

## Implementation

```java
import java.util.*;
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int n = nums.length;
        Map<Integer, Integer> mp = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int want = target - nums[i];
            if (mp.containsKey(want)) return new int[] {i, mp.get(want)};
            mp.put(nums[i], i);
        }
        return new int[]{};
    }
}
```
