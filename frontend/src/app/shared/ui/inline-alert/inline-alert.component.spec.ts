import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { InlineAlertComponent } from './inline-alert.component';

describe('InlineAlertComponent', () => {
  it('hides when message is empty', async () => {
    await TestBed.configureTestingModule({ imports: [InlineAlertComponent] }).compileComponents();
    const fixture = TestBed.createComponent(InlineAlertComponent);
    fixture.componentRef.setInput('message', '');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.alert')).toBeNull();
  });

  it('shows alert when message is set', async () => {
    await TestBed.configureTestingModule({ imports: [InlineAlertComponent] }).compileComponents();
    const fixture = TestBed.createComponent(InlineAlertComponent);
    fixture.componentRef.setInput('message', 'Something went wrong');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.alert')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Something went wrong');
  });
});
