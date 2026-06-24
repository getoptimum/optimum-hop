# HOP: Setup Guide

HOP is a **Docker Compose bundle** for **Prometheus + Grafana** around a running **Optimum Gateway**. Use it to scrape gateway metrics and view the partner dashboard locally.

**Gateway install, API key, config, and CL wiring** (Prysm, Lighthouse, Teku, Nimbus, Lodestar): **[Optimum Gateway documentation (latest)](https://getoptimum.github.io/optimum-gateway/versions/latest/)**.

## Prerequisites

* Docker and Docker Compose
* **curl** and **jq**
* Optimum Gateway running with **`telemetry_enable: true`**
* Ports **48123**, **9090**, and **3000** free on the host

## Quick start

### 1. Run the Optimum Gateway

Follow the [Gateway quick start](https://getoptimum.github.io/optimum-gateway/versions/latest/01_quick_start) (API key, `app_conf.yml`, Docker run).

### 2. Start Prometheus + Grafana

```bash
cd integration/grafana
```

Edit **`prometheus/targets.json`** so Prometheus can scrape your gateway at `:48123` (e.g. `host.docker.internal:48123` if the gateway runs outside the compose network).

```bash
docker compose -f docker-compose-grafana.yml up -d
```

## URLs and checks

| Service               | URL                                                                        |
| --------------------- | -------------------------------------------------------------------------- |
| Grafana               | [http://localhost:3000](http://localhost:3000) (default `admin` / `admin`) |
| Prometheus            | [http://localhost:9090](http://localhost:9090)                             |
| Gateway API / metrics | [http://localhost:48123](http://localhost:48123)                           |

```bash
curl -s http://localhost:48123/health | jq '{status, checks: .checks.cl_peers}'
curl -s http://localhost:48123/metrics | grep mump2p_gateway
```

With a CL client connected, `checks.cl_peers` should be ≥ 1. See [Gateway metrics](https://getoptimum.github.io/optimum-gateway/versions/latest/metrics) for the full `mump2p_gateway_*` set.

## Import dashboard only

Copy **`integration/grafana/grafana-dashboards/partner-dashboard.json`** into your Grafana instance (Dashboards → Import), or see the [Gateway telemetry guide](https://getoptimum.github.io/optimum-gateway/versions/latest/03_telemetry).

## Troubleshooting

* **Gateway not starting or auth errors:** [Gateway troubleshooting](https://getoptimum.github.io/optimum-gateway/versions/latest/04_troubleshoot).
* **CL peers stay at 0:** finish checkpoint sync; wire your CL to the gateway libp2p address from `/api/v1/self_info`. Client-specific flags (Lighthouse PeerDAS, Teku direct peers, Nimbus/Lodestar): [Gateway quick start](https://getoptimum.github.io/optimum-gateway/versions/latest/01_quick_start) and [Configuration](https://getoptimum.github.io/optimum-gateway/versions/latest/02_configuration).
* **Empty Grafana panels:** check [http://localhost:9090/targets](http://localhost:9090/targets) and update `prometheus/targets.json`.

## Further reading

* [Integration README](../integration/README.md) — optional full local EL/CL + gateway stack (synced from the gateway repo)
* [Optimum Gateway documentation](https://getoptimum.github.io/optimum-gateway/versions/latest/)
