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
  templateUrl: 'analise-leite-list.component.html',
  styleUrls: ['analise-leite-list.component.scss'],
  providers:[DataService]
})

export class AnaliseLeiteListComponent {
  @ViewChild('dataGridAnaliseLeite') dataGrid: DxDataGridComponent;

  resource: string= 'Análise Leite';
  ufRegex = /^[A-Z]{2}$/i;
  telefoneRegex = /^\([1-9]{2}\) [2-9][0-9]{3,4}\-[0-9]{4}$/;
  isPanelOpened = false;
  isAddClientePopupOpened = false;
  userId: number;

  dataSource: DataSource;


  analiseLeiteColumns: any[] = [
    {
      dataField: 'origem_amostra',
      caption: 'Origem da Amostra',
      dataType: 'string',
      validationRules: [
        {
          type: 'required',
          message: 'Campo obrigatório!'
        }
      ]
    },
    {
      dataField: 'tipo_analise',
      caption: 'Tipo Análise',
      dataType: 'string',
      validationRules: [
        {
          type: 'required',
          message: 'Campo obrigatório!'
        }
      ]
    },
    {
      dataField: 'data_coleta',
      caption: 'Data Coleta',
      dataType: 'date',
      default: 'now',
      validationRules: [
        {
          type: 'required',
          message: 'Campo obrigatório!'
        }
      ]
    },
    {
      dataField: 'data_avaliacao',
      caption: 'Data Avaliação',
      dataType: 'date',
      default: 'now',
      validationRules: [
        {
          type: 'required',
          message: 'Campo obrigatório!'
        }
      ]
    },
    {
      dataField: 'avaliador_responsavel',
      caption: 'Avaliador Responsavel',
      dataType: 'string',
      validationRules: [
        {
          type: 'required',
          message: 'Campo obrigatório!'
        }
      ]
    },

    {
      dataField: 'ccs',
      caption: 'CCS',
      dataType: 'number',
      validationRules: [
        {
          type: 'required',
          message: 'Campo obrigatório!'
        }
      ]
    },
    {
      dataField: 'cbt',
      caption: 'CBT',
      dataType: 'number',
      validationRules: [
        {
          type: 'required',
          message: 'Campo obrigatório!'
        }
      ]
    },
    {
      dataField: 'ph',
      caption: 'pH',
      dataType: 'number',
      validationRules: [
        {
          type: 'required',
          message: 'Campo obrigatório!'
        }
      ]
    },
  ];


  constructor(private apollo: Apollo, private dataService: DataService) {

    this.dataSource = new DataSource({
      key: 'id',
      load: () => this.dataService.get('findAllAnalisesLeite').then((response) => {
        const data = response.analises_leite;
        return {
          data,
          totalCount: data.length,
        };
      }),

      insert: (object): any => {
        this.dataService.post('newAnaliseLeite', {object}).then((response) => {
          notify( `${this.resource} inserido com sucesso!`, 'success');
          this.refresh();
        }).catch((e: any) => {
          debugger
            notify(`Erro ao cadastrar ${this.resource} ` + e, 'error');
        })
      },

      update: (key, object): any => {
        this.dataService.patch('updateAnaliseLeite/' + key, {object}).then((response) => {
          notify(`${this.resource} atualizado com sucesso!`, 'success');
          this.refresh();
        }).catch((e: any) => {

          notify(`Erro ao atualizar ${this.resource} ` + e, 'error');
        })
      },

      remove: (key): any => {
        this.dataService.delete('deleteAnaliseLeite/' + key).then((response) => {
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
  declarations: [AnaliseLeiteListComponent],
})
export class CrmContactListModule {
}
