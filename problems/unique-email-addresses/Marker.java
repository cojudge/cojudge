import java.util.*;
class Marker {
    public int numUniqueEmails(String[] emails) {
        Set<String> seen = new HashSet<>();
        for (String e : emails) {
            int at = e.indexOf('@');
            String local = e.substring(0, at);
            String domain = e.substring(at);
            int plus = local.indexOf('+');
            if (plus >= 0) local = local.substring(0, plus);
            local = local.replace(".", "");
            seen.add(local + domain);
        }
        return seen.size();
    }
    public boolean isCorrect(String[] emails, int output) {
        return numUniqueEmails(emails) == output;
    }
}
