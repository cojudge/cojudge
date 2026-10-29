Given two strings, you may delete any characters from either string. Each deleted letter costs its ASCII code. After deletions the two results must read identically, and you want the smallest possible total price.

Keeping a shared subsequence for free while paying for everything else is the goal. For instance, turning `sea` into `eat` keeps `ea` and pays for one `s` plus one `t`.

Return the minimum deletion cost.

**Constraints:**
- `1 <= s1.length, s2.length <= 1000`
- Both strings contain lowercase English letters.
