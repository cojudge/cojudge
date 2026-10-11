The count-and-say sequence builds each term by reading aloud the previous one: start with `"1"`, and obtain every later term by replacing each maximal run of equal digits with the run's length followed by the digit itself. For instance, `"3322251"` is read as two `3`s, three `2`s, one `5`, and one `1`, giving `"23321511"`.

Formally, `countAndSay(1) = "1"`, and `countAndSay(n)` is the run-length encoding of `countAndSay(n - 1)`.

Given `n`, return the nth term.

**Example 1:**
```
Input: n = 4
Output: "1211"
Explanation: "1" -> "11" -> "21" -> "1211".
```

**Example 2:**
```
Input: n = 1
Output: "1"
Explanation: The sequence starts with "1".
```

**Example 3:**
```
Input: n = 5
Output: "111221"
Explanation: Reading "1211" aloud gives one 1, one 2, then two 1s.
```

**Constraints:**
- `1 <= n <= 30`
