

[Docs](https://github.com/getoptimum/optimum-hop/actions/workflows/docs.yml)
[Documentation](https://getoptimum.github.io/optimum-hop/)

[Gateway image](https://hub.docker.com/r/getoptimum/gateway)
[Docker pulls](https://hub.docker.com/r/getoptimum/gateway)
[Built with VitePress](https://vitepress.dev/)
[License](./LICENSE)

# Optimum HOP — The fastest way to experience Optimum



HOP is a **Docker Compose framework** and **test suite** for running Optimum Gateway and monitoring in a few commands.  
It’s the quickest way to experiment with **mump2p** without manual setup.

> **Security:** see `[SECURITY.md](SECURITY.md)` for how to report vulnerabilities.

Optimum HOP overview

---

## Integrations

- Grafana dashboard & monitoring stack — see [./integration/README.md](./integration/README.md)
- Optimum Gateway setup — [Gateway docs (latest)](https://getoptimum.github.io/optimum-gateway/versions/latest/)

## Repository layout

```text
optimum-hop/
├── integration/
│   ├── README.md
│   └── grafana/
│       ├── docker-compose-grafana.yml
│       ├── prometheus/
│       ├── grafana-provisioning/
│       └── grafana-dashboards/
│           └── partner-dashboard.json
└── docs/
    └── index.md
```

## Docs site (this repository)

```bash
yarn install --frozen-lockfile
make run-dev    # VitePress dev server; use make build for production build
```

## Contributing

Contributions are welcome — see `[CONTRIBUTING.md](CONTRIBUTING.md)` and our
`[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)`.

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).