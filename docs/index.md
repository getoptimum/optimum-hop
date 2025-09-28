# HOP: Complete Setup Guide

HOP is a **Docker Compose framework** and **test suite** for quickly experimenting with **mumP2P across different networks and use cases**. This guide covers everything you need to get started with HOP.

## Why HOP?

### **Simplicity Through Identity**

Instead of manually stitching together EL/CL clients, Optimum Gateway, Prometheus, Grafana, and other services, HOP ships as one ready-to-run compose bundle.

### **Recognizable & Consistent**

Naming makes HOP recognizable across docs, conversations, and deployments.

### **Focus on What Matters**

HOP removes setup overhead so teams can focus on what's important: testing, measuring, and visualizing mumP2P performance across different networks and use cases.

## Prerequisites

### **Access Requirements**

* **Network access**: Contact Optimum team for network configuration

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

### **Step 1: Get Your HOP Bundle**

Contact the Optimum team for network access.

The HOP bundle includes a complete `docker-compose.yml` with pre-configured services:

<details>
<summary>HOP Docker Compose (click to expand)</summary>

```yaml
services:
  # ========================================================
  # Optimum Gateway service (always required)
  # ========================================================
  optimum-gateway:
    # platform: linux/arm64
    image: getoptimum/gateway:${GATEWAY_VERSION}   # Use version from env var
    container_name: optimum-gateway
    restart: unless-stopped
    profiles: ["lite", "teku", "prysm", "lighthouse"]
    ports:
      - "33212:33212"         # libp2p port
      - "33213:33213"         # OptimumP2P port
      - "48123:48123"         # Telemetry/metrics port
    volumes:
      - ./config:/app/config  # Config directory (must contain app_conf.yml)
      - ./identity/libp2p:/tmp/libp2p  # Persistent libp2p identity
      - ./identity/optp2p:/tmp/optp2p  # Persistent OptimumP2P identity
    environment:
      - OPT_GATEWAY_ID=${GATEWAY_ID:-local-dockerized}  # Override Gateway ID from env
    command: ["-config=/app/config/app_conf.yml"]  # Explicit config path
    networks:
      hop-hoodi-testnet:
        ipv4_address: 172.29.0.XX

  # ========================================================
  # Execution Layer (EL) - choose either geth OR nethermind
  # Activated using --profile geth or --profile nethermind
  # Both expose alias "execution" so CL clients can connect
  # ========================================================
  geth:
    image: ethereum/client-go:${GETH_VERSION:-stable}
    container_name: geth
    restart: unless-stopped
    profiles: ["geth"]  # run only if --profile geth or full
    command:
      - --hoodi                        # Custom Hoodi testnet flag
      - --http                         # Enable HTTP RPC
      - --http.api=eth,net,engine,admin
      - --authrpc.jwtsecret=/jwt.hex   # JWT secret for EL-CL auth
      - --datadir=/data
    ports:
      - "8545:8545"           # HTTP RPC
      - "8551:8551"           # Auth RPC (Engine API for CL)
      - "30303:30303/tcp"     # P2P TCP
      - "30303:30303/udp"     # P2P UDP (discovery)
    volumes:
      - ./hop-hoodi/geth-data:/data
      - ./hop-hoodi/ethereum:/ethereum
      - ./hop-hoodi/jwt.hex:/jwt.hex
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8545"]
      interval: 10s
      timeout: 5s
      retries: 3
    networks:
      hop-hoodi-testnet:
        aliases:
          - execution # gives this EL the alias "execution"

  nethermind:
    image: nethermind/nethermind:${NETHERMIND_VERSION:-1.33.0}
    container_name: nethermind
    restart: unless-stopped
    profiles: ["nethermind"]
    ports:
      - "8545:8545"          # HTTP RPC
      - "8551:8551"         # Auth RPC (Engine API for CL)
      - "30303:30303/tcp"    # P2P TCP
      - "30303:30303/udp"   # P2P UDP (discovery)
    command: >
      --config=hoodi
      --datadir=/nethermind/data
      --JsonRpc.Enabled=true
      --JsonRpc.JwtSecretFile="/root/jwt/jwt.hex"
      --JsonRpc.EngineHost=0.0.0.0
      --JsonRpc.EnginePort=8551
      --JsonRpc.Host=0.0.0.0
      --JsonRpc.Port=8545
      --Metrics.Enabled=true
      --Metrics.ExposePort=8008
      --Sync.SnapSync=true
    volumes:
      - ./data/nethermind:/nethermind/data
      - ./hop-hoodi/jwt.hex:/root/jwt/jwt.hex
    networks:
      hop-hoodi-testnet:
        aliases:
          - execution # gives this EL the alias "execution"

  # ========================================================
  # Consensus Layer (CL) - choose prysm, teku, or lighthouse
  # They connect to whichever EL is running via alias "execution"
  # GATEWAY_PEER is split during make init into ADDR + PEER_ID
  # ========================================================
  prysm-beacon:
    image: gcr.io/prysmaticlabs/prysm/beacon-chain:${PRYSM_VERSION:-stable}
    container_name: prysm-beacon
    restart: unless-stopped
    profiles: ["prysm"]
    command:
      - --execution-endpoint=http://execution:8551   # Connect to Geth EL
      - --datadir=/eth-hoodi-disk/prysm-data
      - --hoodi
      - --jwt-secret=/jwt.hex
      - --checkpoint-sync-url=https://hoodi.beaconstate.info   # Quick sync
      - --genesis-beacon-api-url=https://hoodi.beaconstate.info
      - --accept-terms-of-use
      - --peer=${GATEWAY_PEER}   # Connect to Optimum Gateway
    ports:
      - "4000:4000"           # Prysm gRPC
      - "3500:3500"           # HTTP API
      - "12000:12000/tcp"     # P2P TCP
      - "12000:12000/udp"     # P2P UDP
      - "13000:13000"         # Extra P2P
    volumes:
      - ./hop-hoodi/prysm-data:/prysm-data
      - ./hop-hoodi/ethereum:/ethereum
      - ./hop-hoodi/jwt.hex:/jwt.hex
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:13000/eth/v1/node/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    networks:
      - hop-hoodi-testnet

  teku-beacon:
    image: consensys/teku:${TEKU_VERSION:-latest}
    container_name: teku-beacon
    restart: unless-stopped
    user: "0:0"
    profiles: ["teku"]
    volumes:
      - ./hop-hoodi/teku-data:/teku-data
      - ./hop-hoodi/jwt.hex:/jwt.hex
    command:
      - --network=hoodi
      - --data-base-path=/teku-data
      - --checkpoint-sync-url=https://hoodi.beaconstate.info
      - --ee-endpoint=http://execution:8551       # Connect to Geth EL
      - --ee-jwt-secret-file=/jwt.hex
      - --p2p-enabled=true
      - --p2p-discovery-enabled=true
      - --p2p-port=13000
      - --metrics-enabled=true
      - --metrics-host-allowlist=*
      - --metrics-interface=0.0.0.0
      - --metrics-port=8008
      - --rest-api-enabled=true
      - --rest-api-port=3500
      - --rest-api-host-allowlist=*
      - --validators-proposer-default-fee-recipient=0x0000000000000000000000000000000000000000
      - --p2p-direct-peers=${GATEWAY_PEER}   # Connect to Optimum Gateway
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3500/eth/v1/node/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    networks:
      - hop-hoodi-testnet

  lighthouse:
    image: sigp/lighthouse:${LIGHTHOUSE_VERSION:-v7.1.0}
    profiles: ["lighthouse"]
    restart: unless-stopped
    ports:
      - 9000:9000/tcp # P2P TCP
      - 9000:9000/udp # P2P UDP
      - 5052:5052   # HTTP API
    command: |
      lighthouse bn
      --network=hoodi
      --checkpoint-sync-url=https://hoodi.beaconstate.info 
      --checkpoint-sync-url-timeout=600
      --execution-endpoint=http://execution:8551
      --execution-jwt=/jwt/jwt.hex
      --datadir=/lighthouse-data
      --http
      --http-address=0.0.0.0
      --http-port=5052
      --metrics
      --metrics-address=0.0.0.0
      --metrics-port=5054
      --metrics-allow-origin="*"
      --libp2p-addresses=${ADDR}
      --trusted-peers=${PEER_ID}
    volumes:
      - ./hop-hoodi/lighthouse-data:/lighthouse-data
      - ./hop-hoodi/jwt.hex:/jwt/jwt.hex
    networks:
      - hop-hoodi-testnet

  # ========================================================
  # Monitoring stack (only enabled with --profile full)
  # ========================================================

  # Prometheus metrics collector
  prometheus:
    image: prom/prometheus:latest
    profiles: ["lite", "full"]  # enabled with either profile
    volumes:
      - ../grafana/prometheus:/etc/prometheus  # Prometheus config
      - prometheus-data:/prometheus            # Persist TSDB data
    ports:
      - "9090:9090"          # Prometheus UI
    restart: unless-stopped
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
      - "--storage.tsdb.retention.time=1h"     # Keep 1h of history
      - "--storage.tsdb.retention.size=2GB"    # Or max 2GB
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9090/-/healthy"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:   # Limit log size to avoid disk bloat
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    networks:
      - hop-hoodi-testnet

  grafana:
    image: grafana/grafana:latest
    profiles: ["lite", "full"]  # enabled with either profile
    ports:
      - "3000:3000"          # Grafana UI
    volumes:
      - ../grafana/grafana-provisioning:/etc/grafana/provisioning:ro  # Datasources
      - ../grafana/grafana-dashboards:/var/lib/grafana/dashboards:ro # Dashboards
      - grafana-data:/var/lib/grafana                                 # Persist state
    environment:
      - GF_SECURITY_ADMIN_USER=admin   # Default admin user
      - GF_SECURITY_ADMIN_PASSWORD=admin  # Default password (change in prod!)
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:   # Limit logs
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    networks:
      - hop-hoodi-testnet
    depends_on:
      - prometheus

volumes:
  prometheus-data:   # Persistent Prometheus storage
  grafana-data:      # Persistent Grafana storage

networks:
  hop-hoodi-testnet:
    driver: bridge
    ipam:
      config:
        - subnet: 172.29.0.0/16
```

