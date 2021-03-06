/**
 * <p>Copyright (c) 2009-2013 by Appcelerator, Inc. All Rights Reserved.
 * Please see the LICENSE file for information about licensing.</p>
 *
 * An if or if/else statement
 *
 * @module rules/AST_If
 * @see ECMA-262 Spec Chapter 12.5
 */

/**
 * @event module:rules/AST_If.rule
 * @property {string} ruleName The string 'AST_If'
 * @property {module:AST.node} ast The AST node that is an instance of this rule
 * @property {string} file The file that the rule begins on.
 * @property {number} line The line of the file where the rule begins on.
 * @property {number} column The column of the file where the rule begins on.
 * @property {boolean} processingComplete Indicates whether the rule has been processed yet or not. This can be used to
 *		determine if this is the pre-evalutation event or the post-evaluation event.
 * @property {module:base.BaseType} conditional The value of the conditional. Only available post-evaluation.
 * @property {Array} result The return tuple of evaluating the block. Only available post-evaluation.
 */

var Base = require('../Base'),
	AST = require('../AST'),
	RuleProcessor = require('../RuleProcessor');

AST.registerRuleProcessor('AST_If', function processRule() {

	var leftValue,
		result,
		context = Base.getCurrentContext();

	RuleProcessor.preProcess(this);

	RuleProcessor.fireRuleEvent(this, {}, false);
	RuleProcessor.logRule('AST_If');

	leftValue = Base.getValue(this.condition.processRule());

	if (Base.type(leftValue) === 'Unknown') {
		this._ambiguousBlock = true;
		this.condition._unknown = true;
		Base.enterAmbiguousBlock();
		result = this.body.processRule();
		if (result[0] === 'return') {
			context._returnIsUnknown = true;
			context.lexicalEnvironment.envRec._ambiguousContext = true;
			result = ['normal', undefined, undefined];
		}
		if (this.alternative) {
			result = this.alternative.processRule();
			if (result[0] === 'return') {
				context._returnIsUnknown = true;
				context.lexicalEnvironment.envRec._ambiguousContext = true;
				result = ['normal', undefined, undefined];
			}
		}
		Base.exitAmbiguousBlock();
	} else if (Base.toBoolean(leftValue).value) {
		result = this.body.processRule();
		if (this.alternative) {
			Base.processInSkippedMode(this.alternative.processRule.bind(this.alternative));
		}
	} else {
		Base.processInSkippedMode(this.body.processRule.bind(this.body));
		if (this.alternative) {
			result = this.alternative.processRule();
		} else {
			result = ['normal', undefined, undefined];
		}
	}

	RuleProcessor.fireRuleEvent(this, {
		conditional: leftValue,
		result: result
	}, true);

	RuleProcessor.postProcess(this);

	return result;
});