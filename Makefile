#!/usr/bin/make -f

NPM := npm

run-dev:
	@echo "⚙️  Running development server..."
	@$(NPM) run docs:dev

build:
	@echo "🚀  Building static site..."
	@$(NPM) run docs:build

preview:
	@echo "🔍  Previewing production build..."
	@$(NPM) run docs:preview

lint:
	@echo "🧹  Linting..."
	@$(NPM) run lint

lint-markdown:
	@echo "🧹  Linting markdown..."
	@$(NPM) run lint:md

.PHONY: run-dev build preview lint lint-markdown
