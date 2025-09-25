# HOP: Ethereum Integration

HOP provides ready-to-use Docker Compose stacks for Ethereum with pre-configured EL/CL clients, Optimum Gateway, and monitoring.

## What is HOP?

HOP is a **Docker Compose framework** and **test suite** for quickly experimenting with **mumP2P across different networks and use cases**.

It provides ready-to-use bundles that remove setup overhead and let teams focus on testing, measuring, and visualizing performance.

### HOP Variants

* **HOP Lite**: Gateway + Prometheus + Grafana (for validators with existing infrastructure)
* **HOP Full**: EL/CL + Gateway + Prometheus + Grafana (for complete testing environment)

## Setup

```bash
make init
```

This will:

* Create data directories
* Generate a jwt.hex for EL ↔ CL authentication
* Start the Optimum Gateway and fetch its peer info
* Write to .env:

**Output:**

```bash
Initializing hop-hoodi-testnet...
mkdir -p /Users/swarnabhasinha/optimum-hop/integration/ethereum/hop-hoodi/ethereum
mkdir -p /Users/swarnabhasinha/optimum-hop/integration/ethereum/hop-hoodi/geth-data
mkdir -p /Users/swarnabhasinha/optimum-hop/integration/ethereum/hop-hoodi/prysm-data
Create jwt secret
Latest Prysm version is v6.0.4.
Beacon chain is up to date.
Verifying binary integrity.
beacon-chain-v6.0.4-darwin-arm64: OK
gpg: Signature made Fri Jun  6 06:44:46 2025 IST
gpg:                using RSA key 0AE0051D647BA3C1A917AF4072E33E4DF1A5036E
Verified /Users/swarnabhasinha/optimum-hop/integration/ethereum/./dist/beacon-chain-v6.0.4-darwin-arm64 has been signed by Prysmatic Labs.
Starting Prysm beacon-chain generate-auth-secret
gpg: Good signature from "Preston Van Loon <preston@pvl.dev>" [unknown]
gpg:                 aka "Preston Van Loon <preston@prysmaticlabs.com>" [unknown]
gpg:                 aka "Preston Van Loon <preston90@gmail.com>" [unknown]
gpg:                 aka "Preston Van Loon (0xf71E9C766Cdf169eDFbE2749490943C1DC6b8A55) <preston@machinepowered.com>" [unknown]
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: 0AE0 051D 647B A3C1 A917  AF40 72E3 3E4D F1A5 036E
time="2025-09-25 14:19:33" level=info msg="Successfully wrote JSON-RPC authentication secret to file /Users/swarnabhasinha/optimum-hop/integration/ethereum/jwt.hex"
Starting gateway container to fetch peer info...
 Container optimum-gateway  Running
Waiting for gateway API...
Discovered GATEWAY_PEER=/ip4/172.29.0.16/tcp/33212/p2p/16Uiu2HAkwbdyUeuFGCXFgbNGLrbNeLBEt4jHwWZg7VVrTvaXtVWp
sed -i.bak '/^ADDR=/d' ".env"
sed -i.bak '/^PEER_ID=/d' ".env"
rm -f ".env.bak"
echo "GATEWAY_PEER=${GATEWAY_PEER}" >> .env; \
	echo "ADDR=${ADDR}" >> .env; \
	echo "PEER_ID=${PEER_ID}" >> .env; \
	echo "Updated .env with gateway peer"
Updated .env with gateway peer
```

**NOTE**: You may need to manually set the peer info if the automatic discovery doesn't work:

```bash
# Get gateway peer info
curl -s http://localhost:48123/api/v1/self_info | jq .

# Manually add to .env if needed
echo "GATEWAY_PEER=/ip4/172.29.0.16/tcp/33212/p2p/16Uiu2HAkwbdyUeuFGCXFgbNGLrbNeLBEt4jHwWZg7VVrTvaXtVWp" >> .env
echo "ADDR=/ip4/172.29.0.16/tcp/33212" >> .env
echo "PEER_ID=16Uiu2HAkwbdyUeuFGCXFgbNGLrbNeLBEt4jHwWZg7VVrTvaXtVWp" >> .env
```

## Running the Stack

You can run the stack directly with Docker Compose or via Makefile commands.

### HOP Lite (for validators)

**Use this if you're a validator with existing EL/CL infrastructure and just want to add Optimum Gateway.**

```bash
make lite
```

**Output:**

```bash
Running hop-hoodi-testnet (lite mode: Gateway + Metrics only)...
docker compose --profile lite up --build -d
 Container optimum-gateway  Running
 Container ethereum-prometheus-1  Running
 Container ethereum-grafana-1  Running
```

