#!/bin/bash
# 把 spring-boot-best-practice/doc 的 MD 文件按主题域复制到 columns/java-best-practices/
# 规则：复制不删除 + 清洗文件名 + 补 frontmatter（如缺失）

set -e

SRC="/d/prj/develop/Macaroon-Spring-Family/spring-boot-kata/spring-boot-best-practice/doc"
DST="/d/prj/opensource/nova-vault-studio/docs/md/columns/java-best-practices"

# 清洗文件名：去除噪声前缀
clean_name() {
    local name="$1"
    # 去除 [星标]- / [星标] 前缀
    name=$(echo "$name" | sed -E 's/^\[星标\][-]?//')
    # 去除 [架构] / [源码阅读] / [数据库] / [消息队列] / [校验] / [每日思考] / [持久化异步] / [星标] 前缀
    name=$(echo "$name" | sed -E 's/^\[(架构|源码阅读|数据库|消息队列|校验|每日思考|持久化异步|星标)\][-]?//')
    # 去除 【心得】 / 【思考】 / 【故障现场】 前缀（支持全/半角括号变体）
    name=$(echo "$name" | sed -E 's/^【(心得|思考|故障现场)】[-]?//')
    name=$(echo "$name" | sed -E 's/^\[(心得|思考|故障现场)\][-]?//')
    # 去除 simpread- 前缀
    name=$(echo "$name" | sed -E 's/^simpread[-]?//')
    # 去除 doc-spring-boot-senior-S29- / doc-worker-manage-M05- / doc-database-mysql-B02- 内部代号
    name=$(echo "$name" | sed -E 's/^doc-(spring-boot-senior|worker-manage|database-mysql)[-][A-Z0-9]+[-]?//')
    # 去除 26丨 / 27丨 / 28丨 / 29 丨 课程编号 + 后续空格
    name=$(echo "$name" | sed -E 's/^[0-9]{1,3} 丨 ?//')
    name=$(echo "$name" | sed -E 's/^[0-9]{1,3}丨 ?//')
    # 去除 [每日思考]_ 这种残留前缀
    name=$(echo "$name" | sed -E 's/^\[(每日思考)\]_//')
    # trim leading/trailing whitespace
    name=$(echo "$name" | sed -E 's/^ +//; s/ +$//')
    echo "$name"
}

# 补 frontmatter（如缺失）
add_frontmatter() {
    local filepath="$1"
    local title="$2"
    # 检查首行是否以 --- 开头
    local first_line=$(head -n 1 "$filepath")
    if [ "$first_line" != "---" ]; then
        # 用临时文件补 frontmatter
        local tmp="${filepath}.tmp"
        cat > "$tmp" <<EOF
---
title: "${title}"
date: "2023-04-13"
source: "Macaroon-Spring-Family/spring-boot-best-practice"
---

EOF
        cat "$filepath" >> "$tmp"
        mv "$tmp" "$filepath"
    fi
}

# 从文件名提取标题
extract_title() {
    local name="$1"
    name=$(echo "$name" | sed -E 's/\.md$//')
    echo "$name"
}

# 复制并清洗一个 MD 文件
copy_md() {
    local src_file="$1"
    local dst_dir="$2"
    local raw_basename=$(basename "$src_file")
    local clean=$(clean_name "$raw_basename")
    local title=$(extract_title "$clean")
    local dst_file="${dst_dir}/${clean}"

    if [ -f "$dst_file" ]; then
        echo "  SKIP (exists): $clean"
        return
    fi

    cp "$src_file" "$dst_file"
    add_frontmatter "$dst_file" "$title"
    echo "  OK: $clean"
}

echo "=== 01-domain-modeling ==="
mkdir -p "${DST}/01-domain-modeling"
# bizmodeling 全部 MD（不含子目录 assets/）
for f in "${SRC}/bizmodeling"/*.md; do
    [ -f "$f" ] && copy_md "$f" "${DST}/01-domain-modeling"
done
# 根目录 DDD/思维散落
for f in \
    "${SRC}/[星标]-那些年领域建模教会我的东西.md" \
    "${SRC}/[每日思考]_程序员必备的思维能力_结构化思维.md"; do
    [ -f "$f" ] && copy_md "$f" "${DST}/01-domain-modeling"
done
# systemdesign 里 DDD 相关的 MD
for f in \
    "${SRC}/systemdesign/[星标]业务量猛增！如何用 DDD 避免一场巨大的架构灾难？.md" \
    "${SRC}/systemdesign/5 分钟迅速掌握领域驱动设计的 40 个关键概念.md"; do
    [ -f "$f" ] && copy_md "$f" "${DST}/01-domain-modeling"
done

echo ""
echo "=== 02-architecture-design ==="
mkdir -p "${DST}/02-architecture-design"
# systemdesign 主体（除 DDD 和 sourcecode 已收走的）
for f in "${SRC}/systemdesign"/*.md; do
    [ -f "$f" ] || continue
    case "$(basename "$f")" in
        "[星标]业务量猛增！如何用 DDD 避免一场巨大的架构灾难？.md"|"5 分钟迅速掌握领域驱动设计的 40 个关键概念.md")
            continue ;;  # 已归 01
    esac
    copy_md "$f" "${DST}/02-architecture-design"
done
# systemdesign 根目录 MD（注意：bizmodeling 的源码阅读类已归 01）
# manage 的 MD 没有（只有 PDF），跳过

echo ""
echo "=== 03-clean-code ==="
mkdir -p "${DST}/03-clean-code"
# cleancode 全部 MD（不含 context_pattern/ 子目录）
for f in "${SRC}/cleancode"/*.md; do
    [ -f "$f" ] && copy_md "$f" "${DST}/03-clean-code"
done
# refactor 全部 MD
for f in "${SRC}/refactor"/*.md; do
    [ -f "$f" ] && copy_md "$f" "${DST}/03-clean-code"
done

echo ""
echo "=== 04-reliability ==="
mkdir -p "${DST}/04-reliability"
# faultcase 全部 MD（含数据库子目录）
for f in "${SRC}/faultcase"/*.md "${SRC}/faultcase/数据库相关"/*.md; do
    [ -f "$f" ] && copy_md "$f" "${DST}/04-reliability"
done
# idempotent 全部 MD
for f in "${SRC}/idempotent"/*.md; do
    [ -f "$f" ] && copy_md "$f" "${DST}/04-reliability"
done

echo ""
echo "=== 05-engineering-practice ==="
mkdir -p "${DST}/05-engineering-practice"
for f in \
    "${SRC}/simpread-程序员如何高效工作.md" \
    "${SRC}/simpread-利用 java8 对设计模式的重构.md" \
    "${SRC}/Splitter 助力解决 \"大集合参数\" 这个性能杀手.md" \
    "${SRC}/ThreadLocal：线程专属的变量.md" \
    "${SRC}/调用链跨线程传递 ThreadLocal 对象对比.md" \
    "${SRC}/内存 Join 可以如此简单！！！.md" \
    "${SRC}/战术模式 -- 值对象.md"; do
    [ -f "$f" ] && copy_md "$f" "${DST}/05-engineering-practice"
done

echo ""
echo "=== 完成 ==="
echo "总文件数："
for d in 01-domain-modeling 02-architecture-design 03-clean-code 04-reliability 05-engineering-practice; do
    cnt=$(ls "${DST}/$d"/*.md 2>/dev/null | wc -l)
    echo "  $d: $cnt"
done
