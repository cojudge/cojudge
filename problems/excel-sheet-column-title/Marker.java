import java.util.*;
class Marker {
    public String convertToTitle(int columnNumber) {
        StringBuilder sb = new StringBuilder();
        while (columnNumber > 0) {
            columnNumber--;
            sb.append((char) ('A' + columnNumber % 26));
            columnNumber /= 26;
        }
        return sb.reverse().toString();
    }
    public boolean isCorrect(int columnNumber, String output) {
        return output != null && convertToTitle(columnNumber).equals(output);
    }
}