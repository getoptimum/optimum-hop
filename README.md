<div align="center">

[![Docs](https://github.com/getoptimum/optimum-hop/actions/workflows/docs.yml/badge.svg)](https://github.com/getoptimum/optimum-hop/actions/workflows/docs.yml)
[![Documentation](https://img.shields.io/badge/docs-getoptimum.github.io%2Foptimum--hop-blue)](https://getoptimum.github.io/optimum-hop/)

[![Gateway image](https://img.shields.io/docker/v/getoptimum/gateway?label=gateway%20image&sort=semver&logo=docker)](https://hub.docker.com/r/getoptimum/gateway)
[![Docker pulls](https://img.shields.io/docker/pulls/getoptimum/gateway?logo=docker&label=pulls)](https://hub.docker.com/r/getoptimum/gateway)
[![Built with VitePress](https://img.shields.io/badge/built%20with-VitePress-42b883)](https://vitepress.dev/)
[![License](https://img.shields.io/github/license/getoptimum/optimum-hop)](./LICENSE)

# Optimum HOP — The fastest way to experience Optimum

</div>

HOP is a **Docker Compose framework** and **test suite** for running Optimum Gateway and monitoring in a few commands.  
It’s the quickest way to experiment with **mump2p** without manual setup.

> **Security:** see [`SECURITY.md`](SECURITY.md) for how to report vulnerabilities.

![Optimum HOP overview](public/banner.png)

---

## Integrations

* Ethereum — see [./integration/README.md](./integration/README.md)

## Docs site (this repository)

```bash
yarn install --frozen-lockfile
make run-dev    # VitePress dev server; use make build for production build
```

## Contributing

Contributions are welcome — see [`CONTRIBUTING.md`](CONTRIBUTING.md) and our
[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
