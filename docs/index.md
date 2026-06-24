# HOP: Setup Guide

HOP is a **Docker Compose bundle** for running the **Optimum Gateway** with a pre-wired **Prometheus + Grafana** stack. Use it to connect a consensus client, run the gateway, and inspect metrics locally.

**Repository:** [https://github.com/getoptimum/optimum-hop](https://github.com/getoptimum/optimum-hop)

The gateway bridges your **Ethereum consensus layer (CL) client** to the **mump2p** network. **Peer discovery and fork digest** are handled automatically on startup (no separate proxy configuration in `app_conf.yml`).

Gateway install, configuration, and CL client wiring: **[Optimum Gateway documentation (latest)](https://getoptimum.github.io/optimum-gateway/versions/latest/)**.

## Prerequisites

* Docker and Docker Compose
* **curl** and **jq** (for gateway health checks)
* Optimum Gateway running with **`telemetry_enable: true`**
* Ports **48123**, **9090**, and **3000** free on the host

**Hardware (same order of magnitude as the gateway quick start):** minimum about 1 vCPU, 256MB RAM, 200MB disk; more if you run a full EL/CL stack alongside the gateway.

## Repository layout

```text
optimum-hop/
├── integration/
│   ├── grafana/
│   │   ├── docker-compose-grafana.yml
│   │   ├── prometheus/           # Scrape config + file_sd targets
│   │   ├── grafana-provisioning/
│   │   └── grafana-dashboards/   # Partner dashboard (JSON)
│   └── README.md
└── docs/
    └── index.md                  # This page
```

## Quick start

### 1. Run the Optimum Gateway

Follow the [Gateway quick start](https://getoptimum.github.io/optimum-gateway/versions/latest/01_quick_start) and enable telemetry in your gateway config.

### 2. Start Prometheus + Grafana

```bash
cd integration/grafana
```

Edit **`prometheus/targets.json`** so Prometheus can scrape your gateway at `:48123` (use your host IP or `host.docker.internal:48123` if the gateway runs outside the compose network).

```bash
docker compose -f docker-compose-grafana.yml up -d
```

This is the **HOP Lite** path: gateway (already running) + monitoring.

## Gateway configuration

See the [Gateway configuration guide](https://getoptimum.github.io/optimum-gateway/versions/latest/02_configuration). Important fields:

```yaml
gateway_cluster_id: optimum_hoodi_v0_3
gateway_id: your_unique_gateway_id   # e.g. yourorg-region-hoodi-01

eth_topics_subscribe:
  - beacon_block
```

## URLs and checks

| Service               | URL                                                                        |
| --------------------- | -------------------------------------------------------------------------- |
| Grafana               | [http://localhost:3000](http://localhost:3000) (default `admin` / `admin`) |
| Prometheus            | [http://localhost:9090](http://localhost:9090)                             |
| Gateway API / metrics | [http://localhost:48123](http://localhost:48123)                           |

Prometheus scrapes the gateway; Grafana opens with the gateway dashboard pre-loaded.

```bash
curl -s http://localhost:48123/api/v1/self_info | jq .
curl -s http://localhost:48123/metrics | grep optp2p_gateway
```

With a CL client connected, you should see **CL peers ≥ 1** in the dashboard / self info and libp2p traffic on subscribed topics.

## Import dashboard only

If you already run Prometheus and Grafana, copy **`integration/grafana/grafana-dashboards/partner-dashboard.json`** and import it in Grafana. See also the [Gateway telemetry guide](https://getoptimum.github.io/optimum-gateway/versions/latest/03_telemetry).

## Troubleshooting

* **Gateway not starting or restarting:** see [Gateway troubleshooting](https://getoptimum.github.io/optimum-gateway/versions/latest/04_troubleshoot).
* **CL peers stay at 0:** wait until the beacon client finishes checkpoint sync; confirm your CL client peers to the gateway libp2p address from `/api/v1/self_info`.
* **Empty Grafana panels:** check [http://localhost:9090/targets](http://localhost:9090/targets) and update `prometheus/targets.json` if the scrape target is wrong.
* **Port already in use (9090, 3000, 48123, …):** stop conflicting services or adjust ports in `docker-compose-grafana.yml`.

## Further reading

* **[Optimum Gateway documentation (latest)](https://getoptimum.github.io/optimum-gateway/versions/latest/)** — configuration, networking, and release notes.
* [Integration README](../integration/README.md)
* [Geth](https://geth.ethereum.org/docs/) · [Prysm](https://docs.prylabs.network/) · [Prometheus](https://prometheus.io/docs/) · [Grafana](https://grafana.com/docs/)
