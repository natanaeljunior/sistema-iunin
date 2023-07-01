import {
  Component, ViewChild, NgModule
} from '@angular/core';
import {
  DxButtonModule,
  DxDataGridModule,
  DxDataGridComponent,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxValidatorModule,
  DxValidationGroupModule, DxToolbarModule,
} from 'devextreme-angular';
import {DxDataGridTypes} from 'devextreme-angular/ui/data-grid';
import {exportDataGrid as exportDataGridToPdf} from 'devextreme/pdf_exporter';
import {exportDataGrid as exportDataGridToXLSX} from 'devextreme/excel_exporter';
import {
  CardActivitiesModule,
  ContactStatusModule,
} from 'src/app/components';
import {DxDropDownButtonTypes} from 'devextreme-angular/ui/drop-down-button';
import DataSource from 'devextreme/data/data_source';
import {CommonModule} from '@angular/common';
import {DataService} from 'src/app/services';
import {Workbook} from 'exceljs';
import {saveAs} from 'file-saver-es';
import {jsPDF} from 'jspdf';
import {formatPhone} from 'src/app/pipes/phone.pipe';
import {FormPopupModule} from 'src/app/components';
import {ContactPanelModule} from 'src/app/components/library/contact-panel/contact-panel.component';
import {NEW_USUARIO} from "../../../graphql/graphql.operations";
import notify from "devextreme/ui/notify";
import {Apollo} from "apollo-angular";
import {
  DELETE_CLIENTE_BY_ID,
  GET_CLIENTES,
  NEW_CLIENTE,
  UPDATE_CLIENTE_BY_ID
} from "../../../graphql/clientes.graphql.operations";
import {ClienteNewFormModule} from 'src/app/components/library/cliente-new-form/cliente-new-form.component';

@Component({
  templateUrl: 'funcionarios-list.component.html',
  styleUrls: ['funcionarios-list.component.scss'],
  providers:[DataService]
})

export class FuncionariosListComponent {
  @ViewChild('dataGridCFuncionarios') dataGrid: DxDataGridComponent;

  resource: string= 'Funcionario'
  ufRegex = /^[A-Z]{2}$/i;
  telefoneRegex = /^\([1-9]{2}\) [2-9][0-9]{3,4}\-[0-9]{4}$/;
  isPanelOpened = false;
  isAddClientePopupOpened = false;
  userId: number;

  dataSource: DataSource;


  funcionarioColumns: any[] = [
    {
      dataField: 'nome',
      caption: 'Nome',
      dataType: 'string',
      validationRules: [{
        type: 'required',
        message: 'Campo obrigatório!'
      }]
    },
    {
      dataField: 'cargo',
      caption: 'Cargo',
      dataType: 'string',
      validationRules: [{
        type: 'required',
        message: 'Campo obrigatório!'
      }]
    },
    {
      dataField: 'salario',
      caption: 'Salário',
      dataType: 'number',
      format: { type: 'currency', currency: 'BRL', precision: 2 },
      editorOptions: {
        format: { type: 'currency', currency: 'BRL', precision: 2 }
      },
      validationRules: [{
        type: 'required',
        message: 'Campo obrigatório!'
      }]
    },
    {
      dataField: 'data_admissao',
      caption: 'Data de Admissão',
      dataType: 'date',
      format: 'dd/MM/yyyy',
      validationRules: [{
        type: 'required',
        message: 'Campo obrigatório!'
      }]
    },
    {
      dataField: 'departamento',
      caption: 'Departamento',
      dataType: 'string',
      validationRules: [{
        type: 'required',
        message: 'Campo obrigatório!'
      }]
    },
  ];


