/**
 * 소개 페이지
 * SSG 대상 페이지 - 초기 HTML에 텍스트 포함
 */

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold mb-4 text-gray-800">소개</h1>
      <div className="max-w-3xl">
        <p className="text-1rem text-gray-600 mb-4">
          이 페이지는 정적 사이트 생성(SSG)을 통해 빌드 시점에 HTML로 생성됩니다.
        </p>
        <p className="text-1rem text-gray-600 mb-4">
          모든 텍스트 콘텐츠는 초기 HTML에 포함되어 있어 SEO와 애드센스 크롤링에 최적화되어
          있습니다.
        </p>
        <section className="mt-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">주요 특징</h2>
          <ul className="list-disc list-inside space-y-2 text-1rem text-gray-600">
            <li>서버 사이드 렌더링(SSR) 지원</li>
            <li>정적 사이트 생성(SSG) 지원</li>
            <li>SEO 최적화</li>
            <li>애드센스 크롤링 최적화</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
