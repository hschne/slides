# talks

Source repository for all talk slide decks. Decks are built on push and published to the `published` branch.

## Structure

```
talks/
├── mise.toml
├── bin/build
├── .github/workflows/publish.yml
└── YY-MM-DD-slug/
    ├── talk.yml
    └── (slide sources)
```

## Usage

```bash
# Build all talks
mise run build

# Build a single talk
mise run build gems-are-overrated
```

## talk.yml

```yaml
slug: my-talk
title: My Talk
event: RubyConf
public: true
framework: slidev # slidev | revealjs | static
thumbnail: thumbnail.webp
```
