'use strict';

var configs = require('./configs.js');
require('./utils.js');
require('eslint-visitor-keys');
require('espree');
require('./rules/block-spacing.js');
require('@typescript-eslint/utils');
require('@typescript-eslint/utils/ast-utils');
require('./rules/brace-style.js');
require('./rules/comma-dangle.js');
require('./rules/comma-spacing.js');
require('./rules/function-call-spacing.js');
require('./rules/indent.js');
require('./rules/key-spacing.js');
require('./rules/keyword-spacing.js');
require('./rules/lines-around-comment.js');
require('./rules/lines-between-class-members.js');
require('./rules/member-delimiter-style.js');
require('./rules/no-extra-parens.js');
require('./rules/no-extra-semi.js');
require('./rules/object-curly-newline.js');
require('./rules/object-curly-spacing.js');
require('./rules/object-property-newline.js');
require('./rules/padding-line-between-statements.js');
require('./rules/quote-props.js');
require('./rules/quotes.js');
require('./rules/semi.js');
require('./rules/space-before-blocks.js');
require('./rules/space-before-function-paren.js');
require('./rules/space-infix-ops.js');
require('./rules/type-annotation-spacing.js');

var index = Object.assign(configs.plugin, { configs: configs.configs });

module.exports = index;
