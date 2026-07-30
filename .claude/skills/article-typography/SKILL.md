---
name: article-typography
description: Optimize Chinese article typography and formatting for better readability. Use when user wants to "优化排版", "格式化文章", "美化文本", "优化文字", "排版优化", "improve typography", "format article", "beautify text", "optimize layout", "polish article formatting", or mentions making text more readable, fixing formatting issues, optimizing paragraph structure, standardizing punctuation, or improving Chinese text presentation. Automatically handles character normalization, punctuation standardization, paragraph flow optimization, and removes excessive repetition. Triggers on "排版", "优化文章", "格式化", "美化", "文字优化", "typography", "format", "layout", "readability".
---

# Article Typography Optimizer

**IRON LAW: Never change the core meaning or factual accuracy of the content. Typography optimization must preserve information integrity while improving presentation.**

## Workflow Checklist

```
- [ ] Step 1: Analyze Input ⚠️ REQUIRED
  - [ ] 1.1 Identify source format and language mix
  - [ ] 1.2 Detect typography issues (punctuation, spacing, repetition)
  - [ ] 1.3 Assess paragraph structure and flow
  - [ ] 1.4 Check for ambiguous or unclear passages
- [ ] Step 2: Optimize Characters and Punctuation
  - [ ] 2.1 Convert all characters to proper Chinese format
  - [ ] 2.2 Standardize punctuation (Chinese vs English context)
  - [ ] 2.3 Fix spacing around punctuation marks
  - [ ] 2.4 Normalize quotation marks and brackets
- [ ] Step 3: Optimize Paragraph Structure
  - [ ] 3.1 Remove excessive repetition without losing meaning
  - [ ] 3.2 Improve paragraph transitions and flow
  - [ ] 3.3 Add appropriate line breaks for readability
  - [ ] 3.4 Optimize sentence length and rhythm
- [ ] Step 4: Polish Ambiguous Content
  - [ ] 4.1 Clarify vague expressions
  - [ ] 4.2 Improve sentence structure
  - [ ] 4.3 Ensure logical coherence
- [ ] Step 5: Final Review
  - [ ] 5.1 Verify meaning preserved
  - [ ] 5.2 Check readability improvement
  - [ ] 5.3 Ensure consistent style
```

## Parameters

Support these command-line style flags:

- `--style <type>`: Output style (`formal`, `casual`, `technical`, `literary`) - default: auto-detect
- `--preserve-format`: Keep original markdown/HTML structure
- `--aggressive`: More aggressive optimization (remove more repetition, restructure more)
- `--output <file>`: Save optimized text to file instead of returning inline

**Examples:**
```bash
# Basic optimization
article-typography

# Formal style with preserved markdown
article-typography --style formal --preserve-format

# Aggressive optimization
article-typography --aggressive

# Save to file
article-typography --output optimized.md
```

## Step 1: Analyze Input

First, understand what needs optimization:

**Q1: What is the source format?**
- Plain text?
- Markdown with formatting?
- Mixed Chinese/English?
- Has HTML tags?
- Contains code blocks?

**Q2: What are the main typography issues?**
- Mixed Chinese/English punctuation?
- Inconsistent spacing?
- Excessive repetition?
- Poor paragraph breaks?
- Ambiguous expressions?

**Q3: What style should the output be?**
- Formal (business, academic)
- Casual (blog, social media)
- Technical (documentation)
- Literary (creative writing)

Parse parameters if provided. Otherwise, auto-detect from content.

**Anti-pattern:** Don't assume the style. Different contexts need different typography rules.

## Step 2: Optimize Characters and Punctuation

Apply these rules systematically:

### Chinese Punctuation Rules

**In Chinese context:**
```
使用：，。！？；：「」『』（）……——
```

**In English context (within Chinese text):**
```
Keep: , . ! ? ; : " " ' ' ( ) ... —
```

**Mixed scenarios:**
```
中文句子，English phrase，继续中文。
Use commas (,) after English, Chinese commas (，) in Chinese.
```

### Character Normalization

```
全角 → 半角 (for numbers/letters in mixed text)
１２３ → 123
ＡＢＣ → ABC

But keep:
- Full-width punctuation in Chinese sentences
- Full-width brackets in Chinese context
- Proper spacing around English words: "这是 English word 的用法"
```

### Spacing Rules

```
✓ Correct:
这是一个 example 的用法。
使用 Python 3.10 版本。

✗ Wrong:
这是一个example的用法。
使用Python3.10版本。
```

**Anti-pattern:** Don't blindly convert all punctuation. Context matters.

## Step 3: Optimize Paragraph Structure

### Remove Excessive Repetition

