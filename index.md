# HOP: The fastest way to experience Optimum

HOP is a **Docker Compose framework** and **test suite** for quickly experimenting with **mump2p across different networks and use cases**.

It provides ready-to-use bundles that remove setup overhead and let teams focus on testing, measuring, and visualizing performance.

**Pick your path and hop on** — HOP adapts to different ecosystems, giving validators, builders, and teams a frictionless way to evaluate mump2p.

## Quick Navigation

* **[Complete Setup Guide](./docs/)** — Everything you need to get started

## What's HOP?

### **HOP Lite** (for validators)

* Gateway + Monitoring only
* Connect to your existing Ethereum nodes
* Perfect for production validator setups

### **HOP Full** (for complete testing)

* Full Ethereum node + Gateway + Monitoring
* Everything included in one bundle
* Ideal for builders and ecosystem teams

### **HOP Flex** *(coming soon)*

* Community participation with leaderboards
* Telemetry + dashboards + incentives
* Open to all network participants

## Get Started

Run the **Optimum Gateway** using the [Gateway quick start](https://getoptimum.github.io/optimum-gateway/versions/latest/01_quick_start), then bring up the **Grafana stack** from this repo:

```bash
cd integration/grafana
docker compose -f docker-compose-grafana.yml up -d
```

**Ready to hop on?** → [Start here](./docs/)
