// German URL for the comune pages (/de/ferienhaus-verwaltung/<comune>); same page as gestione-affitti-brevi.
import { comuneParams } from '@/lib/comuni';

export { default, generateMetadata } from '../../gestione-affitti-brevi/[comune]/page';

export function generateStaticParams() {
  return comuneParams('ferienhaus-verwaltung');
}
