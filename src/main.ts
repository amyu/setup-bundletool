import * as core from '@actions/core'
import * as toolCache from '@actions/tool-cache'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

// Fetch the latest release metadata from GitHub
async function getLatestVersion(): Promise<string> {
  const response = await fetch(
    'https://github.com/google/bundletool/releases/latest',
    {redirect: 'manual'}
  )

  const location = response.headers.get('location')

  if (!location) {
    throw new Error(
      'Unable to determine latest release location from GitHub response'
    )
  }

  const tag = location.split('/').pop()

  if (!tag) {
    throw new Error(
      'Unable to extract version tag from GitHub redirect location'
    )
  }

  return tag
}

// Main action entry point
async function run(): Promise<void> {
  try {
    let version = core.getInput('version')

    if (!version) {
      core.info('Fetching latest bundletool release from GitHub…')
      version = await getLatestVersion()
      core.info(`Using latest version: ${version}`)
    }

    const downloadVersion = `${version}/bundletool-all-${version}.jar`

    const downloadDir = path.join(os.homedir(), '.bundletool')
    const downloadJarPath = path.join(
      downloadDir,
      downloadVersion.split('/')[1]
    )

    const bundleToolPath = path.join(
      downloadDir,
      process.platform === 'win32' ? 'bundletool.cmd' : 'bundletool'
    )

    await fs.mkdir(downloadDir, {recursive: true})

    try {
      await fs.access(downloadJarPath)
      core.info('bundletool already downloaded')
    } catch {
      core.info('start download')
      await toolCache.downloadTool(
        `https://github.com/google/bundletool/releases/download/${downloadVersion}`,
        downloadJarPath
      )
      core.info('end download')
    }

    core.info('start create script')
    await fs.writeFile(
      bundleToolPath,
      process.platform === 'win32'
        ? `@echo off\r\njava -jar "${downloadJarPath}" %*\r\n`
        : `#!/usr/bin/env bash\njava -jar "${downloadJarPath}" "$@"\n`
    )
    if (process.platform !== 'win32') {
      await fs.chmod(bundleToolPath, '755')
    }
    core.info('end create script')

    core.info('start add path')
    core.addPath(downloadDir)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
