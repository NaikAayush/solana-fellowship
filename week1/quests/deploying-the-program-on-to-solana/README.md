# Install Solana CLI

Reference - https://docs.solana.com/cli/install-solana-cli-tools
`sh -c "$(curl -sSfL https://release.solana.com/v1.9.5/install)"`
`solana -V`
`sudo nano ~/.zshrc`
`export PATH="/Users/<username>/.local/share/solana/install/active_release/bin:$$`

# Run Local Node

solana-test-validator

# Create Account

`solana-keygen new`
publickey - GvRudibnYQuHUJkrSDiqMtiGPL8sxscYJ9ob9AbP7z83
keypair - <Redacted>
seedphrase - <Redacted>
check bal - `solana balance`
connect solana to local cluster - `solana config set --url http://127.0.0.1:8899`
be rich - solana airdrop 10

# Compile

`cargo build-bpf --manifest-path=./Cargo.toml`

If you get the below error

```
BPF SDK: /usr/bin/solana-release/bin/sdk/bpf
Running: rustup toolchain list -v
Running: cargo +bpf build --target bpfel-unknown-unknown --release
error: no such subcommand: +bpf

Did you mean `b`?
```

Install rust from - `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` and rebuild.

# Deploy

`solana program deploy target/deploy/crowdsource.so`
Program Id: 9YGc7GEZbQXDXMKjiRbSGP53gN8ReaoZnooR2BbLxikt
