// import { CommonModule } from '@angular/common';
// import { Component, OnDestroy, OnInit, inject } from '@angular/core';
// import {
//     FormBuilder,
//     FormGroup,
//     ReactiveFormsModule,
//     Validators,
// } from '@angular/forms';
// import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
// import { Subscription } from 'rxjs';
// import { DataService } from 'src/app/services/data.service';
// import ComponentsModule from 'src/app/shared/components.module';

// @Component({
//   selector: 'app-add-or-edit-cuenta-primer-nivel',
//   templateUrl: './addoredit-cuenta.component.html',
//   standalone: true,
//   imports: [ReactiveFormsModule, ComponentsModule, CommonModule],
// })
// export default class AddOrEditCuentaComponent implements OnInit, OnDestroy {
//   private formBuilder = inject(FormBuilder);
//   public dataService = inject(DataService);
//   public ref = inject(DynamicDialogRef);
//   public config = inject(DynamicDialogConfig);
//   submitting: boolean = false;

//   id: number = 0;
//   subRef$: Subscription;
//   form: FormGroup = this.formBuilder.group({
//     id: { value: this.id, disabled: true },
//     numeroCuenta: ['', Validators.required],
//     descripcion: ['', [Validators.required]],
//   });
//   get f() {
//     return this.form.controls;
//   }

//   ngOnInit(): void {
//     this.id = this.config.data.id;
//     if (this.id !== 0) this.onLoadData();
//   }
//   onLoadData() {
//     this.subRef$ = this.dataService
//       .get(`CompraCuenta/${this.id}`)
//       .subscribe((resp: any) => {
//         this.form.patchValue(resp.body);
//       });
//   }
//   onSubmit() {
//     if (this.form.invalid) {
//       Object.values(this.form.controls).forEach((x) => {
//         x.markAllAsTouched();
//       });
//       return;
//     }
//     this.id = this.config.data.id;
//     this.submitting = false;
//     if (this.id === 0) {
//       this.subRef$ = this.dataService
//         .post(`CompraCuenta`, this.form.value)
//         .subscribe({
//           next: () => {
//             this.ref.close(true);
//           },
//           error: (err) => {
//             console.log(err.error);
//           },
//         });
//     } else {
//       this.subRef$ = this.dataService
//         .put(`CompraCuenta/${this.id}`, this.form.value)
//         .subscribe({
//           next: () => {
//             this.ref.close(true);
//           },
//           error: (err) => {
//             console.log(err.error);
//           },
//         });
//     }
//     this.submitting = true;
//   }
//   ngOnDestroy() {
//     if (this.subRef$) this.subRef$.unsubscribe();
//   }
// }
