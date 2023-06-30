import {
  Component, ViewChild, NgModule, OnInit, ChangeDetectionStrategy, ChangeDetectorRef,
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
import {Contact, contactStatusList, ContactStatus,} from 'src/app/types/contact';
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
import {ApolloQueryResult} from '@apollo/client/core';
import {ClienteNewFormModule} from 'src/app/components/library/cliente-new-form/cliente-new-form.component';
import {newCliente} from 'src/app/types/clientes';
import CustomStore from 'devextreme/data/custom_store';
import {AppComponent} from 'src/app/app.component';
import {delay} from "rxjs/operators";

type FilterContactStatus = ContactStatus | 'Todos';

@Component({
  templateUrl: 'clientes-list.component.html',
  styleUrls: ['clientes-list.component.scss'],
  providers: [DataService],
})
export class ClientesListComponent {
  @ViewChild('dataGridClientes') dataGrid: DxDataGridComponent;

  ufRegex = /^[A-Z]{2}$/i;
  telefoneRegex = /^\([1-9]{2}\) [2-9][0-9]{3,4}\-[0-9]{4}$/;
  isPanelOpened = false;
  isAddClientePopupOpened = false;
  userId: number;

  dataSource: DataSource;

  constructor(private service: DataService, private apollo: Apollo) {
    this.dataSource = new DataSource({
      key: 'id',
      load: () => this.apollo.query<any>({query: GET_CLIENTES,})
        .toPromise()
        .then((result: ApolloQueryResult<any>) => {
          const data = result.data.clientes;
          return {
            data,
            totalCount: data.length,
          };
        }),

      insert: (values) => this.insert(values),
      update: (key, values) => this.update(key, values),
      remove: (key) => this.remove(key)

    });
  }

  async teseButon(){
    console.log(this.dataSource)
    console.log('click')
    await this.dataSource.load();
    console.log(this.dataSource)
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
      this.refresh();
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
      this.refresh();
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

  filterByStatus = (e: DxDropDownButtonTypes.SelectionChangedEvent) => {
    const {item: status}: { item: FilterContactStatus } = e;

    if (status === 'Todos') {
      this.dataGrid.instance.clearFilter();
    } else {
      this.dataGrid.instance.filter(['status', '=', status]);
    }
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
  declarations: [ClientesListComponent],
})
export class CrmContactListModule {
}
