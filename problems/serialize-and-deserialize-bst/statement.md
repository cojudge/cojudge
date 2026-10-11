You are given a binary search tree written as bracket text `data`, for example `"[4,2,7,1,3]"` means root 4 with left child 2 (which has children 1 and 3) and right child 7. An empty tree is `"[]"`.

Write `serialize`, which returns a compact preorder listing of the same tree: visit the node, then the left subtree, then the right subtree, joining values with commas and using no null markers. The examples below show the mapping. An empty tree serializes to `""` (the empty string).

> **Adaptation note:** the classic task exposes a `Codec` class with `serialize(TreeNode)` and `deserialize(String)` over a `tree_node`. Here both sides are plain `string` values so the judge stays within portable types: the input is bracket text, the output is preorder text, and the reference `Marker` codec parses brackets into a tree and then emits preorder. Returning preorder tests the serialization half; a correct preorder can rebuild the same search tree.

**Example 1:**
```
Input: data = "[2,1,3]"
Output: "2,1,3"
Explanation: Preorder visits 2, then left 1, then right 3.
```

**Example 2:**
```
Input: data = "[4,2,7,1,3]"
Output: "4,2,1,3,7"
Explanation: Preorder visits 4, then the left group 2,1,3, then 7.
```

**Example 3:**
```
Input: data = "[]"
Output: ""
Explanation: No nodes means no text.
```

**Constraints:**
- `0 <= number of nodes <= 10^4`
- Values are unique and form a valid binary search tree.
- `-10^4 <= node value <= 10^4`
- Bracket text follows level order with `null` for missing children.
