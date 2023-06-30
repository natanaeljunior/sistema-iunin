import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import {HttpHeaders} from "@angular/common/http";
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';

const uri = 'https://iunin-db.hasura.app/v1/graphql';
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({
      uri,
      headers: new HttpHeaders().set('x-hasura-admin-secret', 'WFqFEfhszLsH2e5944NGyVYy0tq98MMV63cuYiQXMKSuYuKWKqenrfLRq1dEup9W'),
    }),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule { }
