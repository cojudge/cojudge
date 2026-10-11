Parse a nested-list string and hand back its canonical spelling.

You receive a string `s` that encodes either a single integer (for example `"324"`) or a nested list of integers and lists (for example `"[123,[456,[789]]]"`). It uses only digits, `-`, `,`, `[`, and `]`, and it is guaranteed to be a valid encoding with values in `[-10^6, 10^6]`. Implement `deserialize(s)`, which parses this structure and returns its normalized serialization: the same canonical text with no extra spacing, integers in plain decimal form, and lists wrapped in matched brackets separated by single commas.

*Portable adaptation:* the classic version returns a `NestedInteger` object graph, which this judge cannot express; returning the canonical string captures the same parsing work and is compared structurally, so harmless spelling differences that parse to the same shape are still accepted.

**Example 1:**
```
Input: s = "324"
Output: "324"
Explanation: A lone integer normalizes to itself.
```

**Example 2:**
```
Input: s = "[123,[456,[789]]]"
Output: "[123,[456,[789]]]"
Explanation: The nested shape re-serializes unchanged.
```

**Example 3:**
```
Input: s = "[123,456,[789,[]]]"
Output: "[123,456,[789,[]]]"
Explanation: Empty lists and multiple entries survive the round trip.
```

**Constraints:**
- `1 <= s.length <= 5 * 10^4`
- `s` holds only digits, `-`, `,`, `[`, `]`.
- `s` is a valid nested-list serialization.
- Every integer lies in `[-10^6, 10^6]`.
