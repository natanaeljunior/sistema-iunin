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
  templateUrl: 'produtores-list.component.html',
  styleUrls: ['produtores-list.component.scss'],
  providers:[DataService]
})

export class ProdutoresListComponent {
  @ViewChild('dataGridProdutores') dataGrid: DxDataGridComponent;

  resource: string= 'Produtor';
  ufRegex = /^[A-Z]{2}$/i;
  telefoneRegex = /^\([1-9]{2}\) [2-9][0-9]{3,4}\-[0-9]{4}$/;
  isPanelOpened = false;
  isAddClientePopupOpened = false;
  userId: number;

  dataSource: DataSource;


  produtoresColumns: any[] = [
    {
      dataField: 'nome',
      caption: 'Nome',
      dataType: 'string',
      validationRules: [
        {
          type: 'required',
          message: 'Campo obrigatório!'
        }
      ]
    },
    {
      dataField: 'endereco',
      caption: 'Endereço',
      dataType: 'string',
      validationRules: [
        {
          type: 'required',
          message: 'Campo obrigatório!'
        }
      ]
    },
    {
      dataField: 'cidade',
      caption: 'Cidade',
      dataType: 'string',
      validationRules: [
        {
          type: 'required',
          message: 'Campo obrigatório!'
        }
      ]
    },
    {
      dataField: 'uf',
      caption: 'UF',
      dataType: 'string',
      validationRules: [
        {
          type: 'required',
          message: 'Campo obrigatório!'
        }
      ]
    },
    {
      dataField: 'telefone',
      caption: 'Telefone',
      dataType: 'string',
      validationRules: [
        {
          type: 'required',
          message: 'Campo obrigatório!'
        }
      ]
    },
    {
      dataField: 'email',
      caption: 'Email',
      dataType: 'string',
      validationRules: [
        {
          type: 'required',
          message: 'Campo obrigatório!'
        },
        {
          type: 'email',
          message: 'Email inválido!'
        }
      ]
    }
  ];


  constructor(private apollo: Apollo, private dataService: DataService) {

    this.dataSource = new DataSource({
      key: 'id',
      load: () => this.dataService.get('findAllProdutores').then((response) => {
        debugger
        const data = response.produtores;
        return {
          data,
          totalCount: data.length,
        };
      }),

      insert: (object): any => {
        this.dataService.post('newProdutor', {object}).then((response) => {
          notify( `${this.resource} inserido com sucesso!`, 'success');
          this.refresh();
        }).catch((e: any) => {
          debugger
            notify(`Erro ao cadastrar ${this.resource} ` + e, 'error');
        })
      },

      update: (key, object): any => {
        this.dataService.put('updateProdutor/' + key, {object}).then((response) => {
          notify(`${this.resource} atualizado com sucesso!`, 'success');
          this.refresh();
        }).catch((e: any) => {

          notify(`Erro ao atualizar ${this.resource} ` + e, 'error');
        })
      },

      remove: (key): any => {
        this.dataService.delete('deleteProdutorById/' + key).then((response) => {
          notify(`${this.resource} excluido com sucesso!`, 'success');
          this.refresh();
        }).catch((e: any) => {
          debugger
          notify(`Erro ao excluir ${this.resource} ` + e, 'error');
        })
      },
    });
  }

  refresh = () => {
    this.dataGrid.instance.refresh();
    this.dataSource.load();
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
  declarations: [ProdutoresListComponent],
})
export class CrmContactListModule {
}
