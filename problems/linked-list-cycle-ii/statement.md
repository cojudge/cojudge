A linked list may contain a loop: the last node can point back to some earlier node. You are given the list values `head` and a loop descriptor `pos`, where `pos` is the index the tail links to (`-1` means no loop).

Find where the loop starts and return its index. Return `-1` when there is no loop. Do not change the list.

**Example 1:**
```
Input: head = [3,2,0,-4], pos = 1
Output: 1
Explanation: The tail (-4) links to index 1 (value 2), so the cycle starts at index 1.
```

**Example 2:**
```
Input: head = [1,2], pos = 0
Output: 0
Explanation: The tail links to the head, so the cycle starts at index 0.
```

**Example 3:**
```
Input: head = [1], pos = -1
Output: -1
Explanation: There is no cycle.
```

**Constraints:**
- `0 <= number of nodes <= 10^4`
- `-10^5 <= Node.val <= 10^5`
- `pos` is `-1` or a valid list index.

**Adaptation note:** The original LeetCode task returns the cycle-entry node (or null). Because a cyclic list cannot be serialized as an output value, this version returns the entry index (`-1` when absent). The `pos` field is test harness metadata used to build the loop and is not a function parameter.
