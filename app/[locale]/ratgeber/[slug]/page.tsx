// German URL for the owner guides (/de/ratgeber/<slug>); same page as /guide/.
import { guideParams } from '@/lib/guide-links';

export { default, generateMetadata } from '../../guide/[slug]/page';

export function generateStaticParams() {
  return guideParams('ratgeber');
}
