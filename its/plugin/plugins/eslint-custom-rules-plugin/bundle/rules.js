exports.rules = [
  {
    ruleId: "customrule",
    ruleModule: {
      meta: {
        schema: [
          {
            // internal parameter for rules having secondary locations
            enum: ['sonar-runtime'],
          },
          {
            "title": "sonar-context",
            "type": "object",
            "properties": {
              "workDir": {
                "type": "string"
              }
            }
          }
        ],
      },
      create(context) {
        console.log('Options: ', context.options);
        return {
          CallExpression(node) {
            console.log("detected call expression");
            context.report({
              node: node.callee,
              message: JSON.stringify({message: "call", secondaryLocations: [
                  {
                    message: context.options[1].workDir,
                    line: node.loc.start.line,
                    column: node.loc.start.column,
                    endLine: node.loc.end.line,
                    endColumn: node.loc.end.column,
                  }
                ]})
            });
          },
        };
      },
    },
    ruleConfig: [],
  },
];
