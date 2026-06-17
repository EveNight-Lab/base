/**
 * 기획 & 설계 문서 뷰어 (DocsViewer.tsx)
 *
 * docs 폴더 내에 정의된 설계/성능 가이드 및 코딩 표준 가이드 등 마크다운 파일을
 * 비동기 수신하여, 외부 라이브러리 의존성 없이 순수 컴포넌트 분석기를 통해
 * 예쁜 웹 문서로 렌더링하여 읽을 수 있도록 지원합니다.
 */

import { useState, useEffect } from 'react';

interface DocItem {
  id: string;
  name: string;
  path: string;
  description: string;
}

const DOCS_LIST: DocItem[] = [
  {
    id: 'coding_guide',
    name: 'CODING_GUIDE.md',
    path: '/CODING_GUIDE.md',
    description: '프론트엔드 코딩 표준 및 커밋 규칙',
  },
  {
    id: 'plan',
    name: 'PLAN.md',
    path: '/docs/PLAN.md',
    description: '프로젝트 개발 방향 및 요구사항',
  },
  {
    id: 'structure',
    name: 'STRUCTURE.md',
    path: '/docs/STRUCTURE.md',
    description: 'UI 영역 구조 및 레이아웃 정의',
  },
  {
    id: 'function',
    name: 'FUNCTION.md',
    path: '/docs/FUNCTION.md',
    description: '화면 요소별 상세 기능 명세서',
  },
  {
    id: 'design',
    name: 'DESIGN.md',
    path: '/docs/DESIGN.md',
    description: '디자인 철학 및 스타일 토큰',
  },
  {
    id: 'state_flow',
    name: 'STATE_FLOW.md',
    path: '/docs/STATE_FLOW.md',
    description: '상태/데이터 흐름 및 파일 지도',
  },
  {
    id: 'perf_guide',
    name: 'PERFORMANCE_GUIDE.md',
    path: '/docs/REACT_PERFORMANCE_GUIDE.md',
    description: '리액트 성능 최적화 가이드라인',
  },
];

