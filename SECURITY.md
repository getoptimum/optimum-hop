# Security Policy

## Supported Versions

Optimum HOP is a Docker Compose framework and documentation site for running
the Optimum Gateway. Security fixes are applied to the `main` branch. We
recommend always running the latest released version.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, report it privately using one of the
following channels:

- Use GitHub's [private vulnerability reporting](https://github.com/getoptimum/optimum-hop/security/advisories/new)
  (Security → Advisories → Report a vulnerability), **or**
- Email the maintainers at **security@getoptimum.xyz**.

Please include as much of the following as you can:

- A description of the vulnerability and its potential impact.
- Steps to reproduce, or a proof of concept.
- Affected component, version, or configuration.
- Any suggested remediation.

## What to Expect

- We will acknowledge your report within **3 business days**.
- We will provide an initial assessment and expected timeline within **10 business days**.
- We will keep you informed of progress toward a fix and coordinate a disclosure
  timeline with you.

We ask that you give us a reasonable opportunity to address the issue before any
public disclosure. We appreciate responsible disclosure and will credit
reporters who wish to be acknowledged.

## Scope

This repository contains infrastructure-as-configuration (Docker Compose,
Prometheus/Grafana provisioning) and documentation. Note that:

- Secrets such as JWT files and `.env` values are generated locally and are
  **not** stored in this repository.
- The sample configuration files (e.g. `sample.app_conf.yml`) and default
  credentials (e.g. Grafana `admin`/`admin`) are placeholders intended for
  local development only and **must** be changed before any production use.
