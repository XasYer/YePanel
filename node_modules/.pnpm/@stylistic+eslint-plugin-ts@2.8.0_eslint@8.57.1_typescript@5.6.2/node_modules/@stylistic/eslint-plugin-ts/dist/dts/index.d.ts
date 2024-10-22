import { Rule, Linter } from 'eslint';
import { UnprefixedRuleOptions } from './rule-options.js';
export { RuleOptions } from './rule-options.js';

type Rules = {
  [K in keyof UnprefixedRuleOptions]: Rule.RuleModule
}

declare const plugin: {
  rules: Rules
  configs: {
    /**
     * Disable all legacy rules from `@typescript-eslint`
     *
     * This config works for both flat and legacy config format
     */
    'disable-legacy': Linter.Config
    /**
     * Enable all rules, in Flat Config Format
     */
    'all-flat': Linter.Config
    /**
     * Enable all rules, in Legacy Config Format
     */
    'all-extends': Linter.BaseConfig
  }
}

export { type Rules, UnprefixedRuleOptions, plugin as default };
