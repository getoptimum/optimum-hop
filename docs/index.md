# HOP: Complete Setup Guide

HOP is a **Docker Compose framework** and **test suite** for quickly experimenting with **mumP2P across different networks and use cases**. This guide covers everything you need to get started with HOP.

## Why HOP?

### **Simplicity Through Identity**

Instead of manually stitching together EL/CL clients, Optimum Gateway, Prometheus, Grafana, and other services, HOP ships as one ready-to-run compose bundle (`getoptimum/hop`).

### **Recognizable & Consistent**

Naming makes HOP recognizable across docs, conversations, and deployments. When you say "spin up HOP v0.0.1", everyone knows exactly what you mean - a complete, tested environment that just works.

### **Focus on What Matters**

HOP removes setup overhead so teams can focus on what's important: testing, measuring, and visualizing mumP2P performance across different networks and use cases.

## Prerequisites

### **System Requirements**

* **Docker** and **Docker Compose** installed
* **curl** and **jq** (for testing)

#### **Minimum Requirements**

* **CPU**: 1 vCPU (ARM64 or x86_64)
* **RAM**: 256MB available memory
* **Storage**: 200MB free disk space

#### **Recommended Requirements**

* **CPU**: 2+ vCPUs
* **RAM**: 512MB+ available memory
* **Storage**: 500MB+ free disk space

## Quick Start

### **Step 1: Understanding the HOP Repository**

You have received the HOP repository with the following structure:

```text
optimum-hop/
├── integration/
│   ├── ethereum/           # Main Ethereum integration
│   │   ├── docker-compose.yml    # Service orchestration
│   │   ├── Makefile              # Automation commands
│   │   ├── .env.example          # Environment template
│   │   ├── config/
│   │   │   └── sample.app_conf.yml
│   │   └── prysm.sh              # Prysm setup script
│   ├── grafana/            # Monitoring configuration
│   │   ├── grafana-dashboards/   # Pre-built dashboards
│   │   ├── grafana-provisioning/ # Grafana setup
│   │   └── prometheus/           # Metrics collection
│   └── README.md           # Technical integration guide
└── docs/                   # This documentation site
```

#### **integration/ethereum/**

This is your main working directory containing:

* **Docker Compose setup** for running the full stack
* **Makefile** with automation commands
* **Configuration templates** for Gateway and clients

#### **integration/grafana/**

Pre-configured monitoring stack with:

* **Grafana dashboards** for visualizing Gateway metrics
* **Prometheus configuration** for collecting metrics
* **Data source definitions** connecting Grafana to Prometheus

### **Step 2: Navigate to Ethereum Integration**

```bash
cd integration/ethereum/
```

This directory contains everything needed to run HOP.

### **Step 3: Configure Gateway Settings**

```bash
# Copy the Gateway configuration template
cp config/sample.app_conf.yml config/app_conf.yml
```

**Important**: Edit `config/app_conf.yml` and update:

* **gateway_id**: Set your unique Gateway ID (format: `yourorg-region-hoodi-01`)
* **proxy_host**: Use the proxy addresses provided by the Optimum team

**Note**: Proxy host addresses will be provided during onboarding.

### **Step 4: Initialize Your Environment**

```bash
make init
```

This command:

