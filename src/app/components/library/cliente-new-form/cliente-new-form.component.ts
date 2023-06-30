import {
  Component, Input,
  NgModule,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxTextBoxModule,
  DxFormModule,
  DxValidatorModule,
} from 'devextreme-angular';
import {
  FormTextboxModule,
  FormPhotoUploaderModule,
} from 'src/app/components';
import { newContact } from 'src/app/types/contact';
import { getSizeQualifier } from 'src/app/services/screen.service';
import {newCliente} from "../../../types/clientes";
import {Task} from "../../../types/task";

@Component({
  selector: 'cliente-new-form',
  templateUrl: 'cliente-new-form.component.html',
  providers: [],
})

export class ClienteNewFormComponent {
  @Input() newCliente = newCliente;
  @Input() isCreateMode: boolean = false;
  getSizeQualifier = getSizeQualifier;
  constructor() { }
}

@NgModule({
  imports: [
    DxTextBoxModule,
    DxFormModule,
    DxValidatorModule,

    FormTextboxModule,
    FormPhotoUploaderModule,

    CommonModule,
  ],
  declarations: [ClienteNewFormComponent],
  exports: [ClienteNewFormComponent],
})
export class ClienteNewFormModule { }
