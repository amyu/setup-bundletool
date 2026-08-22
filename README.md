# setup-bundletool

This action provides the following functionality for GitHub Actions users:

- Download [bundletool](https://github.com/google/bundletool/releases) and use it in subsequent Steps as `bundletool` command
- Runs on Mac, Linux and Windows powered by SelfHostedRunner or GithubHostedRunner

# Usage

See [action.yml](action.yml)

**Basic** (automatically uses the latest GitHub release):

```yaml
steps:
  - uses: actions/checkout@v6

  # bundletool requires java
  - name: Setup JDK 17
    uses: actions/setup-java@v5
    with:
      java-version: 17
      distribution: temurin

  - name: Setup bundletool
    uses: amyu/setup-bundletool@v1.1

  - run: bundletool help
```

**With specific version:**

```yaml
steps:
  - uses: actions/checkout@v6

  - name: Setup JDK 17
    uses: actions/setup-java@v5
    with:
      java-version: 17
      distribution: temurin

  - name: Setup bundletool
    uses: amyu/setup-bundletool@v1.1
    with:
      version: 1.18.3

  - run: bundletool help
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!