</details>

### **Step 2: Choose Your Path**

#### **HOP Lite** (for validators with existing infrastructure)

```bash
GATEWAY_ID=$GATEWAY_ID docker compose --profile lite up -d
```

* Gateway + Monitoring only
* Connect to your existing Ethereum nodes
* Perfect for production validator setups

#### **HOP Full** (for complete testing environment)

```bash
NETWORK_TAG=hoodi GATEWAY_ID=$GATEWAY_ID docker compose --profile full up -d
```

* Full Ethereum node + Gateway + Monitoring
* Everything included in one bundle
* Ideal for builders and ecosystem teams

### **Step 3: Access Dashboards**

* **Grafana**: <http://localhost:3000> (default credentials: admin/admin)
* **Prometheus**: <http://localhost:9090>
* **Gateway Metrics**: <http://localhost:48123/metrics>

## HOP Variants

### **HOP Lite**

* **Audience**: Validators running large-scale fleets
* **Status**: Available now (private access)
* **Networks**: Ethereum Hoodi (now), Mainnet (later)
* **Contents**: Gateway + Prometheus + Grafana
* **Use Case**: Add mumP2P to existing validator infrastructure

### **HOP Full**

* **Audience**: Builders, testers, ecosystem teams
* **Status**: Available now (private access), public in ~1 month
* **Networks**: Ethereum Hoodi and Mainnet
* **Contents**: EL/CL + Gateway + Prometheus + Grafana
* **Use Case**: Complete testing environment with no prerequisites

