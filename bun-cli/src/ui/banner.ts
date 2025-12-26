/**
 * Banner UI component.
 */

import pc from "picocolors";

export function printBanner(): void {
  console.log();
  console.log(
    pc.cyan("╔══════════════════════════════════════════════════════════╗"),
  );
  console.log(
    pc.cyan("║") +
      pc.bold(
        pc.white("           📝 CONVEX NOTES MANAGER                      "),
      ) +
      pc.cyan("║"),
  );
  console.log(
    pc.cyan("║") +
      pc.dim("         Self-Hosted • Bun Client • v0.1.0             ") +
      pc.cyan("║"),
  );
  console.log(
    pc.cyan("╚══════════════════════════════════════════════════════════╝"),
  );
  console.log();
}
