## Approach

Every index dominates exactly those subarrays where it is the chosen minimum. Scanning with an increasing stack finds for each slot how far it stretches left until a strictly smaller value and right until a smaller-or-equal value; the asymmetric tie-break guarantees each subarray is credited once. Multiplying the value by the two stretch lengths and summing modulo `1_000_000_007` yields the total.

## Complexity Analysis

- **Time Complexity:** O(n) for the two stack passes plus the final accumulation.
- **Space Complexity:** O(n) for the border arrays and the stack.

## Implementation

```python
from typing import List
class Solution:
    def sumSubarrayMins(self, arr: List[int]) -> int:
        MOD = 10 ** 9 + 7
        n = len(arr)
        left = [0] * n
        right = [0] * n
        st = []
        for i in range(n):
            while st and arr[st[-1]] > arr[i]:
                st.pop()
            left[i] = i + 1 if not st else i - st[-1]
            st.append(i)
        st.clear()
        for i in range(n - 1, -1, -1):
            while st and arr[st[-1]] >= arr[i]:
                st.pop()
            right[i] = n - i if not st else st[-1] - i
            st.append(i)
        return sum(a * l * r for a, l, r in zip(arr, left, right)) % MOD
```
