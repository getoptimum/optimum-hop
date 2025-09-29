# Optimum Gateway Integration

## Setup

```bash
make init
```

This will:

* Create data directories
* Generate a jwt.hex for EL ↔ CL authentication
* Start the Optimum Gateway and fetch its peer info
* Write to .env

```bash
GATEWAY_PEER=/ip4/99.97.0.2/tcp/33212/p2p/16Uiu2HAm...
ADDR=/ip4/99.97.0.2/tcp/33212
PEER_ID=16Uiu2HAm...
```

## Running the Stack

You can run the stack directly with Docker Compose or via Makefile commands.

### With Docker Compose

Profiles let you choose EL, CL, and monitoring:

#### Run Geth + Prysm + Monitoring

```bash
docker compose --profile full --profile geth --profile prysm up -d
```

#### Run Nethermind + Teku + Monitoring

```bash
docker compose --profile full --profile nethermind --profile teku up -d
```

#### Run Lighthouse + Nethermind + Monitoring

```bash
docker compose --profile full --profile nethermind --profile lighthouse up -d
```

#### Run Gateway + Metrics only (lite mode)

```bash
docker compose --profile lite up -d
```

### With Makefile

* `make init` - Initialize project, generate jwt, discover GATEWAY_PEER, update .env
* `make run` - Run Geth + Prysm + Monitoring
* `make run_teku` - Run Nethermind + Teku + Monitoring
* `make run_lighthouse` - Run Nethermind + Lighthouse + Monitoring
* `make run_prysm` - Run Nethermind + Prysm + Monitoring
* `make lite` - Run Gateway + Metrics only
* `make stop` - Stop all services
* `make reset` - Wipe all data and re-init from scratch
* `make clean` - Stop services and remove all data + containers

### Monitoring

* **Prometheus**: <http://localhost:9090>
* **Grafana**: <http://localhost:3000> (default login: admin/admin)
* **Gateway API**: <http://localhost:48123>

### Test Gateway API

```bash
curl -s http://localhost:48123/api/v1/self_info | jq .
```

Expected output:

```json
{
  "multiaddrs": [
    "/ip4/172.29.0.16/tcp/33212"
  ],
  "peer_id": "16Uiu2HAkwbdyUeuFGCXFgbNGLrbNeLBEt4jHwWZg7VVrTvaXtVWp"
}
```

## Important Notes

* Only one EL profile should be active at a time (geth or nethermind)
* Only one CL profile should be active at a time (prysm, teku, or lighthouse)
* GATEWAY_PEER, ADDR and PEER_ID are populated automatically during `make init`
* If you run into sync issues, try `make reset` to wipe state and re-init

## Troubleshooting

### Gateway Connection Issues

Check Gateway logs:

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

## Known Issues

### Geth + Teku

```text
WARN Beacon client online, but no consensus updates received in a while
ERROR - Execution Client request failed. Make sure the Execution Client is online and can respond to requests.
```

### Geth + Lighthouse

```text
ERROR Error during execution engine upcheck
      error: HttpClient(url: http://execution:8551/, kind: request,
      detail: error trying to connect: tcp connect error: Connection refused (os error 111))
```
