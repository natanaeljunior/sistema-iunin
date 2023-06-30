import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SingleCardModule } from 'src/app/layouts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthenticated-content',
  template: `
    <app-single-card >
      <div style="text-align: center; margin-top:-30px; margin-bottom: 20px"><img src="../../../assets/logo-iunin.jpeg" [width]="150"></div>
      <router-outlet></router-outlet>
    </app-single-card>
  `,
  styles: [`
    :host {
      width: 100%;
      height: 100%;
    }
  `],
})
export class UnauthenticatedContentComponent {
  constructor(private router: Router) { }

  get description() {
    const path = this.router.url.split('/').at(-1);
    switch (path) {
      case 'reset-password': return 'Por favor, digite o endereço de e-mail que você usou para se cadastrar, e nós enviaremos um link para redefinir sua senha por e-mail.';
      default: return '';
    }
  }

  get title() {
    const path = this.router.url.split('/').at(-1);
    switch (path) {
      case 'login': return '<img src="https://a-static.mlcdn.com.br/450x450/iogurte-parcialmente-desnatado-iunin-1000g/liveralimentos/acc86f6cc8ba11ed9d714201ac18502f/0b3478833edc77fb0a56eab9870052d6.jpeg"/>';
      case 'reset-password': return 'Redefinir senha';
      case 'create-account': return 'Registrar';
      case 'change-password': return 'Senha';
      default: return '';
    }
  }
}
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SingleCardModule,
  ],
  declarations: [UnauthenticatedContentComponent],
  exports: [UnauthenticatedContentComponent],
})
export class UnauthenticatedContentModule { }
