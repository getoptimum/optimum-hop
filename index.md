# HOP: The fastest way to experience Optimum

HOP is a **Docker Compose framework** and **test suite** for quickly experimenting with **mumP2P across different networks and use cases**.

It provides ready-to-use bundles that remove setup overhead and let teams focus on testing, measuring, and visualizing performance.

With HOP, you can:

* Spin up a full environment in minutes, no manual multi-service setup.
* Run tests without validator keys or staking requirements.
* Access instant dashboards to track latency and network behavior.

**Pick your path and hop on** — HOP adapts to different ecosystems, giving validators, builders, and teams a frictionless way to evaluate mumP2P.

## Prerequisites

Before you begin, ensure you have:

* **Docker** and **Docker Compose** installed
* **Make** (usually pre-installed on macOS/Linux)
* **curl** and **jq** (for API testing)

## Quick Start

### **Step 1: Initialize**

```bash
make init
```

### **Step 2: Choose Your Path**

#### **HOP Lite** (for validators)

```bash
make lite
```

* Gateway + Monitoring only
* Connect to your existing Ethereum nodes

#### **HOP Full** (for complete testing)

```bash
make run
```

* Full Ethereum node + Gateway + Monitoring
* Everything included

### **Step 3: Access Dashboards**

* **Grafana**: http://localhost:3000 (admin/admin)
* **Prometheus**: http://localhost:9090  
* **Gateway API**: http://localhost:48123

## Available Commands

```bash
make help    # Show all commands
make lite    # HOP Lite (Gateway + Monitoring)
make run     # HOP Full (Geth + Prysm)
make stop    # Stop all services
```

## External Resources

### Client Documentation

* [Geth Documentation](https://geth.ethereum.org/docs/) - Ethereum execution client
* [Prysm Documentation](https://docs.prylabs.network/) - Ethereum consensus client
* [Teku Documentation](https://docs.teku.consensys.net/) - Ethereum consensus client
* [Lighthouse Documentation](https://lighthouse-book.sigmaprime.io/) - Ethereum consensus client
* [Nethermind Documentation](https://docs.nethermind.io/) - Ethereum execution client

### Monitoring & Tools

* [Prometheus Documentation](https://prometheus.io/docs/) - Metrics collection
* [Grafana Documentation](https://grafana.com/docs/) - Dashboards and visualization

## Integrations

* **Ethereum** - See [./integration/README.md](./integration/README.md) for detailed setup and configuration