**Verify it's working:**

```bash
# Check service status
docker compose ps
```

**Expected output:**

```bash
NAME                    IMAGE                           COMMAND                  SERVICE           CREATED          STATUS                            PORTS
ethereum-grafana-1      grafana/grafana:latest          "/run.sh"                grafana           10 seconds ago   Up 6 seconds (health: starting)   0.0.0.0:3000->3000/tcp
ethereum-prometheus-1   prom/prometheus:latest          "/bin/prometheus --c…"   prometheus        10 seconds ago   Up 7 seconds (health: starting)   0.0.0.0:9090->9090/tcp
optimum-gateway         getoptimum/gateway:v0.0.1-rc4   "/optimum-gateway -c…"   optimum-gateway   10 seconds ago   Up 7 seconds                      0.0.0.0:33212-33213->33212-33213/tcp, 0.0.0.0:48123->48123/tcp
```

**Test Gateway API:**

```bash
curl -s http://localhost:48123/api/v1/self_info | jq .
```

**Expected output:**

```json
{
  "multiaddrs": [
    "/ip4/172.29.0.16/tcp/33212"
  ],
  "peer_id": "16Uiu2HAkwbdyUeuFGCXFgbNGLrbNeLBEt4jHwWZg7VVrTvaXtVWp"
}
```

### HOP Full (for builders/testers)

**Use this if you want a complete testing environment with EL/CL + Gateway + Monitoring.**

#### Run Geth + Prysm + Monitoring

```bash
make run
```

**Output:**

```bash
Running hop-hoodi-testnet (Geth + Prysm + Monitoring)...
docker compose --profile full --profile geth --profile prysm up --build -d
 Container ethereum-prometheus-1  Creating
 Container geth  Creating
 Container prysm-beacon  Creating
 Container optimum-gateway  Creating
 Container geth  Created
 Container optimum-gateway  Created
 Container ethereum-prometheus-1  Created
 Container ethereum-grafana-1  Creating
 Container prysm-beacon  Created
 Container ethereum-grafana-1  Created
 Container optimum-gateway  Started
 Container ethereum-prometheus-1  Started
 Container prysm-beacon  Started
 Container geth  Started
 Container ethereum-grafana-1  Started
```

**Service Status:**

```bash
NAME                    IMAGE                                            COMMAND                  SERVICE           CREATED          STATUS                             PORTS
ethereum-grafana-1      grafana/grafana:latest                           "/run.sh"                grafana           57 seconds ago   Up 49 seconds (healthy)            0.0.0.0:3000->3000/tcp
ethereum-prometheus-1   prom/prometheus:latest                           "/bin/prometheus --c…"   prometheus        57 seconds ago   Up 50 seconds (health: starting)   0.0.0.0:9090->9090/tcp
geth                    ethereum/client-go:stable                        "geth --hoodi --http…"   geth              57 seconds ago   Up 50 seconds                      0.0.0.0:8545->8545/tcp, 0.0.0.0:8551->8551/tcp, 0.0.0.0:30303->30303/tcp, 8546/tcp, 0.0.0.0:30303->30303/udp
optimum-gateway         getoptimum/gateway:v0.0.1-rc4                    "/optimum-gateway -c…"   optimum-gateway   57 seconds ago   Up 28 seconds                      0.0.0.0:33212-33213->33212-33213/tcp, 0.0.0.0:48123->48123/tcp
prysm-beacon            gcr.io/prysmaticlabs/prysm/beacon-chain:stable   "/beacon-chain --exe…"   prysm-beacon      57 seconds ago   Up 50 seconds (health: starting)   0.0.0.0:3500->3500/tcp, 0.0.0.0:4000->4000/tcp, 0.0.0.0:12000->12000/tcp, 0.0.0.0:13000->13000/tcp, 0.0.0.0:12000->12000/udp
```

**What's Happening:**

* **Geth**: Running and syncing blockchain data
* **Prysm**: Starting beacon chain sync
* **Gateway**: Working perfectly, API responding
* **Grafana**: Healthy and accessible
* **Prometheus**: Starting up

**Logs to Check:**

```bash
# Geth logs - shows sync progress
docker logs geth --tail 10

# Prysm logs - shows beacon chain sync
docker logs prysm-beacon --tail 10
```

#### Run Nethermind + Teku + Monitoring

```bash
make run_teku
```

**Output:**

