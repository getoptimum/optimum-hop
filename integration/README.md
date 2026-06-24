# Optimum Gateway Integration

Grafana dashboard and monitoring stack for the Optimum Gateway.

Gateway setup, EL/CL wiring, and configuration: **[Optimum Gateway docs (latest)](https://getoptimum.github.io/optimum-gateway/versions/latest/)**.

## Prerequisites

* Docker and Docker Compose installed
* Optimum Gateway running with **`telemetry_enable: true`**
* Ports **9090** and **3000** available for Prometheus and Grafana

## Setup

```bash
cd grafana
```

Edit **`prometheus/targets.json`** with the address Prometheus should scrape (gateway metrics on port **48123**).

```bash
docker compose -f docker-compose-grafana.yml up -d
```

## Monitoring

| Service     | URL                                   |
| ----------- | ------------------------------------- |
| Prometheus  | <http://localhost:9090>               |
| Grafana     | <http://localhost:3000> (admin/admin) |
| Gateway API | <http://localhost:48123>              |

## Verify

```bash
curl -s http://localhost:48123/health | jq '{status, checks: .checks.cl_peers}'
curl -s http://localhost:48123/api/v1/self_info | jq '{peer_id, libp2p: .libp2p.total_peers}'
```

When CL is connected: gateway `checks.cl_peers` ≥ 1 and CL peer `state` is `connected` (brief `disconnected` can occur during churn).

## Structure

```text
integration/
├── README.md
└── grafana/
    ├── docker-compose-grafana.yml
    ├── prometheus/
    │   ├── prometheus.yml
    │   └── targets.json
    ├── grafana-provisioning/
    │   ├── datasources/
    │   └── dashboards/
    └── grafana-dashboards/
        └── partner-dashboard.json
```

## Import dashboard only

Copy **`grafana/grafana-dashboards/partner-dashboard.json`** into your existing Grafana instance (Dashboards → Import).

## Further reading

* [Optimum Gateway documentation (latest)](https://getoptimum.github.io/optimum-gateway/versions/latest/)
* [Telemetry & Grafana (Gateway docs)](https://getoptimum.github.io/optimum-gateway/versions/latest/03_telemetry)
