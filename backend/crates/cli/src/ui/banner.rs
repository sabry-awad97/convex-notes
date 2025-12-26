//! Application banner.

use colored::Colorize;

/// Print the application banner.
pub fn print() {
    println!();
    println!(
        "{}",
        "╔══════════════════════════════════════════════════════════╗".bright_cyan()
    );
    println!(
        "{}",
        "║                                                          ║".bright_cyan()
    );
    println!(
        "{}{}{}",
        "║".bright_cyan(),
        "           📝 CONVEX NOTES MANAGER                      "
            .bright_white()
            .bold(),
        "║".bright_cyan()
    );
    println!(
        "{}{}{}",
        "║".bright_cyan(),
        "         Self-Hosted • Rust Client • v0.1.0             ".bright_black(),
        "║".bright_cyan()
    );
    println!(
        "{}",
        "║                                                          ║".bright_cyan()
    );
    println!(
        "{}",
        "╚══════════════════════════════════════════════════════════╝".bright_cyan()
    );
    println!();
}
