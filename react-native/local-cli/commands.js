/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
'use strict';

const Config = require('./util/Config');
const getUserCommands = require('./rnpm/core/src/getCommands');
// @Denis
const fs = require('fs');

export type Command = {
  name: string,
  description?: string,
  usage?: string,
  func: (argv: Array<string>, config: Config, args: Object) => ?Promise<void>,
  options?: Array<{
    command: string,
    description?: string,
    parse?: (val: string) => any,
    default?: (config: Config) => any | any,
  }>,
  examples?: Array<{
    desc: string,
    cmd: string,
  }>,
};

const documentedCommands = [
  require('./server/server'),
  require('./runIOS/runIOS'),
  require('./runAndroid/runAndroid'),
  require('./library/library'),
  require('./bundle/bundle'),
  require('./bundle/unbundle'),
  require('./rnpm/link/link'),
  require('./rnpm/link/unlink'),
  require('./rnpm/install/install'),
  require('./rnpm/install/uninstall'),
  require('./upgrade/upgrade'),
  require('./logAndroid/logAndroid'),
  require('./logIOS/logIOS'),
  require('./dependencies/dependencies'),
  // @Denis
  {
    name: 'version',
    description: 'print version',
    func: printVersion,
  }
];

// @Denis
function printVersion() {
  return new Promise((resolve, reject) => {
    var version = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../../../package.json'), 'utf8')
    ).version;
    console.log(version);
    resolve();
  });
}

// The user should never get here because projects are inited by
// using `react-native-cli` from outside a project directory.
const undocumentedCommands = [
  {
    name: 'init',
    func: () => {
      console.log([
        'Looks like React Native project already exists in the current',
        'folder. Run this command from a different folder or remove node_modules/react-native'
      ].join('\n'));
    },
  },
];

const commands: Array<Command> = [
  ...documentedCommands,
  ...undocumentedCommands,
  ...getUserCommands(),
];

module.exports = commands;