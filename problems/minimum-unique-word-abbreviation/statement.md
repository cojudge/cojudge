An abbreviation of a word keeps some letters and replaces consecutive skipped blocks with their counts: `a4` means `a` followed by four hidden letters, and `1p3` means one hidden letter, then `p`, then three hidden letters. Numbers never have leading zeros. Such a shorthand matches a word of the same length when its kept letters equal the word's letters at those spots.

Given a `target` word and a `dictionary` list, find the shortest abbreviation of `target` that matches none of the dictionary words having the same length. Words of different lengths can never collide and are ignored. When several shorthands tie for shortest, any one of them is acceptable, but the judge used here expects the length to be minimal and the shorthand to be valid and unique.

Return that shortest unique shorthand.

**Example 1:**
```
Input: target = "apple", dictionary = ["blade"]
Output: "a4"
Explanation: a4 abbreviates apple as a plus four skips. Blade begins with b, so a4 cannot match it, and no length-1 shorthand works.
```

**Example 2:**
```
Input: target = "apple", dictionary = ["plain","amber","blade"]
Output: "1p3"
Explanation: Among shorthands of apple missed by all three rivals, 1p3 (length 3) is minimal.
```

**Example 3:**
```
Input: target = "a", dictionary = []
Output: "1"
Explanation: Without rivals the single letter compresses to 1.
```

**Constraints:**
- `1 <= target.length <= 21`
- `0 <= dictionary.length <= 100`
- Words hold lowercase letters; only same-length entries matter.
- At least one valid abbreviation always exists.

**Adaptation note:** Grading accepts any valid unique abbreviation whose length equals the true minimum.
