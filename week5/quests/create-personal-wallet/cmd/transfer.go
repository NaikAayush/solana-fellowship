/*
Copyright © 2022 NAME HERE <EMAIL ADDRESS>

*/
package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

// transferCmd represents the transfer command
var transferCmd = &cobra.Command{
	Use:   "createWallet",
	Short: "Creates a new wallet",
	Long:  "Transfer SOL from your wallet to other Solana wallets.",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("transfer called")
	},
}

func init() {
	rootCmd.AddCommand(transferCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// transferCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// transferCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
