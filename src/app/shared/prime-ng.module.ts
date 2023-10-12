import { NgModule } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { ImageModule } from 'primeng/image';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
@NgModule({
  imports: [
    EditorModule,
    TableModule,
    ToastModule,
    CheckboxModule,
    DialogModule,
    ImageModule,
    MenuModule,
    MultiSelectModule,
  ],
  exports: [
    EditorModule,
    TableModule,
    ToastModule,
    CheckboxModule,
    DialogModule,
    ImageModule,
    MenuModule,
    MultiSelectModule,
  ],
})
export default class PrimeNgModule {}
