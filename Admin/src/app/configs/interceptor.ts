import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor() {
  }

  //function which will be called for all http calls
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //how to update the request Parameters
    let addition = request.headers;
    let updateRes;
    if (localStorage.getItem('token')) {
      updateRes = request.clone({ headers: request.headers.set("x-logintoken", localStorage.getItem('token')) });
    } else {
      updateRes = request;
    }

    
    //logging the updated Parameters to browser's console
    return next.handle(updateRes).pipe(
      tap(
        event => {
          //logging the http response to browser's console in case of a success
          if (event instanceof HttpResponse) {
            // window.alert(`Success: ${event.statusText}`);
          }
        },
        error => {
          //logging the http response to browser's console in case of a failuer
          if (event instanceof HttpResponse) {
            //window.alert(`Error: ${event.status}`);

          }
        }
      )
    );
  }

}
