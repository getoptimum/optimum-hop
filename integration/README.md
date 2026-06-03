# Optimum Gateway Integration

Local development and testing setup for the Optimum Gateway with Ethereum EL/CL clients and monitoring.

## Prerequisites

* Docker and Docker Compose installed
* Ports available: gateway `33211`, `33212`, `48123`; monitoring `9090`, `3000` (lite/full); CL-specific ports below

## Setup

```bash
cd ethereum
make init
```

This will:

* Create data directories
* Generate a `jwt.hex` for EL ↔ CL authentication
* Start the Optimum Gateway and fetch its peer info
* Write `GATEWAY_PEER`, `ADDR`, and `PEER_ID` to `.env`

`GATEWAY_PEER` is used by CL clients (Prysm `--peer`, Teku/Lighthouse/Nimbus direct peer flags).

## Running the Stack

### With Makefile

| Command | Description |
|---------|-------------|
| `make init` | Initialize project, generate jwt, discover `GATEWAY_PEER` |
| `make run` | Geth + Prysm + monitoring |
| `make run_prysm` | Nethermind + Prysm + monitoring |
| `make run_teku` | Nethermind + Teku + monitoring |
| `make run_lighthouse` | Nethermind + Lighthouse + monitoring |
| `make run_nimbus` | Nethermind + Nimbus + monitoring |
| `make lite` | Gateway + monitoring only (no EL/CL) |
| `make stop` | Stop all services |
| `make reset` | Wipe data dirs and re-init |
| `make clean` | Stop services and remove local data |

If port `9090` is already in use, run without the monitoring profile:

```bash
docker compose --profile nethermind --profile nimbus up -d
```

### With Docker Compose

| Stack | Command |
|-------|---------|
| Geth + Prysm | `docker compose --profile full --profile geth --profile prysm up -d` |
| Nethermind + Prysm | `docker compose --profile full --profile nethermind --profile prysm up -d` |
| Nethermind + Teku | `docker compose --profile full --profile nethermind --profile teku up -d` |
| Nethermind + Lighthouse | `docker compose --profile full --profile nethermind --profile lighthouse up -d` |
| Nethermind + Nimbus | `docker compose --profile full --profile nethermind --profile nimbus up -d` |
| Gateway only | `docker compose --profile lite up -d` |

## CL client notes

| Client | Gateway connection | Local REST (host) |
|--------|-------------------|-------------------|
| Prysm | `--peer=${GATEWAY_PEER}` | `http://localhost:3500` |
| Teku | `--p2p-direct-peers=${GATEWAY_PEER}` | `http://localhost:3500` |
| Lighthouse | `--trusted-peers=${PEER_ID}` + `--boot-nodes=${ADDR}` | `http://localhost:5052` |
| Nimbus | `--direct-peer=${GATEWAY_PEER}` | `http://localhost:13500` (maps container `3500`) |

Nimbus P2P is published on host ports `19000` (tcp/udp) to avoid clashes with other CL stacks.

Optional: add Nimbus to gateway `config/app_conf.yml` after it is running:

```yaml
direct_cl_peers:
  - /ip4/172.29.0.2/tcp/19000/p2p/<NIMBUS_PEER_ID>
```

Get `<NIMBUS_PEER_ID>` from:

```bash
curl -s http://localhost:13500/eth/v1/node/identity | jq -r '.data.peer_id'
```

Use the Docker network address from `p2p_addresses` (not `127.0.0.1`), then restart the gateway.

## Configuration

Gateway config: `ethereum/config/app_conf.yml` (created from `config/sample.app_conf.yml` on first `make init`).

Image versions and `GATEWAY_PEER` live in `ethereum/.env` (from `.env.example`).

## Monitoring

| Service | URL |
|---------|-----|
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 (admin/admin) |
| Gateway API | http://localhost:48123 |

## Verify

```bash
# Gateway health and peers
curl -s http://localhost:48123/health | jq '{status, checks: .checks.cl_peers}'
curl -s http://localhost:48123/api/v1/self_info | jq '{peer_id, libp2p: .libp2p.total_peers}'

# Nimbus sees gateway (after make run_nimbus)
curl -s http://localhost:13500/eth/v1/node/peers/$(grep PEER_ID .env | cut -d= -f2) | jq '.data | {state, agent}'
```

When CL is connected: gateway `checks.cl_peers` ≥ 1 and Nimbus peer `state` is `connected` (brief `disconnected` can occur during churn).

## Structure

```text
integration/
├── README.md
├── ethereum/
│   ├── docker-compose.yml
│   ├── Makefile
│   ├── config/
│   │   └── sample.app_conf.yml
│   ├── .env.example
│   └── prysm.sh
└── grafana/
    ├── prometheus/
    ├── grafana-provisioning/
    └── grafana-dashboards/
```

## Important Notes

* Only one EL profile at a time (`geth` or `nethermind`)
* Only one CL profile at a time (`prysm`, `teku`, `lighthouse`, or `nimbus`)
* `GATEWAY_PEER`, `ADDR`, and `PEER_ID` are set by `make init`
* Sync issues: `make reset`

## Troubleshooting

```bash
docker logs optimum-gateway
docker logs nimbus
make stop && docker compose --profile nethermind --profile nimbus up -d   # skip monitoring if 9090 busy
```

Nimbus startup can take several minutes (genesis/checkpoint). Gateway bootstrap errors to remote mump2p nodes during local dev are expected if outbound mesh is unreachable.