```bash
Running hop-hoodi-testnet (Nethermind + Teku + Monitoring)...
docker compose --profile full --profile nethermind --profile teku up --build -d
 Container optimum-gateway  Creating
 Container nethermind  Creating
 Container ethereum-prometheus-1  Creating
 Container teku-beacon  Creating
 Container optimum-gateway  Created
 Container ethereum-prometheus-1  Created
 Container ethereum-grafana-1  Creating
 Container nethermind  Created
 Container teku-beacon  Created
 Container ethereum-grafana-1  Created
 Container ethereum-prometheus-1  Started
 Container optimum-gateway  Started
 Container teku-beacon  Started
 Container nethermind  Started
 Container ethereum-grafana-1  Started
```

**Service Status:**

```bash
NAME                    IMAGE                           COMMAND                  SERVICE           CREATED          STATUS                             PORTS
ethereum-grafana-1      grafana/grafana:latest          "/run.sh"                grafana           31 seconds ago   Up 26 seconds (health: starting)   0.0.0.0:3000->3000/tcp
ethereum-prometheus-1   prom/prometheus:latest          "/bin/prometheus --c…"   prometheus        31 seconds ago   Up 26 seconds (health: starting)   0.0.0.0:9090->9090/tcp
nethermind              nethermind/nethermind:1.33.0    "./nethermind --conf…"   nethermind        31 seconds ago   Up 26 seconds                      0.0.0.0:8545->8545/tcp, 0.0.0.0:8551->8551/tcp, 0.0.0.0:30303->30303/tcp, 0.0.0.0:30303->30303/udp
optimum-gateway         getoptimum/gateway:v0.0.1-rc4   "/optimum-gateway -c…"   optimum-gateway   31 seconds ago   Up 26 seconds                      0.0.0.0:33212-33213->33212-33213/tcp, 0.0.0.0:48123->48123/tcp
teku-beacon             consensys/teku:latest           "/opt/teku/bin/teku …"   teku-beacon       31 seconds ago   Up 26 seconds (health: starting)   5051/tcp, 8008/tcp, 9000/tcp, 9000/udp
```

**What's Happening:**

* **Nethermind**: Running and syncing blockchain data (snap sync in progress)
* **Teku**: Connected to Nethermind, syncing beacon chain, waiting for execution layer sync
* **Gateway**: Working perfectly, API responding
* **Grafana**: Starting up
* **Prometheus**: Starting up

**Logs to Check:**

```bash
# Teku logs - shows sync progress and execution client connection
docker logs teku-beacon --tail 10

# Nethermind logs - shows blockchain sync progress
docker logs nethermind --tail 10
```

**API Test:**

```bash
# Test Nethermind RPC
curl -s http://localhost:8545 -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
# Returns: {"jsonrpc":"2.0","result":"0x0","id":1}
```


#### Run Nethermind + Lighthouse + Monitoring

```bash
make run_lighthouse
```

**Output:**

```bash
Running hop-hoodi-testnet (Nethermind + Lighthouse + Monitoring)...
docker compose --profile full --profile nethermind --profile lighthouse up --build -d
 Container ethereum-lighthouse-1  Creating
 Container nethermind  Running
 Container optimum-gateway  Running
 Container ethereum-prometheus-1  Running
 Container ethereum-grafana-1  Running
 Container ethereum-lighthouse-1  Created
 Container ethereum-lighthouse-1  Started
```

#### Run Nethermind + Prysm + Monitoring

```bash
make run_prysm
```

**Output:**

```bash
Running hop-hoodi-testnet (Nethermind + Prysm + Monitoring)...
docker compose --profile full --profile nethermind --profile prysm up --build -d
 Container prysm-beacon  Creating
 Container optimum-gateway  Running
 Container ethereum-prometheus-1  Running
 Container nethermind  Running
 Container ethereum-grafana-1  Running
 Container prysm-beacon  Created
 Container prysm-beacon  Started
```

## Available Commands

```bash
# Show all available commands
make help
```

**Output:**

```bash
clean                         Stop compose services
help                          Show help
init                          Initialize project and set GATEWAY_PEER in .env
lite                          Run without monitoring (Gateway + EL + CL only)
reset                         Reset project for re-init prysm
run                           Run full stack with Geth + Prysm + monitoring
run_lighthouse                Run full stack with Nethermind + Lighthouse + monitoring
run_prysm                     Run full stack with Nethermind + Prysm + monitoring
run_teku                      Run full stack with Nethermind + Teku + monitoring
stop                          Stop compose services
```

### Command Reference

