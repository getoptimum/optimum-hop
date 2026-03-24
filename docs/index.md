# HOP: Setup Guide

HOP is a **Docker Compose bundle** for running the **Optimum Gateway** on Hoodi with optional local EL/CL clients and a pre-wired **Prometheus + Grafana** stack. Use it to try the gateway, connect a consensus client, and inspect metrics locally.

**Repository:** [https://github.com/getoptimum/optimum-hop](https://github.com/getoptimum/optimum-hop)

The gateway bridges your **Ethereum consensus layer (CL) client** to the **mump2p** network. **Peer discovery and fork digest** are handled automatically on startup (no separate proxy configuration in `app_conf.yml`).

## Prerequisites

* Docker and Docker Compose
* **curl** and **jq** (used by `make init`)
* Ports **33211**, **33212**, **43213**, **48123**, **9090**, **3000** free on the host

**Hardware (same order of magnitude as the gateway quick start):** minimum about 1 vCPU, 256MB RAM, 200MB disk; more if you run a full EL/CL stack.

## Repository layout

```text
optimum-hop/
├── integration/
│   ├── ethereum/                 # Compose + Makefile (your working directory)
│   │   ├── docker-compose.yml
│   │   ├── Makefile
│   │   ├── .env.example
│   │   ├── config/
│   │   │   └── sample.app_conf.yml
│   │   └── prysm.sh
│   ├── grafana/
│   │   ├── prometheus/           # Scrape config + file_sd targets
│   │   ├── grafana-provisioning/
│   │   └── grafana-dashboards/   # Partner dashboard (JSON)
│   └── README.md
└── docs/
    └── index.md                  # This page
```

## Quick start

```bash
cd integration/ethereum
make init
```

`make init`:

* Creates `hop-hoodi/` data dirs and EL↔CL **jwt.hex**
* Creates `.env` from `.env.example` and `config/app_conf.yml` from `sample.app_conf.yml` if missing
* Starts the gateway and writes **GATEWAY_PEER**, **ADDR**, and **PEER_ID** into `.env` (for CL clients to peer with the gateway on the Docker network)

Then start either **lite** (gateway + monitoring only) or **full** (add Geth/Prysm or another supported pair):

```bash
make lite    # gateway + Prometheus + Grafana (no EL/CL)
make run     # Geth + Prysm + gateway + monitoring
```

## Gateway configuration

Edit `integration/ethereum/config/app_conf.yml` (seeded from `sample.app_conf.yml`). Important fields for **v0.0.1-rc11**:

```yaml
gateway_cluster_id: optimum_hoodi_v0_3
gateway_id: your_unique_gateway_id   # e.g. yourorg-region-hoodi-01

eth_topics_subscribe:
  - beacon_block
```

Only **`beacon_block`** is supported in rc11; attestation subnets are planned for a later release. Identity paths in the bundled sample use `/tmp/libp2p` and `/tmp/mump2p` with matching volume mounts in Compose.

## Makefile commands

| Command | Description |
|---------|-------------|
| `make help` | List targets |
| `make init` | Init dirs, JWT, gateway peer discovery → `.env` |
| `make lite` | Gateway + Prometheus + Grafana |
| `make run` | Geth + Prysm + gateway + monitoring |
| `make run_teku` | Nethermind + Teku + gateway + monitoring |
| `make run_lighthouse` | Nethermind + Lighthouse + gateway + monitoring |
| `make run_prysm` | Nethermind + Prysm + gateway + monitoring |
| `make stop` | `docker compose down` |
| `make reset` | Remove EL/CL data dirs under `hop-hoodi/` and run `init` again |
| `make clean` | Stops stack and aggressively removes local compose data (see `Makefile`) |

## Docker Compose (same profiles as the Makefile)

From `integration/ethereum/`:

```bash
docker compose --profile lite up -d

docker compose --profile full --profile geth --profile prysm up -d
docker compose --profile full --profile nethermind --profile teku up -d
docker compose --profile full --profile nethermind --profile lighthouse up -d
```

Use only **one** EL profile (geth *or* nethermind) and **one** CL profile at a time.

## URLs and checks

| Service | URL |
|---------|-----|
| Grafana | http://localhost:3000 (default `admin` / `admin`) |
| Prometheus | http://localhost:9090 |
| Gateway API / metrics | http://localhost:48123 |

Prometheus scrapes the gateway on the Docker network; Grafana opens with a **partner** dashboard pre-loaded for gateway metrics.

```bash
curl -s http://localhost:48123/api/v1/version
curl -s http://localhost:48123/api/v1/self_info | jq .
curl -s http://localhost:48123/metrics | grep optp2p_gateway
```

With a CL container connected, you should see **CL peers ≥ 1** in the dashboard / self info and libp2p traffic on subscribed topics.

## Persistent data

* **`hop-hoodi/`** — JWT, EL/CL datadirs (depending on profile)
* **Named volumes** — `prometheus-data`, `grafana-data` (metrics and Grafana state)

## Troubleshooting

* **Gateway not starting or restarting:** `docker logs optimum-gateway` and confirm `config/app_conf.yml` exists (run `make init` once so it is created from the sample if needed).
* **CL peers stay at 0** (full stack): wait until the beacon client finishes checkpoint sync, then check `docker logs prysm-beacon` (or your CL container). Ensure you ran `make init` so `.env` contains a valid **GATEWAY_PEER** for the gateway’s libp2p address inside Docker.
* **Port already in use (9090, 3000, 48123, …):** `make stop`, stop whatever else is bound to that port, or run `docker system prune -f` if you have leftover containers, then start again.
* **Services show unhealthy:** often normal for the first few minutes while Geth/Prysm (or another EL/CL pair) start; use `docker compose ps` and `docker compose logs <service-name>`.
* **Start over with chain data:** `make reset` stops, wipes the usual `hop-hoodi/` EL/CL dirs, and re-runs `init`.

## Further reading

* **[Optimum Gateway documentation (latest)](https://getoptimum.github.io/optimum-gateway/versions/latest/)** — configuration, networking, and release notes aligned with the gateway image you run here.
* [Geth](https://geth.ethereum.org/docs/)
* [Prysm](https://docs.prylabs.network/)
* [Teku](https://docs.teku.consensys.net/)
* [Lighthouse](https://lighthouse-book.sigmaprime.io/)
* [Prometheus](https://prometheus.io/docs/) · [Grafana](https://grafana.com/docs/)