  constructor(private apollo: Apollo, private dataService: DataService) {

    this.dataSource = new DataSource({
      key: 'id',
      load: () => this.dataService.get('findAllFuncionarios').then((response) => {
        const data = response.funcionarios;
        return {
          data,
          totalCount: data.length,
        };
      }),

      insert: (value): any => {
        this.dataService.post('newFuncionario', {value}).then((response) => {
          notify( `${this.resource} inserido com sucesso!`, 'success');
          this.dataGrid.instance.refresh();
          this.dataSource.load();
        }).catch((e: any) => {
          debugger
            notify(`Erro ao cadastrar ${this.resource} ` + e, 'error');
        })
      },

      update: (key, object): any => {
        this.dataService.put('updateFuncionario/' + key, {object}).then((response) => {
          notify(`${this.resource} atualizado com sucesso!`, 'success');
          this.dataGrid.instance.refresh();
          this.dataSource.load();
        }).catch((e: any) => {

          notify(`Erro ao atualizar ${this.resource} ` + e, 'error');
        })
      },

      remove: (key): any => {
        this.dataService.delete('deleteFuncionarioById/' + key).then((response) => {
          notify(`${this.resource} excluido com sucesso!`, 'success');
          this.dataGrid.instance.refresh();
          this.dataSource.load();
          debugger
        }).catch((e: any) => {
          debugger
          notify(`Erro ao excluir ${this.resource} ` + e, 'error');
        })
      },
    });
  }


  async insert(values: any): Promise<any> {
    try {
      const result = await this.apollo.mutate({
        mutation: NEW_CLIENTE,
        variables: {
          object: values,
        },
      }).toPromise();

      notify('Cliente inserido com sucesso!', 'success');

      this.dataGrid.instance.refresh();
      debugger;
      return result.data['insert_clientes_one'];
    } catch (e) {
      notify('Erro ao cadastrar Cliente!', 'error');
      throw e;
    }
  }

  async update(key: any, values: any): Promise<any> {
    try {
      const result = await this.apollo.mutate({
        mutation: UPDATE_CLIENTE_BY_ID,
        variables: {
          id: key,
          fields: values,
        },
      }).toPromise();

      notify('Cliente atualizado com sucesso!', 'success');
      debugger;

      return result;
    } catch (e) {
      notify('Erro ao atualizar Cliente!', 'error');
      throw e;
    }
  }

  async remove(key: any): Promise<any> {
    try {
      const result = await this.apollo.mutate({
        mutation: DELETE_CLIENTE_BY_ID,
        variables: {
          id: key,
        },
      }).toPromise();

      notify('Cliente excluído com sucesso!', 'success');
      debugger;

      return result.data['delete_clientes_by_pk'].id;
    } catch (e) {
      notify('Erro ao excluir Cliente!', 'error');
      throw e;
    }
  }

  showAddCliente() {
    this.isAddClientePopupOpened = true;
  }

  refresh = () => {
    this.dataSource.reload();
    this.dataGrid.instance.refresh();
  };

  rowClick(e: DxDataGridTypes.RowClickEvent) {
    const {data} = e;

    this.userId = data.id;
    this.isPanelOpened = true;
  }

  onOpenedChange = (value: boolean) => {
    if (!value) {
      this.userId = null;
    }
  };

  onPinnedChange = () => {
    this.dataGrid.instance.updateDimensions();
  };


  customizePhoneCell = ({value}) => value ? formatPhone(value) : undefined;

  onExporting(e) {
    if (e.format === 'pdf') {
      const doc = new jsPDF();
      exportDataGridToPdf({
        jsPDFDocument: doc,
        component: e.component,
      }).then(() => {
        doc.save('Clientes.pdf');
      });
    } else {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Clientes');

      exportDataGridToXLSX({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], {type: 'application/octet-stream'}), 'Clientes.xlsx');
        });
      });
      e.cancel = true;
    }
  }

  meuMetodo() {

    this.dataSource.load();
    this.dataGrid.instance.refresh();
  }

}

@NgModule({
  imports: [
    DxButtonModule,
    DxDataGridModule,
    DxDropDownButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxValidationGroupModule,
    DxValidatorModule,
    ContactPanelModule,
    ClienteNewFormModule,
    FormPopupModule,
    CardActivitiesModule,
    ContactStatusModule,
    DxToolbarModule,
    CommonModule,
  ],
  providers: [],
  exports: [],
  declarations: [FuncionariosListComponent],
})
export class CrmContactListModule {
}
