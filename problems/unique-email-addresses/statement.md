Each email address has the form `local@domain`. The domain part is used exactly as written. The local part follows two rules: dots `'.'` are skipped entirely, and anything after the first `'+'` is discarded.

Two addresses that normalize to the same string count as one. Given a list `emails`, return how many distinct normalized addresses appear.

**Example 1:**
```
Input: emails = ["test.email+alex@leetcode.com","test.e.mail+bob.cathy@leetcode.com","testemail+david@lee.tcode.com"]
Output: 2
Explanation: The first two both become "testemail@leetcode.com".
```

**Example 2:**
```
Input: emails = ["a@leetcode.com","b@leetcode.com","c@leetcode.com"]
Output: 3
```

**Example 3:**
```
Input: emails = ["test.email+alex@leetcode.com","test.email.leet+alex@code.com"]
Output: 2
Explanation: Different domains keep them distinct.
```

**Constraints:**
- `1 <= emails.length <= 100`
- Each address contains exactly one `'@'`, lowercase letters, `'.'`, `'+'`, and digits in the local part.
