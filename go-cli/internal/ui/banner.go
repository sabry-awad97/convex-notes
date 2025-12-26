// Package ui provides terminal UI components.
package ui

import (
	"fmt"

	"github.com/fatih/color"
)

// PrintBanner displays the application banner.
func PrintBanner() {
	cyan := color.New(color.FgCyan)
	white := color.New(color.FgWhite, color.Bold)
	dim := color.New(color.Faint)

	fmt.Println()
	cyan.Println("╔══════════════════════════════════════════════════════════╗")
	cyan.Print("║")
	white.Print("           📝 CONVEX NOTES MANAGER                        ")
	cyan.Println("║")
	cyan.Print("║")
	dim.Print("         Self-Hosted • Go Client • v0.1.0               ")
	cyan.Println("║")
	cyan.Println("╚══════════════════════════════════════════════════════════╝")
	fmt.Println()
}
