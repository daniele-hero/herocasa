/** Small inline loading ring in the current text colour (form buttons while sending). */
export default function Spinner() {
  return <span aria-hidden="true" className="inline-block w-3.5 h-3.5 rounded-full border-2 border-current border-r-transparent animate-spin motion-reduce:animate-none" />;
}
