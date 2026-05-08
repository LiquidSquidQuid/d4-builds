// Progress bar — driven by the rAF scroll engine via class selector .progress-bar
// The scroll engine updates transform: scaleX() directly on this element.
export default function ProgressBar() {
  return <div className="progress-bar" />;
}
