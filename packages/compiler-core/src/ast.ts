import { isString } from '@vue/shared'
import { CREATE_ELEMENT_VNODE } from './runtimeHelpers'

export const enum NodeTypes {
  ROOT,
  ELEMENT,
  TEXT,
  COMMENT,
  SIMPLE_EXPRESSION,
  INTERPOLATION,
  ATTRIBUTE,
  DIRECTIVE,
  // containers
  COMPOUND_EXPRESSION,
  IF,
  IF_BRANCH,
  FOR,
  TEXT_CALL,
  // codegen
  VNODE_CALL,
  JS_CALL_EXPRESSION,
  JS_OBJECT_EXPRESSION,
  JS_PROPERTY,
  JS_ARRAY_EXPRESSION,
  JS_FUNCTION_EXPRESSION,
  JS_CONDITIONAL_EXPRESSION,
  JS_CACHE_EXPRESSION,

  // ssr codegen
  JS_BLOCK_STATEMENT,
  JS_TEMPLATE_LITERAL,
  JS_IF_STATEMENT,
  JS_ASSIGNMENT_EXPRESSION,
  JS_SEQUENCE_EXPRESSION,
  JS_RETURN_STATEMENT
}

export const enum ElementTypes {
  ELEMENT,
  COMPONENT,
  SLOT,
  TEMPLATE
}

export function createVNodeCall(context, tag, props?, children?) {
  if (context) {
    context.helper(CREATE_ELEMENT_VNODE)
  }

  return {
    type: NodeTypes.VNODE_CALL,
    tag,
    props,
    children
  }
}

export function createConditionalExpression(
  test,
  consequent,
  alternate,
  newline = true
) {
  return {
    type: NodeTypes.JS_CONDITIONAL_EXPRESSION,
    test,
    consequent,
    alternate,
    newline,
    loc: {}
  }
}

export function createSimpleExpression(content, isStatic) {
  return {
    type: NodeTypes.SIMPLE_EXPRESSION,
    loc: {},
    content,
    isStatic
  }
}

export function createObjectProperty(key, value) {
  return {
    type: NodeTypes.JS_PROPERTY,
    loc: {},
    key: isString(key) ? createSimpleExpression(key, true) : key,
    value
  }
}

export function createCallExpression(callee, args) {
  return {
    type: NodeTypes.JS_CALL_EXPRESSION,
    loc: {},
    callee,
    arguments: args
  }
}
