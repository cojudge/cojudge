A linked list may contain a loop: the last node can point back to some earlier node. You are given the list values `head` and a loop descriptor `pos`, where `pos` is the index the tail links to (`-1` means no loop).

Find where the loop starts and return its index. Return `-1` when there is no loop. Do not change the list.

**Constraints:**
- `0 <= number of nodes <= 10^4`
- `-10^5 <= Node.val <= 10^5`
- `pos` is `-1` or a valid list index.

**Adaptation note:** The original LeetCode task returns the cycle-entry node (or null). Because a cyclic list cannot be serialized as an output value, this version returns the entry index (`-1` when absent). The `pos` field is test harness metadata used to build the loop and is not a function parameter.
