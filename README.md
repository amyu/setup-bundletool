# setup-bundletool

This action provides the following functionality for GitHub Actions users:

- Download [bundletool](https://github.com/google/bundletool/releases) and use it in subsequent Steps as `bundletool` command
- Runs on Mac, Linux and Windows powered by SelfHostedRunner or GithubHostedRunner

# Usage

See [action.yml](action.yml)

**Basic:**
```yaml
steps:
  - uses: actions/checkout@v3
    
  # bundletool requires java
  - name: Setup JDK 17
    uses: actions/setup-java@v3
    with:
      java-version: 17
      distribution: temurin
      
  - name: Setup bundletool
    uses: amyu/setup-bundletool@v1

  - run: bundletool help
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Contributions

Contributions are welcome!
