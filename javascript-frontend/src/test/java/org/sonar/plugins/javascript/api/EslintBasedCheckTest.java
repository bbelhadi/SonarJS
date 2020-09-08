/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2020 SonarSource SA
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
package org.sonar.plugins.javascript.api;

import org.junit.Test;
import org.sonar.plugins.javascript.api.tree.Tree;
import org.sonar.plugins.javascript.api.visitors.Issue;
import org.sonar.plugins.javascript.api.visitors.TreeVisitorContext;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;


public class EslintBasedCheckTest {

  @Test
  public void test() {
    EslintBasedCheck check = () -> "key";

    assertThat(check.eslintKey()).isEqualTo("key");
    assertThat(check.configurations()).isEmpty();
    assertThat(check.scanFile(mock(TreeVisitorContext.class))).isEmpty();
    Issue issue = mock(Issue.class);
    assertThatThrownBy(() -> check.addIssue(issue)).isInstanceOf(IllegalStateException.class);
    Tree tree = mock(Tree.class);
    assertThatThrownBy(() -> check.addIssue(tree, "msg")).isInstanceOf(IllegalStateException.class);
    assertThatThrownBy(() -> check.addLineIssue(tree, "msg")).isInstanceOf(IllegalStateException.class);
  }

}
