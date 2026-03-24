# Optimum Gateway Integration

Local development and testing setup for the Optimum Gateway with Ethereum EL/CL clients and monitoring.

## Prerequisites

* Docker and Docker Compose installed
* Ports 33211, 33212, 43213, 48123, 9090, 3000 available

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

## Running the Stack

### With Makefile

| Command | Description |
|---------|-------------|
| `make init` | Initialize project, generate jwt, discover GATEWAY_PEER |
| `make run` | Run Geth + Prysm + Monitoring |
| `make run_teku` | Run Nethermind + Teku + Monitoring |
| `make run_lighthouse` | Run Nethermind + Lighthouse + Monitoring |
| `make run_prysm` | Run Nethermind + Prysm + Monitoring |
| `make lite` | Run Gateway + Metrics only (no EL/CL) |
| `make stop` | Stop all services |
| `make reset` | Wipe all data and re-init |
| `make clean` | Stop services and remove all data + containers |

### With Docker Compose

#### Geth + Prysm + Monitoring

```bash
docker compose --profile full --profile geth --profile prysm up -d
```

#### Nethermind + Teku + Monitoring

```bash
docker compose --profile full --profile nethermind --profile teku up -d
```

#### Nethermind + Lighthouse + Monitoring

```bash
docker compose --profile full --profile nethermind --profile lighthouse up -d
```

#### Gateway + Metrics only (lite mode)

```bash
docker compose --profile lite up -d
```

## Configuration

Gateway config is in `ethereum/config/app_conf.yml` (copied from `sample.app_conf.yml` on first run).

Key settings:

```yaml
gateway_cluster_id: optimum_hoodi_v0_3
gateway_id: local-dockerized
eth_topics_subscribe:
  - beacon_block
```

Currently only `beacon_block` is supported. Attestation subnets will be added in RC12.

## Monitoring

| Service | URL |
|---------|-----|
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 (admin/admin) |
| Gateway API | http://localhost:48123 |

Prometheus scrapes the gateway at `optimum-gateway:48123` (docker network). The Partner Dashboard is auto-provisioned in Grafana.

## Verify

```bash
# Gateway version
curl -s http://localhost:48123/api/v1/version

# Gateway self info (peer ID, multiaddrs)
curl -s http://localhost:48123/api/v1/self_info | jq .

# Metrics
curl -s http://localhost:48123/metrics | grep optp2p_gateway
```

When CL is connected: `cl_peers` ≥ 1, `libp2p_total_messages` increments.

## Structure

```text
integration/
├── ethereum/
│   ├── docker-compose.yml      # Full stack: gateway + EL + CL + monitoring
│   ├── Makefile                # Convenience targets
│   ├── config/
│   │   └── sample.app_conf.yml # Gateway config template
│   ├── .env.example            # Environment variables (versions, peer info)
│   └── prysm.sh               # JWT generation helper
└── grafana/
    ├── prometheus/
    │   ├── prometheus.yml      # Prometheus scrape config
    │   └── targets.json        # Scrape targets (gateway)
    ├── grafana-provisioning/
    │   ├── datasources/
    │   │   └── prometheus.yaml # Auto-provisioned Prometheus datasource
    │   └── dashboards/
    │       └── dashboards.yml  # Dashboard provisioning config
    └── grafana-dashboards/
        └── partner-dashboard.json  # Partner Dashboard (auto-loaded)
```

## Important Notes

* Only one EL profile should be active at a time (geth or nethermind)
* Only one CL profile should be active at a time (prysm, teku, or lighthouse)
* GATEWAY_PEER, ADDR and PEER_ID are populated automatically during `make init`
* If you run into sync issues, try `make reset` to wipe state and re-init

## Troubleshooting

### Gateway Connection Issues

```bash
docker logs optimum-gateway
```

### Port Conflicts

```bash
make stop && docker system prune -f
```

### Services Unhealthy

Normal during startup, wait 2-3 minutes for full synchronization.

### Fresh Start

```bash
make reset
```
