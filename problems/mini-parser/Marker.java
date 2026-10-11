import java.util.*;
class Marker {
    static class Node {
        boolean isInt;
        int val;
        List<Node> list = new ArrayList<>();
    }
    private int pos;
    private String str;
    private Node parse() {
        if (str.charAt(pos) == '[') {
            pos++;
            Node n = new Node();
            n.isInt = false;
            while (str.charAt(pos) != ']') {
                n.list.add(parse());
                if (str.charAt(pos) == ',') pos++;
            }
            pos++;
            return n;
        } else {
            int start = pos;
            if (str.charAt(pos) == '-') pos++;
            while (pos < str.length() && Character.isDigit(str.charAt(pos))) pos++;
            Node n = new Node();
            n.isInt = true;
            n.val = Integer.parseInt(str.substring(start, pos));
            return n;
        }
    }
    private Node parseString(String s) {
        pos = 0; str = s;
        return parse();
    }
    private String serialize(Node n) {
        if (n.isInt) return String.valueOf(n.val);
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < n.list.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(serialize(n.list.get(i)));
        }
        sb.append("]");
        return sb.toString();
    }
    public String deserialize(String s) {
        return serialize(parseString(s));
    }
    public boolean isCorrect(String s, String output) {
        if (output == null) return false;
        try {
            String exp = deserialize(s);
            String got = serialize(parseString(output));
            // compare canonical re-serializations; also require output parses fully
            Node check;
            pos = 0; str = output;
            check = parse();
            if (pos != output.length()) return false;
            return exp.equals(got);
        } catch (Exception e) {
            return false;
        }
    }
}
