// const { FusesPlugin } = require('@electron-forge/plugin-fuses');
// const { FuseV1Options, FuseVersion } = require('@electron/fuses');
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    // Windows平台创建Squirrel安装程序(.exe)
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'YuiParkour', // 应用名称
      },
    },
    // macOS平台创建Zip文件
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    // Debian 和 Ubuntu 等Linux发行版创建.deb安装包
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    // 基于RPM的Linux发行版创建.rpm安装包
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
