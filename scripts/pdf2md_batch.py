#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PDF 批量转 MD
- 文字：pdftotext -layout (排版好)
- 图片：PyMuPDF (fitz) 提取嵌入图片
- 输出：MD + images/{slug}/
"""
import subprocess
import re
import sys
import os
from pathlib import Path

import fitz  # PyMuPDF

SRC = Path("D:/prj/develop/Macaroon-Spring-Family/spring-boot-kata/spring-boot-best-practice/doc")
COL = Path("D:/prj/opensource/nova-vault-studio/docs/md/columns/java-best-practices")

# (相对源路径, 目标主题域, 输出文件名, 标题)
PDF_MAP = [
    # ===== 01-domain-modeling =====
    ("[星标]从横向和纵向两个维度寻求复杂问题的答案.pdf",
     "01-domain-modeling", "从横向和纵向两个维度寻求复杂问题的答案", "从横向和纵向两个维度寻求复杂问题的答案"),
    ("[星标]多图详解：金字塔原理如何指导技术系统优化.pdf",
     "01-domain-modeling", "多图详解-金字塔原理如何指导技术系统优化", "多图详解：金字塔原理如何指导技术系统优化"),
    ("[星标]长文多图：结合DDD讲清楚编写技术方案的七大维度.pdf",
     "01-domain-modeling", "长文多图-结合DDD讲清楚编写技术方案的七大维度", "长文多图：结合 DDD 讲清楚编写技术方案的七大维度"),
    ("DDD上下文映射.pdf",
     "01-domain-modeling", "DDD上下文映射", "DDD 上下文映射"),
    ("领域驱动设计--战术模式简介.pdf",
     "01-domain-modeling", "领域驱动设计-战术模式简介", "领域驱动设计：战术模式简介"),
    # bizmodeling/
    ("bizmodeling/[架构]thoughtworks_现代企业架构白皮书.pdf",
     "01-domain-modeling", "thoughtworks-现代企业架构白皮书", "ThoughtWorks 现代企业架构白皮书"),
    ("bizmodeling/[架构]架构设计：如何区分变与不变，建立边界与结构？.pdf",
     "01-domain-modeling", "架构设计-如何区分变与不变-建立边界与结构", "架构设计：如何区分变与不变，建立边界与结构"),
    ("bizmodeling/[架构]架构师成长之路：如何做好架构设计？.pdf",
     "01-domain-modeling", "架构师成长之路-如何做好架构设计", "架构师成长之路：如何做好架构设计"),
    ("bizmodeling/[源码阅读]如何去阅读源码.pdf",
     "01-domain-modeling", "如何去阅读源码", "如何去阅读源码"),
    ("bizmodeling/[源码阅读]有哪些你不知道的阅读源码的技巧.pdf",
     "01-domain-modeling", "有哪些你不知道的阅读源码的技巧", "有哪些你不知道的阅读源码的技巧"),
    ("bizmodeling/[源码阅读]阅读源码方法.pdf",
     "01-domain-modeling", "阅读源码方法", "阅读源码方法"),
    ("bizmodeling/a-programmer-s-cognitive-experience.pdf",
     "01-domain-modeling", "a-programmer-s-cognitive-experience", "A Programmer's Cognitive Experience"),
    ("bizmodeling/DDD建模工作坊指南.pdf",
     "01-domain-modeling", "DDD建模工作坊指南", "DDD 建模工作坊指南"),
    ("bizmodeling/懂微服务、懂得搭建各种技术框架就是架构师了吗.pdf",
     "01-domain-modeling", "懂微服务就是架构师了吗", "懂微服务、懂得搭建各种技术框架就是架构师了吗"),
    ("bizmodeling/复杂是技术系统根本属性.pdf",
     "01-domain-modeling", "复杂是技术系统根本属性", "复杂是技术系统根本属性"),
    ("bizmodeling/横向和纵向两个维度思考复杂系统.pdf",
     "01-domain-modeling", "横向和纵向两个维度思考复杂系统", "横向和纵向两个维度思考复杂系统"),
    ("bizmodeling/结构化思维指导系统优化.pdf",
     "01-domain-modeling", "结构化思维指导系统优化", "结构化思维指导系统优化"),
    ("bizmodeling/面向对象分析与设计的底层逻辑.pdf",
     "01-domain-modeling", "面向对象分析与设计的底层逻辑", "面向对象分析与设计的底层逻辑"),
    ("bizmodeling/迄今为止最完整的DDD实践.pdf",
     "01-domain-modeling", "迄今为止最完整的DDD实践", "迄今为止最完整的 DDD 实践"),
    ("bizmodeling/如何快速理解复杂业务，系统思考问题？.pdf",
     "01-domain-modeling", "如何快速理解复杂业务-系统思考问题", "如何快速理解复杂业务，系统思考问题"),
    ("bizmodeling/软件复杂度的思考与解决之道.pdf",
     "01-domain-modeling", "软件复杂度的思考与解决之道", "软件复杂度的思考与解决之道"),
    ("bizmodeling/软件工程中建模的底层逻辑.pdf",
     "01-domain-modeling", "软件工程中建模的底层逻辑", "软件工程中建模的底层逻辑"),
    ("bizmodeling/软件开发中的核心底层思想.pdf",
     "01-domain-modeling", "软件开发中的核心底层思想", "软件开发中的核心底层思想"),
    ("bizmodeling/业务单据进行领域驱动设计的最佳实践.pdf",
     "01-domain-modeling", "业务单据进行领域驱动设计的最佳实践", "业务单据进行领域驱动设计的最佳实践"),
    ("bizmodeling/殷浩详解 DDD：如何避免写流水账代码？.pdf",
     "01-domain-modeling", "殷浩详解DDD-如何避免写流水账代码", "殷浩详解 DDD：如何避免写流水账代码"),
    ("bizmodeling/元数据思想-打破传统的思维方式.pdf",
     "01-domain-modeling", "元数据思想-打破传统的思维方式", "元数据思想：打破传统的思维方式"),
    ("bizmodeling/再谈软件设计中的抽象思维（上），从封装变化开始.pdf",
     "01-domain-modeling", "再谈软件设计中的抽象思维-上", "再谈软件设计中的抽象思维（上）：从封装变化开始"),
    ("bizmodeling/再谈软件设计中的抽象思维（下），从FizzBuzz到规则引擎.pdf",
     "01-domain-modeling", "再谈软件设计中的抽象思维-下", "再谈软件设计中的抽象思维（下）：从 FizzBuzz 到规则引擎"),

    # ===== 02-architecture-design =====
    ("[星标]架构权衡评估方法（ATAM）：如何评估一个系统的质量.pdf",
     "02-architecture-design", "架构权衡评估方法ATAM-如何评估一个系统的质量", "架构权衡评估方法（ATAM）：如何评估一个系统的质量"),
    ("架构设计--配置信息管理.pdf",
     "02-architecture-design", "架构设计-配置信息管理", "架构设计：配置信息管理"),
    ("manage/doc-worker-manage-M05-业务技术理解.pdf",
     "02-architecture-design", "业务技术理解", "业务技术理解"),
    ("manage/doc-worker-manage-M06-业务技术方案.pdf",
     "02-architecture-design", "业务技术方案", "业务技术方案"),
    ("systemdesign/[数据库]单表数据量大是否必须分表.pdf",
     "02-architecture-design", "单表数据量大是否必须分表", "单表数据量大是否必须分表"),
    ("systemdesign/[消息队列]一次线上事故，我顿悟了异步的精髓.pdf",
     "02-architecture-design", "一次线上事故-我顿悟了异步的精髓", "一次线上事故，我顿悟了异步的精髓"),
    ("systemdesign/cache/分布式缓存实践.pdf",
     "02-architecture-design", "分布式缓存实践", "分布式缓存实践"),
    ("systemdesign/cache/携程分布式缓存实践：最终一致和强一致性通吃！.pdf",
     "02-architecture-design", "携程分布式缓存实践-最终一致和强一致性通吃", "携程分布式缓存实践：最终一致和强一致性通吃"),
    ("systemdesign/ebook/grok_system_design_interview.pdf",
     "02-architecture-design", "grok-system-design-interview", "Grok the System Design Interview"),
    ("systemdesign/ebook/Principles of Computer System Design An Introduction-2009.pdf",
     "02-architecture-design", "principles-of-computer-system-design", "Principles of Computer System Design: An Introduction (2009)"),
    ("systemdesign/阿里大佬谈交易链路中的一些设计原则！.pdf",
     "02-architecture-design", "阿里大佬谈交易链路中的一些设计原则", "阿里大佬谈交易链路中的一些设计原则"),
    ("systemdesign/阿里商旅账单系统架构设计实践.pdf",
     "02-architecture-design", "阿里商旅账单系统架构设计实践", "阿里商旅账单系统架构设计实践"),
    ("systemdesign/订单逆向履约系统的建模与PaaS化落地实践.pdf",
     "02-architecture-design", "订单逆向履约系统的建模与PaaS化落地实践", "订单逆向履约系统的建模与 PaaS 化落地实践"),
    ("systemdesign/分布式权限设计.pdf",
     "02-architecture-design", "分布式权限设计", "分布式权限设计"),
    ("systemdesign/复杂系统设计原则与案例!.pdf",
     "02-architecture-design", "复杂系统设计原则与案例", "复杂系统设计原则与案例"),
    ("systemdesign/基于有限状态机与消息队列的三方支付系统补单实践.pdf",
     "02-architecture-design", "基于有限状态机与消息队列的三方支付系统补单实践", "基于有限状态机与消息队列的三方支付系统补单实践"),
    ("systemdesign/基于注解的异步导入导出系统.pdf",
     "02-architecture-design", "基于注解的异步导入导出系统", "基于注解的异步导入导出系统"),
    ("systemdesign/熔断、隔离、重试、降级、超时、限流，高可用架构流量治理核心策略全掌握.pdf",
     "02-architecture-design", "高可用架构流量治理核心策略全掌握", "熔断、隔离、重试、降级、超时、限流：高可用架构流量治理核心策略全掌握"),
    ("systemdesign/营销活动_活动流程编排.pdf",
     "02-architecture-design", "营销活动-活动流程编排", "营销活动：活动流程编排"),

    # ===== 03-clean-code =====
    ("[星标]复杂、繁杂、庞杂：图解七种代码耦合类型.pdf",
     "03-clean-code", "图解七种代码耦合类型", "复杂、繁杂、庞杂：图解七种代码耦合类型"),
    ("[星标]多图详解：七种具体方法增强代码可扩展性.pdf",
     "03-clean-code", "多图详解-七种具体方法增强代码可扩展性", "多图详解：七种具体方法增强代码可扩展性"),
    ("满屏的 if-else，要怎么优化？.pdf",
     "03-clean-code", "满屏的if-else要怎么优化", "满屏的 if-else，要怎么优化？"),
    ("我的代码没有 else 系列教程之代码模板.pdf",
     "03-clean-code", "我的代码没有else系列教程之代码模板", "我的代码没有 else 系列教程之代码模板"),
    ("应用服务 和 模板方法 擦出的火花.pdf",
     "03-clean-code", "应用服务和模板方法擦出的火花", "应用服务和模板方法擦出的火花"),
    ("cleancode/[星标]答应我，别再写上千行的类了好吗.pdf",
     "03-clean-code", "答应我别再写上千行的类了好吗", "答应我，别再写上千行的类了好吗"),
    ("cleancode/[星标]腾讯程序员怎么写代码？看看读者麻瓜大佬怎么说！.pdf",
     "03-clean-code", "腾讯程序员怎么写代码-麻瓜大佬怎么说", "腾讯程序员怎么写代码？看看读者麻瓜大佬怎么说"),
    ("cleancode/对象参数校验的花式写法.pdf",
     "03-clean-code", "对象参数校验的花式写法", "对象参数校验的花式写法"),
    ("cleancode/防腐层是如何工作的.pdf",
     "03-clean-code", "防腐层是如何工作的", "防腐层是如何工作的"),
    ("cleancode/高并发系统-使用自定义日志埋点快速排查问题.pdf",
     "03-clean-code", "高并发系统-使用自定义日志埋点快速排查问题", "高并发系统：使用自定义日志埋点快速排查问题"),
    ("cleancode/可编排下单服务引擎设计.pdf",
     "03-clean-code", "可编排下单服务引擎设计", "可编排下单服务引擎设计"),
    ("cleancode/聊聊如何利用管道模式来进行业务编排（上篇）.pdf",
     "03-clean-code", "聊聊如何利用管道模式来进行业务编排-上篇", "聊聊如何利用管道模式来进行业务编排（上篇）"),
    ("cleancode/为什么ifelse会影响我的代码复杂度.pdf",
     "03-clean-code", "为什么if-else会影响我的代码复杂度", "为什么 if-else 会影响我的代码复杂度"),
    ("cleancode/业务代码和技术代码.pdf",
     "03-clean-code", "业务代码和技术代码", "业务代码和技术代码"),
    ("cleancode/责任链模式与策略模式在售后系统里的实战.pdf",
     "03-clean-code", "责任链模式与策略模式在售后系统里的实战", "责任链模式与策略模式在售后系统里的实战"),
    ("cleancode/责任链模式在复杂数据处理场景中的实战.pdf",
     "03-clean-code", "责任链模式在复杂数据处理场景中的实战", "责任链模式在复杂数据处理场景中的实战"),
    ("cleancode/自定义注解优雅实现业务复杂校验.pdf",
     "03-clean-code", "自定义注解优雅实现业务复杂校验", "自定义注解优雅实现业务复杂校验"),
    ("refactor/Java单元测试实战.pdf",
     "03-clean-code", "Java单元测试实战", "Java 单元测试实战"),
    ("refactor/Java工程师成神之路.pdf",
     "03-clean-code", "Java工程师成神之路", "Java 工程师成神之路"),

    # ===== 04-reliability =====
    ("devops/25 张图带你理解各中间件的优雅停机方案.pdf",
     "04-reliability", "25张图带你理解各中间件的优雅停机方案", "25 张图带你理解各中间件的优雅停机方案"),
    ("faultcase/[持久化异步]升级版 @Async，让异步任务无懈可击.pdf",
     "04-reliability", "升级版Async-让异步任务无懈可击", "升级版 @Async，让异步任务无懈可击"),
    ("faultcase/【故障现场】15种线上Bug梳理.pdf",
     "04-reliability", "15种线上Bug梳理", "15 种线上 Bug 梳理"),
    ("faultcase/【故障现场】Redis 事务遇上 @Transactional 有大坑.pdf",
     "04-reliability", "Redis事务遇上Transactional有大坑", "Redis 事务遇上 @Transactional 有大坑"),
    ("faultcase/【故障现场】事务加锁，短短几行代码，全是问题.pdf",
     "04-reliability", "事务加锁-短短几行代码全是问题", "事务加锁，短短几行代码，全是问题"),
    ("faultcase/【故障现场】事务里发普通消息的线上问题排查过程.pdf",
     "04-reliability", "事务里发普通消息的线上问题排查过程", "事务里发普通消息的线上问题排查过程"),
    ("faultcase/【故障现场】事务内发mq消息.pdf",
     "04-reliability", "事务内发mq消息", "事务内发 MQ 消息"),
    ("faultcase/【故障现场】死锁_不要向自己运行的线程池提交任务.pdf",
     "04-reliability", "死锁-不要向自己运行的线程池提交任务", "死锁：不要向自己运行的线程池提交任务"),
    ("faultcase/【故障现场】线程池异常黑洞及其防范策略.pdf",
     "04-reliability", "线程池异常黑洞及其防范策略", "线程池异常黑洞及其防范策略"),
    ("faultcase/【故障现场】消息发送居然有这么大的坑.pdf",
     "04-reliability", "消息发送居然有这么大的坑", "消息发送居然有这么大的坑"),
    ("faultcase/【故障现场】业务系统要优雅关闭才使用Spring Event.pdf",
     "04-reliability", "业务系统要优雅关闭才使用Spring-Event", "业务系统要优雅关闭才使用 Spring Event"),
    ("faultcase/【故障现场】长事务&事务失效.pdf",
     "04-reliability", "长事务与事务失效", "长事务 & 事务失效"),
    ("faultcase/【故障现场】资源隔离&大事务.pdf",
     "04-reliability", "资源隔离与大事务", "资源隔离 & 大事务"),
    ("monitor/稳定性之接口监控.pdf",
     "04-reliability", "稳定性之接口监控", "稳定性之接口监控"),
    ("performance/复杂业务接口优化.pdf",
     "04-reliability", "复杂业务接口优化", "复杂业务接口优化"),
    ("troubleshooting/CPU飙高，系统性能问题如何排查？.pdf",
     "04-reliability", "CPU飙高-系统性能问题如何排查", "CPU 飙高，系统性能问题如何排查"),
    ("troubleshooting/JVM内存问题排查Cookbook.pdf",
     "04-reliability", "JVM内存问题排查Cookbook", "JVM 内存问题排查 Cookbook"),
    ("troubleshooting/线上故障如何快速排查？来看这套技巧大全.pdf",
     "04-reliability", "线上故障如何快速排查-技巧大全", "线上故障如何快速排查？来看这套技巧大全"),
]


def to_win_path(p: Path) -> str:
    return str(p).replace("/", "\\")


def clean_for_slug(name: str) -> str:
    """生成图片目录 slug：去除文件系统不安全字符"""
    s = re.sub(r'[\\/:*?"<>|？]', '-', name)
    s = re.sub(r'\s+', '-', s)
    s = re.sub(r'-+', '-', s).strip('-')
    return s


def extract_images(pdf_path: Path, img_dir: Path, min_size_kb: int = 30) -> list:
    """用 PyMuPDF 提取 PDF 嵌入图片，返回 [(filename, page, idx)]"""
    img_dir.mkdir(parents=True, exist_ok=True)
    extracted = []
    try:
        doc = fitz.open(to_win_path(pdf_path))
    except Exception as e:
        print(f"  ! PyMuPDF 打开失败: {e}", file=sys.stderr)
        return []

    img_counter = 0
    for page_idx, page in enumerate(doc, 1):
        for img_idx, img_info in enumerate(page.get_images(full=True)):
            xref = img_info[0]
            try:
                base_img = doc.extract_image(xref)
                img_bytes = base_img["image"]
                ext = base_img["ext"]
                w = base_img.get("width", 0)
                h = base_img.get("height", 0)
                # 过滤小图（装饰/logo/分隔条）
                if len(img_bytes) < min_size_kb * 1024:
                    continue
                # 过滤太窄或太矮的图（很可能是分隔条）
                if w < 100 or h < 50:
                    continue
                img_counter += 1
                fname = f"{img_counter:03d}-p{page_idx:02d}.{ext}"
                fpath = img_dir / fname
                fpath.write_bytes(img_bytes)
                extracted.append((fname, page_idx, img_idx))
            except Exception as e:
                print(f"  ! 图片 {xref} 提取失败: {e}", file=sys.stderr)
                continue
    doc.close()
    return extracted


def convert_one(rel_src: str, subdir: str, out_name: str, title: str) -> bool:
    pdf_path = SRC / rel_src
    if not pdf_path.exists():
        print(f"MISSING: {pdf_path}", file=sys.stderr)
        return False

    out_md = COL / subdir / f"{out_name}.md"
    if out_md.exists():
        print(f"  SKIP (exists): {out_name}.md")
        return True

    img_dir = COL / subdir / "images" / clean_for_slug(out_name)
    print(f"  -> {subdir}/{out_name}.md")

    # 1) pdftotext -layout
    text = subprocess.run(
        ["pdftotext", "-layout", to_win_path(pdf_path), "-"],
        capture_output=True, text=True, encoding="utf-8"
    ).stdout

    # 2) 提取图片
    images = extract_images(pdf_path, img_dir)

    # 3) 写 MD
    with open(out_md, "w", encoding="utf-8") as f:
        f.write("---\n")
        f.write(f'title: "{title}"\n')
        f.write(f'date: "2023-04-13"\n')
        f.write(f'source: "Macaroon-Spring-Family/spring-boot-best-practice"\n')
        f.write(f'original: "{rel_src}"\n')
        f.write("---\n\n")
        f.write(f"# {title}\n\n")
        f.write(f"> 原文 PDF：`{rel_src}`（已转文字 + 提取配图）\n\n")
        f.write("## 正文\n\n")
        f.write("```\n")
        f.write(text)
        f.write("\n```\n\n")
        if images:
            f.write("## 配图\n\n")
            # 相对路径从 MD 所在目录算起
            for fname, page, _ in images:
                rel = f"images/{clean_for_slug(out_name)}/{fname}"
                f.write(f"### 第 {page} 页 — {fname}\n\n")
                f.write(f"![{fname}]({rel})\n\n")

    return True


def main():
    print(f"待转换 PDF: {len(PDF_MAP)} 个")
    ok = 0
    fail = 0
    for rel_src, subdir, out_name, title in PDF_MAP:
        try:
            if convert_one(rel_src, subdir, out_name, title):
                ok += 1
            else:
                fail += 1
        except Exception as e:
            print(f"FAIL: {rel_src}: {e}", file=sys.stderr)
            fail += 1
    print(f"\n完成: ok={ok}, fail={fail}")

    # 统计
    print("\n各主题域文件数：")
    for d in ["01-domain-modeling", "02-architecture-design",
              "03-clean-code", "04-reliability", "05-engineering-practice"]:
        md_count = len(list((COL / d).glob("*.md")))
        img_dirs = len(list((COL / d / "images").iterdir())) if (COL / d / "images").exists() else 0
        print(f"  {d}: {md_count} MD, {img_dirs} image dirs")


if __name__ == "__main__":
    main()
