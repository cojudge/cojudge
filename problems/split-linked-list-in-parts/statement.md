You are given the head of a singly linked list holding `n` values and an integer `k`. Your task is to divide the list into `k` consecutive groups.

Follow these rules when describing the groups:

- Every value of the original list appears in exactly one group, and the groups preserve the original order.
- The groups should be as close in size as possible: any two groups differ in length by at most one.
- Groups at the front get the extra values. In other words, if `n` does not divide evenly, the first `n % k` groups each hold one additional node.
- When there are more groups than values, the trailing groups are empty.

Return the `k` groups in order, where each group is represented by the head of its chain (an empty group is represented by an empty chain).

**Constraints:**
- `0 <= n <= 1000`
- `1 <= k <= 50`
- `0 <= Node.val <= 1000`
