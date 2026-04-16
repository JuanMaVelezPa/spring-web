import { Component, computed, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { AdminApiService } from '../../core/admin/admin-api.service';
import { adminQueryKeys } from '../../core/admin/admin-query.keys';
import { I18nService } from '../../core/i18n/i18n.service';
import { problemDetailMessage } from '../../core/util/http-error';
import { InlineAlertComponent } from '../../shared/ui/inline-alert/inline-alert.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { AdminSubnavComponent } from './admin-subnav.component';

@Component({
  selector: 'app-admin-roles',
  imports: [InlineAlertComponent, LoadingStateComponent, AdminSubnavComponent],
  templateUrl: './admin-roles.component.html',
})
export class AdminRolesComponent {
  private readonly admin = inject(AdminApiService);
  protected readonly i18n = inject(I18nService);

  readonly rolesQuery = injectQuery(() => ({
    queryKey: adminQueryKeys.roles(),
    queryFn: () => lastValueFrom(this.admin.listRoles()),
  }));

  readonly loading = computed(() => this.rolesQuery.isPending());
  readonly error = computed(() => {
    const err = this.rolesQuery.error();
    return err ? problemDetailMessage(err) : null;
  });
  readonly roles = computed(() => this.rolesQuery.data() ?? []);
}

