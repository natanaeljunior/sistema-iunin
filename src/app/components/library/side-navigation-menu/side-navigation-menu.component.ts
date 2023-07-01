import {
  Component,
  NgModule,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { DxTreeViewModule, DxTreeViewComponent, DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import * as events from 'devextreme/events';
import { navigation } from '../../../app-navigation';

@Component({
  selector: 'side-navigation-menu',
  templateUrl: './side-navigation-menu.component.html',
  styleUrls: ['./side-navigation-menu.component.scss'],
})
export class SideNavigationMenuComponent implements AfterViewInit, OnDestroy {
  @ViewChild(DxTreeViewComponent, { static: true })
  menu!: DxTreeViewComponent;

  @Output()
  selectedItemChanged = new EventEmitter<DxTreeViewTypes.ItemClickEvent>();

  @Output()
  openMenu = new EventEmitter<any>();

  @Input()
  get compactMode() {
    return this._compactMode;
  }
  @Input() menuOpened:boolean = true;

  @Input()
  set selectedItem(value: String) {
    this._selectedItem = value;
    this.setSelectedItem();
  }

  get selectedItem(): String {
    return this._selectedItem;
  }

  set compactMode(val) {
    this._compactMode = val;

    if (!this.menu.instance) {
      return;
    }

    if (val) {
      this.menu.instance.collapseAll();
    } else {
      this.menu.instance.expandItem(this._selectedItem);
    }
  }

  private _selectedItem!: String;

  private _items!: Record <string, unknown>[];

  filteredItems: any[] = []; // Variável para armazenar os itens filtrados do menu

  searchValueChanged(event: any) {
    // Aqui você pode realizar a lógica para filtrar os itens do menu com base no valor da pesquisa
    // Por exemplo, você pode atualizar uma propriedade `filteredItems` com os itens filtrados
    // e usá-la na diretiva `*ngFor` para exibir apenas os itens filtrados no menu

    // Exemplo de implementação de filtragem dos itens:
    this.filteredItems = this.items.filter(item => item.text.toLowerCase().includes(event.toLowerCase()));
  }


  get items():any {
    if (!this._items) {
      this._items = navigation.map((item) => {
        if (item.path && !(/^\//.test(item.path))) {
          item.path = `/${item.path}`;
        }
        return { ...item, expanded: !this._compactMode };
      });
    }

    return this._items;
  }

  private _compactMode = false;

  constructor(private elementRef: ElementRef) { }

  setSelectedItem() {
    if (!this.menu.instance) {
      return;
    }

    this.menu.instance.selectItem(this.selectedItem);
  }

  onItemClick(event: DxTreeViewTypes.ItemClickEvent) {
    this.selectedItemChanged.emit(event);
  }

  ngAfterViewInit() {
    this.setSelectedItem();
    events.on(this.elementRef.nativeElement, 'dxclick', (e: Event) => {
      this.openMenu.next(e);
    });
  }

  ngOnDestroy() {
    events.off(this.elementRef.nativeElement, 'dxclick');
  }
}

@NgModule({
  imports: [DxTreeViewModule],
  declarations: [SideNavigationMenuComponent],
  exports: [SideNavigationMenuComponent],
})
export class SideNavigationMenuModule { }
