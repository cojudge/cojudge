You are given an array `nums` encoding a binary tree. Each entry is a three-digit number:

- hundreds digit: depth `d` (root is depth 1),
- tens digit: position `p` within that depth (counting from 1),
- ones digit: node value `v` (0..9).

The tree is consistent: every code except the root has its parent present, and positions follow heap rules where children of `(d, p)` are `(d+1, 2p-1)` and `(d+1, 2p)`.

Add up the sums of all root-to-leaf paths and return the total.

**Adaptation:** the encoded entries map to an int array in this judge.

**Constraints:**
- `1 <= nums.length <= 50`
- Each code is between 111 and 459 with value digit 0..9 and forms a valid tree.