### **HOP Flex** *(future)*

* **Audience**: Community participants joining as P2P nodes
* **Networks**: Hoodi + Mainnet
* **Contents**: Telemetry + dashboards + optional leaderboards
* **Incentive**: Potential MUM airdrop → Flexnode staking

## Service Management

### **Available Docker Compose Profiles**

```bash
# Profile combinations
--profile lite                    # Gateway + Monitoring only
--profile full                    # Complete stack with EL/CL
--profile full --profile geth     # Use Geth execution client
--profile full --profile prysm    # Use Prysm consensus client
--profile full --profile teku     # Use Teku consensus client
```


### **Service Status**

Check all HOP services:

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

HOP creates persistent data directories:

```text
hop-data/
├── ethereum/           # Ethereum configuration
├── geth-data/         # Geth blockchain data (if using HOP Full)
├── jwt.hex            # JWT secret for EL-CL authentication
├── prysm-data/        # Prysm beacon data (if using Prysm)
├── teku-data/         # Teku beacon data (if using Teku)
└── grafana-data/      # Grafana dashboards and settings
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
4. For Gateway configuration issues, see [Technical Integration](../integration/README.md)
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
4. **Explore advanced configuration** in [Technical Integration](../integration/README.md)


**Ready to optimize your validator performance?** Contact the Optimum team for network access.
