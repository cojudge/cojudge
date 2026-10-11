A strobogrammatic number looks the same when rotated 180 degrees. The valid digit rotations are `0 -> 0`, `1 -> 1`, `6 -> 9`, `8 -> 8`, and `9 -> 6`; any other digit breaks the property.

Given a numeric string `num`, check that every character has a valid rotation and that the rotated characters mirror the original positions. Leading zeros are allowed.

Return `true` when `num` is strobogrammatic, otherwise return `false`.

**Example 1:**
```
Input: num = "69"
Output: true
Explanation: Rotating gives "69" back.
```

**Example 2:**
```
Input: num = "88"
Output: true
Explanation: Each 8 rotates to itself, mirrored correctly.
```

**Example 3:**
```
Input: num = "962"
Output: false
Explanation: The digit 2 has no valid rotation.
```

**Constraints:**
- `1 <= num.length <= 50`
- `num` holds digits only.
