# Optimum Gateway Integration

## Setup

```sh
make init
```

This will:

* Create data directories.
* Generate a jwt.hex for EL ↔ CL authentication.
* Start the Optimum Gateway and fetch its peer info.
* Write to .env:
NOTE: need to configure app_config.yml (example in sample.app_config.yml)

```sh
GATEWAY_PEER=/ip4/99.97.0.2/tcp/33212/p2p/16Uiu2HAm...
ADDR=/ip4/99.97.0.2/tcp/33212
PEER_ID=16Uiu2HAm...
```

## Running the Stack

You can run the stack directly with Docker Compose or via Makefile commands.

### With Docker Compose

Profiles let you choose EL, CL, and monitoring:

#### Run Geth + Prysm + Monitoring

```sh
docker compose --profile full --profile geth --profile prysm up -d
```

#### Run Nethermind + Teku + Monitoring

```sh
docker compose --profile full --profile nethermind --profile teku up -d
```

#### Run Lighthouse + Nethermind + Monitoring

```sh
docker compose --profile full --profile nethermind --profile lighthouse up -d
```

#### Run Gateway + Metrics only (lite mode)

```sh
docker compose --profile lite up -d
```

### With Makefile

* `make init` - Initialize project, generate jwt, discover GATEWAY_PEER, update .en
* `make run` - Run Geth + Prysm + Monitoring
* `make run_teku` - Run Geth + Teku + Monitoring
* `make run_lighthouse` - Run Geth + Lighthouse + Monitoring
* `make run_prysm` - Run Nethermind + Prysm + Monitoring
* `make lite` - Run Gateway + EL + CL without monitoring
* `make stop` - Stop all services
* `make reset` - Wipe all data and re-init from scratch
* `make clean` - Stop and remove docker containers

### Monitoring

* `Prometheus` → <http://localhost:9090>
* `Grafana` → <http://localhost:3000> Default login: `admin/admin`

### Important

* Only one EL profile should be active at a time (geth or nethermind).
* Only one CL profile should be active at a time (prysm, teku, or lighthouse).
* GATEWAY_PEER, ADDR and PEER_ID are populated automatically from the Gateway during `make init`.
* If you run into sync issues, try `make reset` to wipe state and re-init.

### Known Issues

#### Geth + Teku

```sh
WARN Beacon client online, but no consensus updates received in a while
ERROR - Execution Client request failed. Make sure the Execution Client is online and can respond to requests.
```

#### Geth + Lightouse

```sh
ERROR Error during execution engine upcheck
      error: HttpClient(url: http://execution:8551/, kind: request,
      detail: error trying to connect: tcp connect error: Connection refused (os error 111))
```
