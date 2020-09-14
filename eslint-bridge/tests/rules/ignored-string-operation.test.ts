import { RuleTester } from 'eslint';
import { rule } from 'rules/ignored-string-operation';
import { RuleTesterTs } from '../RuleTesterTs';

const ruleTesterJs = new RuleTester({ parserOptions: { ecmaVersion: 2018, sourceType: 'module' } });
const ruleTesterTs = new RuleTesterTs(false);

const testCases = {
  valid: [
    {
      code: `
            var var1 = "abc".toUpperCase();
            `,
    },
    {
      code: `
            unknown.toUpperCase();
            `
    }
  ],
  invalid: [
    {
      code: `
            var foo = "abc";
            foo.toUpperCase();
            `,
      errors: 1,
    }
  ]
};

ruleTesterJs.run("todo", rule, testCases);
ruleTesterTs.run("todo", rule, testCases);
