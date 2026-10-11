Given the head of a singly linked list and a non-negative integer `k`, shift the list to the right by `k` places. Shifting means the last `k` nodes move to the front while preserving their internal order, and the remaining nodes follow behind them.

If `k` is larger than the list length, wrap around using `k` modulo the length. An empty list or a zero shift leaves the list unchanged.

**Example 1:**
```
Input: head = [1,2,3,4,5], k = 2
Output: [4,5,1,2,3]
Explanation: The last 2 nodes (4, 5) move to the front.
```

**Example 2:**
```
Input: head = [0,1,2], k = 4
Output: [2,0,1]
Explanation: 4 mod 3 is 1, so effectively rotate by 1.
```

**Example 3:**
```
Input: head = [], k = 0
Output: []
Explanation: An empty list stays empty.
```

**Constraints:**
- `0 <= number of nodes <= 500`
- `-100 <= node value <= 100`
- `0 <= k <= 2000000000`
