You are given a string holding only `'+'` and `'-'` characters. A single move picks an
occurrence of `"++"` and flips both characters to `"--"`. Return every distinct board that
can be reached with exactly one move. The order of the returned boards does not matter.

**Example 1:**
```
Input: currentState = "++++"
Output: ["--++","+--+","++--"]
Explanation: The three adjacent pairs each flip once.
```

**Example 2:**
```
Input: currentState = "--++"
Output: ["----"]
Explanation: Only the trailing pair can flip.
```

**Example 3:**
```
Input: currentState = "-+-"
Output: []
Explanation: There is no "++" to flip.
```

**Constraints:**
- `1 <= currentState.length <= 100`
- `currentState` contains only `'+'` and `'-'`.
