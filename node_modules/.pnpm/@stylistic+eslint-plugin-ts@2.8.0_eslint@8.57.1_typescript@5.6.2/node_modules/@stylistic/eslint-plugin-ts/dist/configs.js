'use strict';

var utils = require('./utils.js');
var blockSpacing = require('./rules/block-spacing.js');
var braceStyle = require('./rules/brace-style.js');
var commaDangle = require('./rules/comma-dangle.js');
var commaSpacing = require('./rules/comma-spacing.js');
var functionCallSpacing = require('./rules/function-call-spacing.js');
var indent = require('./rules/indent.js');
var keySpacing = require('./rules/key-spacing.js');
var keywordSpacing = require('./rules/keyword-spacing.js');
var linesAroundComment = require('./rules/lines-around-comment.js');
var linesBetweenClassMembers = require('./rules/lines-between-class-members.js');
var memberDelimiterStyle = require('./rules/member-delimiter-style.js');
var noExtraParens = require('./rules/no-extra-parens.js');
var noExtraSemi = require('./rules/no-extra-semi.js');
var objectCurlyNewline = require('./rules/object-curly-newline.js');
var objectCurlySpacing = require('./rules/object-curly-spacing.js');
var objectPropertyNewline = require('./rules/object-property-newline.js');
var paddingLineBetweenStatements = require('./rules/padding-line-between-statements.js');
var quoteProps = require('./rules/quote-props.js');
var quotes = require('./rules/quotes.js');
var semi = require('./rules/semi.js');
var spaceBeforeBlocks = require('./rules/space-before-blocks.js');
var spaceBeforeFunctionParen = require('./rules/space-before-function-paren.js');
var spaceInfixOps = require('./rules/space-infix-ops.js');
var typeAnnotationSpacing = require('./rules/type-annotation-spacing.js');

var rules = {
  "block-spacing": blockSpacing,
  "brace-style": braceStyle,
  "comma-dangle": commaDangle,
  "comma-spacing": commaSpacing,
  "func-call-spacing": functionCallSpacing,
  "function-call-spacing": functionCallSpacing,
  "indent": indent,
  "key-spacing": keySpacing,
  "keyword-spacing": keywordSpacing,
  "lines-around-comment": linesAroundComment,
  "lines-between-class-members": linesBetweenClassMembers,
  "member-delimiter-style": memberDelimiterStyle,
  "no-extra-parens": noExtraParens,
  "no-extra-semi": noExtraSemi,
  "object-curly-newline": objectCurlyNewline,
  "object-curly-spacing": objectCurlySpacing,
  "object-property-newline": objectPropertyNewline,
  "padding-line-between-statements": paddingLineBetweenStatements,
  "quote-props": quoteProps,
  "quotes": quotes,
  "semi": semi,
  "space-before-blocks": spaceBeforeBlocks,
  "space-before-function-paren": spaceBeforeFunctionParen,
  "space-infix-ops": spaceInfixOps,
  "type-annotation-spacing": typeAnnotationSpacing
};

var plugin = {
  rules
};

const config = {
  rules: {
    "@typescript-eslint/block-spacing": 0,
    "@typescript-eslint/brace-style": 0,
    "@typescript-eslint/comma-dangle": 0,
    "@typescript-eslint/comma-spacing": 0,
    "@typescript-eslint/func-call-spacing": 0,
    "@typescript-eslint/indent": 0,
    "@typescript-eslint/key-spacing": 0,
    "@typescript-eslint/keyword-spacing": 0,
    "@typescript-eslint/lines-around-comment": 0,
    "@typescript-eslint/lines-between-class-members": 0,
    "@typescript-eslint/member-delimiter-style": 0,
    "@typescript-eslint/no-extra-parens": 0,
    "@typescript-eslint/no-extra-semi": 0,
    "@typescript-eslint/object-curly-newline": 0,
    "@typescript-eslint/object-curly-spacing": 0,
    "@typescript-eslint/object-property-newline": 0,
    "@typescript-eslint/padding-line-between-statements": 0,
    "@typescript-eslint/quote-props": 0,
    "@typescript-eslint/quotes": 0,
    "@typescript-eslint/semi": 0,
    "@typescript-eslint/space-before-blocks": 0,
    "@typescript-eslint/space-before-function-paren": 0,
    "@typescript-eslint/space-infix-ops": 0,
    "@typescript-eslint/type-annotation-spacing": 0
  }
};

const configs = {
  "disable-legacy": config,
  "all-flat": utils.createAllConfigs(plugin, "@stylistic/ts", true),
  "all-extends": utils.createAllConfigs(plugin, "@stylistic/ts", false)
};

exports.configs = configs;
exports.plugin = plugin;
