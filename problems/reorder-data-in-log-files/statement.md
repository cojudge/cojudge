Each log is a string starting with an identifier, followed by either words (a letter-log) or numbers (a digit-log). Reorder all logs so that letter-logs come first, sorted by their content and then by identifier when contents tie, while digit-logs keep their original relative order at the end.

Return the reordered logs as a list. The judge stores string arrays as native lists and expects a string list back.

**Example 1:**
```
Input: logs = ["dig1 8 1 5 1","let1 art can","dig2 3 6","let2 own kit dig","let3 art zero"]
Output: ["let1 art can","let3 art zero","let2 own kit dig","dig1 8 1 5 1","dig2 3 6"]
Explanation: Letter-logs sort by content ("art can" < "art zero" < "own kit dig"); digits stay behind in order.
```

**Example 2:**
```
Input: logs = ["a1 9 2 3 1","g1 act car","zo4 4 7","ab1 off key dog","a8 act zoo"]
Output: ["g1 act car","a8 act zoo","ab1 off key dog","a1 9 2 3 1","zo4 4 7"]
```

**Example 3:**
```
Input: logs = ["t1 1 2","t2 3 4"]
Output: ["t1 1 2","t2 3 4"]
Explanation: With only digits, the order is unchanged.
```

**Constraints:**
- `1 <= logs.length <= 100`
- Each log has an identifier plus at least one word or number, separated by single spaces.

Adaptation: input logs use `string_array` while the ordered result uses `string_list`.
