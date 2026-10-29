Given the head of a singly linked list and a non-negative integer `k`, shift the list to the right by `k` places. Shifting means the last `k` nodes move to the front while preserving their internal order, and the remaining nodes follow behind them.

If `k` is larger than the list length, wrap around using `k` modulo the length. An empty list or a zero shift leaves the list unchanged.

**Constraints:**
- `0 <= number of nodes <= 500`
- `-100 <= node value <= 100`
- `0 <= k <= 2000000000`
