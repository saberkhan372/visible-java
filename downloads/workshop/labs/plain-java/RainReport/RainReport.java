// Visible lab 3, Java transfer: the same file with Scanner and no bars.
// Run this from the RainReport folder so Java can find rainfall.txt.
// Predict every line before you run it.

import java.io.File;
import java.io.IOException;
import java.util.Scanner;

public class RainReport {

  public static void main(String[] args) throws IOException {
    Scanner input = new Scanner(new File("rainfall.txt"));
    double total = 0;
    String wettest = "";
    double most = -1;

    while (input.hasNext()) {
      String[] parts = input.nextLine().split(",");
      double inches = Double.parseDouble(parts[1]);
      total = total + inches;
      if (inches > most) {
        most = inches;
        wettest = parts[0];
      }
    }
    input.close();

    System.out.println("total: " + total);
    System.out.println("wettest: " + wettest);
  }
}
