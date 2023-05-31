import * as core from '@actions/core'
import * as toolCache from '@actions/tool-cache'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

async function run(): Promise<void> {
  try {
    const downloadVersion = '1.15.1/bundletool-all-1.15.1.jar'

    const downloadDir = path.join(os.homedir(), '.bundletool')
    const downloadJarPath = path.join(
      downloadDir,
      downloadVersion.split('/')[1]
    )
    const bundleToolPath = path.join(downloadDir, 'bundletool')

    await fs.mkdir(downloadDir)

    core.info('start download')
    await toolCache.downloadTool(
      `https://github.com/google/bundletool/releases/download/${downloadVersion}`,
      downloadJarPath
    )
    core.info('end download')

    core.info('start create script')
    await fs.writeFile(
      bundleToolPath,
      `
      #!/bin/bash
      java -jar ${downloadJarPath} "$@"
    `
    )
    await fs.chmod(bundleToolPath, '755')
    core.info('end create script')

    core.info('start add path')
    core.addPath(downloadDir)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
