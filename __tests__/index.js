"use strict";

const fn = require("../");

testRule(fn.rule, {
  ruleName: fn.ruleName,
  skipBasicChecks: true,
  config: [true],
  accept: [
    {
      code: `div {
        font-size: 14px;
        width: 200px;
        transition-property: opacity;
      }`
    },
    {
      code: "div { transition-property: transform; }"
    },
    {
      code: "div { transition-property: transform, opacity; }"
    },
    {
      code: "div { transition: opacity 0.3s steps(4, end); }"
    },
    {
      code: "div { transition: 350ms step-start opacity; }"
    },
    {
      code:
        "div { transition: opacity 350ms easy-in 100ms, transform 350ms linear 200ms; }"
    },
    {
      code: "div { transition: none; }"
    },
    {
      code: "div { transition: inherit; }"
    },
    {
      code: "div { transition: initial; }"
    },
    {
      code: "div { transition: opacity 250ms $timingFunction; }"
    },
    {
      code: "@keyframes test {0% { opacity: 0 } 100% {opacity: 1}}"
    },
    {
      code: "div { transition-property: -webkit-transform; }"
    },
    {
      code: "div { transition-property: -webkit-text-stroke-color; }"
    },
    {
      code: "div { transition-property: cursor; }"
    },
    {
      code: `
        .test {
          transition: -webkit-text-stroke-color 2ms linear;
        }
      `
    },
    {
      code: "div { transition: var(--sidebar-transition); }",
      description: "should ignore CSS variables"
    },
    {
      code: "div { transition: }",
      description: "does not crash with an empty transition value"
    }
  ],
  reject: [
    {
      code: "div { transition-property: all; }",
      message: fn.messages.rejected("transition", "all"),
      line: 1,
      column: 28
    },
    {
      code: "div { transition-property: width; }",
      message: fn.messages.rejected("transition", "width"),
      line: 1,
      column: 28
    },
    {
      code: "div { transition-property: transform, opacity, width; }",
      message: fn.messages.rejected("transition", "width")
    },
    {
      code: "div { transition: all 0.3s; }",
      message: fn.messages.rejected("transition", "all"),
      line: 1,
      column: 19
    },
    {
      code: "div { transition: 0.3s; }",
      message: fn.messages.rejected("transition", "all"),
      line: 1,
      column: 19
    },
    {
      code: "div { transition: 0.3s 100ms; }",
      message: fn.messages.rejected("transition", "all"),
      line: 1,
      column: 19
    },
    {
      code: "div { transition: 0.3s linear 100ms; }",
      message: fn.messages.rejected("transition", "all"),
      line: 1,
      column: 19
    },
    {
      code: "div { transition: 300ms cubic-bezier(0.25,0.1,0.25,1) .1s; }",
      message: fn.messages.rejected("transition", "all"),
      line: 1,
      column: 19
    },
    {
      code: "div { transition: padding 0.3s step-start; }",
      message: fn.messages.rejected("transition", "padding")
    },
    {
      code: "div { transition: 350ms width, padding 150ms; }",
      message: fn.messages.rejected("transition", "width"),
      line: 1,
      column: 25
    },
    {
      code:
        "div { transition: opacity 350ms easy-in 100ms, transform 350ms linear 200ms, padding 200ms ease-out; }",
      message: fn.messages.rejected("transition", "padding")
    },
    {
      code: "div { transition: -webkit-appearance 350ms easy-in 100ms; }",
      message: fn.messages.rejected("transition", "-webkit-appearance")
    },
    {
      code: "div { transition-property: -webkit-appearance; }",
      message: fn.messages.rejected("transition", "-webkit-appearance")
    },
    {
      code: "div { transition: -webkit-border-radius  0.3s linear; }",
      message: fn.messages.rejected("transition", "-webkit-border-radius"),
      line: 1,
      column: 19
    },
    {
      code: `
div {
  font-size: 14px;
  width: 200px;
  transition-property: margin;
}`,
      message: fn.messages.rejected("transition", "margin"),
      line: 5,
      column: 24
    },
    {
      code: `
@keyframes test{
  50% { top: 1px; }
}`,
      message: fn.messages.rejected("animation", "top"),
      line: 3,
      column: 9
    },

    {
      code: `
@keyframes foo {
  50% { -webkit-border-radius: 10px; }
}`,
      message: fn.messages.rejected("animation", "-webkit-border-radius"),
      line: 3,
      column: 9
    }
  ]
});

testRule(fn.rule, {
  ruleName: fn.ruleName,
  skipBasicChecks: true,
  config: [
    true,
    {
      ignoreProperties: ["color", "background-color", "all"]
    }
  ],
  accept: [
    {
      code: "div { transition-property: transform, color; }"
    },
    {
      code: "div { transition-property: color; }"
    },
    {
      code: "div { transition-property: all; }"
    },
    {
      code: "div { transition: all 0.2s; }"
    },
    {
      code: "div { transition: 0.3s; }"
    },
    {
      code: "div { transition: 0.3s 100ms; }"
    },
    {
      code: "div { transition: 0.3s linear 100ms; }"
    },
    {
      code: "div { transition: 300ms cubic-bezier(0.25,0.1,0.25,1) .1s; }"
    },
    {
      code: "div { transition-property: background-color, color; }"
    },
    {
      code: "@keyframes test {0% { color: black } 100% {color: white}}"
    }
  ],
  reject: [
    {
      code: "div { transition-property: transform, color, border; }",
      message: fn.messages.rejected("transition", "border"),
      line: 1,
      column: 46
    },
    {
      code: "@keyframes test {0% { border-width: 2px }}",
      message: fn.messages.rejected("animation", "border-width"),
      line: 1,
      column: 23
    }
  ]
});

testRule(fn.rule, {
  ruleName: fn.ruleName,
  skipBasicChecks: true,
  config: [
    true,
    {
      ignore: "paint-properties"
    }
  ],
  accept: [
    {
      code: "div { transition-property: transform, color; }"
    },
    {
      code: "div { transition-property: color; }"
    },
    {
      code: "div { transition-property: text-decoration, color; }"
    },
    {
      code: "@keyframes test {0% { color: black } 100% {color: white}}"
    }
  ],
  reject: [
    {
      code: "div { transition-property: transform, color, border; }",
      message: fn.messages.rejected("transition", "border"),
      line: 1,
      column: 46
    },
    {
      code: "@keyframes test {0% { border-width: 2px }}",
      message: fn.messages.rejected("animation", "border-width"),
      line: 1,
      column: 23
    }
  ]
});

testRule(fn.rule, {
  ruleName: fn.ruleName,
  skipBasicChecks: true,
  config: [
    true,
    {
      severity: "error"
    }
  ],
  accept: [
    {
      code: "div { transition-property: transform; }",
      description: "severity as secondary option is supported"
    }
  ]
});

testRule(fn.rule, {
  ruleName: fn.ruleName,
  skipBasicChecks: true,
  syntax: "scss",
  config: [true],
  accept: [
    {
      code: "div { transition: $variable; }",
      description: "should ignore Scss variables"
    },
    {
      code: "div { transition: ($variable + $variable); }",
      description: "should ignore Scss list"
    }
  ]
});

testRule(fn.rule, {
  ruleName: fn.ruleName,
  skipBasicChecks: true,
  syntax: "less",
  config: [true],
  accept: [
    {
      code: "div { transition: @variable; }",
      description: "should ignore LESS variables"
    },
    {
      code: "div { transition: (@variable + @variable); }",
      description: "should ignore LESS list"
    }
  ]
});
