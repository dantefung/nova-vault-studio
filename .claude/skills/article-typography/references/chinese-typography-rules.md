# Chinese Typography Rules

## Character Width Rules

### Full-Width (全角) Characters

**Use in Chinese context:**
```
Punctuation: ，。！？；：「」『』（）【】……——
Brackets: （说明）【注释】
Dashes: ——（破折号）、……（省略号）
```

### Half-Width (半角) Characters

**Use in English context or mixed text:**
```
Letters: A-Z, a-z
Numbers: 0-9 (unless in pure Chinese text)
English punctuation: , . ! ? ; : " " ' ' ( ) ... —
```

### Context-Based Conversion

```
✓ Pure Chinese:
这是第１章，共有１０节内容。→ 这是第 1 章，共有 10 节内容。

✓ Mixed with English:
Python 3.10 版本 (keep half-width)
使用 React 18 框架 (keep half-width)

✓ Technical content:
端口号 8080 (half-width numbers)
版本 v2.0.1 (half-width)
```

## Punctuation Rules

### Comma Usage

**Chinese comma (，) - Use in:**
```
Chinese sentences:
我喜欢读书，也喜欢写作。

List items in Chinese:
包括技术、设计、产品等领域。
```

**English comma (,) - Use in:**
```
English phrases within Chinese:
He said, "Hello, world!"

Technical terms:
support for Node.js, Python, and Go
```

### Period and Full Stop

```
Chinese: 。（句号）
这是一个完整的句子。

English: . (period)
This is a complete sentence.

Mixed: Follow the language of the sentence
中文句子用中文句号。
English sentence uses English period.
```

### Quotation Marks

**Chinese quotation marks:**
```
First level: 「」 or ""
Second level: 『』 or ''

Example:
他说：「我觉得『论语』很有意思。」
或
他说："我觉得'论语'很有意思。"
```

**English quotation marks in Chinese text:**
```
When quoting English:
他说了一句 "Hello, world!" 就离开了。
```

### Parentheses and Brackets

```
Chinese context: （）【】
这是一个例子（如上所示）。
参考资料【见附录】

English context or technical: () []
函数参数 (x, y, z)
数组 [1, 2, 3]
```

## Spacing Rules

### Spaces Around English Words

```
✓ Correct:
使用 Python 编程
在 GitHub 上查看
version 2.0 版本

✗ Wrong:
使用Python编程
在GitHub上查看
version2.0版本
```

### Spaces Around Numbers

```
✓ Correct:
共有 100 个用户
第 5 章
增长了 30%

✗ Wrong:
共有100个用户
第5章
增长了30%

Exception - No space for:
Unit tightly bound: 5kg, 10cm, 3GB
```

### No Spaces Around Chinese Punctuation

```
✓ Correct:
这是第一点，这是第二点。

✗ Wrong:
这是第一点 ， 这是第二点 。
这是第一点 ,这是第二点 .
```

### Spaces in Mixed Lists

```
✓ Correct:
支持 Python、JavaScript、Go 等语言

✗ Wrong:
支持 Python,JavaScript,Go 等语言
支持Python、JavaScript、Go等语言
```

## Special Symbols

### Ellipsis (省略号)

```
Chinese: ……（6 个点）
他说："我想……"

English: ... (3 dots)
He said: "I think..."
```

### Dash (破折号)

```
Chinese: ——（双横线）
这是说明——也就是注释。

English: — (em dash) or – (en dash)
This is an explanation—a note.
```

### Bullets and Lists

```
Unordered lists:
- 第一项
- 第二项
- 第三项

Or:
• 第一项
• 第二项
• 第三项

Ordered lists:
1. 第一步
2. 第二步
3. 第三步
```

## Common Mistakes and Fixes

| Wrong | Right | Reason |
|-------|-------|--------|
| 这是例子,这是说明. | 这是例子，这是说明。 | Use Chinese punctuation in Chinese text |
| 使用Python编程 | 使用 Python 编程 | Add spaces around English words |
| 他说:"你好" | 他说："你好" | Use Chinese colon before quotation |
| 第1章,第2章 | 第 1 章，第 2 章 | Add spaces around numbers, use Chinese comma |
| 共有100个 | 共有 100 个 | Add space between number and Chinese character |
| 我想... | 我想…… | Use Chinese ellipsis (6 dots) |

## Context-Sensitive Rules

### Technical Documentation

```
Prefer half-width for:
- All code, commands, file names
- Version numbers: v1.0.2
- URLs, emails
- Technical parameters

Keep Chinese punctuation for:
- Descriptive sentences
- Explanatory paragraphs
```

### Formal Writing

```
Use:
- Standardized Chinese punctuation throughout
- Full-width brackets for annotations: （说明）
- Proper quotation mark nesting: 「『』」
```

### Casual/Social Media

```
Allowed flexibility:
- Mix of punctuation styles (but still prefer consistency)
- Emoji (use sparingly)
- Abbreviated expressions

Still maintain:
- Spaces around English words
- Clear paragraph breaks
```

## When in Doubt

**Priority order:**
1. Preserve meaning and readability
2. Follow the context (technical vs formal vs casual)
3. Be consistent within the same document
4. When rules conflict, choose the one that improves readability

**Ask yourself:**
- Does this make the text easier to read?
- Is the punctuation consistent with surrounding content?
- Would a native reader find this natural?
