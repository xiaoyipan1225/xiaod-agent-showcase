'use client';

import { useState } from 'react';

const demos = [
  {
    label: 'YouTube 视频',
    source: 'youtube.com/watch?v=demo',
    prompt: '请按原语言把这个访谈整理成一篇可以直接阅读的提纯稿。',
  },
  {
    label: 'B站视频',
    source: 'bilibili.com/video/BVdemo',
    prompt: '请保留案例、数字和关键原话，按主题整理。',
  },
  {
    label: '飞书妙记',
    source: 'feishu.cn/minutes/demo',
    prompt: '请把这次会议录音整理成分享式提纯稿。',
  },
];

const demoSteps = ['识别来源', '查找现成文本', '语音识别', '语义分段', '创建文档', '回读与权限'];

const workflow = [
  {
    number: '01',
    title: '识别来源与权限',
    text: '识别链接、会议标识或本地文件，并确认当前已有合法权限足以访问。',
    rule: '来源不确定或需要绕过访问控制：立即转人工。',
  },
  {
    number: '02',
    title: '优先取得现成文本',
    text: '先查找字幕、逐字稿、会议记录或妙记。找到后直接作为原始文本。',
    rule: '字幕不通顺也继续使用，不触发重新识别。',
  },
  {
    number: '03',
    title: '获取音频并转录',
    text: '没有现成文本时获取音频，直接交给 faster-whisper，保留原始语言。',
    rule: '首次报错、空结果或超过 5 分钟：停止并转人工，不重试。',
  },
  {
    number: '04',
    title: '清洗而不篡改',
    text: '删除时间戳、说话人标签及不影响原意的重复和语气词。',
    rule: '疑似 ASR 错词保留原文，不纠正、不补全、不标注。',
  },
  {
    number: '05',
    title: '按语义整理成稿',
    text: '按话题关系分段，用每段开篇观点生成标题，保留案例、数字和重要原话。',
    rule: '交付分享式提纯稿，不改写成摘要式要点。',
  },
  {
    number: '06',
    title: '创建、回读与交付',
    text: '创建飞书文档，写入完整内容并回读正文、段落、标题和目录。',
    rule: '权限必须经人工确认；确认前不得宣称完成。',
  },
];

const canDo = [
  '处理公开内容和已有合法权限可访问的内容',
  '支持小宇宙、YouTube、B站、飞书妙记和本地音频',
  '中文、外语和多语言内容均按原语言保留',
  '保留关键案例、数字、事实与重要原话',
  '创建飞书文档并回读内容和目录结构',
];

const cannotDo = [
  '不绕过登录、付费墙或任何访问控制',
  '不发布、传播或重新上传原始音视频',
  '不做多语言翻译或统一语言',
  '不把交付物压缩成三句话总结或关键词清单',
  '不以本地文件、应用窗口或工具日志冒充交付',
];

const statuses = [
  ['飞书私聊接通', '已验证', true],
  ['飞书群聊接通', '已验证', true],
  ['文档相关权限', '已授权', true],
  ['yt-dlp / ffmpeg / faster-whisper', '已安装验证', true],
  ['公开链接到飞书文档的完整交付', '待端到端验收', false],
];

