You are given the heads of two singly linked lists, `headA` and `headB`.

In the original setting the two lists join at some shared node. Because this offline judge builds each list separately, intersection is defined by values instead: the lists intersect when they end with the same non-empty run of values. That is, there are positions `i` in the first list and `j` in the second list such that the remaining tails are equal element by element.

Return the intersecting tail (the suffix starting at its first shared value), or null when the lists share no common ending values. Test data avoids coincidental single-value matches for non-intersecting cases, so a shared ending genuinely represents a meeting point.

**Example 1:**
```
Input: headA = [4,1,8,4,5], headB = [5,6,1,8,4,5]
Output: [8,4,5]
Explanation: Both lists end with 8 -> 4 -> 5, so the intersecting tail is [8,4,5].
```

**Example 2:**
```
Input: headA = [1,9,1,2,4], headB = [3,2,4]
Output: [2,4]
Explanation: Both lists end with 2 -> 4.
```

**Example 3:**
```
Input: headA = [2,6,4], headB = [1,5]
Output: []
Explanation: The endings differ, so there is no intersection (null, shown as []).
```

**Constraints:**
- `0 <= number of nodes <= 10^4`
- `0 <= Node.val <= 100`
- Each list is acyclic.