**Identify patterns:**
- Same phrase repeated within 2-3 sentences
- Redundant qualifiers (很、非常、十分 stacked)
- Duplicate information in adjacent paragraphs

**Example:**
```
❌ Before:
这个方法非常好，非常实用，而且非常简单。这个方法真的很好用。

✓ After:
这个方法好用、实用且简单。
```

**Constraint:** Only remove redundancy that doesn't serve emphasis or rhetorical purpose.

### Improve Paragraph Flow

**Add transitions where missing:**
```
❌ Disconnected:
用户需要更好的体验。产品设计要简洁。

✓ Connected:
用户需要更好的体验，因此产品设计要简洁。
或
用户需要更好的体验。为此，产品设计要简洁。
```

**Break long paragraphs:**
```
Rule: If paragraph > 5 sentences or > 200 characters, consider splitting.

Split at:
- Topic shifts
- List items (convert to bullet points if appropriate)
- Before/after examples
```

### Optimize Sentence Rhythm

**Vary sentence length:**
```
❌ Monotonous:
这是第一点。这是第二点。这是第三点。

✓ Varied:
这是第一点。第二点更加重要，因为它涉及到核心逻辑。第三点。
```

## Step 4: Polish Ambiguous Content

**Clarify vague expressions:**

```
❌ Vague: 这个东西很重要
✓ Clear: 这个功能对用户体验很重要

❌ Vague: 差不多就是这样
✓ Clear: 基本流程是这样的

❌ Vague: 有些情况下可能会...
✓ Clear: 当用户输入为空时，可能会...
```

**Improve sentence structure:**

```
❌ Awkward: 因为要实现功能，所以，需要我们去做一些准备工作
✓ Smooth: 为了实现这个功能，我们需要做一些准备工作

❌ Unclear: 关于这个问题的解决方案的思路的想法是...
✓ Clear: 解决这个问题的思路是...
```

**Anti-pattern:** Don't over-polish to the point where it loses the author's voice. Preserve natural expression while fixing clarity issues.

## Step 5: Final Review

Before returning the optimized text, verify:

**Q1: Is the core meaning preserved?**
- Compare key facts and arguments
- Check that no critical information was lost
- Verify numbers, names, and technical terms unchanged

**Q2: Is readability improved?**
- Are paragraphs well-structured?
- Is punctuation consistent?
- Are transitions smooth?
- Is repetition reduced?

**Q3: Is the style consistent?**
- Does it match the target style (formal/casual/technical/literary)?
- Is the tone unified throughout?
- Are formatting conventions consistent?

## Typography Guidelines Reference

Load `references/chinese-typography-rules.md` for detailed rules on:
- Full-width vs half-width characters
- Chinese vs English punctuation in mixed text
- Spacing around numbers and English words
- Quotation mark nesting rules
- List formatting conventions

Load `references/readability-patterns.md` for:
- Optimal paragraph length by content type
- Sentence rhythm patterns
- Transition phrase templates
- Common ambiguity patterns to fix

## Anti-Patterns (What NOT to Do)

❌ **Don't change technical terms or proper nouns**
   → Keep original: API, GitHub, React, 张三, etc.

❌ **Don't blindly convert all punctuation to Chinese**
   → Use appropriate punctuation based on context

❌ **Don't remove all repetition**
   → Some repetition serves emphasis or rhetorical purpose

❌ **Don't over-formalize casual content**
   → Preserve the author's voice and intended tone

❌ **Don't add information not in the original**
   → Only clarify, never invent content

❌ **Don't break markdown/code formatting**
   → Preserve code blocks, links, images as-is

❌ **Don't optimize content you don't understand**
   → When ambiguous, ask user for clarification rather than guessing

## Pre-Delivery Checklist

Before returning optimized text:
- [ ] All Chinese punctuation is correct (，。！？not ,.)
- [ ] English words/numbers have proper spacing in Chinese text
- [ ] No excessive repetition remains
- [ ] Paragraph breaks are logical and improve readability
- [ ] All original meaning and facts are preserved
- [ ] Technical terms and proper nouns unchanged
- [ ] Code blocks and markdown formatting intact (if applicable)
- [ ] Style is consistent throughout
- [ ] Ambiguous passages are clarified (or flagged for user review)

## Output Format

Return the optimized text with:
1. The fully optimized content
2. Brief summary of changes made (optional, unless user asks)
3. Any ambiguities that need user clarification (if any)

**Example output structure:**
```markdown
[Optimized text here]

---

优化说明：
- 统一了中英文标点符号
- 优化了段落衔接
- 移除了 X 处重复表述
- 改进了 Y 个模糊表达
```
