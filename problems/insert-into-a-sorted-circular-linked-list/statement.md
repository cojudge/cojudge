A circular linked list is sorted when its values increase around the ring except for one drop from the maximum back to the minimum. The list is given as a linear encoding `head` that lists values in circular order starting from the current head node (for example `[3,4,1]` means `3 -> 4 -> 1 -> 3`). An empty list is `[]`.

Insert a new value `insertVal` so the ring stays sorted, and return the linear encoding that starts from the original head (or the single new value when the input was empty). The head itself never changes unless the list was empty.

**Constraints:**
- `0 <= head.length <= 1000`
- `-1000 <= Node.val, insertVal <= 1000`
- The input ring is sorted in the circular sense.
- The judge checks that the output starts from the same head, holds all old values plus the new one, and is circularly sorted.
