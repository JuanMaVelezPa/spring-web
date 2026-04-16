import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { I18nService } from '../../../core/i18n/i18n.service';
import { PageNavComponent } from './page-nav.component';

describe('PageNavComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNavComponent],
      providers: [
        {
          provide: I18nService,
          useValue: {
            t: (key: string, vars?: Record<string, string | number>) => {
              if (key === 'pageSummary' && vars) {
                return `P${vars['page']}/${vars['pages']}·${vars['total']}`;
              }
              if (key === 'noItems') {
                return 'None';
              }
              return key;
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('computes page count and next/prev for second page with size 10', async () => {
    const fixture = TestBed.createComponent(PageNavComponent);
    fixture.componentRef.setInput('page', 0);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('totalElements', 12);
    fixture.detectChanges();
    const cmp = fixture.componentInstance as unknown as Record<string, () => number | boolean>;
    expect(cmp['pageCount']()).toBe(2);
    expect(cmp['canPrev']()).toBe(false);
    expect(cmp['canNext']()).toBe(true);

    fixture.componentRef.setInput('page', 1);
    fixture.detectChanges();
    expect(cmp['canPrev']()).toBe(true);
    expect(cmp['canNext']()).toBe(false);
  });

  it('disables next on a single full page', async () => {
    const fixture = TestBed.createComponent(PageNavComponent);
    fixture.componentRef.setInput('page', 0);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('totalElements', 10);
    fixture.detectChanges();
    const cmp = fixture.componentInstance as unknown as Record<string, () => number | boolean>;
    expect(cmp['pageCount']()).toBe(1);
    expect(cmp['canNext']()).toBe(false);
  });
});
