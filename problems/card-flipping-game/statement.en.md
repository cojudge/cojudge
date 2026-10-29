There are cards with a number on the front and a (possibly different) number on the back. In one move you may flip any card over. After any sequence of flips, look at the upward faces: a value is called good when no upward face equals that value on a downward face of the same card — equivalently, the value never sits on a card whose two sides are both that value after hiding? The working rule is simpler: any value that occupies both sides of at least one card is permanently disqualified, because that card always shows it on one side.

Find the smallest good value among all numbers appearing on either side. Return 0 when every value is disqualified.

Adaptation note: this task uses portable `int_array` inputs and an `int` output.

**Constraints:**
- `1 <= fronts.length == backs.length <= 1000`
- `1 <= fronts[i], backs[i] <= 2000`