export default function Home() {
  const [active, setActive] = useState(0);
  const demo = demos[active];

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f1ea] text-[#18251f]">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
        <a href="#top" className="flex items-center gap-3" aria-label="小D 首页">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#173f2f] text-sm font-black text-[#f6d365]">D</span>
          <span>
            <strong className="block text-sm tracking-wide">音视频转录整理助手</strong>
            <span className="block text-xs text-[#607067]">小D · Agent 展示页</span>
          </span>
        </a>
        <div className="hidden items-center gap-7 text-sm font-semibold text-[#53645b] md:flex">
          <a href="#workflow" className="hover:text-[#173f2f]">工作流</a>
          <a href="#boundaries" className="hover:text-[#173f2f]">能力边界</a>
          <a href="#status" className="hover:text-[#173f2f]">验证状态</a>
        </div>
        <a href="#demo" className="rounded-full border border-[#173f2f]/20 bg-white/65 px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-white">体验演示</a>
      </nav>

      <section id="top" className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 pb-20 pt-8 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:px-10 lg:pb-28 lg:pt-16">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#173f2f]/15 bg-white/55 px-3 py-1.5 text-xs font-bold tracking-[0.18em] text-[#365444]">PUBLIC DEMO · 公开展示版</p>
          <h1 className="max-w-2xl text-5xl font-black leading-[1.03] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            把声音里的信息，<span className="text-[#20704c]">整理成值得阅读的文章。</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-[#53645b] sm:text-lg">小D接收播客、视频、飞书妙记或本地音频，完成转录、清洗、按主题整理，并交付可直接阅读的飞书文档链接。</p>
          <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold text-[#385044]">
            {['纯静态演示', '不连接任何 API', '不收集访客数据'].map((item) => (
              <span key={item} className="rounded-full border border-[#173f2f]/15 bg-white/60 px-3 py-2">✓ {item}</span>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#demo" className="rounded-full bg-[#173f2f] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(23,63,47,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0f3325]">看它如何工作</a>
            <a href="#boundaries" className="rounded-full px-6 py-3 text-sm font-bold text-[#173f2f] underline decoration-[#91ad9d] underline-offset-4">查看能力边界</a>
          </div>
        </div>

        <div id="demo" className="relative scroll-mt-6">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#f2ca52]/35 blur-3xl" />
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#122c22] p-3 shadow-[0_28px_80px_rgba(17,44,34,0.24)] sm:p-5">
            <div className="mb-4 flex items-center justify-between px-2 pt-1 text-white/70">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wide"><span className="h-2 w-2 rounded-full bg-[#6ed89b] shadow-[0_0_12px_#6ed89b]" />小D演示空间</div>
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px]">DEMO ONLY</span>
            </div>
            <div className="rounded-[22px] bg-[#f8f7f2] p-4 sm:p-6">
              <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="选择输入类型">
                {demos.map((item, index) => (
                  <button key={item.label} type="button" role="tab" aria-selected={active === index} onClick={() => setActive(index)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold transition ${active === index ? 'bg-[#173f2f] text-white' : 'bg-[#e9ece7] text-[#53645b] hover:bg-[#dfe5df]'}`}>{item.label}</button>
                ))}
              </div>
              <div className="mt-5 ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-[#dceee3] p-4 text-sm leading-6 text-[#203f31]">
                <p className="font-mono text-[11px] text-[#617a6c]">{demo.source}</p>
                <p className="mt-1">{demo.prompt}</p>
              </div>
              <div className="mt-5 rounded-2xl rounded-tl-sm border border-[#dfe5df] bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-black text-[#173f2f]"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#173f2f] text-[10px] text-[#f6d365]">D</span>已理解任务，正在整理</div>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {demoSteps.map((step, index) => (
                    <div key={step} className="rounded-xl bg-[#f2f4ef] p-3"><span className="text-[10px] font-black text-[#779083]">0{index + 1}</span><p className="mt-1 text-xs font-bold text-[#314c3e]">{step}</p></div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-[#e1d18a] bg-[#fff9dc] p-3 text-xs leading-5 text-[#62551f]"><strong>交付示例：</strong> 已生成《访谈提纯稿》，保留关键案例、数字与原话，并完成文档回读检查。</div>
              </div>
              <p className="mt-4 text-center text-[11px] leading-5 text-[#7c877f]">这是安全的交互演示，不会处理真实链接，也不会上传任何文件。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#173f2f]/10 bg-[#173f2f] text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/10 px-5 py-7 sm:grid-cols-4 sm:px-8 lg:px-10">
          {[
            ['4 类', '标准输入'],
            ['6 阶段', '核心流程'],
            ['5 分钟', '语音识别上限'],
            ['1 个链接', '最终交付'],
          ].map(([big, small]) => (
            <div key={small} className="px-4 py-3 text-center"><strong className="block text-2xl text-[#f6d365]">{big}</strong><span className="mt-1 block text-xs text-white/65">{small}</span></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-[#20704c]">WHAT IT DELIVERS</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-5xl">不是逐字稿搬运，<br />也不是三句话总结。</h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[#607067]">它真正完成的是信息重组：保留原始语言和关键细节，去除妨碍阅读的时间戳、标签与冗余表达，按真实话题组织成一篇有标题、有结构、可以继续传播观点但不传播原始音视频的文章。</p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            ['01', '省去素材获取', '先找现成字幕；没有文本时再获取音频并执行语音识别。'],
            ['02', '省去逐段整理', '按语义切分话题，标题来自每段开篇观点，不凭空创造主题。'],
            ['03', '省去文档交付', '写入飞书文档后回读正文与目录，再由人工确认访问权限。'],
          ].map(([no, title, text]) => (
            <article key={no} className="rounded-[24px] border border-[#173f2f]/10 bg-white/55 p-7 transition hover:-translate-y-1 hover:bg-white">
              <span className="text-xs font-black text-[#20704c]">{no}</span><h3 className="mt-8 text-xl font-black">{title}</h3><p className="mt-3 text-sm leading-7 text-[#607067]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="workflow" className="scroll-mt-10 bg-[#e8e3d8] py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div><p className="text-xs font-black tracking-[0.2em] text-[#20704c]">WORKFLOW</p><h2 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-5xl">从输入到交付的六个关口</h2></div>
            <p className="max-w-md text-sm leading-7 text-[#607067]">每个阶段都有明确判断。关键失败不自动换方法、不盲目重试，而是保留上下文并转交人工。</p>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-[#173f2f]/10 bg-[#173f2f]/10 lg:grid-cols-2">
            {workflow.map((item) => (
              <article key={item.number} className="bg-[#f6f3ec] p-7 sm:p-9">
                <div className="flex gap-5"><span className="text-sm font-black text-[#20704c]">{item.number}</span><div><h3 className="text-xl font-black">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#53645b]">{item.text}</p><p className="mt-4 border-l-2 border-[#e3bd43] pl-4 text-xs font-semibold leading-6 text-[#645b36]">{item.rule}</p></div></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-[28px] bg-[#173f2f] p-8 text-white sm:p-10">
            <p className="text-xs font-black tracking-[0.18em] text-[#8dd0ad]">INPUT · 输入</p>
            <h2 className="mt-4 text-3xl font-black">给小D一个可访问的声音来源</h2>
            <ul className="mt-8 space-y-3 text-sm text-white/80">
              {['小宇宙分享链接', 'YouTube / B站公开视频链接', '飞书会议 ID 或妙记链接', '本地 .mp3 / .m4a / .wav 文件'].map((item) => (
                <li key={item} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3"><span className="text-[#f6d365]">↳</span>{item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-[28px] border border-[#173f2f]/10 bg-white p-8 sm:p-10">
            <p className="text-xs font-black tracking-[0.18em] text-[#20704c]">OUTPUT · 输出</p>
            <h2 className="mt-4 text-3xl font-black">得到一个经过验证的飞书文档链接</h2>
            <div className="mt-8 rounded-2xl border border-[#dfe5df] bg-[#f7f8f4] p-5">
              <p className="text-xs font-bold text-[#708078]">分享式提纯稿 · 示例结构</p>
              <h3 className="mt-4 text-xl font-black">为什么真正的效率来自判断，而不是速度</h3>
              <div className="mt-4 space-y-2"><span className="block h-2 w-full rounded bg-[#dce4dd]" /><span className="block h-2 w-[92%] rounded bg-[#dce4dd]" /><span className="block h-2 w-[76%] rounded bg-[#dce4dd]" /></div>
              <p className="mt-5 text-xs font-bold text-[#20704c]">正文与目录已回读 · 权限等待人工确认</p>
            </div>
          </article>
        </div>
      </section>

      <section id="boundaries" className="scroll-mt-10 bg-[#152a21] py-24 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-3xl"><p className="text-xs font-black tracking-[0.2em] text-[#8dd0ad]">CAPABILITY BOUNDARIES</p><h2 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-5xl">知道什么时候继续，也知道什么时候停。</h2><p className="mt-6 text-base leading-8 text-white/60">边界不是免责说明，而是工作流的一部分。小D只在正常权限和明确规则内完成任务。</p></div>
          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            <article className="rounded-[26px] border border-[#86cda6]/20 bg-[#86cda6]/8 p-7 sm:p-9">
              <h3 className="text-xl font-black text-[#9de3ba]">可以做</h3>
              <ul className="mt-6 space-y-4">{canDo.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-white/75"><span className="font-black text-[#8dd0ad]">✓</span>{item}</li>)}</ul>
            </article>
            <article className="rounded-[26px] border border-[#f1cf61]/20 bg-[#f1cf61]/7 p-7 sm:p-9">
              <h3 className="text-xl font-black text-[#f1cf61]">不会做</h3>
              <ul className="mt-6 space-y-4">{cannotDo.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-white/75"><span className="font-black text-[#f1cf61]">×</span>{item}</li>)}</ul>
            </article>
          </div>
          <div className="mt-5 rounded-[22px] border border-white/10 bg-white/5 p-6 text-sm leading-7 text-white/65"><strong className="text-white">必须转人工：</strong> 来源首次识别失败、权限不足、音频首次获取失败、转录报错或超时、文档写入/回读失败，以及最终访问权限确认。</div>
        </div>
      </section>

      <section id="status" className="scroll-mt-10 mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-[#20704c]">VERIFICATION STATUS</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-5xl">展示真实进度，<br />不把配置完成当成任务完成。</h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#607067]">下面展示当前配置与验证状态。标记为“待验收”的能力不会在公开页中被描述成已经生产可用。</p>
          </div>
          <div className="overflow-hidden rounded-[26px] border border-[#173f2f]/10 bg-white">
            {statuses.map(([name, state, ok], index) => (
              <div key={name as string} className={`flex items-center justify-between gap-4 px-6 py-5 ${index !== statuses.length - 1 ? 'border-b border-[#173f2f]/8' : ''}`}>
                <span className="text-sm font-bold">{name}</span>
                <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-black ${ok ? 'bg-[#dceee3] text-[#20704c]' : 'bg-[#fff1bd] text-[#705d18]'}`}>{ok ? '✓ ' : '△ '}{state}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#ded8ca] py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <p className="text-center text-xs font-black tracking-[0.2em] text-[#20704c]">HOW TO USE</p>
          <h2 className="mt-4 text-center text-4xl font-black tracking-[-0.045em] sm:text-5xl">圈友拿到后，四步开始使用</h2>
          <div className="mt-14 grid gap-4 md:grid-cols-4">
            {[
              ['1', '准备输入', '使用公开链接、已有权限的妙记，或本地音频路径。'],
              ['2', '发送任务', '在飞书私聊机器人；群聊中需要 @音视频转录助手。'],
              ['3', '等待处理', 'Agent 会报告当前阶段；关键失败会明确转人工。'],
              ['4', '确认交付', '检查飞书文档能否打开，人工确认权限后才算完成。'],
            ].map(([no, title, text]) => (
              <article key={no} className="rounded-[22px] bg-[#f4f1ea] p-6"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#173f2f] text-sm font-black text-[#f6d365]">{no}</span><h3 className="mt-6 text-lg font-black">{title}</h3><p className="mt-3 text-sm leading-7 text-[#607067]">{text}</p></article>
            ))}
          </div>
          <div className="mt-8 rounded-[24px] bg-[#f6d365] p-6 text-center text-sm font-bold leading-7 text-[#433914] sm:p-8">推荐触发语：请将这个链接整理成分享式提纯稿，保留关键案例、数字和重要原话，完成后交付飞书文档链接。</div>
        </div>
      </section>

      <footer className="bg-[#0e1f18] px-5 py-12 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#f6d365] text-xs font-black text-[#173f2f]">D</span><strong>音视频转录整理助手 · 小D</strong></div><p className="mt-4 max-w-xl text-xs leading-6 text-white/50">本页面仅用于展示 Agent 的功能、规范和能力边界。页面不接入 Hermes、飞书或任何第三方 API，不接受真实任务，不存储访客数据。</p></div>
          <a href="#top" className="text-xs font-bold text-[#9de3ba]">返回顶部 ↑</a>
        </div>
      </footer>
    </main>
  );
}
