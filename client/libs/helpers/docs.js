/* eslint-disable import/no-commonjs */
const doctrine = require('doctrine')

/**
 * @param {import('@babel/traverse').NodePath} p
 * @returns {string}
 */
function getLeadingCommentPageName (p) {
  let pageName = ''

  const commentsPath = p.get('leadingComments')
  if (commentsPath.length) {
    const comment = commentsPath[0].node.value
    if (comment) {
        const tag = doctrine.parse(comment, {
          unwrap: true,
          tags: ['pageName']
        }).tags[0] || { description: '' }
        pageName = tag.description
    }
  }

  return pageName
}

module.exports.getLeadingCommentPageName = getLeadingCommentPageName
