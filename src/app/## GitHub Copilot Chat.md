## GitHub Copilot Chat

- Extension Version: 0.27.2 (prod)
- VS Code: vscode/1.100.2
- OS: Windows

## Network

User Settings:
```json
  "github.copilot.advanced.debug.useElectronFetcher": true,
  "github.copilot.advanced.debug.useNodeFetcher": false,
  "github.copilot.advanced.debug.useNodeFetchFetcher": true
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 20.207.73.85 (84 ms)
- DNS ipv6 Lookup: Error (3 ms): getaddrinfo ENOTFOUND api.github.com
- Proxy URL: None (7 ms)
- Electron fetch (configured): timed out after 10 seconds
- Node.js https: HTTP 200 (987 ms)
- Node.js fetch: HTTP 200 (1785 ms)
- Helix fetch: timed out after 10 seconds

Connecting to https://api.individual.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.114.22 (67 ms)
- DNS ipv6 Lookup: Error (2 ms): getaddrinfo ENOTFOUND api.individual.githubcopilot.com
- Proxy URL: None (2 ms)
- Electron fetch (configured): timed out after 10 seconds
- Node.js https: timed out after 10 seconds
- Node.js fetch: timed out after 10 seconds
- Helix fetch: HTTP 200 (1640 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).