export default function DocsViewer() {
  const [selectedDoc, setSelectedDoc] = useState<DocItem>(DOCS_LIST[0]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 문서 파일 가져오기
  useEffect(() => {
    const fetchDoc = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(selectedDoc.path);
        if (!response.ok) {
          throw new Error(`문서를 로드할 수 없습니다: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDoc();
  }, [selectedDoc]);

  // 경량 마크다운 파서 유틸리티
  const parseMarkdown = (md: string): string => {
    let html = md;

    // 1. 코드 블록 선파싱 (개행 포함 치환)
    const codeBlocks: string[] = [];
    html = html.replace(/```(.*?)\n([\s\S]*?)```/g, (_, _lang: string, code: string) => {
      const placeholder = `__CODE_BLOCK_PLACEHOLDER_${codeBlocks.length}__`;
      codeBlocks.push(
        `<pre class="bg-black/30 border border-white/5 p-4 rounded-xl font-mono text-0.75rem overflow-x-auto my-4 text-indigo-300"><code>${code.trim()}</code></pre>`
      );
      return placeholder;
    });

    // 2. HTML 이스케이프 처리 (코드블럭 보호 후 본문 특수기호 제거)
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // 3. 테이블 변환
    const lines = html.split('\n');
    let inTable = false;
    let tableHtml = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableHtml =
            '<div class="overflow-x-auto my-4"><table class="w-full text-left border-collapse border border-white/10 text-0.75rem">';
        }

        const cells = line
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());
        // 구분선 무시 (|---|---|)
        if (cells.every((c) => /^[-:]+$/.test(c))) {
          continue;
        }

        const isHeader = !tableHtml.includes('<tbody>');
        if (isHeader && !tableHtml.includes('<thead>')) {
          tableHtml += '<thead><tr class="bg-white/5 border-b border-white/10">';
          cells.forEach((c) => {
            tableHtml += `<th class="p-2.5 font-semibold text-gray-200">${c}</th>`;
          });
          tableHtml += '</tr></thead><tbody>';
        } else {
          tableHtml += '<tr class="border-b border-white/5 hover:bg-white/[0.01]">';
          cells.forEach((c) => {
            tableHtml += `<td class="p-2.5 text-gray-300">${c}</td>`;
          });
          tableHtml += '</tr>';
        }
        lines[i] = ''; // 원본 텍스트는 빈 값 처리
      } else {
        if (inTable) {
          inTable = false;
          tableHtml += '</tbody></table></div>';
          lines[i] = tableHtml + '\n' + lines[i];
        }
      }
    }
    html = lines.filter((l) => l !== '').join('\n');

    // 4. 헤더 파싱
    html = html.replace(
      /^# (.*?)$/gm,
      '<h1 class="text-1.5rem font-bold text-white border-b border-white/10 pb-2 mt-6 mb-4">$1</h1>'
    );
    html = html.replace(
      /^## (.*?)$/gm,
      '<h2 class="text-1.2rem font-bold text-indigo-300 mt-6 mb-3 border-b border-white/[0.03] pb-1">$1</h2>'
    );
    html = html.replace(
      /^### (.*?)$/gm,
      '<h3 class="text-1rem font-bold text-indigo-400 mt-5 mb-2">$1</h3>'
    );
    html = html.replace(
      /^#### (.*?)$/gm,
      '<h4 class="text-0.875rem font-bold text-gray-200 mt-4 mb-2">$1</h4>'
    );

    // 5. 리스트 항목 (체크박스 지원)
    html = html.replace(
      /^\s*[-*]\s+\[ \]\s+(.*?)$/gm,
      '<li class="flex items-start gap-2.5 py-0.5"><input type="checkbox" disabled class="mt-1 rounded bg-gray-800 border-gray-700" /> <span class="text-gray-300">$1</span></li>'
    );
    html = html.replace(
      /^\s*[-*]\s+\[[xX]\]\s+(.*?)$/gm,
      '<li class="flex items-start gap-2.5 py-0.5"><input type="checkbox" checked disabled class="mt-1 rounded bg-gray-800 border-gray-700 text-indigo-500" /> <span class="line-through text-gray-500">$1</span></li>'
    );
    html = html.replace(
      /^\s*[-*]\s+(.*?)$/gm,
      '<li class="list-disc list-inside pl-2 py-0.5 text-gray-300">$1</li>'
    );

    // 6. 연속된 li 들을 ul로 묶기
    html = html.replace(
      /((?:<li[\s\S]*?<\/li>\n?)+)/g,
      '<ul class="flex flex-col gap-1 my-3 pl-2">$1</ul>'
    );

    // 7. 인라인 텍스트 가공 (굵게, 코드)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    html = html.replace(
      /`(.*?)`/g,
      '<code class="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded font-mono text-indigo-300 text-[11px]">$1</code>'
    );

    // 8. 빈 줄 단락 구분
    const blocks = html.split('\n\n');
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i].trim();
      if (block && !block.startsWith('<') && !block.endsWith('>')) {
        blocks[i] = `<p class="text-0.875rem text-gray-300 leading-relaxed my-3">${block}</p>`;
      }
    }
    html = blocks.join('\n\n');

    // 9. 코드블록 원본 복원
    codeBlocks.forEach((codeBlock, idx) => {
      html = html.replace(`__CODE_BLOCK_PLACEHOLDER_${idx}__`, codeBlock);
    });

    return html;
  };

  return (
    <div className="w-full h-full flex overflow-hidden">
      {/* Left Menu Sidebar */}
      <aside className="w-80 border-r border-white/5 bg-[#0D1222]/40 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <span className="text-0.75rem font-semibold text-gray-500 tracking-wider uppercase">
            문서 목록
          </span>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1.5 overflow-y-auto">
          {DOCS_LIST.map((doc) => {
            const isSelected = selectedDoc.id === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500/50 text-indigo-200'
                    : 'bg-white/[0.01] border-white/5 hover:bg-white/5 text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="text-0.875rem font-semibold truncate mb-1">{doc.name}</div>
                <div className="text-[11px] text-gray-500 truncate">{doc.description}</div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Right Content Viewer */}
      <section className="flex-1 flex flex-col bg-[#090C16] overflow-hidden">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-0.875rem">
            <span className="animate-pulse">가이드라인을 읽어오는 중...</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-500 text-0.875rem">
            <p className="text-rose-400 font-semibold mb-2">⚠️ 문서를 불러오지 못했습니다.</p>
            <p className="text-[12px] text-gray-600 mb-4">{error}</p>
            <div className="max-w-[420px] text-gray-500 text-[11px] leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
              Vite 개발 환경에서 root 폴더 내의 파일 리소스를 브라우저가 직접 fetch할 수 있도록
              설정되거나, public 폴더 하위에 존재해야 정상 표출됩니다.
            </div>
          </div>
        ) : (
          <article className="flex-1 p-8 overflow-y-auto select-text scrollbar-thin">
            <div
              className="max-w-3xl mx-auto py-4 text-gray-300"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
            />
          </article>
        )}
      </section>
    </div>
  );
}