* Creates data directories (`hop-hoodi/`)
* Copies `.env.example` to `.env` (if `.env` doesn't exist)
* Generates JWT secret for EL-CL communication  
* Starts Gateway container to discover peer information
* Updates your `.env` file with Gateway peer details

**Expected output:**

```text
Initializing hop-hoodi-testnet...
Create jwt secret
Starting gateway container to fetch peer info...
Container optimum-gateway  Running
Waiting for gateway API...
Discovered GATEWAY_PEER=/ip4/172.29.0.16/tcp/33212/p2p/16Uiu2HAm...
Updated .env with gateway peer
```

### **Step 5: Choose Your Path**

Now you can run HOP using either **Makefile commands** (recommended) or **Docker Compose commands** directly.

## Available Commands

### **Makefile Commands**

| Command | Description | Use Case |
|---------|-------------|----------|
| `make help` | Show all available commands | Get command reference |
| `make init` | Initialize environment and discover Gateway peer | First-time setup |
| `make lite` | Run Gateway + Monitoring only | Validators with existing infrastructure |
| `make run` | Run Geth + Prysm + Monitoring | Complete testing environment |
| `make run_teku` | Run Nethermind + Teku + Monitoring | Alternative CL client |
| `make run_lighthouse` | Run Nethermind + Lighthouse + Monitoring | Alternative CL client |
| `make run_prysm` | Run Nethermind + Prysm + Monitoring | Alternative EL client |
| `make stop` | Stop all services | Clean shutdown |
| `make clean` | Stop services and remove all data | Complete cleanup |
| `make reset` | Reset project for re-initialization | Fresh start |

### **Docker Compose Commands**

For direct Docker Compose control:

#### **HOP Lite**

```bash
GATEWAY_ID=$GATEWAY_ID docker compose --profile lite up -d
```

#### **HOP Full - Different Client Combinations**

**Geth + Prysm:**

```bash
GATEWAY_ID=$GATEWAY_ID docker compose --profile full --profile geth --profile prysm up -d
```

**Nethermind + Teku:**

```bash
GATEWAY_ID=$GATEWAY_ID docker compose --profile full --profile nethermind --profile teku up -d
```

**Nethermind + Lighthouse:**

```bash
GATEWAY_ID=$GATEWAY_ID docker compose --profile full --profile nethermind --profile lighthouse up -d
```

#### **Stop Services**

```bash
docker compose down
```

## Running HOP

### **HOP Lite** (for validators with existing infrastructure)

Use this if you already run Ethereum nodes and just want to add the Gateway and monitoring.

```bash
make lite
```

**What this does:**

* Starts Optimum Gateway
* Starts Prometheus (metrics collection)
* Starts Grafana (dashboards)
* Connects to your existing Ethereum infrastructure

### **HOP Full** (for complete testing environment)

Use this if you want a complete Ethereum environment for testing and evaluation.

#### **Option 1: Geth + Prysm (Default)**

```bash
make run
```

**What this includes:**

* Geth (Execution Layer)
* Prysm (Consensus Layer)  
* Optimum Gateway
* Prometheus + Grafana monitoring

#### **Option 2: Nethermind + Teku**

```bash
make run_teku
```

**What this includes:**

* Nethermind (Execution Layer)
* Teku (Consensus Layer)
* Optimum Gateway
* Prometheus + Grafana monitoring

#### **Option 3: Nethermind + Lighthouse**

```bash
make run_lighthouse
```

**What this includes:**

* Nethermind (Execution Layer)
* Lighthouse (Consensus Layer)
* Optimum Gateway
* Prometheus + Grafana monitoring

## Access Your HOP Environment

Once HOP is running, you can access:

### **Monitoring Dashboards**

* **Grafana**: <http://localhost:3000> (credentials: admin/admin)
* **Prometheus**: <http://localhost:9090>

### **Gateway API**

* **Gateway Metrics**: <http://localhost:48123/metrics>
* **Gateway Info**: <http://localhost:48123/api/v1/self_info>

### **Test Your Setup**

```bash
# Check Gateway status
curl -s http://localhost:48123/api/v1/self_info | jq .

# Check Grafana health
curl -s http://localhost:3000/api/health | jq .
```

## Managing Your HOP Environment

### **Stop Services**

```bash
make stop
```

### **Clean Up Everything**

```bash
make clean  # Removes all data and containers
```

### **Reset for Fresh Start**

```bash
make reset  # Stops, cleans, and prepares for re-initialization
```

## Service Status

### **Check Running Services**

```bash
docker compose ps
```

### **View Service Logs**

```bash
# Gateway logs
docker logs optimum-gateway

# Geth logs  
docker logs geth

# Prysm logs
docker logs prysm-beacon
```


```bash
# View running services
docker compose ps

# Check service logs
docker compose logs grafana
docker compose logs prometheus
docker compose logs optimum-gateway
```

## Monitoring & Observability

HOP includes comprehensive monitoring out of the box:

### **Gateway Metrics**

Test Gateway endpoints:

```bash
# Gateway version
curl -s http://localhost:48123/api/v1/version

# Gateway peer info
curl -s http://localhost:48123/api/v1/self_info | jq .

# Gateway metrics (Prometheus format)
curl -s http://localhost:48123/metrics | grep gateway_id
```

### **Dashboards**

* **Grafana**: Pre-configured dashboards for instant visualization
* **Prometheus**: Automatic collection of all Gateway metrics
* **Real-time Monitoring**: Track latency, propagation, and network behavior

### **Key Metrics**

* **ETH_LATENCY**: Gateway synchronization delay
* **LIBP2P_PROPAGATION_LATENCY**: P2P message propagation time
* **message_size_bytes**: Message size distribution


## Data Structure

HOP creates a `hop-hoodi/` directory with persistent data:

```text
hop-hoodi/
├── ethereum/           # Ethereum network configuration
├── geth-data/         # Geth blockchain data (if using Geth)
├── prysm-data/        # Prysm beacon chain data (if using Prysm)
├── teku-data/         # Teku beacon chain data (if using Teku)
├── lighthouse-data/   # Lighthouse beacon chain data (if using Lighthouse)
├── jwt.hex            # JWT secret for EL-CL authentication
└── logs/              # Service logs for troubleshooting
```

**Additional Docker Volumes:**

```text
prometheus-data/       # Persistent Prometheus metrics storage
grafana-data/         # Persistent Grafana dashboards and settings
```


## Troubleshooting

### **Common HOP Issues**

#### **Port Conflicts**

If you see port binding errors:

```bash
# Stop all HOP services
docker compose down

# Clean up Docker
docker system prune -f

# Try again
GATEWAY_ID=$GATEWAY_ID docker compose --profile lite up -d
```

#### **Gateway Connection Issues**

Check Gateway logs for connection status:

```bash
# View Gateway logs
docker compose logs optimum-gateway

# Look for peer connections
docker compose logs optimum-gateway | grep -E "(peer|connection|handshake)"
```

#### **Service Startup Issues**

Some services may show as "unhealthy" initially during startup:

```bash
# Check service status
docker compose ps

# Wait a few minutes for services to initialize
# Check specific service logs
docker compose logs <service-name>
```

### **Verifying HOP Setup**

```bash
# 1. Check all services are running
docker compose ps

# 2. Test Gateway API
curl -s http://localhost:48123/api/v1/self_info | jq .

# 3. Test Grafana
curl -s http://localhost:3000/api/health

# 4. Test Prometheus
curl -s http://localhost:9090/-/healthy
```

### **Getting Help**

If you encounter HOP issues:

1. Check HOP service logs: `docker compose logs <service-name>`
2. Verify all services are running: `docker compose ps`
3. Test individual service endpoints
4. Check service logs: `docker logs <service-name>`
5. Contact the Optimum team for support

## External Resources

### **Client Documentation**

* [Geth Documentation](https://geth.ethereum.org/docs/) - Ethereum execution client
* [Prysm Documentation](https://docs.prylabs.network/) - Ethereum consensus client
* [Teku Documentation](https://docs.teku.consensys.net/) - Ethereum consensus client
* [Lighthouse Documentation](https://lighthouse-book.sigmaprime.io/) - Ethereum consensus client

### **Monitoring & Tools**

* [Prometheus Documentation](https://prometheus.io/docs/) - Metrics collection
* [Grafana Documentation](https://grafana.com/docs/) - Dashboards and visualization

## Next Steps

1. **Start with HOP Lite** if you're a validator with existing infrastructure
2. **Try HOP Full** for complete testing and evaluation
3. **Monitor performance** using the included Grafana dashboards

