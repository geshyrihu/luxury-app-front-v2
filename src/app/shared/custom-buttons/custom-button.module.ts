// import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import CustomButtonActiveDesactiveComponent from './custom-Button-active-desactive/custom-Button-active-desactive.component';
import CustomButtonDeleteSpanComponent from './custom-Button-delete-span/custom-Button-delete-span.component';
import CustomButtonConfirmationComponent from './custom-buttom-confirmation/custom-button-confirmation.component';
import CustomButtonDeleteComponent from './custom-buttom-delete/custom-button-delete.component';
import CustomButtomDropdownItemComponent from './custom-buttom-dropdown-item/custom-buttom-dropdown-item.component';
import CustomButtonEditComponent from './custom-buttom-edit/custom-button-edit.component';
import CustomButtonAddComponent from './custom-button-add/custom-button-add.component';
import CustomButtonDownloadFileComponent from './custom-button-download-file/custom-button-download-file.component';
import CustomButtonDownloadPdfComponent from './custom-button-download-pdf/custom-button-download-pdf.component';
import CustomButtonExportExcelComponent from './custom-button-export-excel/custom-button-export-excel.component';
import CustomButtonLinkComponent from './custom-button-link/custom-button-link.component';
import CustomButtonSendEmailComponent from './custom-button-send-email/custom-button-send-email.component';
import CustomButtonSubmitComponent from './custom-button-submit/custom-button-submit.component';
import CustomButtonComponent from './custom-button/custom-button.component';

@NgModule({
  imports: [
    CustomButtonActiveDesactiveComponent,
    CustomButtonAddComponent,
    CustomButtonComponent,
    CustomButtonConfirmationComponent,
    CustomButtonDeleteComponent,
    CustomButtonDeleteSpanComponent,
    CustomButtonDownloadFileComponent,
    CustomButtonEditComponent,
    CustomButtonExportExcelComponent,
    CustomButtonLinkComponent,
    CustomButtonSendEmailComponent,
    CustomButtonSubmitComponent,
    CustomButtomDropdownItemComponent,
    CustomButtonDownloadPdfComponent,
  ],
  exports: [
    CustomButtonActiveDesactiveComponent,
    CustomButtonAddComponent,
    CustomButtonComponent,
    CustomButtonConfirmationComponent,
    CustomButtonDeleteComponent,
    CustomButtonDeleteSpanComponent,
    CustomButtonDownloadFileComponent,
    CustomButtonEditComponent,
    CustomButtonExportExcelComponent,
    CustomButtonLinkComponent,
    CustomButtonSendEmailComponent,
    CustomButtonSubmitComponent,
    CustomButtomDropdownItemComponent,
    CustomButtonDownloadPdfComponent,
  ],
})
export default class CustomButtonModule {}
