# HOP: The fastest way to experience Optimum

HOP is a **Docker Compose framework** for quickly experimenting with **mump2p** — starting with a pre-wired **Prometheus + Grafana** stack for the Optimum Gateway.

**Pick your path and hop on:**

* **HOP Lite** — gateway (already running) + monitoring only
* **HOP Full** — full local EL/CL + gateway + monitoring via [integration](../integration/README.md) (synced from the gateway repo)

## Get started

1. Run the **Optimum Gateway** — [Gateway quick start](https://getoptimum.github.io/optimum-gateway/versions/latest/01_quick_start)
2. Start **Grafana + Prometheus** from this repo:

```bash
cd integration/grafana
docker compose -f docker-compose-grafana.yml up -d
```

**Setup details** → [Complete Setup Guide](./docs/)
