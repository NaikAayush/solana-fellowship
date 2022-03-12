/*
Copyright © 2022 NAME HERE <EMAIL ADDRESS>

*/
package cmd

import (
	"fmt"
	"strconv"

	"github.com/spf13/cobra"
)

// transferCmd represents the transfer command
var transferCmd = &cobra.Command{
	Use:   "transfer",
	Short: "Transfer SOL",
	Long:  "Transfer SOL from your wallet to other Solana wallets.",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Recepient address: " + args[0])
		fmt.Println("Amount to be sent: " + args[1])
		amount, _ := strconv.ParseUint(args[1], 10, 64)
		txhash, _ := Transfer(args[0], amount)
		fmt.Println("Transaction complete.\nTransaction hash: " + txhash)
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
