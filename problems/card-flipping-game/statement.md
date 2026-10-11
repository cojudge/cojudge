There are cards with a number on the front and a (possibly different) number on the back. In one move you may flip any card over. After any sequence of flips, look at the upward faces: a value is called good when no upward face equals that value on a downward face of the same card — equivalently, the value never sits on a card whose two sides are both that value after hiding? The working rule is simpler: any value that occupies both sides of at least one card is permanently disqualified, because that card always shows it on one side.

Find the smallest good value among all numbers appearing on either side. Return 0 when every value is disqualified.

Adaptation note: this task uses portable `int_array` inputs and an `int` output.

**Example 1:**
```
Input: fronts = [1,2,4,4,7], backs = [1,3,4,1,3]
Output: 2
Explanation: 1 is double on card 0 and 4 is double on card 2, so both are out; 2 is the smallest survivor.
```

**Example 2:**
```
Input: fronts = [1], backs = [1]
Output: 0
Explanation: The sole value is double-sided, leaving nothing.
```

**Example 3:**
```
Input: fronts = [2,3], backs = [4,5]
Output: 2
Explanation: No card repeats a value, so the global minimum 2 wins.
```

**Constraints:**
- `1 <= fronts.length == backs.length <= 1000`
- `1 <= fronts[i], backs[i] <= 2000`
