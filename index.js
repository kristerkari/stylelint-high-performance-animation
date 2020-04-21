"use strict";

const declarationValueIndex = require("stylelint/lib/utils/declarationValueIndex");
const postcss = require("postcss");
const stylelint = require("stylelint");
const valueParser = require("postcss-value-parser");

const ruleName = "plugin/no-low-performance-animation-properties";

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (type, prop) =>
    `Unexpected use of low performance ${type} property (${prop}).`
});

const isString = s => typeof s === "string";

// https://drafts.csswg.org/css-timing/
const cssLinearTimingFunctions = ["linear"];
const cssCubicBezierTimingFunctions = [
  "ease",
  "ease-in",
  "ease-out",
  "ease-in-out",
  "cubic-bezier"
];
const cssStepTimingFunctions = ["step-start", "step-end", "steps"];
const cssFramesTimingFunctions = ["frames"];
const cssTimingFunctions = [].concat(
  cssLinearTimingFunctions,
  cssCubicBezierTimingFunctions,
  cssStepTimingFunctions,
  cssFramesTimingFunctions
);
const cssTimingFunctionsRE = new RegExp(
  "^(" + cssTimingFunctions.join("|") + ").*"
);

const propsThatCauseLayout = [
  "position",
  "top",
  "bottom",
  "left",
  "right",
  "width",
  "height",
  "min-height",
  "max-height",
  "max-width",
  "min-width",
  "padding",
  "padding-bottom",
  "padding-left",
  "padding-right",
  "padding-top",
  "margin",
  "margin-bottom",
  "margin-left",
  "margin-right",
  "margin-top",
  "display",
  "border-width",
  "border-spacing",
  "border-collapse",
  "border",
  "font",
  "font-size",
  "font-family",
  "font-weight",
  "font-style",
  "float",
  "overflow-y",
  "overflow-x",
  "overflow",
  "line-height",
  "vertical-align",
  "clear",
  "white-space",
  "list-style",
  "list-style-type",
  "zoom",
  "content",
  "box-sizing",
  "text-shadow",
  "text-align",
  "text-indent",
  "text-transform",
  "text-overflow",
  "word-wrap",
  "letter-spacing",
  "appearance",
  "direction"
];

const propsThatCausePaint = [
  "color",
  "border-color",
  "border-style",
  "border-radius",
  "visibility",
  "text-decoration",
  "background",
  "background-color",
  "background-size",
  "background-image",
  "background-position",
  "background-repeat",
  "outline",
  "outline-style",
  "outline-width",
  "outline-color",
  "box-shadow"
];

const getBlacklist = ignore => {
  if (ignore === "paint-properties") {
    return propsThatCauseLayout;
  }
  return propsThatCauseLayout.concat(propsThatCausePaint);
};

module.exports = stylelint.createPlugin(
  ruleName,
  (actual, options) => (cssRoot, result) => {
    const validOptions = stylelint.utils.validateOptions(
      result,
      ruleName,
      { actual },
      {
        actual: options,
        possible: {
          ignore: ["paint-properties"],
          ignoreProperties: [isString]
        },
        optional: true
      }
    );

    if (!validOptions) return;

    const blacklist = getBlacklist(options && options.ignore);
    const ignored =
      options && options.ignoreProperties ? options.ignoreProperties : [];

    cssRoot.walkDecls("transition-property", decl => {
      valueParser(decl.value).walk(node => {
        const val = postcss.vendor.unprefixed(node.value);
        if (
          node.type === "word" &&
          ignored.indexOf(val) === -1 &&
          (blacklist.indexOf(val) > -1 || val === "all")
        ) {
          const index = declarationValueIndex(decl) + node.sourceIndex;
          stylelint.utils.report({
            ruleName,
            result,
            node: decl,
            message: messages.rejected("transition", node.value),
            index
          });
        }
      });
    });

    cssRoot.walkDecls("transition", decl => {
      const nodes = [];

      valueParser(decl.value).walk(node => {
        if (node.type === "word" || node.type === "function")
          nodes.push({
            index: node.sourceIndex,
            value: node.value
          });
        return false;
      });

      if (ignored.indexOf("all") === -1) {
        const transitionProp = nodes.filter(node => {
          const isUnit = valueParser.unit(node.value);
          const isTimingFunction = cssTimingFunctionsRE.test(node.value);
          if (isUnit || isTimingFunction) {
            return false;
          }
          return node;
        });

        if (nodes.length && transitionProp.length === 0) {
          stylelint.utils.report({
            ruleName,
            result,
            node: decl,
            message: messages.rejected("transition", "all"),
            index: declarationValueIndex(decl) + nodes[0].index
          });
          return;
        }
      }

      for (const prop of nodes) {
        const index = declarationValueIndex(decl) + prop.index;
        const val = postcss.vendor.unprefixed(prop.value);
        if (
          ignored.indexOf(val) === -1 &&
          (blacklist.indexOf(val) > -1 || val === "all")
        ) {
          stylelint.utils.report({
            ruleName,
            result,
            node: decl,
            message: messages.rejected("transition", prop.value),
            index
          });
        }
      }
    });

    cssRoot.walkAtRules(/^keyframes$/i, atRuleKeyframes => {
      atRuleKeyframes.walkDecls(decl => {
        const val = postcss.vendor.unprefixed(decl.prop);
        if (ignored.indexOf(val) === -1 && blacklist.indexOf(val) > -1) {
          stylelint.utils.report({
            ruleName,
            result,
            node: decl,
            message: messages.rejected("animation", decl.prop)
          });
        }
      });
    });
  }
);

module.exports.ruleName = ruleName;
module.exports.messages = messages;
