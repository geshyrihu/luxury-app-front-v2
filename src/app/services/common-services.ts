// common-services.ts

import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthService } from './auth.service';
import { CustomerIdService } from './customer-id.service';
import { DataService } from './data.service';
import { FilterRequestsService } from './filter-requests.service';
import { StatusSolicitudVacanteService } from './status-solicitud-vacante.service';
import { SwalService } from './swal.service';
import { ToastService } from './toast.service';

export {
  AuthService,
  CustomerIdService,
  DataService,
  DialogService,
  FilterRequestsService,
  MessageService,
  StatusSolicitudVacanteService,
  SwalService,
  ToastService,
};

// public swalService = inject(SwalService);
// public toastService = inject(ToastService);
// public authService = inject(AuthService);
// private dataService = inject(DataService);
// public dialogService = inject(DialogService);
// public messageService = inject(MessageService);
// public statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
// private filterRequestsService = inject(FilterRequestsService);
