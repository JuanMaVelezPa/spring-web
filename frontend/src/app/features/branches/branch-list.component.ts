import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { BranchApiService } from '../../core/branches/branch-api.service';
import type { Branch, PagedResponse } from '../../core/models/api-types';
import { problemDetailMessage } from '../../core/util/http-error';
import { InlineAlertComponent } from '../../shared/ui/inline-alert/inline-alert.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { PageNavComponent } from '../../shared/ui/page-nav/page-nav.component';

@Component({
  selector: 'app-branch-list',
  imports: [RouterLink, InlineAlertComponent, LoadingStateComponent, PageNavComponent],
  templateUrl: './branch-list.component.html',
})
export class BranchListComponent implements OnInit {
  private readonly branches = inject(BranchApiService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly data = signal<PagedResponse<Branch> | null>(null);
  readonly page = signal(0);
  readonly pageSize = signal(20);

  ngOnInit(): void {
    this.load();
  }

  onPageChange(nextPage: number): void {
    this.page.set(nextPage);
    this.load();
  }

  onPageSizeChange(nextSize: number): void {
    this.pageSize.set(nextSize);
    this.page.set(0);
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.branches
      .list(this.page(), this.pageSize())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (page) => this.data.set(page),
        error: (err) => this.error.set(problemDetailMessage(err)),
      });
  }
}
