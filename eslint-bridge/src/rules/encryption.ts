/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2018 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

// https://jira.sonarsource.com/browse/RSPEC-4787

import { Rule } from "eslint";
import * as estree from "estree";
import {
  isIdentifier,
  getModuleNameOfIdentifier,
  getModuleNameOfImportedIdentifier,
  isMemberWithProperty,
} from "./utils";

const message = `Make sure that encrypting data is safe here.`;

const clientSideEncryptMethods = ["encrypt", "decrypt"];
const serverSideEncryptMethods = [
  "createCipher",
  "createCipheriv",
  "createDecipher",
  "createDecipheriv",
  "publicEncrypt",
  "publicDecrypt",
  "privateEncrypt",
  "privateDecrypt",
];

export const rule: Rule.RuleModule = {
  create(context: Rule.RuleContext) {
    // for client side
    let usingCryptoInFile = false;

    return {
      Program() {
        // init flag for each file
        usingCryptoInFile = false;
      },

      MemberExpression(node: estree.Node) {
        // detect 'SubtleCrypto' object
        // which can be retrieved by 'crypto.subtle' or 'window.crypto.subtle'
        const { object, property } = node as estree.MemberExpression;
        if (
          isIdentifier(property, "subtle") &&
          (isIdentifier(object, "crypto") || isMemberWithProperty(object, "crypto"))
        ) {
          usingCryptoInFile = true;
        }
      },

      "CallExpression:exit"(node: estree.Node) {
        const { callee } = node as estree.CallExpression;

        if (usingCryptoInFile) {
          // e.g.: crypto.subtle.encrypt()
          checkForClientSide(callee, context);
        }

        // e.g.
        // const crypto = require("crypto");
        // const cipher = crypto.createCipher(alg, key);
        checkForServerSide(callee, context);
      },
    };
  },
};

function checkForServerSide(callee: estree.Node, context: Rule.RuleContext) {
  let moduleName: estree.Literal | undefined;
  if (
    isMemberWithProperty(callee, ...serverSideEncryptMethods) &&
    callee.object.type === "Identifier"
  ) {
    moduleName = getModuleNameOfIdentifier(callee.object, context);
  } else if (isIdentifier(callee, ...serverSideEncryptMethods)) {
    moduleName = getModuleNameOfImportedIdentifier(callee, context);
  }
  if (moduleName && moduleName.value === "crypto") {
    context.report({
      message,
      node: callee,
    });
  }
}

function checkForClientSide(callee: estree.Node, context: Rule.RuleContext) {
  if (
    isIdentifier(callee, ...clientSideEncryptMethods) ||
    isMemberWithProperty(callee, ...clientSideEncryptMethods)
  ) {
    context.report({
      message,
      node: callee,
    });
  }
}