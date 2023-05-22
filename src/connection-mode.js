/**
 * @typedef {{shouldConnectWith(one: import('./piece'), other: import('./piece')): boolean}} ConnectionMode
 */

const ConnectAlways = {
  /**
   *
   * @param {import('./piece')} one
   * @param {import('./piece')} other
   * @returns
   */
  shouldConnectWith(one, other) {
    return true;
  }
}

module.exports = {
  ConnectAlways
}