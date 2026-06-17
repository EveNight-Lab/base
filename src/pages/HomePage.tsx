/**
 * 홈페이지
 * SSG 대상 페이지 - 초기 HTML에 텍스트 포함
 */

import Button from '@/components/common/Button';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-6 text-gray-900 tracking-tight">
          Project Base에 오신 것을 환영합니다
        </h1>
        <p className="text-1.125rem text-gray-600 max-w-2xl mx-auto leading-relaxed">
          이 텍스트는 초기 HTML에 포함되어 SEO와 애드센스 크롤링에 최적화되어 있습니다. 실제 서비스
          구축을 위한 가장 완벽한 베이스 플랫폼입니다.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button size="lg">시작하기</Button>
          <Button variant="outline" size="lg">
            문서 보기
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-1.5rem font-bold mb-3 text-gray-900">고성능 베이스</h2>
          <p className="text-1rem text-gray-600">
            Vite 7과 React 19을 기반으로 한 최신 스택으로 최고의 개발 속도와 사용자 경험을
            제공합니다.
          </p>
        </article>

        <article className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h2 className="text-1.5rem font-bold mb-3 text-gray-900">SEO 최적화</h2>
          <p className="text-1rem text-gray-600">
            SSR/SSG 친화적인 구조로 검색 엔진 노출과 애드센스 승인 확률을 극대화했습니다.
          </p>
        </article>

        <article className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04m-1.422 13.363A5.548 5.548 0 1111 8.877V6.253a4.102 4.102 0 10-2.31 4.102z"
              />
            </svg>
          </div>
          <h2 className="text-1.5rem font-bold mb-3 text-gray-900">AI 에이전트 협업</h2>
          <p className="text-1rem text-gray-600">
            Antigravity 규칙이 적용되어 AI와 효율적으로 코드를 작성하고 관리할 수 있습니다.
          </p>
        </article>
      </div>
    </div>
  );
}
