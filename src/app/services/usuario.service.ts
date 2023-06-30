import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {UsuarioModel} from "../models/usuario.model";
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private apollo: Apollo) {}

  criarUsuario(nome: string): Observable<any> {
    const mutation = gql`
      mutation ($nome: String!) {
        criarUsuario(nome: $nome) {
          id
          nome
        }
      }
    `;
    debugger
    return this.apollo
      .mutate<{ criarUsuario: any }>({
        mutation,
        variables: { nome },
      })
      .pipe(map((result) => result.data.criarUsuario));
  }

  // criarUsuario(nome: string): Observable<any> {
  //   const mutation = gql`
  //     mutation ($nome: String!) {
  //       criarUsuario(nome: $nome) {
  //         id
  //         nome
  //       }
  //     }
  //   `;
  //   return this.apollo
  //     .mutate<{ criarUsuario: any }>({
  //       mutation,
  //       variables: { nome },
  //     })
  //     .pipe(map((result) => result.data.criarUsuario));
  // }
}
