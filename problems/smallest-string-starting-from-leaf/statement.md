Each node of the binary tree holds an integer `0` to `25`, encoding letters `a` to `z` (`0` is `a`, `25` is `z`).

For every leaf (a node with no children), write the letters along the path from that leaf up to the root, leaf first. Among all such leaf-to-root strings, return the lexicographically smallest one.

**Example 1:**
```
Input: root = [0,1,2,3,4,3,4]
Output: "dba"
Explanation: Candidate leaf strings include dba and eba; dba is smaller.
```

**Example 2:**
```
Input: root = [25,1,3,1,3,0,2]
Output: "adz"
Explanation: Comparing all leaf-up spellings gives adz as the minimum.
```

**Example 3:**
```
Input: root = [2,2,1,null,1,0,null,0]
Output: "abc"
Explanation: The smallest leaf-up spelling is abc.
```

**Constraints:**
- `1 <= number of nodes <= 8500`
- `0 <= node value <= 25`
