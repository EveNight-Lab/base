/**
 * SSR/SSG 관련 타입 정의
 */

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
}

export interface SSRPageProps {
  meta?: PageMeta;
  initialData?: unknown;
}

/**
 * SSG 페이지를 위한 타입
 */
export interface SSGPage {
  path: string;
  component: React.ComponentType;
  getStaticProps?: () => Promise<{ props: unknown }>;
}

/**
 * SSR 페이지를 위한 타입
 */
export interface SSRPage {
  path: string;
  component: React.ComponentType;
  getServerSideProps?: (context: unknown) => Promise<{ props: unknown }>;
}
