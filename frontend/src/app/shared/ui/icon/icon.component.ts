import { Component, input } from '@angular/core';

/** Minimal inline SVG icons (Heroicons-style, MIT). Use `currentColor` for theme-aware strokes. */
@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  host: { class: 'inline-flex shrink-0 items-center justify-center' },
})
export class IconComponent {
  /** Icon name from the design set. */
  readonly name = input.required<
    'user' | 'cog' | 'chevron-down' | 'arrow-up' | 'arrow-down' | 'arrows-up-down'
  >();
  /** Tailwind size class for width/height, e.g. `h-5 w-5`. */
  readonly sizeClass = input('h-5 w-5');
}
