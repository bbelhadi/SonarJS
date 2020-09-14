// https://jira.sonarsource.com/browse/RSPEC-1154
import { Rule } from 'eslint';
import * as estree from 'estree';
import { isRequiredParserServices } from '../utils/isRequiredParserServices';
import { getTypeAsString } from './utils';

export const rule: Rule.RuleModule = {
  create(context: Rule.RuleContext) {
    return {
      ExpressionStatement(node: estree.Node) {
        const services = context.parserServices;
        const canResolveType = isRequiredParserServices(services);
        const expressionStatement = node as estree.ExpressionStatement;
        const expression = expressionStatement.expression;
        if (expression.type !== "CallExpression") {
          return;
        }
        if (expression.callee.type !== "MemberExpression") {
          return;
        }
        if (canResolveType) {
          const object = expression.callee.object;
          const type = getTypeAsString(object, services);
          if (type === "string" || type === "String") {
            context.report({node, message: "TODO"});
          }
        }
      }
    }
  }
}
