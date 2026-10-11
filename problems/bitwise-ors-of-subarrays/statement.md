Look at every contiguous block inside `arr` (a block must keep neighbours together and cannot be empty). For each block compute the bitwise OR of its entries — the OR of a lone entry is the entry itself.

How many different OR values appear across all blocks?

**Example 1:**
```
Input: arr = [0]
Output: 1
Explanation: The only block gives 0.
```

**Example 2:**
```
Input: arr = [1,1,2]
Output: 3
Explanation: The blocks produce 1, 2 and 3, so three distinct results emerge.
```

**Example 3:**
```
Input: arr = [1,2,4]
Output: 6
Explanation: The attainable ORs are 1, 2, 3, 4, 6 and 7.
```

**Constraints:**
- `1 <= arr.length <= 5 * 10^4`
- `0 <= arr[i] <= 10^9`
