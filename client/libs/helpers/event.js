/* eslint-disable import/no-commonjs */
/**
 * @param {string} id
 * @param {string} behavior
 * @param {string|undefined} comments
 * @returns {{id: string; behavior: string; comments?: string}}
 */
function makeEvent (id, behavior, comments) {
  return {
    id,
    behavior,
    comments,
  }
}

module.exports.makeEvent = makeEvent
