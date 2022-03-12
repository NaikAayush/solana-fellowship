/*
Copyright © 2022 NAME HERE <EMAIL ADDRESS>

*/
package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

// requestAirdropCmd represents the requestAirdrop command
var requestAirdropCmd = &cobra.Command{
	Use:   "requestAirdrop",
	Short: "Request airdrop in Solana",
	Long:  "Request airdrop to your public address.",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("requestAirdrop called")
	},
}

func init() {
	rootCmd.AddCommand(requestAirdropCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// requestAirdropCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// requestAirdropCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