| Command | Description | Use Case |
|---------|-------------|----------|
| `make init` | Initialize project and discover gateway peer | First-time setup |
| `make lite` | Run HOP Lite (Gateway + Metrics) | Validators with existing infrastructure |
| `make run` | Run HOP Full (Geth + Prysm + Monitoring) | Complete testing environment |
| `make run_teku` | Run HOP Full (Nethermind + Teku + Monitoring) | Alternative CL client |
| `make run_lighthouse` | Run HOP Full (Nethermind + Lighthouse + Monitoring) | Alternative CL client |
| `make run_prysm` | Run HOP Full (Nethermind + Prysm + Monitoring) | Alternative EL client |
| `make stop` | Stop all services | Clean shutdown |
| `make reset` | Reset project and re-initialize | Fresh start |

## Monitoring

### Access Dashboards

* **Grafana**: http://localhost:3000 (admin/admin)
* **Prometheus**: http://localhost:9090
* **Gateway API**: http://localhost:48123

### Test Services

**Test Grafana:**

```bash
curl -s http://localhost:3000/api/health | jq .
```

**Expected output:**

```json
{
  "database": "ok",
  "version": "12.1.1",
  "commit": "df5de8219b41d1e639e003bf5f3a85913761d167"
}
```

**Test Prometheus:**

```bash
curl -s http://localhost:9090/-/healthy
```

**Expected output:**

```bash
Prometheus Server is Healthy.
```

**Test Gateway API:**

```bash
curl -s http://localhost:48123/api/v1/self_info | jq .
```

**Expected output:**

```json
{
  "multiaddrs": [
    "/ip4/172.29.0.16/tcp/33212"
  ],
  "peer_id": "16Uiu2HAkwbdyUeuFGCXFgbNGLrbNeLBEt4jHwWZg7VVrTvaXtVWp"
}
```

## Important Notes

* Only one EL profile should be active at a time (geth or nethermind)
* Only one CL profile should be active at a time (prysm, teku, or lighthouse)
* GATEWAY_PEER, ADDR and PEER_ID are populated automatically from the Gateway during `make init`
* If you run into sync issues, try `make reset` to wipe state and re-init

## Data Structure

HOP creates a `hop-hoodi/` directory with persistent data:

```bash
hop-hoodi/
├── ethereum/           # Ethereum configuration
├── geth-data/         # Geth blockchain data (~141MB)
├── jwt.hex            # JWT secret for EL-CL authentication
├── lighthouse-data/   # Lighthouse beacon data (~44KB)
├── prysm-data/        # Prysm beacon data
└── teku-data/         # Teku beacon data (~229MB)
```

**Log files** are available in each client's data directory for troubleshooting:

* Teku: `hop-hoodi/teku-data/logs/teku.log`
* Lighthouse: `hop-hoodi/lighthouse-data/beacon/logs/beacon.log`
* Gateway: `docker logs optimum-gateway`

## Troubleshooting

### Common Issues

#### Port Conflicts

If you get "port is already allocated" errors:

```bash
# Stop all services
make stop

# Clean up Docker
docker system prune -f

# Try again
make run
```

#### Gateway Peer Discovery Issues

If the gateway peer discovery doesn't work automatically:

```bash
# Get the gateway peer info manually
curl -s http://localhost:48123/api/v1/self_info | jq .

# Add to .env manually
echo "GATEWAY_PEER=/ip4/172.29.0.16/tcp/33212/p2p/16Uiu2HAkwbdyUeuFGCXFgbNGLrbNeLBEt4jHwWZg7VVrTvaXtVWp" >> .env
echo "ADDR=/ip4/172.29.0.16/tcp/33212" >> .env
echo "PEER_ID=16Uiu2HAkwbdyUeuFGCXFgbNGLrbNeLBEt4jHwWZg7VVrTvaXtVWp" >> .env
```

#### Service Health Issues

Some services may show as "unhealthy" initially - this is normal during startup. Wait a few minutes and check again:

```bash
# Check service status
docker compose ps

# Check logs for specific service
docker logs optimum-gateway
docker logs geth
docker logs prysm-beacon
```

### Known Issues

#### Geth + Teku

```bash
WARN Beacon client online, but no consensus updates received in a while
ERROR - Execution Client request failed. Make sure the Execution Client is online and can respond to requests.
```

#### Geth + Lighthouse

```bash
ERROR Error during execution engine upcheck
      error: HttpClient(url: http://execution:8551/, kind: request,
      detail: error trying to connect: tcp connect error: Connection refused (os error 111))
```

### Getting Help

If you encounter issues not covered here:

1. Check the service logs: `docker logs <service-name>`
2. Verify all services are running: `docker compose ps`
3. Test individual service endpoints
4. Try `make reset` for a fresh start
5. Contact the Optimum team for support

