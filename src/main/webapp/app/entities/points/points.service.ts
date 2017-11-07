import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Points } from './points.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class PointsService {

    private resourceUrl = SERVER_API_URL + 'api/points';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/points';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(points: Points): Observable<Points> {
        const copy = this.convert(points);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(points: Points): Observable<Points> {
        const copy = this.convert(points);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Points> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Points.
     */
    private convertItemFromServer(json: any): Points {
        const entity: Points = Object.assign(new Points(), json);
        entity.date = this.dateUtils
            .convertLocalDateFromServer(json.date);
        return entity;
    }

    /**
     * Convert a Points to a JSON which can be sent to the server.
     */
    private convert(points: Points): Points {
        const copy: Points = Object.assign({}, points);
        copy.date = this.dateUtils
            .convertLocalDateToServer(points.date);
        return copy;
    }
}
