You are given a license plate string `licensePlate` and a list of lowercase candidate words `words`. Exactly one answer is guaranteed to exist.

Collect every letter appearing in the plate while skipping digits, spaces, and punctuation, treating upper and lower case as the same. A candidate is acceptable when it holds each required letter at least as many times as the plate does.

Return the shortest acceptable candidate. If several share the minimal length, return the one appearing earliest in `words`.

**Example 1:**
```
Input: licensePlate = "1s3 PSt", words = ["step","steps","stripe","stepple"]
Output: "steps"
Explanation: The plate needs two copies of "s" plus "p" and "t". "steps" is the shortest word covering all four, beating "stripe" and "stepple".
```

**Example 2:**
```
Input: licensePlate = "1s3 456", words = ["looks","pest","stew","show"]
Output: "pest"
Explanation: Only the letter "s" is required. "pest", "stew" and "show" tie at length 4, and "pest" comes first.
```

**Example 3:**
```
Input: licensePlate = "aBc 12c", words = ["abccdef","caaacab","cbca"]
Output: "cbca"
Explanation: The plate needs "a" once, "b" once and "c" twice. All three candidates qualify, but "cbca" has length 4 and is shortest.
```

**Constraints:**
- `1 <= licensePlate.length <= 7`
- `licensePlate` holds digits, letters, or spaces.
- `1 <= words.length <= 1000`
- `1 <= words[i].length <= 15`
- `words[i]` holds lowercase English letters.
